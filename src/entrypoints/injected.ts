import { getMockData } from "@/utils/dom";
import { sendMessageToContentScript, tryParseJson } from "@/utils/inject-help";
import { isXTweetDetailUrl } from "@/utils/x-api";
import { transformXData } from "@/utils/x-util";
import { proxy } from "ajax-hook";

export default defineUnlistedScript(() => {
  const res = getMockData();
  proxy({
    onRequest: (config, handler) => {
      // if (res.isDebugMode && res.xMockData.mockData && isXTweetDetailUrl(config.url)) {
      //   console.log('res', res)
      //   const mockData = tryParseJson(res.xMockData.mockData, {});
      //   console.log('mockData', mockData)
      //   handler.resolve(mockData);
      // } else {
      //   handler.next(config);
      // }
      handler.next(config);

    },
    onError: (err, handler) => {
      handler.next(err);
    },
    onResponse: (response, handler) => {
      const url = response.config.url;
      const responseData = response.response;
      // if (res.isDebugMode && isXTweetDetailUrl(url)) {
      //   window.dispatchEvent(new CustomEvent('x-mockData', { detail: responseData }));
      // }
      if (isXTweetDetailUrl(url)) {

        try {
          const currentTodo = transformXData(responseData);
          sendMessageToContentScript(currentTodo, "x-data");
        } catch (err) {
          console.error(err);
        } finally {
          handler.resolve(response);
        }
      } else {
        handler.resolve(response);
      }
    },
  });
});
