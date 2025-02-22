import { registerTodosRepo } from "@/utils/service";
import { openDB } from "idb";

export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });


  // Open the database and register your service
  const db = openDB("todos", 1, {
    upgrade(db) {
      // 创建一个名为 'todos' 的对象存储
      if (!db.objectStoreNames.contains('todos')) {
        db.createObjectStore('todos', { 
          keyPath: 'id',
          autoIncrement: true 
        });
      }
    }
  });
  registerTodosRepo(db);
  console.log("todos repo registered");

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
