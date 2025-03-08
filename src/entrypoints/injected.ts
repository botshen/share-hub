import { proxy } from "ajax-hook";
import { sendMessageToContentScript } from "@/utils/inject-help";
 import { isXTweetDetailUrl, transformXData } from "@/utils/x-util";
 


export default defineUnlistedScript(() => {
  proxy({
    onRequest: (config, handler) => {
      handler.next(config);
    },
    onError: (err, handler) => {
      handler.next(err);
    },
    onResponse: (response, handler) => { 
      const url = response.config.url;
      const responseData = response.response;
      if(isXTweetDetailUrl(url)){
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
