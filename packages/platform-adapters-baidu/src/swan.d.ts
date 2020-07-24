declare const swan: BaiduMiniApp.Swan;

declare namespace BaiduMiniApp {
  interface Swan {
    login(option: LoginOption): void;
    request(option: RequestOption): RequestTask;
    uploadFile(option: UploadOption): UploadTask;
    setStorageSync(key: string, data: string | object): void;
    getStorageSync(key: string): string | object;
    removeStorageSync(key: string): void;
    clearStorageSync(): void;
    connectSocket(option: SocketConnectOption): SocketTask;
  }

  interface ResultHandlers {
    success?: Function;
    fail?: Function;
    complete?: Function;
  }

  interface LoginOption extends ResultHandlers {
    timeout?: number;
    success?: (event: { code: string }) => void;
  }

  interface RequestOption {
    url: string;
    data?: object | string;
    header?: object;
    method?: string;
    dataType?: "string" | "json";
    responseType?: "text" | "arraybuffer";
    success?: RequestCallback;
    fail?: RequestCallback;
    complete?: RequestCallback;
  }

  interface RequestCallback {
    (res: Response): void;
  }

  interface Response {
    statusCode?: number;
    header?: object;
    data?: object | string;
    errCode?: number;
    errMsg?: string;
  }

  interface RequestTask {
    abort(): void;
  }

  interface UploadOption {
    url: string;
    filePath: string;
    name: string;
    header?: object;
    formData?: object;
    success?: RequestCallback;
    fail?: RequestCallback;
    complete?: RequestCallback;
  }

  interface UploadTask {
    abort(): void;
    onProgressUpdate(listener: (event: ProgressEvent) => void): void;
  }

  interface ProgressEvent {
    progress: number;
    totalBytesSent: number;
    totalBytesExpectedToSend: number;
  }

  interface SocketConnectOption {
    url: string;
    header?: object;
    protocols?: string[];
    success?: Function;
    fail?: Function;
    complete?: Function;
  }

  interface SocketTask {
    send(option: SocketSendOption): void;
    close(option?: SocketCloseOption): void;
    onOpen(listener: Function): void;
    onClose(listener: Function): void;
    onError(listener: Function): void;
    onMessage(listener: (event: { data: string | ArrayBuffer }) => void): void;
  }

  interface SocketSendOption extends ResultHandlers {
    data: string | ArrayBuffer;
  }

  interface SocketCloseOption extends ResultHandlers {
    code?: number;
    reason?: string;
  }
}
