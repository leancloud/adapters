import { Adapters } from "@leancloud/adapter-types";
import { EventTarget } from "event-target-shim";
import { encode, decode } from "base64-arraybuffer";

const EVENTS = ["open", "error", "message", "close"];

class WS extends EventTarget(EVENTS) {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  private _url: string;
  private _protocol?: string | string[];
  private _readyState: number;

  constructor(url: string, protocol?: string | string[]) {
    if (!url) {
      throw new TypeError("Failed to construct 'WebSocket': url required");
    }

    super();

    const header: { [key: string]: string } = {};
    if (protocol) {
      if (protocol instanceof Array) {
        protocol = protocol.join(",");
      }
      const sp = url.includes("?") ? "&" : "?";
      url += sp + "subprotocol=" + protocol;
      header["Sec-WebSocket-Protocol"] = protocol;
    }

    this._protocol = protocol;
    this._url = url;
    this._readyState = WS.CONNECTING;

    const openHandler = () => {
      this._readyState = WS.OPEN;
      this.dispatchEvent({ type: "open" });
    };
    const errorHandler = () => {
      // Alipay doesnt provide any error messages, for now
      this.dispatchEvent({ type: "error" });
      this.close();
    };
    const messageHandler = (
      msg: {
        data: string | ArrayBuffer,
        isBuffer: boolean,
      }
    ) => {
      let data: string | ArrayBuffer;
      if (msg.data instanceof ArrayBuffer || !msg.isBuffer) {
        data = msg.data;
      } else {
        data = decode(msg.data);
      }
      this.dispatchEvent({ type: "message", data });
    };
    const closeHandler = () => {
      this._readyState = WS.CLOSED;
      this.dispatchEvent({ type: "close" });
      my.offSocketOpen(openHandler);
      my.offSocketError(errorHandler);
      my.offSocketMessage(messageHandler);
      my.offSocketClose(closeHandler);
    };

    my.onSocketOpen(openHandler);
    my.onSocketError(errorHandler);
    my.onSocketMessage(messageHandler);
    my.onSocketClose(closeHandler);

    my.connectSocket({ url, header });
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
    let isBuffer = false;
    if (data instanceof ArrayBuffer) {
      data = encode(data);
      isBuffer = true;
    } else if (typeof data !== "string") {
      throw new TypeError("only String/ArrayBuffer supported");
    }
    my.sendSocketMessage({ data, isBuffer });
  }

  close() {
    if (this.readyState === WS.CLOSED) return;
    my.closeSocket();
  }
}

export const WebSocket: Adapters["WebSocket"] = WS;
