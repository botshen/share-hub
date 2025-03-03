import { defineExtensionMessaging } from '@webext-core/messaging';

interface ProtocolMap {
    openOptionsPage(): void;
    setTwitterData(data: any): void;
}

export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>();
