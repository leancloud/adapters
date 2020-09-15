import { Adapters } from "@leancloud/adapter-types";
import { EventTarget } from "event-target-shim";

abstract class WS extends EventTarget("open", "error", "message", "close") {
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSING = 2;
  static readonly CLOSED = 3;

  protected _url: string;
  protected _protocol?: string | string[];
  protected _readyState = WS.CLOSED;

  constructor(url: string, protocol?: string | string[]) {
    super();

    if (!url) {
      throw new TypeError("Failed to construct 'WebSocket': url required");
    }
    this._url = url;
    this._protocol = protocol;
  }

  get url(): string {
    return this._url;
  }

  get protocol(): string | string[] | undefined {
    return this._protocol;
  }

  get readyState(): number {
    return this._readyState;
  }

  abstract send(data: string | ArrayBuffer): any;

  abstract close(): any;
}

class BaiduWS extends WS {
  private _socketTask: BaiduMiniApp.SocketTask;

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

    this._socketTask = swan.connectSocket({ url: this._url, protocols });

    this._socketTask.onOpen(() => {
      this._readyState = WS.OPEN;
      this.dispatchEvent({ type: "open" });
    });

    this._socketTask.onError(() => {
      // baidu mini-app doesnt provide any error message, for now.
      this.dispatchEvent({ type: "error" });
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

export const WebSocket: Adapters["WebSocket"] = BaiduWS;
