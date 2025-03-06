import { isTimelineEntryConversationThread } from "@/entrypoints/api";
import { extractTimelineTweet } from "@/entrypoints/api";
import { isTimelineEntryTweet } from "@/entrypoints/api";
import {
  TimelineAddEntriesInstruction,
  TimelineAddToModuleInstruction,
  TimelineInstructions,
  TimelineTweet,
  Tweet,
} from "@/entrypoints/types";
import { proxy } from "ajax-hook";
import { sendMessageToContentScript } from "@/utils/inject-help";
import { strEntitiesToHTML } from "@/utils/x";

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
      console.log("response.config.url", response.config.url);
      try {
        const json: TweetDetailResponse = JSON.parse(response.response);
        const instructions =
          json.data.threaded_conversation_with_injections_v2.instructions;
        let mainTweet: Tweet | null = null;
        const comments: Tweet[] = [];

        const timelineAddEntriesInstruction = instructions.find(
          (i) => i.type === "TimelineAddEntries",
        ) as TimelineAddEntriesInstruction<TimelineTweet>;

        // When loading more tweets in conversation, the "TimelineAddEntries" instruction may not exist.
        const timelineAddEntriesInstructionEntries =
          timelineAddEntriesInstruction?.entries ?? [];

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
              if (i.entryId.includes("-tweet-")) {
                return extractTimelineTweet(i.item.itemContent);
              }
            });

            comments.push(
              ...tweetsInConversation.filter((t): t is Tweet => !!t),
            );
          }
        }

        // Lazy-loaded conversations.
        const timelineAddToModuleInstruction = instructions.find(
          (i) => i.type === "TimelineAddToModule",
        ) as TimelineAddToModuleInstruction<TimelineTweet>;

        if (timelineAddToModuleInstruction) {
          const tweetsInConversation =
            timelineAddToModuleInstruction.moduleItems
              .map((i) => extractTimelineTweet(i.item.itemContent))
              .filter((t): t is Tweet => !!t);

          comments.push(...tweetsInConversation);
        }
        console.log("comments", comments);
        console.log("mainTweet", mainTweet);
        // Add captured tweets to the database.
        const url = window.location.href;
        const checkedComments: {
          id: string;
          conversationId: string;
          avatarUrl: string;
          replyId: string;
          author: string;
          content: string;
          isChecked: boolean;
          mediaPhotosUrl: string[];
          card: unknown;
          imageUrl: string;
          replayUser: string;
        }[] = [];
        const okCommentsSource: string[] = [
          '<a href="https://mobile.twitter.com" rel="nofollow">Twitter Web App</a>',
          '<a href="http://twitter.com/download/android" rel="nofollow">Twitter for Android</a>',
          '<a href="http://twitter.com/download/iphone" rel="nofollow">Twitter for iPhone</a>',
        ];
        comments.forEach((comment) => {
          if (
            comment?.core?.user_results?.result?.professional
              ?.professional_type === "Business"
          )
            return;
          if (
            comment?.core?.user_results?.result?.affiliates_highlighted_label
              ?.label?.userLabelType === "BusinessLabel"
          )
            return;
          if (!okCommentsSource.includes(comment.source)) {
            console.log(
              "comment.source==================================",
              comment.source,
            );
            return;
          }
          console.log("comment.legacy.full_text", comment.legacy.full_text);
          // comment.legacy.full_text @szac19851 firefox今天出了个事，你去搜一下 隐私相关的
          // 提取出@szac19851 后面的内容（匹配第一个@和后面连着的字符）
          // @szac19851 firefox今天出了个事，你去搜一下 隐私相关的   => @szac19851 firefox今天出了个事，你去搜一下 隐私相关的
          const replayUser = comment.legacy.full_text.match(/@([^\s]+)/)?.[1];
          const replayContent = comment.legacy.full_text.replace(
            `@${replayUser}`,
            "",
          );
          console.log("replayUser", replayUser);
          if(comment.quoted_status_result?.result?.legacy?.full_text){
            const quotedContent=comment.quoted_status_result?.result?.legacy?.full_text;
            const quotedUser=comment.quoted_status_result?.result?.core?.user_results?.result?.legacy?.name;
            const quotedUserImage=comment.quoted_status_result?.result?.core?.user_results?.result?.legacy?.profile_image_url_https;
            console.log('quotedContent==============================================================',quotedContent)
            console.log('quotedUser',quotedUser)
            console.log('quotedUserImage',quotedUserImage)
          }
          checkedComments.push({
            id: comment.rest_id,
            conversationId: comment.legacy.conversation_id_str,
            replyId: comment.legacy.in_reply_to_status_id_str || "",
            avatarUrl:
              comment.core.user_results.result.legacy.profile_image_url_https,
            author: comment.core.user_results.result.legacy.screen_name,
            content: strEntitiesToHTML(replayContent, [
              ...(comment.legacy.entities?.urls ?? []),
              ...(comment.legacy.entities?.media ?? []),
            ]),
            replayUser: replayUser || "",
            isChecked: false,
            mediaPhotosUrl:
              comment.legacy?.extended_entities?.media
                ?.filter((m) => m.type === "photo")
                .map((m) => m.media_url_https) || [],
            card: comment.card?.legacy?.binding_values?.reduce(
              (
                acc: Record<string, string>,
                item: { key: string; value: any },
              ) => {
                acc[item.key] = item.value;
                return acc;
              },
              {},
            ),
            imageUrl:
              comment.card?.legacy?.binding_values.find(
                (item) => item.key === "photo_image_full_size_large",
              )?.value.image_value?.url || "",
          });
        });

        const currentTodo = {
          url,
          postContent: mainTweet?.legacy.full_text,
          title: "",
          comments: checkedComments,
          postscripts: [],
          author: mainTweet?.core.user_results.result.legacy.screen_name,
          avatarUrl:
            mainTweet?.core.user_results.result.legacy.profile_image_url_https,
          source: "twitter",
          id:
            mainTweet?.legacy.conversation_id_str ||
            checkedComments?.[0]?.conversationId,
        };
        console.log("currentTodo", currentTodo);
        sendMessageToContentScript(currentTodo, "x-data");
      } catch (err) {
        console.error(err);
      } finally {
        handler.resolve(response);
      }

      handler.resolve(response);
    },
  });
});
