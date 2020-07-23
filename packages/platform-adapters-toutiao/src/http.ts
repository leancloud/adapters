import { Adapters, RequestOptions } from "@leancloud/adapter-types";

export const request: Adapters["request"] = function (url, options = {}) {
  const { method, data, headers, signal } = options;

  if (signal?.aborted) {
    return Promise.reject(new Error("Request aborted"));
  }

  return new Promise((resolve, reject) => {
    const task = tt.request({
      url,
      method,
      header: headers,
      data,
      complete: (res: any) => {
        if (!res.statusCode) {
          reject(new Error(res.errMsg));
          return;
        }
        resolve({
          ok: !(res.statusCode >= 400),
          status: res.statusCode,
          headers: res.header,
          data: res.data,
        });
      },
    });
    if (signal) {
      signal.addEventListener("abort", task.abort);
    }
  });
};

export const upload: Adapters["upload"] = function (url, file, options = {}) {
  const { headers, data, onprogress, signal } = options;

  if (signal?.aborted) {
    return Promise.reject(new Error("Request aborted"));
  }
  if (!(file && file.data && file.data.uri)) {
    return Promise.reject(
      new TypeError("File data must be an object like { uri: localPath }.")
    );
  }

  return new Promise((resolve, reject) => {
    const task = tt.uploadFile({
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
    if (signal) {
      signal.addEventListener("abort", task.abort);
    }
    if (onprogress) {
      task.onProgressUpdate((event: any) => onprogress({
        loaded: event.totalBytesSent,
        total: event.totalBytesExpectedToSend,
        percent: event.progress,
      }));
    }
  });
};
