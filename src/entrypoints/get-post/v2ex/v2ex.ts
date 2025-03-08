import { createNanoId } from "@/utils/id-helper";
import { sendMessage } from "@/utils/message";
import { getTodosRepo } from "@/utils/service";
import { currentIdStorage } from "@/utils/storage";




// 清理HTML内容，删除所有具有指定class的元素
function cleanHTMLContent(html: string): string {
  const container = document.createElement("div");
  container.innerHTML = html;

  // 处理YouTube视频嵌入
  const videoWrappers = container.querySelectorAll(".embedded_video_wrapper");
  videoWrappers.forEach((wrapper) => {
    const iframe = wrapper.querySelector("iframe");
    if (iframe && iframe.src) {
      // 从iframe的src中提取视频ID
      const videoId = iframe.src.split("/").pop();
      if (videoId) {
        // 创建一个包含视频封面的div
        const thumbnailDiv = document.createElement("div");
        thumbnailDiv.className = "youtube-thumbnail";
        thumbnailDiv.innerHTML = `
          <img src="https://img.youtube.com/vi/${videoId}/maxresdefault.jpg" 
               alt="YouTube视频封面" 
               style="width: 100%; border-radius: 8px;"
          />
          <div style="text-align: center; margin-top: 8px; color: #666;">
            🎬 点击查看YouTube视频
          </div>
        `;
        // 替换原有的iframe
        wrapper.innerHTML = "";
        wrapper.appendChild(thumbnailDiv);
      }
    }
  });

  // 原有的清理代码
  const elementsToRemove = container.querySelectorAll("span.small.fade");
  elementsToRemove.forEach((element) => {
    element.remove();
  });

  const citedReplies = container.querySelectorAll(".cited_reply");
  citedReplies.forEach((citedReply) => {
    const frElements = citedReply.querySelectorAll("div.fr");
    const agoElements = citedReply.querySelectorAll(".ago");

    frElements.forEach((element) => {
      element.remove();
    });

    agoElements.forEach((element) => {
      element.remove();
    });
  });

  return container.innerHTML;
}

export async function sharePostV2ex() {
  const postContentElement = document.querySelector(
    ".topic_content:not(.markdown_body)",
  );
  let postContent = postContentElement ? postContentElement.innerHTML : "";
  postContent = cleanHTMLContent(postContent);
  const titleElement = document.querySelector(
    "#Wrapper .content #Main .box .header h1",
  );
  const title = titleElement ? titleElement.textContent : "未找到标题";

  const authorElement = document.querySelector(
    "#Wrapper .content #Main .box .header small a",
  );
  const author = authorElement ? authorElement.textContent : "未找到作者";

  const avatarElement = document.querySelector(
    "#Wrapper .content #Main .box .header img",
  ) as HTMLImageElement;
  const avatarUrl = avatarElement ? avatarElement.src : "未找到头像";

  const postscriptElements = document.querySelectorAll(
    "#Wrapper .content #Main .box .subtle .topic_content",
  );
  const postscripts = Array.from(postscriptElements).map((element) => ({
    content: cleanHTMLContent((element as HTMLElement).innerHTML),
  }));

  const comments = collectCheckedComments();
  const url = window.location.href;
  const _id = url.split('/').pop()?.split('#')[0] || url.split('/').pop();
  const id = _id ? parseInt(_id) : createNanoId();
  const currentTodo = {
    id,
    postContent,
    title,
    author,
    avatarUrl,
    comments,
    postscripts,
    url,
    source: "v2ex",
  };
  const todosRepo = getTodosRepo();
  currentIdStorage.setValue(id);
  todosRepo.update(currentTodo);
  await sendMessage("openOptionsPage", undefined);
}

function collectCheckedComments() {
  let comments: NodeListOf<Element> | null = null;

  // 初始查找所有评论元素
  const mainElement = document.querySelector("#Main");
   if (mainElement) {
    const boxes = mainElement.querySelectorAll(".box");
    if (boxes.length > 1) {
      const secondBox = boxes[1];
      comments = secondBox.querySelectorAll("[id^='r_']");
    }
  }

  const checkedComments: {
    id: string;
    avatarUrl: string;
    author: string;
    content: string;
    isChecked: boolean;
  }[] = [];
   if (comments) {
    comments.forEach((comment) => {
      const commentElement = comment.querySelector("table") as HTMLElement;
      if (commentElement) {
        const avatarElement = commentElement.querySelector(
          "img.avatar",
        ) as HTMLImageElement;
        const authorElement = commentElement.querySelector(
          "strong a.dark",
        ) as HTMLElement;
        const contentElement = commentElement.querySelector(
          ".reply_content",
        ) as HTMLElement;

        const avatarUrl = avatarElement ? avatarElement.src : "未找到头像";
        const author = authorElement ? authorElement.textContent : "未找到作者";
        let content = contentElement
          ? contentElement.innerHTML
          : "未找到评论内容";
        content = cleanHTMLContent(content);

        checkedComments.push({
          id: createNanoId("comment"),
          avatarUrl,
          author: author || "-",
          content: content || "-",
          isChecked: false,
        });
      }
    });
  }
   return checkedComments;
}
