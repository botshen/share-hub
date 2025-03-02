import { proxy } from "ajax-hook";

export default defineUnlistedScript(() => {
  proxy({
    onRequest: (config, handler) => {
      handler.next(config);
    },
    onError: (err, handler) => {
      handler.next(err);
    },
    onResponse: (response, handler) => {
      console.log("response", response.config.url);
      handler.resolve(response);
    },
  });
});
