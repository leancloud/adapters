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
  private _socketTask: any;

  constructor(url: string, protocol?: string | string[]) {
    if (!url) {
      throw new TypeError("Failed to construct 'WebSocket': url required");
    }

    super();

    if (protocol) {
      let pstr;
      if (typeof protocol === "string") {
        pstr = protocol;
        protocol = [ protocol ];
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

    const st = swan.connectSocket({ url, protocols: protocol });
    st.onOpen(openHandler);
    st.onError(errorHandler);
    st.onMessage(messageHandler);
    st.onClose(closeHandler);
    this._socketTask = st;
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

export const WebSocket: Adapters["WebSocket"] = WS;
