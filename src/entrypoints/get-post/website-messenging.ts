import { defineCustomEventMessaging } from '@webext-core/messaging/page';

export interface WebsiteMessengerSchema {
   setTwitterData(data: unknown): void;
}

export const websiteMessenger = defineCustomEventMessaging<WebsiteMessengerSchema>({
  namespace: 'share-hub-2025',
});