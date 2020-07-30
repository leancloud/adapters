import { Adapters, RequestOptions } from "@leancloud/adapter-types";
import { EventTarget } from "event-target-shim";

import { fetch } from "@system.fetch";
import { upload } from "@system.request";
import * as storage from "@system.storage";
import {
  create as createWebSocket,
  WebSocket as QAWebSocket,
} from "@system.websocketfactory";

export const platformInfo: Adapters["platformInfo"] = {
  name: "QuickApp",
};

type Response = {
  data: Parameters<Required<Parameters<typeof fetch>[0]>["success"]>[0];
};

export const request: Adapters["request"] = (
  url,
  { method, data, headers }: RequestOptions = {}
) =>
  ((fetch({
    url,
    method,
    data,
    header: headers,
    responseType: "json",
  }) as unknown) as Promise<Response>).then((response) => {
    const { code, data, ...rest } = response.data;
    return {
      ...rest,
      data: data as object,
      status: code,
      ok: !(code >= 400),
    };
  });

const uploadFile: Adapters["upload"] = (
  url,
  file,
  { headers, data, onprogress }: RequestOptions = {}
) => {
  if (!(file && file.data && file.data.uri)) {
    return Promise.reject(
      new TypeError("File data must be an object like { uri: localPath }.")
    );
  }
  if (onprogress) {
    console.warn("快应用暂不支持监听文件上传进度");
  }
  return (upload({
    url,
    header: headers,
    data: data
      ? (Object.keys(data).map((key) => ({
          name: key,
          value: data[key],
        })) as any)
      : undefined,
    files: [
      {
        filename: file.name,
        name: file.field,
        uri: file.data.uri,
      },
    ],
  }) as unknown) as Promise<Response>;
};

export { uploadFile as upload };

const Events = ["open", "error", "message", "close"];
export class WS extends EventTarget(Events) {
  private ws: QAWebSocket;

  constructor(url: string, subprotocol?: string | string[]) {
    super();

    const ws =
      typeof subprotocol === "string"
        ? createWebSocket({
            url: `${url}?subprotocol=${encodeURIComponent(subprotocol)}`,
            // >预览不支持设置protocols属性，你设置的protocols属性不会生效，请使用真机调试
            // fallback 到 url query
            // protocols: [subprotocol],
          })
        : createWebSocket({
            url,
            protocols: subprotocol,
          });

    ws.onopen = () => {
      this.dispatchEvent({
        type: "open",
      });
    };
    ws.onerror = (event) => {
      this.dispatchEvent({
        type: "error",
        message: event?.data,
      });
    };
    ws.onmessage = (event) => {
      var { data } = event;
      this.dispatchEvent({
        data,
        type: "message",
      });
    };
    ws.onclose = (event) => {
      var { code, reason, wasClean } = event;
      this.dispatchEvent({
        code,
        reason,
        wasClean,
        type: "close",
      });
    };

    this.ws = ws;
  }
  send(data: string | ArrayBuffer) {
    this.ws.send({
      data,
    });
  }
  close() {
    this.ws.close({});
  }
}
export const WebSocket: Adapters["WebSocket"] = WS;

const getFailHandler = (reject: (reason?: any) => void) => (
  data: any,
  code: any
) => {
  const error = new Error(data);
  Object.assign(error, { code });
  reject(error);
};

const localStorage: Adapters["storage"] = {
  async: true,
  getItem: (key) =>
    new Promise((resolve, reject) =>
      storage.get({
        key,
        success: ((value: string) => {
          if (typeof value === "string" && value.length === 0) {
            resolve(null);
          }
          resolve(value);
        }) as any,
        fail: getFailHandler(reject),
      })
    ),
  setItem: (key, value) =>
    new Promise((resolve, reject) =>
      storage.set({
        key,
        value,
        success: resolve,
        fail: getFailHandler(reject),
      })
    ),
  removeItem: (key) =>
    new Promise((resolve, reject) =>
      // @ts-ignore
      storage.delete({
        key,
        success: resolve,
        fail: getFailHandler(reject),
      })
    ),
  clear: () =>
    new Promise((resolve, reject) =>
      storage.clear({
        success: resolve,
        fail: getFailHandler(reject),
      })
    ),
};
export { localStorage as storage };
