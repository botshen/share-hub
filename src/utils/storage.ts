import { storage } from "@wxt-dev/storage";

const currentIdStorage = storage.defineItem<number | string>(
  'local:currentId',
  {
    fallback: 0,
  },
);

const isDebugModeStorage = storage.defineItem<boolean>(
  'local:isDebugMode',
  {
    fallback: false,
  },
);

const xMockConfigStorage = storage.defineItem<{
  mockData: any;
}>('local:xMockConfig', {
  fallback: {
    mockData: null,
  },
});
export { currentIdStorage, isDebugModeStorage, xMockConfigStorage };
