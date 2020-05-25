import { Adapters, RequestOptions } from "@leancloud/adapter-types";

export const request: Adapters["request"] = function (
  url,
  { method, data, headers }: RequestOptions = {}
) {
  return new Promise((resolve, reject) => {
    swan.request({
      url,
      method,
      header: headers,
      data,
      success: (res: any) => {
        res.status = res.statusCode;
        res.ok = !(res.status >= 400);
        resolve(res);
      },
      fail: (res: any) => reject(new Error(res.errMsg)),
    });
  });
}

export const upload: Adapters["upload"] = function (
  url,
  file,
  { headers, data, onprogress }: RequestOptions = {}
) {
  if (!(file && file.data && file.data.uri)) {
    return Promise.reject(
      new TypeError("File data must be an object like { uri: localPath }.")
    );
  }
  return new Promise((resolve, reject) => {
    const task = swan.uploadFile({
      url,
      header: headers,
      filePath: file.data.uri,
      name: file.field,
      formData: data,
      success: (res: any) => {
        res.status = res.statusCode;
        res.ok = !(res.statusCode >= 400);
        resolve(res);
      },
      fail: (res: any) => reject(new Error(res.errMsg)),
    });
    const progressHandler = ({
      progress,
      totalBytesSent,
      totalBytesExpectedToSend,
    }: any) => {
      onprogress?.({
        percent: progress,
        loaded: totalBytesSent,
        total: totalBytesExpectedToSend,
      });
    }
    task?.onProgressUpdate?.(progressHandler);
  });
}
