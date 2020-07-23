import { Adapters } from "@leancloud/adapter-types";

export const request: Adapters["request"] = function (url, options = {}) {
  const { method, data, headers, signal } = options;
  return new Promise((resolve, reject) => {
    const task = my.request({
      method,
      url,
      headers,
      data,
      complete: (res: any) => {
        if (!res.status) {
          reject(new Error(res.errorMessage));
          return;
        }
        res.ok = !(res.status >= 400);
        resolve(res);
      },
    });
    if (signal) {
      signal.addEventListener("abort", task.abort);
    }
  });
};

export const upload: Adapters["upload"] = function (url, file, options = {}) {
  const { headers, data, onprogress, signal } = options;
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
        resolve({
          ok: !(res.statusCode >= 400),
          status: res.statusCode,
          headers: res.header,
          data: res.data,
        });
      },
      fail: reject,
    });
    if (signal) {
      signal.addEventListener("abort", task.abort);
    }
    if (onprogress) {
      task.onProgressUpdate((event: any) => onprogress({
        loaded: event.totalBytesWritten,
        total: event.totalBytesExpectedToWrite,
        percent: event.progress,
      }));
    }
  });
};
