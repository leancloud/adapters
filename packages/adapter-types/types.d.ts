export interface ProgressEvent {
  loaded: number;
  percent?: number;
  total?: number;
}
export interface UploadOptions {
  headers?: object;
  data?: { [fieldName: string]: string };
  onprogress?: (event: ProgressEvent) => void;
}
interface RequestOptions {
  method?:
    | "OPTIONS"
    | "GET"
    | "HEAD"
    | "POST"
    | "PUT"
    | "DELETE"
    | "TRACE"
    | "CONNECT";
  data?: object;
  headers?: object;
  onprogress?: (event: ProgressEvent) => void;
}
interface Response {
  status?: number;
  ok?: boolean;
  headers?: object;
  data?: object;
}
export interface FormDataPart {
  field: string;
  data: any;
  name: string;
}

export declare type SyncStorage = {
  async?: false;
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => any;
  removeItem: (key: string) => any;
  clear: () => any;
};
export declare type AsyncStorage = {
  async: true;
  getItem: (key: string) => Promise<string>;
  setItem: (key: string, value: string) => Promise<any>;
  removeItem: (key: string) => Promise<any>;
  clear: () => Promise<any>;
};
export declare type Storage = SyncStorage | AsyncStorage;

interface WebSocket {
  addEventListener(
    event: string,
    handler: (...args: any[]) => any,
    ...args: any[]
  ): any;
  removeEventListener(
    event: string,
    handler: (...args: any[]) => any,
    ...args: any[]
  ): any;
  send(data: string | ArrayBuffer): any;
  close(): any;
}

export interface Adapters {
  request: (url: string, options?: RequestOptions) => Promise<Response>;
  upload: (
    url: string,
    file: FormDataPart,
    options?: UploadOptions
  ) => Promise<Response>;
  storage: Storage;
  WebSocket: {
    new (url: string, protocols?: string | string[]): WebSocket;
  };
}
