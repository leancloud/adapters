import { Adapters, AuthInfo } from "@leancloud/adapter-types";

const PROVIDER = "lc_tt";

interface GetAuthInfoOption {
  force?: boolean;
}
function _getAuthInfo(option: GetAuthInfoOption = {}): Promise<AuthInfo> {
  return new Promise(function (resolve, reject) {
    tt.login({
      force: option.force,
      success: (res) =>
        resolve({
          authData: { code: res.code, anonymousCode: res.anonymousCode },
          provider: PROVIDER,
        }),
      fail: (err) => reject(new Error(err.errMsg)),
    });
  });
}

export const getAuthInfo: Adapters["getAuthInfo"] = _getAuthInfo;
