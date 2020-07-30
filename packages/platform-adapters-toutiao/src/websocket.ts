import { Adapters } from "@leancloud/adapter-types";
import { WS } from "@leancloud/adapter-utils/esm";

class ToutiaoWS extends WS {
  private _socketTask: ToutiaoMiniApp.SocketTask;

  constructor(url: string, protocol?: string | string[]) {
    super(url, protocol);

    this._readyState = WS.CONNECTING;

    let protocols: string[] = [];
    if (protocol) {
      let str: string; // protocol string
      if (Array.isArray(protocol)) {
        str = protocol.join(",");
        protocols = protocol;
      } else {
        str = protocol;
        protocols = [protocol];
      }
      const sp = this._url.includes("?") ? "&" : "?";
      this._url += sp + "subprotocol=" + str;
    }

    this._socketTask = tt.connectSocket({ url: this._url, protocols });

    this._socketTask.onOpen(() => {
      this._readyState = WS.OPEN;
      this.dispatchEvent({ type: "open" });
    });

    this._socketTask.onError((err) => {
      this.dispatchEvent({ type: "error", message: err.errMsg });
      this.close();
    });

    this._socketTask.onMessage((msg) => {
      this.dispatchEvent({ type: "message", data: msg.data });
    });

    this._socketTask.onClose(() => {
      this._readyState = WS.CLOSED;
      this.dispatchEvent({ type: "close" });
    });
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

export const WebSocket: Adapters["WebSocket"] = ToutiaoWS;
