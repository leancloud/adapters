import { Adapters } from "@leancloud/adapter-types";
import { EventTarget } from "event-target-shim";

const EVENTS = ["open", "error", "message", "close"];

class WS extends EventTarget(EVENTS) {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  private _url: string;
  private _protocol?: string | string[];
  private _readyState: number;
  private _socketTask: WechatMiniprogram.SocketTask;

  constructor(url: string, protocol?: string | string[]) {
    if (!url) {
      throw new TypeError("Failed to construct 'WebSocket': url required");
    }
    if (
      protocol &&
      !(wx.canIUse && wx.canIUse("connectSocket.object.protocols"))
    ) {
      throw new Error("subprotocol not supported in weapp");
    }

    super();
    this._url = url;
    this._protocol = protocol;
    this._readyState = WS.CONNECTING;

    const errorHandler = (event: WechatMiniprogram.GeneralCallbackResult) => {
      this._readyState = WS.CLOSED;
      this.dispatchEvent({
        type: "error",
        message: event.errMsg
      });
    };
    const socketTask = wx.connectSocket({
      url,
      protocols:
        this._protocol === undefined || Array.isArray(this._protocol)
          ? this._protocol
          : [this._protocol],
      fail: error => setTimeout(() => errorHandler(error), 0)
    });
    this._socketTask = socketTask;

    socketTask.onOpen(event => {
      this._readyState = WS.OPEN;
      this.dispatchEvent({
        type: "open"
      });
    });
    socketTask.onError(errorHandler);
    socketTask.onMessage(event => {
      var { data } = event;
      this.dispatchEvent({
        data,
        type: "message"
      });
    });
    socketTask.onClose(event => {
      this._readyState = WS.CLOSED;
      var { code, reason } = event;
      this.dispatchEvent({
        code,
        reason,
        type: "close"
      });
    });
  }

  get url() {
    return this._url;
  }
  get protocol() {
    return this._protocol;
  }
  get readyState() {
    return this._readyState;
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
      data
    });
  }
}
export const WebSocket: Adapters["WebSocket"] = WS;
