declare const my: my.AlipayStatic;

declare namespace my {
  interface AlipayStatic {
    request(option: RequestOption): RequestTask;
    uploadFile(option: UploadOption): UploadTask;
    getAuthCode(option: GetAuthCodeOption): void;
    getStorageSync(option: { key: string }): { data: string | object };
    setStorageSync(option: { key: string; data: string | object }): void;
    removeStorageSync(option: { key: string }): void;
    clearStorageSync(): void;
    connectSocket(option: SocketConnectOption): void;
    sendSocketMessage(option: SocketSendMessageOption): void;
    closeSocket(/* omit option */): void;
    onSocketOpen(listener: Function): void;
    onSocketError(listener: Function): void;
    onSocketClose(listener: Function): void;
    onSocketMessage(listener: SocketOnMessageListener): void;
    offSocketOpen(listener?: Function): void;
    offSocketError(listener?: Function): void;
    offSocketClose(listener?: Function): void;
    offSocketMessage(listener?: SocketOnMessageListener): void;
  }

  interface RequestOption {
    url: string;
    headers?: object;
    method?: string;
    data?: object | ArrayBuffer;
    timeout?: number;
    dataType?: string;
    success?: RequestCallback;
    fail?: RequestCallback;
    complete?: RequestCallback;
  }

  interface RequestCallback {
    (res: Response): void;
  }

  interface ResponseError {
    error?: number;
    errorMessage?: string;
  }

  interface Response extends ResponseError {
    status?: number;
    headers?: object;
    data?: string;
  }

  interface RequestTask {
    abort(): void;
  }

  interface UploadOption {
    url: string;
    filePath: string;
    fileName: string;
    fileType: "image" | "video" | "audio";
    hideLoading?: boolean;
    header?: object;
    formData?: object;
    success?: UploadCallback;
    fail?: UploadCallback;
    complete?: UploadCallback;
  }

  interface UploadCallback {
    (res: UploadResponse): void;
  }

  interface UploadResponse extends ResponseError {
    statusCode?: number;
    header?: object;
    data?: string;
  }

  interface UploadTask {
    abort(): void;
    onProgressUpdate(listener: (event: UploadProgressEvent) => void): void;
  }

  interface UploadProgressEvent {
    progress: number;
    totalBytesWritten: number;
    totalBytesExpectedToWrite: number;
  }

  type AuthScope = "auth_base" | "auth_user" | "auth_zhima";

  interface GetAuthCodeOption {
    scopes?: AuthScope | AuthScope[];
    success?: GetAuthCodeCallback;
    fail?: any;
    complete?: any;
  }

  interface GetAuthCodeCallback {
    (data: AuthCodeData): void;
  }

  interface AuthCodeData {
    authCode: string;
    authErrorScopes: Record<string, any>;
    authSuccessScopes: AuthScope[];
  }

  interface SocketConnectOption {
    url: string;
    data?: object;
    header?: object;
    success?: Function;
    fail?: Function;
    complete?: Function;
  }

  interface SocketSendMessageOption {
    data: string;
    isBuffer?: boolean;
    success?: Function;
    fail?: Function;
    complete?: Function;
  }

  interface SocketOnMessageListener {
    (event: { data: string | ArrayBuffer, isBuffer: boolean }): void;
  }
}
