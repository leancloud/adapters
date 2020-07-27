import { Adapters } from "@leancloud/adapter-types";
import { WS } from "@leancloud/adapter-utils";

class ToutiaoWS extends WS {
  private _socketTask: any;

  constructor(url: string, protocol?: string | string[]) {
    super(url, protocol);

    if (protocol) {
      let pstr;
      if (typeof protocol === "string") {
        pstr = protocol;
        protocol = [protocol];
      } else {
        pstr = protocol.join(",");
      }
      const sp = url.includes("?") ? "&" : "?";
      url += sp + "subprotocol=" + pstr;
    }

    this._protocol = protocol;
    this._url = url;
    this._readyState = WS.CONNECTING;

    const openHandler = () => {
      this._readyState = WS.OPEN;
      this.dispatchEvent({ type: "open" });
    };
    const errorHandler = (err: any) => {
      this.dispatchEvent({ type: "error", message: err.errMsg });
      this.close();
    };
    const messageHandler = (msg: { data: string | ArrayBuffer }) => {
      this.dispatchEvent({ type: "message", data: msg.data });
    };
    const closeHandler = () => {
      this._readyState = WS.CLOSED;
      this.dispatchEvent({ type: "close" });
    };

    const st = tt.connectSocket({ url, protocols: protocol });
    st.onOpen(openHandler);
    st.onError(errorHandler);
    st.onMessage(messageHandler);
    st.onClose(closeHandler);
    this._socketTask = st;
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
    this._socketTask.closeSocket();
  }
}

export const WebSocket: Adapters["WebSocket"] = ToutiaoWS;
