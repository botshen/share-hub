import { extractTweetFullText, isTimelineEntryConversationThread } from "@/entrypoints/api";
import { extractTimelineTweet } from "@/entrypoints/api";
import { isTimelineEntryTweet } from "@/entrypoints/api";
import type {
  TimelineAddEntriesInstruction,
  TimelineAddToModuleInstruction,
  TimelineInstructions,
  TimelineTweet,
  Tweet,
  TweetUnion,
} from "@/entrypoints/types";

import { strEntitiesToHTML } from "@/utils/x";
function isMainTweet(tweet: TweetUnion): tweet is Tweet {
  if (tweet.__typename !== 'Tweet') {
    return false;
  }
  return tweet.legacy.conversation_id_str === tweet.legacy.id_str;
}

export function isXTweetDetailUrl(url: string) {
  return /\/graphql\/.+\/TweetDetail/.test(url)
}
interface TweetDetailResponse {
  data: {
    threaded_conversation_with_injections_v2: {
      instructions: TimelineInstructions;
    };
  };
}


export function transformXData(data: any) {
  const json: TweetDetailResponse = JSON.parse(data);
  const instructions =
    json.data.threaded_conversation_with_injections_v2.instructions;
  let mainTweet!: Tweet;
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
      const tweetUnion = extractTimelineTweet(entry.content.itemContent);
      if (tweetUnion && tweetUnion.__typename === 'Tweet') {
        if (isMainTweet!(tweetUnion)) {
          mainTweet! = tweetUnion;
        } else {
          console.log('tweetUnion', tweetUnion)
          comments.push(tweetUnion);
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
  console.log("mainTweet!", mainTweet!);
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
    quotedContent: string;
    quotedUser: string;
    quotedUserImage: string;
    quotedImg: string;
  }[] = [];

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
    if (comment.legacy.display_text_range) {
      // 根据display_text_range 提取出实际显示的内容
      const [start, end] = comment.legacy.display_text_range;
      comment.legacy.full_text = comment.legacy.full_text.substring(start, end);
    }
    // comment.legacy.full_text @szac19851 firefox今天出了个事，你去搜一下 隐私相关的
    // 提取出@szac19851 后面的内容（匹配第一个@和后面连着的字符）
    // @szac19851 firefox今天出了个事，你去搜一下 隐私相关的   => @szac19851 firefox今天出了个事，你去搜一下 隐私相关的
    const replayUser = comment.legacy.full_text.match(/@([^\s]+)/)?.[1];
    const replayContent = comment.legacy.full_text
      .replace(`@${replayUser}`, "")
      .replace(/https:\/\/t\.co\/\w+/g, "");
    let quotedContent = "";
    let quotedUser = "";
    let quotedUserImage = "";
    let quotedImg = "";
    if (comment.quoted_status_result?.result?.tweet) {
      const [start, end] = comment.quoted_status_result?.result?.tweet.legacy?.display_text_range;
      const _quotedContent = comment.quoted_status_result?.result?.tweet.legacy?.full_text.substring(start, end);
      const _quotedUser = comment.quoted_status_result?.result?.tweet.core?.user_results?.result?.legacy?.name;
      const _quotedUserImage = comment.quoted_status_result?.result?.tweet.core?.user_results?.result?.legacy?.profile_image_url_https;
      const _quotedImg = comment.quoted_status_result?.result?.tweet.legacy?.extended_entities?.media?.find(m => m.type === 'photo')?.media_url_https;
      console.log('quotedContent==============================================================', quotedContent)
      console.log('quotedUser', quotedUser)
      console.log('quotedUserImage', quotedUserImage)
      console.log('quotedImg', quotedImg)
      quotedContent = _quotedContent;
      quotedUser = _quotedUser;
      quotedUserImage = _quotedUserImage;
      quotedImg = _quotedImg;
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
      quotedContent: quotedContent,
      quotedUser: quotedUser,
      quotedUserImage: quotedUserImage,
      quotedImg: quotedImg,
    });
  });
  let mainQuotedContent = "";
  let mainQuotedUser = "";
  let mainQuotedUserImage = "";
  let mainQuotedImg = "";
  console.log('mainTweet', mainTweet)
  if (mainTweet.quoted_status_result?.result) {
    const [start, end] = mainTweet.quoted_status_result?.result.legacy?.display_text_range;
    const _MainQuotedContent = mainTweet.quoted_status_result?.result.legacy?.full_text.substring(start, end);
    const _MainQuotedUser = mainTweet.quoted_status_result?.result.core.user_results.result.legacy.name;
    const _MainQuotedUserImage = mainTweet.quoted_status_result?.result.core.user_results.result.legacy.profile_image_url_https;
    const _MainQuotedImg = mainTweet.quoted_status_result?.result.legacy?.extended_entities?.media?.find(m => m.type === 'photo')?.media_url_https;
    console.log('mainQuotedContent==============================================================', mainQuotedContent)
    console.log('mainQuotedUser', mainQuotedUser)
    console.log('mainQuotedUserImage', mainQuotedUserImage)
    console.log('mainQuotedImg', mainQuotedImg)
    mainQuotedContent = _MainQuotedContent;
    mainQuotedUser = _MainQuotedUser;
    mainQuotedUserImage = _MainQuotedUserImage;
    mainQuotedImg = _MainQuotedImg;
  }
  const currentTodo = {
    url,
    postContent: extractTweetFullText(mainTweet!),
    title: "",
    comments: checkedComments,
    postscripts: [],
    author: mainTweet?.core.user_results.result.legacy.screen_name,
    avatarUrl:
      mainTweet?.core.user_results.result.legacy.profile_image_url_https,
    source: "x",
    mediaPhotosUrl:
      mainTweet?.legacy?.extended_entities?.media
        ?.filter((m) => m.type === "photo")
        .map((m) => m.media_url_https) || [],
    id:
      mainTweet?.legacy.conversation_id_str ||
      checkedComments?.[0]?.conversationId,
    isInitialLoad: false,
    mainQuotedContent: mainQuotedContent,
    mainQuotedUser: mainQuotedUser,
    mainQuotedUserImage: mainQuotedUserImage,
    mainQuotedImg: mainQuotedImg,
  };
  if (mainTweet) {
    // 添加一个标记表示这是页面加载的初始数据
    currentTodo.isInitialLoad = true;
  }
  console.log("currentTodo", currentTodo);
  return currentTodo;
}
