import { getTodosRepo } from "@/utils/service";
import { sendMessage } from "@/utils/message";

export function sharePostX(xData: any) {
  console.log('xData', xData)
  const { postContent, title, comments, author, avatarUrl } = xData
  const url = window.location.href;
  const currentTodo = {
    postContent,
    title,
    author,
    url,
    avatarUrl,
    comments,
    postscripts: [],
    source: "x",
  };
  const todosRepo = getTodosRepo();

  todosRepo.update(currentTodo);
  sendMessage("openOptionsPage", undefined);
}
