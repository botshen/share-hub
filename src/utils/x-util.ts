import { extractTimelineTweet, isTimelineEntryConversationThread, isTimelineEntryTweet } from "@/entrypoints/api";
import type {
  TimelineAddEntriesInstruction,
  TimelineAddToModuleInstruction,
  TimelineTweet,
  Tweet,
  TweetUnion
} from "@/entrypoints/types";

import { strEntitiesToHTML } from "@/utils/x";
import { findMainTweet, type TweetDetailResponse } from "@/utils/x-api";



export function transformXData(data: any) {
  const json: TweetDetailResponse = JSON.parse(data);
  const instructions =
    json.data.threaded_conversation_with_injections_v2.instructions;
  const originComments: Tweet[] = [];
  console.log('instructions', instructions)
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
        originComments.push(tweetUnion);
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

      originComments.push(
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

    originComments.push(...tweetsInConversation);
  }
  console.log("originComments", originComments);
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
    cardInfo: Record<string, any>;
    imageUrl: string;
    replayUser: string;
    quotedContent: string;
    quotedUser: string;
    quotedUserImage: string;
    quotedImg: string;
  }[] | TweetUnion = [];

  originComments.forEach((comment) => {
    if (comment.legacy.display_text_range) {
      const [start, end] = comment.legacy.display_text_range;
      const text = comment.legacy.full_text;
      let safeStart = start;
      let safeEnd = end;

      if (text.codePointAt(start)?.toString(16).length === 5) {
        safeStart = start - 1;
      }

      if (text.codePointAt(end - 1)?.toString(16).length === 5) {
        safeEnd = end + 1;
      }

      comment.legacy.full_text = text.substring(safeStart, safeEnd);
    }

    const replayUser = comment.legacy.full_text.match(/@([^\s]+)/)?.[1];
    const replayContent = comment.legacy.full_text
      .replace(`@${replayUser}`, "")
      .replace(/https:\/\/t\.co\/\w+/g, "");
    let quotedContent = "";
    let quotedUser = "";
    let quotedUserImage = "";
    let quotedImg = "";
    if (comment.quoted_status_result?.result) {
      console.log('comment', comment)
      console.log('comment.quoted_status_result?.result', comment.quoted_status_result?.result)
      const tweet = comment.quoted_status_result?.result || comment.quoted_status_result?.result?.tweet
      const range = tweet?.legacy?.display_text_range
      if (range && Array.isArray(range)) {
        const [start, end] = range;
        const _quotedContent = tweet?.legacy?.full_text.substring(start, end);
        const _quotedUser = tweet?.core?.user_results?.result?.legacy?.name;
        const _quotedUserImage = tweet?.core?.user_results?.result?.legacy?.profile_image_url_https;
        const _quotedImg = tweet?.legacy?.extended_entities?.media?.find(m => m.type === 'photo')?.media_url_https;
        quotedContent = _quotedContent;
        quotedUser = _quotedUser;
        quotedUserImage = _quotedUserImage;
        quotedImg = _quotedImg;
      }
    }
    const card = comment.card?.legacy?.binding_values?.reduce(
      (acc: Record<string, any>, item: { key: string; value: any }) => {
        // 根据不同的 value type 提取实际值
        const value = item.value.string_value ||
          item.value.image_value ||
          item.value.image_color_value;
        acc[item.key] = value;
        return acc;
      },
      {},
    );

    const cardInfo = {
      title: card?.title,
      domain: card?.domain,
      appName: card?.app_name,
      // 使用最大尺寸的缩略图
      thumbnailUrl: card?.thumbnail_image_x_large?.url,
      // App 相关信息
      appStarRating: card?.app_star_rating,
      appNumRatings: card?.app_num_ratings,
      appIsFree: card?.app_is_free === 'true',
      // 颜色信息，用于UI渲染
      themeColor: card?.thumbnail_image_color?.palette?.[0]?.rgb,
      // 链接
      cardUrl: card?.card_url
    };

    if (comment.rest_id === "1765246490946277488") {
      console.log('cardInfo', cardInfo)
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
      cardInfo,
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

  console.log('checkedComments', checkedComments)
  const mainTweet = findMainTweet(checkedComments);
  const realComments = checkedComments.filter((c) => c.id !== mainTweet?.id);
  console.log('mainTweet', mainTweet)
  const { quotedContent = "", quotedUser = "", quotedUserImage = "", quotedImg = "" } = mainTweet
  const currentTodo = {
    url,
    title: "",
    content: mainTweet?.content,
    comments: realComments,
    postscripts: [],
    author: mainTweet?.author,
    avatarUrl:
      mainTweet?.avatarUrl,
    source: "x",
    mediaPhotosUrl:
      mainTweet?.mediaPhotosUrl,
    id:
      mainTweet?.id,
    isInitialLoad: false,
    quotedContent,
    quotedUser,
    quotedUserImage,
    quotedImg,

  };
  if (mainTweet) {
    // 添加一个标记表示这是页面加载的初始数据
    currentTodo.isInitialLoad = true;
  }
  console.log("currentTodo-inject", currentTodo);
  return currentTodo;
}
