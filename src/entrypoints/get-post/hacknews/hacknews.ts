import { findImmersiveElements } from "@/utils/dom";
import { getComment } from "./hacknews-comment";
import { getTodosRepo } from "@/utils/service";
import { currentIdStorage } from "@/utils/storage";

import { sendMessage } from "@/utils/message";
import { createNanoId } from "@/utils/id-helper";

export async function sharePostHacknews() {
  findImmersiveElements(document);
  const title = document.querySelector('.titleline')?.innerHTML?.replace(/Ask HN:|问 HN：/g, '');
   const fatitem = document.querySelector('.fatitem')
   const author = fatitem?.querySelector('.hnuser')?.textContent
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
