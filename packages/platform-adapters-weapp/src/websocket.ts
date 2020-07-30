import { Adapters } from "@leancloud/adapter-types";
import { WS } from "@leancloud/adapter-utils/esm";

class WechatWS extends WS {
  private _socketTask: WechatMiniprogram.SocketTask;

  constructor(url: string, protocol?: string | string[]) {
    super(url, protocol);
    if (
      protocol &&
      !(wx.canIUse && wx.canIUse("connectSocket.object.protocols"))
    ) {
      throw new Error("subprotocol not supported in weapp");
    }

    this._readyState = WS.CONNECTING;

    const errorHandler = (event: WechatMiniprogram.GeneralCallbackResult) => {
      this._readyState = WS.CLOSED;
      this.dispatchEvent({
        type: "error",
        message: event.errMsg,
      });
    };
    const socketTask = wx.connectSocket({
      url,
      protocols:
        this._protocol === undefined || Array.isArray(this._protocol)
          ? this._protocol
          : [this._protocol],
      fail: (error) => setTimeout(() => errorHandler(error), 0),
    });
    this._socketTask = socketTask;

    socketTask.onOpen(() => {
      this._readyState = WS.OPEN;
      this.dispatchEvent({
        type: "open",
      });
    });
    socketTask.onError(errorHandler);
    socketTask.onMessage((event) => {
      var { data } = event;
      this.dispatchEvent({
        data,
        type: "message",
      });
    });
    socketTask.onClose((event) => {
      this._readyState = WS.CLOSED;
      var { code, reason } = event;
      this.dispatchEvent({
        code,
        reason,
        type: "close",
      });
    });
  }

  close() {
    if (this.readyState === WS.CLOSED) return;
    if (this.readyState === WS.CONNECTING) {
      console.warn("close WebSocket which is connecting might not work");
    }
    this._socketTask.close({});
  }

  send(data: string | ArrayBuffer) {
    if (this.readyState !== WS.OPEN) {
      throw new Error("INVALID_STATE_ERR");
    }

    if (!(typeof data === "string" || data instanceof ArrayBuffer)) {
      throw new TypeError("only String/ArrayBuffer supported");
    }

    this._socketTask.send({
      data,
    });
  }
}
export const WebSocket: Adapters["WebSocket"] = WechatWS;
