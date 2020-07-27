import { Adapters } from "@leancloud/adapter-types";
import { WS } from "@leancloud/adapter-utils";

class BaiduWS extends WS {
  private _socketTask: BaiduMiniApp.SocketTask;

  constructor(url: string, protocol?: string | string[]) {
    super(url, protocol);

    this._readyState = WS.CONNECTING;

    const openHandler = () => {
      this._readyState = WS.OPEN;
      this.dispatchEvent({ type: "open" });
    };
    const errorHandler = () => {
      // baidu mini-app doesnt provide any error message, for now.
      this.dispatchEvent({ type: "error" });
      this.close();
    };
    const messageHandler = (
      msg: {
        data: string | ArrayBuffer
      }
    ) => {
      this.dispatchEvent({ type: "message", data: msg.data });
    };
    const closeHandler = () => {
      this._readyState = WS.CLOSED;
      this.dispatchEvent({ type: "close" });
    };

    let protocols: string[] = [];
    if (protocol) {
      let str: string; // protocol string
      if (Array.isArray(protocol)) {
        str = protocol.join(",");
        protocols = protocol;
      } else {
        str = protocol;
        protocols = [ protocol ];
      }
      const sp = this._url.includes("?") ? "&" : "?";
      this._url += sp + "subprotocol=" + str;
    }
    this._socketTask = swan.connectSocket({ url, protocols });
    this._socketTask.onOpen(openHandler);
    this._socketTask.onError(errorHandler);
    this._socketTask.onMessage(messageHandler);
    this._socketTask.onClose(closeHandler);
  }

  send(data: string | ArrayBuffer) {
    if (this.readyState !== WS.OPEN) {
      throw new Error("INVALID_STATE_ERR");
    }
    if (!(typeof data === "string" || data instanceof ArrayBuffer)) {
      throw new TypeError("only String/ArrayBuffer supported");
    }
    this._socketTask.send({ data });
  }

  close() {
    if (this.readyState === WS.CLOSED) return;
    this._socketTask.close();
  }
}

export const WebSocket: Adapters["WebSocket"] = BaiduWS;
