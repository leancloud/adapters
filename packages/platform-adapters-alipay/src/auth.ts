import { Adapters, AuthInfo } from "@leancloud/adapter-types";

import AuthScope = AlipayMiniApp.AuthScope;

const PROVIDER = "lc_alipay";

function getLoginCode(scopes: AuthScope | AuthScope[]): Promise<string> {
  return new Promise((resolve, reject) => {
    my.getAuthCode({
      scopes,
      success: (res) => {
        const failedScopes = Object.keys(res.authErrorScopes);
        if (failedScopes.length == 0) {
          resolve(res.authCode);
        } else {
          const first = failedScopes[0];
          reject(new Error(`scope "${first}": ${res.authErrorScopes[first]}`));
        }
      },
      fail: () => reject(new Error("Failed to get login code")),
    });
  });
}

interface GetAuthInfoOptions {
  scopes?: AuthScope | AuthScope[];
}
async function _getAuthInfo(options: GetAuthInfoOptions): Promise<AuthInfo> {
  const { scopes = "auth_base" } = options || {};
  const code = await getLoginCode(scopes);
  return {
    authData: { code },
    provider: PROVIDER,
  };
}
export const getAuthInfo: Adapters["getAuthInfo"] = _getAuthInfo;
