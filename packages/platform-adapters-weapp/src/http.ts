import { Adapters } from "@leancloud/adapter-types";
import { AbortError } from "@leancloud/adapter-utils/esm";

export const request: Adapters["request"] = function (url, options = {}) {
  const { method, data, headers, signal } = options;

  if (signal?.aborted) {
    return Promise.reject(new AbortError("Request aborted"));
  }

  return new Promise((resolve, reject) => {
    const task = wx.request({
      url,
      method,
      data,
      header: headers,
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
    const task = wx.uploadFile({
      url,
      header: headers,
      filePath: file.data.uri,
      name: file.field,
      formData: data,
      success: (response) => {
        const { statusCode: status, data, ...rest } = response;
        resolve({
          ...rest,
          data: typeof data === "string" ? JSON.parse(data) : data,
          status,
          ok: !(status >= 400),
        });
      },
      fail: (response) => {
        reject(new Error(response.errMsg));
      },
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
          loaded: event.totalBytesSent,
          total: event.totalBytesExpectedToSend,
          percent: event.progress,
        })
      );
    }
  });
};
