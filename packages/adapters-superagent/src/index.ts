import { Adapters, Response } from "@leancloud/adapter-types";
import { AbortError } from "@leancloud/adapter-utils";
import * as superagent from "superagent";

function convertResponse(res: superagent.Response): Response {
  return {
    ok: res.ok,
    status: res.status,
    headers: res.header,
    data: res.body,
  };
}

export const request: Adapters["request"] = function (url, options = {}) {
  const { method = "GET", data, headers, onprogress, signal } = options;

  if (signal?.aborted) {
    return Promise.reject(new AbortError("Request aborted"));
  }

  const req = superagent(method, url);
  if (headers) {
    req.set(headers);
  }
  if (onprogress) {
    req.on("progress", onprogress);
  }

  return new Promise((resolve, reject) => {
    const abortListener = () => {
      reject(new AbortError("Request aborted"));
      req.abort();
    };
    signal?.addEventListener("abort", abortListener);
    req
      .then((res) => resolve(convertResponse(res)))
      .catch((err: superagent.ResponseError) => {
        if (err.response) {
          resolve(convertResponse(err.response));
        } else {
          reject(err);
        }
      })
      .finally(() => signal?.removeEventListener("abort", abortListener));
  });
};

export const upload: Adapters["upload"] = (url, file, options = {}) => {
  const { method = "POST", data, headers, onprogress, signal } = options;

  if (signal?.aborted) {
    return Promise.reject(new AbortError("Request aborted"));
  }

  const req = superagent(method, url).attach(file.field, file.data, file.name);
  if (data) {
    req.field(data);
  }
  if (headers) {
    req.set(headers);
  }
  if (onprogress) {
    req.on("progress", onprogress);
  }

  return new Promise((resolve, reject) => {
    const abortListener = () => {
      reject(new AbortError("Request aborted"));
      req.abort();
    };
    signal?.addEventListener("abort", abortListener);
    req
      .then((res) => resolve(convertResponse(res)))
      .catch((err: superagent.ResponseError) => {
        if (err.response) {
          resolve(convertResponse(err.response));
        } else {
          reject(err);
        }
      })
      .finally(() => signal?.removeEventListener("abort", abortListener));
  });
};
