import { Adapters } from "@leancloud/adapter-types";
export { request, upload } from "@leancloud/adapters-superagent";
export const storage: Adapters["storage"] = window.localStorage;
export const WebSocket: Adapters["WebSocket"] = window.WebSocket;
