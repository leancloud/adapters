import { EventTarget } from "event-target-shim";
import { WebSocket } from "@leancloud/adapter-types";

const WSEventTarget = EventTarget(["open", "error", "message", "close"]);

export abstract class WS extends WSEventTarget implements WebSocket {
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
