 import { sendMessage } from "@/utils/message";
import { currentIdStorage } from "@/utils/storage";

export function sharePostX( id: string) {
   currentIdStorage.setValue(id);
   sendMessage("openOptionsPage", undefined);
}
