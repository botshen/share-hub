
export function getComment() {
  const commentElements = document.querySelectorAll('shreddit-comment');
  // console.log('commentElements', commentElements)
  const comments = Array.from(commentElements).map(comment => {
    console.log('comment', comment)
    // 先找commentAvatar
    const commentAvatar = comment.querySelector('[slot="commentAvatar"]')
    const avatar = commentAvatar?.querySelector('img[alt*="avatar"]') as HTMLImageElement | null;
    let avatarUrl = avatar?.src;

    if (!avatarUrl) {
      // 如果第一种方式失败，尝试第二种方式
      const svgImage = comment.querySelector('svg image[href]');
      avatarUrl = svgImage?.getAttribute('href') || undefined;
    }

    const id = comment.getAttribute('thingid')
    const author = comment.getAttribute('author')
    const depth = comment.getAttribute('depth')
    const parentId = comment.getAttribute('parentid')
    findImmersiveElements(comment as unknown as Document);

    const content = comment.querySelector('[slot="comment"]')?.innerHTML


    return {
      id,
      avatarUrl,
      author,
      content,
      depth,
      parentId,
    }
  })
  console.log('comments', comments)
  return comments;
}