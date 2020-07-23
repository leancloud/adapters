import { Adapters } from "@leancloud/adapter-types";
import * as superagent from "superagent";

export const request: Adapters["request"] = function (url, options = {}) {
  const { method = "GET", data, headers, onprogress, signal } = options;

  if (signal?.aborted) {
    return Promise.reject(new Error("Request aborted"));
  }

  const req = superagent(method, url);
  if (headers) {
    req.set(headers);
  }
  if (onprogress) {
    req.on("progress", onprogress);
  }
  if (signal) {
    signal.addEventListener("abort", req.abort);
  }

  return req
    .send(data)
    .catch(error => {
      if (error.response) {
        return error.response;
      }
      throw error;
    })
    .then(({ status, ok, header, body }) => ({
      status,
      ok,
      headers: header,
      data: body,
    }));
};

export const upload: Adapters["upload"] = (url, file, options = {}) => {
  const { method = "POST", data, headers, onprogress, signal } = options;

  if (signal?.aborted) {
    return Promise.reject(new Error("Request aborted"));
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
  if (signal) {
    signal.addEventListener("abort", req.abort);
  }

  return req
    .catch(error => {
      if (error.response) {
        return error.response;
      }
      throw error;
    })
    .then(({ status, ok, header, body }) => ({
      status,
      ok,
      headers: header,
      data: body,
    }));
};
