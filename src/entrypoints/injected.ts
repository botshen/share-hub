import { isTimelineEntryConversationThread } from "@/entrypoints/api";
import { extractTimelineTweet } from "@/entrypoints/api";
import { isTimelineEntryTweet } from "@/entrypoints/api";
import { TimelineAddEntriesInstruction, TimelineAddToModuleInstruction, TimelineInstructions, TimelineTweet, Tweet } from "@/entrypoints/types";
import { proxy } from "ajax-hook";


interface TweetDetailResponse {
  data: {
    threaded_conversation_with_injections_v2: {
      instructions: TimelineInstructions;
    };
  };
}
function isMainTweet(tweet: Tweet): boolean {
  return tweet.legacy.conversation_id_str === tweet.legacy.id_str;
}
function sendMessageToContentScript<T>(message: T, eventName: string) {
  const event = new CustomEvent(eventName, { detail: message })
  window.dispatchEvent(event)
}
export default defineUnlistedScript(() => {
  proxy({
    onRequest: (config, handler) => {
      handler.next(config);
    },
    onError: (err, handler) => {
      handler.next(err);
    },
    onResponse: (response, handler) => {
      if (!/\/graphql\/.+\/TweetDetail/.test(response.config.url)) {
        handler.resolve(response);
        return;
      }
      console.log('response.config.url', response.config.url)
      try {
        const json: TweetDetailResponse = JSON.parse(response.response);
        const instructions = json.data.threaded_conversation_with_injections_v2.instructions;
        let mainTweet: Tweet | null = null;
        const comments: Tweet[] = [];

        const timelineAddEntriesInstruction = instructions.find(
          (i) => i.type === 'TimelineAddEntries',
        ) as TimelineAddEntriesInstruction<TimelineTweet>;

        // When loading more tweets in conversation, the "TimelineAddEntries" instruction may not exist.
        const timelineAddEntriesInstructionEntries = timelineAddEntriesInstruction?.entries ?? [];

        for (const entry of timelineAddEntriesInstructionEntries) {
          // The main tweet.
          if (isTimelineEntryTweet(entry)) {
            const tweet = extractTimelineTweet(entry.content.itemContent);
            if (tweet) {
              if (isMainTweet(tweet)) {
                mainTweet = tweet;
              } else {
                comments.push(tweet);
              }
            }
          }

          // The conversation thread.
          if (isTimelineEntryConversationThread(entry)) {
            // Be careful about the "conversationthread-{id}-cursor-showmore-{cid}" item.
            const tweetsInConversation = entry.content.items.map((i) => {
              if (i.entryId.includes('-tweet-')) {
                return extractTimelineTweet(i.item.itemContent);
              }
            });

            comments.push(...tweetsInConversation.filter((t): t is Tweet => !!t));
          }
        }

        // Lazy-loaded conversations.
        const timelineAddToModuleInstruction = instructions.find(
          (i) => i.type === 'TimelineAddToModule',
        ) as TimelineAddToModuleInstruction<TimelineTweet>;

        if (timelineAddToModuleInstruction) {
          const tweetsInConversation = timelineAddToModuleInstruction.moduleItems
            .map((i) => extractTimelineTweet(i.item.itemContent))
            .filter((t): t is Tweet => !!t);

          comments.push(...tweetsInConversation);
        }
        console.log("comments", comments);
        console.log('mainTweet', mainTweet)
        // Add captured tweets to the database.
        const url = window.location.href;
        const checkedComments: {
          id: string;
          avatarUrl: string;
          author: string;
          content: string;
          isChecked: boolean;
        }[] = [];
        comments.forEach((comment) => {
          checkedComments.push({
            id: comment.legacy.id_str,
            avatarUrl: comment.core.user_results.result.legacy.profile_image_url_https,
            author: comment.core.user_results.result.legacy.screen_name,
            content: comment.legacy.full_text,
            isChecked: false,
          });
        });
        const currentTodo = {
          url,
          postContent: mainTweet?.legacy.full_text,
          title: "",
          comments: checkedComments,
          postscripts: [],
          author: mainTweet?.core.user_results.result.legacy.screen_name,
          avatarUrl: mainTweet?.core.user_results.result.legacy.profile_image_url_https,
          source: "twitter",
        };
        console.log('currentTodo', currentTodo)
        sendMessageToContentScript(currentTodo, 'todo')
      } catch (err) {
        console.error(err);

      } finally {
        handler.resolve(response);
      }

      handler.resolve(response);
    },
  });
});
