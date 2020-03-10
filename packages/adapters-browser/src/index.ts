import { Adapters } from "@leancloud/adapter-types";
import * as superagent from "superagent";

export const request: Adapters["request"] = (url, options = {}) => {
  const { method = "GET", data, headers, onprogress } = options;
  const req = superagent(method, url);
  if (headers) {
    req.set(headers);
  }
  if (onprogress) {
    req.on("progress", onprogress);
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
      data: body
    }));
};

export const upload: Adapters["upload"] = (url, file, options = {}) => {
  const { data, headers, onprogress } = options;
  const req = superagent("POST", url).attach(file.field, file.data, file.name);
  if (data) {
    req.field(data);
  }
  if (headers) {
    req.set(headers);
  }
  if (onprogress) {
    req.on("progress", onprogress);
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
      data: body
    }));
};

export const storage: Adapters['storage'] = window.localStorage;
export const WebSocket: Adapters['WebSocket'] = window.WebSocket;
