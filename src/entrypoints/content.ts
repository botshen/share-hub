// 1. Import the style
import { injectScriptToPage } from '@/utils/inject-help';
import { onMessage } from '@/utils/message';
import { sharePostCommon } from './get-post/common';
import { sharePostX } from './get-post/x/x';
import { sharePostHacknews } from './get-post/hacknews/hacknews';
import { sharePostReddit } from './get-post/reddit/reddit';
import { sharePostV2ex } from './get-post/v2ex/v2ex';
import { getWebKind } from '@/utils/get-web-kind';
import { parseGitHubIssueFromDocument } from './get-post/github-issue/github-issue';
export default defineContentScript({
  matches: ['<all_urls>'],
  cssInjectionMode: 'ui',
  runAt: 'document_start',
  async main(ctx) {
    // const isDebugMode = await isDebugModeStorage.getValue();
    // const xMockData = await xMockConfigStorage.getValue()
    // window.addEventListener(
    //   'x-mockData',
    //   (event: any) => {
    //     xMockConfigStorage.setValue({
    //       mockData: event.detail
    //     })
    //   },
    //   false
    // )

    injectScriptToPage()
    // injectElementForMessage({
    //   isDebugMode,
    //   xMockData
    // })
    const xId = ref<string | null>(null);
    window.addEventListener("x-data", (async (event: Event) => {
      const customEvent = event as CustomEvent;
      const currentTodo = customEvent.detail;
      const todosRepo = getTodosRepo();
      const todo = await todosRepo.getOne(currentTodo.id);
      if (currentTodo.isInitialLoad) {
        console.log('11111', 11111)
        await todosRepo.delete(currentTodo.id);
        console.log('currentTodo', currentTodo)
        todosRepo.create(currentTodo);
      } else {
        if (!todo) {
          todosRepo.create(currentTodo);
        } else {
          // 合并现有评论和新评论
          const existingComments = todo.comments || [];
          const newComments = currentTodo.comments || [];

          // 使用Map来存储评论，以id为键避免重复
          const commentMap = new Map();
          [...existingComments, ...newComments].forEach(comment => {
            commentMap.set(comment.id, comment);
          });

          // 将评论转换回数组并按照回复关系排序
          const mergedComments = Array.from(commentMap.values());
          const sortedComments: Comment[] = [];

          // 先添加没有回复ID的评论
          mergedComments.forEach(comment => {
            if (!comment.replyId) {
              sortedComments.push(comment);
            }
          });

          // 然后处理有回复ID的评论 
          mergedComments.forEach(comment => {
            if (comment.replyId) {
              const parentIndex = sortedComments.findIndex(c => c.id === comment.replyId);
              if (parentIndex !== -1) {
                sortedComments.splice(parentIndex + 1, 0, comment);
              } else {
                sortedComments.push(comment); // 如果找不到父评论，就加到最后
              }
            }
          });

          todosRepo.update({
            ...todo,
            comments: sortedComments,
          });
        }
      }

      xId.value = currentTodo.id;
    }) as EventListener);


    onMessage("sharePost", () => {
      const webKind = getWebKind();
      if (webKind === "v2ex") {
        sharePostV2ex();
      } else if (webKind === "reddit") {
        sharePostReddit();
      } else if (webKind === "hacknews") {
        sharePostHacknews();
      } else if (webKind === "x" && xId.value) {
        sharePostX(xId.value);
      } else if (webKind === "github-issue") {
        parseGitHubIssueFromDocument();
      } else {
        sharePostCommon();
      }
    });
    // 3. Define your UI
    // const ui = await createShadowRootUi(ctx, {
    //   name: 'share-ui',
    //   position: 'overlay',
    //   mode: "closed",
    //   anchor: 'html',
    //   append: "first",

    //   onMount: (container) => {
    //     // Define how your UI will be mounted inside the container
    //     const app = createApp(Button);
    //     app.mount(container);
    //     return app;
    //   },
    //   onRemove: (app) => {
    //     // Unmount the app when the UI is removed
    //     app?.unmount();
    //   },
    // });

    // // 4. Mount the UI
    // ui.mount();


  },
});
