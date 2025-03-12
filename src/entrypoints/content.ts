// 1. Import the style
import { injectElementForMessage, injectScriptToPage } from '@/utils/inject-help';
import { isDebugModeStorage, xMockConfigStorage } from '@/utils/storage';
import { createApp } from 'vue';
import Button from './button.vue';

export default defineContentScript({
  matches: ['<all_urls>'],
  // 2. Set cssInjectionMode
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

    // 3. Define your UI
    const ui = await createShadowRootUi(ctx, {
      name: 'share-ui',
      position: 'overlay',
      mode: "closed",
      anchor: 'html',
      append: "first",

      onMount: (container) => {
        // Define how your UI will be mounted inside the container
        const app = createApp(Button);
        app.mount(container);
        return app;
      },
      onRemove: (app) => {
        // Unmount the app when the UI is removed
        app?.unmount();
      },
    });

    // 4. Mount the UI
    ui.mount();


  },
});
