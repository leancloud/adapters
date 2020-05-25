import { Adapters, RequestOptions } from '@leancloud/adapter-types';

export const request: Adapters["request"] = (
  url,
  { method, data, headers }: RequestOptions = {}
) =>
  new Promise((resolve, reject) =>
    wx.request({
      url,
      method,
      data,
      header: headers,
      responseType: "text",
      success: response => {
        const { statusCode: status, data, ...rest } = response;
        resolve({
          ...rest,
          data: typeof data === "string" ? JSON.parse(data) : data,
          status,
          ok: !(status >= 400)
        });
      },
      fail: response => {
        reject(new Error(response.errMsg));
      }
    })
  );

export const upload: Adapters["upload"] = (
  url,
  file,
  { headers, data, onprogress }: RequestOptions = {}
) => {
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
      success: response => {
        const { statusCode: status, data, ...rest } = response;
        resolve({
          ...rest,
          data: typeof data === "string" ? JSON.parse(data) : data,
          status,
          ok: !(status >= 400)
        });
      },
      fail: response => {
        reject(new Error(response.errMsg));
      }
    });
    task?.onProgressUpdate?.(
      ({ progress, totalBytesSent, totalBytesExpectedToSend }) =>
        onprogress?.({
          percent: progress,
          loaded: totalBytesSent,
          total: totalBytesExpectedToSend
        })
    );
  });
};
