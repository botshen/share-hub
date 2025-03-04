import { findImmersiveElements } from "@/utils/dom";
import { getComment } from "./hacknews-comment";
import { getTodosRepo } from "@/utils/service";
import { currentIdStorage } from "@/utils/storage";

import { sendMessage } from "@/utils/message";
import { createNanoId } from "@/utils/id-helper";

export async function sharePostHacknews() {
  findImmersiveElements(document);
  const title = document.querySelector('.titleline')?.innerHTML?.replace(/Ask HN:|问 HN：/g, '');
  console.log('title', title)
  const fatitem = document.querySelector('.fatitem')
  console.log('fatitem', fatitem)
  const author = fatitem?.querySelector('.hnuser')?.textContent
  console.log('author', author)
  const content = document.querySelector('.toptext')
  const comments = getComment()
  const url = window.location.href;
  const todosRepo = getTodosRepo();

  const currentTodo = {
    id: createNanoId(),
    title,
    author,
    url,
    avatarUrl: '',
    comments,
    postscripts: [],
    source: "hacknews",
    postContent: content?.innerHTML || "",
  };
  currentIdStorage.setValue(currentTodo.id);
  todosRepo.update(currentTodo);
  await sendMessage("openOptionsPage", undefined);
}
