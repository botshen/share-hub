import { Readability } from "@mozilla/readability";
import { getTodosRepo } from "@/utils/service";
import { sendMessage } from "@/utils/message";
import { createNanoId } from "@/utils/id-helper";
export async function sharePostCommon() {
  // 克隆整个文档以避免修改原始文档
  var documentClone = document.cloneNode(true);

  // 使用 Readability 解析主要内容
  var article = new Readability(documentClone as Document).parse();

  // 清洗数据 - 移除多余的HTML标签和格式信息
  if (article?.textContent) {
    article.textContent = article.textContent
      .replace(/\s+/g, ' ')  // 合并多个空格
      .trim();
  }

 
  const url = window.location.href;
  const currentTodo = {
    id: createNanoId(),
    postContent: article?.textContent || "",
    title: article?.title || "",
    author: article?.byline || "",
    url,
    avatarUrl: "",
    comments: [],
    postscripts: [],
    source: "common",
  };
  const todosRepo = getTodosRepo();

  todosRepo.update(currentTodo);
  await sendMessage("openOptionsPage", undefined);
}