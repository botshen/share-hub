
export function getComment() {
  const commentElements = document.querySelectorAll('shreddit-comment');
  // console.log('commentElements', commentElements)
  const comments = Array.from(commentElements).map(comment => {
    // 尝试获取头像的不同方式
    const avatar = comment.querySelector('img[alt*="avatar"]') as HTMLImageElement | null;
    let avatarSrc = avatar?.src;

    if (!avatarSrc) {
      // 如果第一种方式失败，尝试第二种方式
      const svgImage = comment.querySelector('svg image[href]');
      avatarSrc = svgImage?.getAttribute('href') || undefined;
    }

    // console.log('Found avatar URL:', avatarSrc);

    const authorName = comment.querySelector('[aria-label*="profile"]:not([aria-label*="avatar"])')?.textContent?.trim()
    // console.log('Found author name:', authorName)

    findImmersiveElements(comment as unknown as Document);

    const commentText = comment.querySelector('[slot="comment"]')?.innerHTML

    // console.log('commentText', commentText)

    return {
      id: createNanoId("comment"),
      avatarUrl: avatarSrc,
      author: authorName,
      content: commentText,
    }
  })
  return comments;
}