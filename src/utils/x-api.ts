import type { TimelineInstructions, Tweet } from "@/entrypoints/types";

import type { TweetUnion } from "@/entrypoints/types";
export interface TweetDetailResponse {
  data: {
    threaded_conversation_with_injections_v2: {
      instructions: TimelineInstructions;
    };
  };
}
export function isMainTweet(tweet: TweetUnion): tweet is Tweet {
  if (tweet.__typename !== 'Tweet') {
    return false;
  }
  return tweet.legacy.conversation_id_str === tweet.legacy.id_str;
}

export function findMainTweet(comments) {
  return comments.find(c => c.conversationId === c.id)
}

export function isXTweetDetailUrl(url: string) {
  return /\/graphql\/.+\/TweetDetail/.test(url)
}
