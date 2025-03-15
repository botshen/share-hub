import type { IssueComment, Issue } from "./issue-types";
import showdown from 'showdown'
/**
 * 智能处理HTML内容
 * 如果是真正的HTML内容则保持不变，如果是纯文本中包含HTML标签字符则进行转义
 * @param content 需要处理的内容
 * @returns 处理后的内容
 */
function processHtmlContent(content: string): string {
  // 检查内容是否看起来像有效的HTML
  // 简单判断：如果包含成对的HTML标签，则认为是有效HTML
  const hasValidHtmlTags = /<\w+[^>]*>.*?<\/\w+>/s.test(content);

  // 如果看起来是有效的HTML，则不进行转义处理
  if (hasValidHtmlTags) {
    return content;
  }

  // 否则，将其视为纯文本，对HTML特殊字符进行转义
  return escapeHtml(content);
}

/**
 * 转义 HTML 特殊字符，防止标签被解析
 * @param text 需要转义的文本
 * @returns 转义后的文本
 */
function escapeHtml(text: string): string {
  if (!text) return ''
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * 从 GitHub 页面的嵌入式数据中提取 Issue 信息
 * @param documentData 页面中的嵌入式 JSON 数据
 * @returns 提取的 Issue 对象
 */
function extractGitHubIssueData(documentData: string): Issue {
  try {
    // 解析 JSON 数据
    const jsonStartIndex = documentData.indexOf('{');
    const jsonEndIndex = documentData.lastIndexOf('}') + 1;
    const jsonData = documentData.substring(jsonStartIndex, jsonEndIndex);
    const parsedData = JSON.parse(jsonData);

    // 获取 Issue 数据
    // 适配新的数据结构
    const issueData = parsedData.payload.preloadedQueries[0].result.data.repository.issue;

    // 提取评论
    const comments: IssueComment[] = [];
    // 适配新的数据结构中的评论
    const timelineItems = issueData?.frontTimelineItems?.edges || [];

    for (const item of timelineItems) {
      if (item.node.__typename === 'IssueComment') {
        comments.push({
          id: item?.node?.id || createNanoId('issue-comment-'),
          body: item?.node?.body,
          bodyHTML: item?.node?.bodyHTML,
          createdAt: item?.node?.createdAt,
          author: item?.node?.author
        });
      }
    }
    // 构建 Issue 对象
    const issue: Issue = {
      id: issueData?.id || createNanoId('issue-'),
      title: issueData?.title,
      number: issueData?.number,
      state: issueData?.state,
      stateReason: issueData?.stateReason,
      createdAt: issueData?.createdAt,
      updatedAt: issueData?.updatedAt,
      author: issueData?.author,
      body: issueData?.body,
      bodyHTML: issueData?.bodyHTML,
      labels: issueData?.labels,
      assignees: issueData?.assignees,
      linkedPullRequests: issueData?.linkedPullRequests,
      comments: comments
    };

    return issue;
  } catch (error) {
    console.error('解析 GitHub Issue 数据时出错:', error);
    throw new Error('无法提取 Issue 数据');
  }
}

/**
 * 从GitHub Issue页面提取Issue数据并输出详细信息
 * @returns 提取的Issue对象，如果未找到数据则返回null
 */
export async function parseGitHubIssueFromDocument(): Promise<void> {
  // 获取文档中的嵌入式数据
  const scriptElement = document.querySelector('script[type="application/json"][data-target="react-app.embeddedData"]');
  // console.log('scriptElement', scriptElement)
  if (scriptElement) {
    const issueData = extractGitHubIssueData(scriptElement.textContent || '');

    // // 输出Issue基本信息
    // console.log('===== Issue基本信息 =====');
    // console.log('Issue ID:', issueData.id);
    // console.log('Issue编号:', issueData.number);
    // console.log('Issue标题:', issueData.title);
    // console.log('Issue状态:', issueData.state, issueData.stateReason ? `(${issueData.stateReason})` : '');
    // console.log('创建时间:', new Date(issueData.createdAt).toLocaleString());
    // console.log('更新时间:', new Date(issueData.updatedAt).toLocaleString());

    // // 输出Issue作者信息
    // console.log('\n===== Issue作者信息 =====');
    // console.log('作者用户名:', issueData.author.login);
    // console.log('作者ID:', issueData.author.id);
    // console.log('作者头像URL:', issueData.author.avatarUrl);
    // if (issueData.author.name) {
    //   console.log('作者显示名称:', issueData.author.name);
    // }

    // 输出Issue内容
    // console.log('\n===== Issue内容 =====');
    // console.log('Issue描述:', issueData.body);
    // console.log('Issue描述(HTML):', issueData.bodyHTML); // HTML内容较长，可选择是否输出

    // 输出标签信息
    // if (issueData.labels && issueData.labels.edges && issueData.labels.edges.length > 0) {
    //   console.log('\n===== Issue标签 =====');
    //   issueData.labels.edges.forEach((labelEdge, index) => {
    //     const label = labelEdge.node;
    //     console.log(`标签 ${index + 1}:`, label.name);
    //     console.log(`标签 ${index + 1} 颜色:`, label.color);
    //     if (label.description) {
    //       console.log(`标签 ${index + 1} 描述:`, label.description);
    //     }
    //   });
    // }

    // 输出指派人信息
    // if (issueData.assignees && issueData.assignees.nodes && issueData.assignees.nodes.length > 0) {
    //   console.log('\n===== Issue指派人 =====');
    //   issueData.assignees.nodes.forEach((assignee, index) => {
    //     console.log(`指派人 ${index + 1}:`, assignee.login);
    //     console.log(`指派人 ${index + 1} 头像:`, assignee.avatarUrl);
    //     if (assignee.name) {
    //       console.log(`指派人 ${index + 1} 显示名称:`, assignee.name);
    //     }
    //   });
    // }

    // 输出关联的Pull Request
    // if (issueData.linkedPullRequests && issueData.linkedPullRequests.nodes && issueData.linkedPullRequests.nodes.length > 0) {
    //   console.log('\n===== 关联的Pull Request =====');
    //   issueData.linkedPullRequests.nodes.forEach((pr, index) => {
    //     console.log(`PR ${index + 1} 标题:`, pr.title);
    //     console.log(`PR ${index + 1} 编号:`, pr.number);
    //     console.log(`PR ${index + 1} 状态:`, pr.state);
    //     console.log(`PR ${index + 1} URL:`, pr.url);
    //     console.log(`PR ${index + 1} 仓库:`, `${pr.repository.owner.login}/${pr.repository.name}`);
    //   });
    // }

    // // 输出评论信息
    // if (issueData.comments && issueData.comments.length > 0) {
    //   console.log('\n===== Issue评论 =====');
    //   console.log('评论总数:', issueData.comments.length);

    //   issueData.comments.forEach((comment, index) => {
    //     console.log(`\n----- 评论 ${index + 1} -----`);
    //     console.log(`评论ID:`, comment.id);
    //     console.log(`评论时间:`, new Date(comment.createdAt).toLocaleString());

    //     // 评论作者信息
    //     console.log(`评论作者:`, comment.author.login);
    //     console.log(`评论作者ID:`, comment.author.id);
    //     console.log(`评论作者头像:`, comment.author.avatarUrl);
    //     if (comment.author.name) {
    //       console.log(`评论作者显示名称:`, comment.author.name);
    //     }

    //     // 评论内容
    //     console.log(`评论内容:`, comment.body);
    //     // console.log(`评论内容(HTML):`, comment.bodyHTML); // HTML内容较长，可选择是否输出
    //   });
    // }

    // 返回完整的Issue数据对象，方便进一步处理
    // console.log('issueData', issueData)
    const mdtohtml = (str: string) => {
      var converter = new showdown.Converter()
      return converter.makeHtml(str)
    }
    // 将 IssueComment[] 转换为 Todo 接口期望的评论格式
    const formattedComments = issueData.comments.map(comment => ({
      id: comment.id,
      content: mdtohtml(comment.body),
      author: comment.author.name || comment.author.login,
      avatarUrl: comment.author.avatarUrl,
      replyId: null
    }));
    const title = escapeHtml(issueData.title)
    console.log('title', title)
    const currentTodo = {
      id: issueData.id,
      content: mdtohtml(issueData.body),
      title: title,
      author: issueData?.author?.name || issueData?.author?.login,
      avatarUrl: issueData?.author?.avatarUrl,
      comments: formattedComments,
      postscripts: [],
      url: window.location.href,
      source: "github-issue",
    };
    const todosRepo = getTodosRepo();
    currentIdStorage.setValue(issueData.id);

    todosRepo.update(currentTodo);
    await sendMessage("openOptionsPage", undefined);

  } else {
    console.error('找不到 GitHub Issue 数据');
  }
}
