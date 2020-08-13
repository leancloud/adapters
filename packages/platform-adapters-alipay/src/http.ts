import { Adapters } from "@leancloud/adapter-types";
import { AbortError } from "@leancloud/adapter-utils/esm";

export const request: Adapters["request"] = function (url, options = {}) {
  const { method, data, headers, signal } = options;

  if (signal?.aborted) {
    return Promise.reject(new AbortError("Request aborted"));
  }

  return new Promise((resolve, reject) => {
    const task = my.request({
      method,
      url,
      headers,
      data,
      complete: (res) => {
        if (res.status) {
          resolve({
            ok: !(res.status >= 400),
            status: res.status,
            headers: res.headers,
            data: res.data as object,
          });
        } else {
          reject(new Error(`${res.error}: ${res.errorMessage}`));
        }
      },
    });
    if (signal) {
      signal.addEventListener("abort", () => {
        reject(new AbortError("Request aborted"));
        task.abort();
      });
    }
  });
};

export const upload: Adapters["upload"] = function (url, file, options = {}) {
  const { headers, data, onprogress, signal } = options;

  if (signal?.aborted) {
    return Promise.reject(new AbortError("Request aborted"));
  }
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
      success: (res) => {
        resolve({
          ok: !(res.statusCode! >= 400),
          status: res.statusCode,
          headers: res.header,
          data: res.data as object,
        });
      },
      fail: (res) => reject(new Error(`${res.error}: ${res.errorMessage}`)),
    });
    if (signal) {
      signal.addEventListener("abort", () => {
        reject(new AbortError("Request aborted"));
        task.abort();
      });
    }
    if (onprogress) {
      task.onProgressUpdate((event) =>
        onprogress({
          loaded: event.totalBytesWritten,
          total: event.totalBytesExpectedToWrite,
          percent: event.progress,
        })
      );
    }
  });
};
