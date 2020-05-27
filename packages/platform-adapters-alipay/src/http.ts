import { Adapters, RequestOptions } from "@leancloud/adapter-types";

export const request: Adapters["request"] = function (
  url,
  { method, data, headers }: RequestOptions = {}
) {
  return new Promise((resolve, reject) => {
    my.request({
      method,
      url,
      headers,
      data,
      success: (res: any) => {
        res.ok = !(res.status >= 400);
        resolve(res);
      },
      fail: reject,
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
    const task = my.uploadFile({
      url,
      header: headers,
      filePath: file.data.uri,
      fileName: file.field,
      formData: data,
      fileType: "image",
      success: (res: any) => {
        res.ok = !(res.statusCode >= 400);
        resolve(res);
      },
      fail: reject,
    });
    const progressHandler = ({
      progress,
      totalBytesWritten,
      totalBytesExpectedToWrite,
    }: any) => {
      onprogress?.({
        percent: progress,
        loaded: totalBytesWritten,
        total: totalBytesExpectedToWrite,
      });
    }
    task?.onProgressUpdate?.(progressHandler);
  });
}
