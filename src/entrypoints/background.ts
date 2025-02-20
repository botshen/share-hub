export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "openNewTab") {
      browser.tabs.create({ url: browser.runtime.getURL("/options.html") }, (tab) => {
        browser.tabs.onUpdated.addListener(function listener(tabId, info) {
          if (info.status === 'complete' && tabId === tab.id) {
            browser.tabs.onUpdated.removeListener(listener);
            browser.tabs.sendMessage(tabId, {
              action: "showPostContent",
              data: message.data
            });
          }
        });
      });
    }
  });
  
});
