import { Readable } from "stream";
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

export function sendReadableData(
  req: superagent.SuperAgentRequest,
  data: Readable
) {
  return new Promise<superagent.Response>((resolve, reject) => {
    req.on("response", resolve);
    req.on("error", reject);
    data.pipe(req as any);
  });
}

export const request: Adapters["request"] = async (url, options = {}) => {
  const { method = "GET", data, headers, onprogress, signal } = options;

  if (signal?.aborted) {
    throw new AbortError("Request aborted");
  }

  const req = superagent(method, url).ok(() => true);
  if (headers) {
    req.set(headers);
  }
  if (onprogress) {
    req.on("progress", onprogress);
  }

  let aborted = false;
  const onAbort = () => {
    aborted = true;
    req.abort();
  };

  signal?.addEventListener("abort", onAbort);

  try {
    const res =
      data instanceof Readable
        ? await sendReadableData(req, data)
        : await req.send(data);
    return convertResponse(res);
  } catch (error) {
    if (aborted) {
      throw new AbortError("Request aborted");
    }
    throw error;
  } finally {
    signal?.removeEventListener("abort", onAbort);
  }
};

export const upload: Adapters["upload"] = async (url, file, options = {}) => {
  const { method = "POST", data, headers, onprogress, signal } = options;

  if (signal?.aborted) {
    throw new AbortError("Request aborted");
  }

  const req = superagent(method, url)
    .ok(() => true)
    .attach(file.field, file.data, file.name);
  if (data) {
    req.field(data);
  }
  if (headers) {
    req.set(headers);
  }
  if (onprogress) {
    req.on("progress", onprogress);
  }

  let aborted = false;
  const onAbort = () => {
    aborted = true;
    req.abort();
  };

  signal?.addEventListener("abort", onAbort);

  try {
    const res = await req;
    return convertResponse(res);
  } catch (error) {
    if (aborted) {
      throw new AbortError("Request aborted");
    }
    throw error;
  } finally {
    signal?.removeEventListener("abort", onAbort);
  }
};
