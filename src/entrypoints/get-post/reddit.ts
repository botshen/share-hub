import { findImmersiveElements } from "@/utils/dom";

const todosRepo = getTodosRepo();

// 清理 HTML 内容的辅助函数
function cleanHtmlContent(html: string): string {
  const container = document.createElement('div');
  container.innerHTML = html;

  // 移除所有元素的 class、style、id 属性
  const allElements = container.getElementsByTagName('*');
  for (let i = 0; i < allElements.length; i++) {
    const element = allElements[i];
    // element.removeAttribute('class');
    element.removeAttribute('style');
    element.removeAttribute('id');
    element.removeAttribute('data-*');
    element.removeAttribute('aria-*');
    element.removeAttribute('role');

    // 移除所有事件监听器
    const clone = element.cloneNode(true);
    element.parentNode?.replaceChild(clone, element);
  }

  // 保留图片的必要属性
  container.querySelectorAll('img').forEach(img => {
    img.setAttribute('loading', 'lazy');
    // 只保留 src 和 alt 属性
    const src = img.getAttribute('src');
    const alt = img.getAttribute('alt');
    for (const attr of img.getAttributeNames()) {
      img.removeAttribute(attr);
    }
    if (src) img.setAttribute('src', src);
    if (alt) img.setAttribute('alt', alt);
  });

  return container.innerHTML;
}

export async function sharePostReddit() {
  // 获取主题 wrapper
  const post = document.querySelector("shreddit-post");
  if (!post) return;
  findImmersiveElements(post as unknown as Document);
  // console.log("post", post);

  // 获取头像
  const avatar = post.querySelector('[class*="avatar"]');
  const avatarUrl = avatar?.querySelector("img")?.src;
  // 获取作者
  const authorName = post.querySelector('[slot="authorName"]');
  const authorElement = authorName?.querySelector('[class*="author-name"]');
  const author = authorElement ? authorElement.textContent?.trim() : "";
  // 获取标题
  const titleElement = post.querySelector("h1");
  const title = titleElement ? titleElement.innerHTML : "";
  console.log('title', title)

  // 获取帖子
  const contentElement = post.querySelector('[slot="text-body"]');
  // console.log("contentElement.innerHTML", contentElement?.innerHTML);
  const _content = contentElement ? cleanHtmlContent(contentElement.innerHTML) : "";
  // console.log('_content', _content)
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

  // console.log('comments', comments)


  const url = window.location.href;
  const currentTodo = {
    postContent: _content,
    title,
    author,
    url,
    avatarUrl,
    comments,
    postscripts: [],
    source: "reddit",
  };
  todosRepo.update(currentTodo);
  await sendMessage("openOptionsPage", undefined);
}
