import { onMessage, sendMessage } from "@/utils/message";
import { registerTodosRepo } from "@/utils/service";
import { openDB } from "idb";

export default defineBackground(() => {

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

  browser.runtime.onInstalled.addListener(() => {
    // 创建一个分享菜单项
    browser.contextMenus.create({
      id: "shareMenu",
      title: "分享",
      contexts: ["all"], // 可以是 ["page", "selection", "link", "image"] 等
    });
  });
  browser.contextMenus.onClicked.addListener(async (info, tab) => {
    switch (info.menuItemId) {
      case "shareMenu":
        console.log("点击了分享菜单");
        // 获取当前活动标签页
        const currentTab = await browser.tabs.query({ active: true, currentWindow: true });
        const tabId = currentTab[0].id!;
        await sendMessage("sharePost", undefined, { tabId });
        break;
      default:
        break;
    }
  });
});
