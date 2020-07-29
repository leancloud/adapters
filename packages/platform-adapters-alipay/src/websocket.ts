import { Adapters } from "@leancloud/adapter-types";
import { WS } from "@leancloud/adapter-utils/lib/esm";
import { encode, decode } from "base64-arraybuffer";

class AlipayWS extends WS {
  constructor(url: string, protocol?: string | string[]) {
    super(url, protocol);

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
    const messageHandler = (msg: {
      data: string | ArrayBuffer;
      isBuffer: boolean;
    }) => {
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

    const header: Record<string, string> = {};
    if (protocol) {
      let str = Array.isArray(protocol) ? protocol.join(",") : protocol;
      const sp = this._url.includes("?") ? "&" : "?";
      this._url += sp + "subprotocol=" + str;
      header["Sec-WebSocket-Protocol"] = str;
    }
    my.connectSocket({ url: this._url, header });
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

export const WebSocket: Adapters["WebSocket"] = AlipayWS;
