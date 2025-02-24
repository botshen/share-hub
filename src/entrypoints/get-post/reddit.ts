const todosRepo = getTodosRepo();

// 清理 HTML 内容的辅助函数
function cleanHtmlContent(html: string): string {
  const container = document.createElement('div');
  container.innerHTML = html;

  // 移除所有元素的 class、style、id 属性
  const allElements = container.getElementsByTagName('*');
  for (let i = 0; i < allElements.length; i++) {
    const element = allElements[i];
    element.removeAttribute('class');
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
  const title = titleElement ? titleElement.textContent?.trim() : "";

  // 获取帖子
  const contentElement = post.querySelector('[slot="text-body"]');
  console.log("contentElement.innerHTML", contentElement?.innerHTML);
  const _content = contentElement ? cleanHtmlContent(contentElement.innerHTML) : "";
  console.log('_content', _content)
  const postData = {
    author,
    title,
    content: _content,
  };

  const url = window.location.href;
  const currentTodo = {
    postContent: postData.content,
    title: postData.title,
    author: postData.author,
    url,
    avatarUrl: avatarUrl,
    comments: [],
    postscripts: [],
  };
  todosRepo.update(currentTodo);
  await sendMessage("openOptionsPage", undefined);
}
