import { getTodosRepo } from "@/utils/service";
import { sendMessage } from "@/utils/message";

export function sharePostX(xData: any) {
  console.log('xData', xData)
  const { postContent, title, comments, author, avatarUrl, id } = xData
  const url = window.location.href;
  const _id = id || createNanoId()
  const currentTodo = {
    id: _id,
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
  sendMessage("openOptionsPage", _id);
}
