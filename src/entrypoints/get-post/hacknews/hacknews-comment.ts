
import { findImmersiveElements } from "@/utils/dom";
import { createNanoId } from "@/utils/id-helper";
export function getComment() {
  const commentElements = document.querySelectorAll('.comtr');
  console.log('commentElements', commentElements)
  const comments = Array.from(commentElements).map(comment => {
    findImmersiveElements(comment as unknown as Document);

    console.log('comment', comment)


    const author = comment.querySelector('.hnuser')?.textContent
    const ind = comment.querySelector('.ind')
    const depth = ind?.getAttribute('indent') || "0"
    const content = comment.querySelector('.commtext')?.innerHTML


    return {
      id: createNanoId(),
      avatarUrl: '',
      author,
      content,
      depth,
    }
  })
  console.log('comments', comments)
  return comments;
}