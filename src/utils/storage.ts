import { storage } from "@wxt-dev/storage";

const currentIdStorage = storage.defineItem<number | string>(
  'local:currentId',
  {
    fallback: 0,
  },
);

export { currentIdStorage };