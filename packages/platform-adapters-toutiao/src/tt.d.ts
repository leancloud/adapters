declare const tt: ToutiaoMiniApp.TT;

declare namespace ToutiaoMiniApp {
  interface TT {
    login(option?: LoginOption): void;
    request(option: RequestOption): RequestTask;
    uploadFile(option: UploadOption): UploadTask;
    setStorageSync(key: string, data: CacheDataType): void;
    getStorageSync(key: string): string;
    removeStorageSync(key: string): void;
    clearStorageSync(): void;
    connectSocket(option: SocketConnectOption): SocketTask;
  }

  interface ResultHandlers {
    success?: Function;
    fail?: (error: { errMsg: string }) => void;
    complete?: Function;
  }

  interface LoginOption extends ResultHandlers {
    force?: boolean;
    success?: (data: LoginData) => void;
  }

  interface LoginData {
    code: string;
    anonymousCode: string;
    isLogin: boolean;
  }

  interface RequestOption extends ResultHandlers {
    url: string;
    header?: object;
    method?: string;
    data?: object | ArrayBuffer;
    dataType?: string;
    responseType?: "text" | "arraybuffer";
    complete?: (res: Response) => void;
  }

  interface Response {
    statusCode?: number;
    header?: object;
    data?: object | string | ArrayBuffer;
    errMsg?: string;
  }

  interface RequestTask {
    abort(): void;
  }

  interface UploadOption extends ResultHandlers {
    url: string;
    filePath: string;
    name: string;
    header?: object;
    formData?: object;
    success?: (res: UploadResponse) => void;
  }

  interface UploadResponse {
    data: string;
    statusCode: number;
  }

  interface UploadTask {
    abort(): void;
    onProgressUpdate(listener: (event: UploadProgressEvent) => void): void;
  }

  interface UploadProgressEvent {
    progress: number;
    totalBytesSent: number;
    totalBytesExpectedToSend: number;
  }

  type CacheDataType =
    | string
    | object
    | number
    | Date
    | boolean
    | undefined
    | null;

  interface SocketConnectOption extends ResultHandlers {
    url: string;
    header?: object;
    protocols?: string[];
  }

  interface SocketTask {
    send(option: { data: string | ArrayBuffer }): void;
    close(option?: { code?: number; reason?: string }): void;
    onOpen(listener: (data: { header: object }) => void): void;
    onClose(listener: Function): void;
    onError(listener: (error: { errMsg: string }) => void): void;
    onMessage(listener: (data: { data: string | ArrayBuffer }) => void): void;
  }
}
