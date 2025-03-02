// 1. Import the style
import { createApp } from 'vue';
import Button from './button.vue';
import { injectScriptToPage } from '@/utils/inject-help';


export default defineContentScript({
  matches: ['<all_urls>'],
  // 2. Set cssInjectionMode
  cssInjectionMode: 'ui',
  runAt: 'document_start',
  async main(ctx) {
    injectScriptToPage()

    // 3. Define your UI
    const ui = await createShadowRootUi(ctx, {
      name: 'share-ui',
      position: 'overlay',
      mode: "open",
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