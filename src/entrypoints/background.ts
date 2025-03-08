import { onMessage } from "@/utils/message";
import { registerTodosRepo } from "@/utils/service";
import { openDB } from "idb";

export default defineBackground(() => {
  // console.log("Hello background!", { id: browser.runtime.id });

  // Open the database and register your service
  const db = openDB("todos", 1, {
    upgrade(db) {
      // 创建一个名为 'todos' 的对象存储
      if (!db.objectStoreNames.contains("todos")) {
        db.createObjectStore("todos", {
          keyPath: "id",
        });
      }
    },
  });
  registerTodosRepo(db);
  onMessage("openOptionsPage", async () => {
    const url = browser.runtime.getURL("/options.html");

    // 查找所有已打开的选项页面
    const tabs = await browser.tabs.query({ url });

    if (tabs.length > 0) {
      // 如果已存在选项页面，则聚焦到第一个
      await browser.tabs.update(tabs[0].id!, { active: true });

    } else {
      // 如果不存在，则创建新的选项页面
      await browser.tabs.create({
        url,
        active: true
      });
    }
  });
});
