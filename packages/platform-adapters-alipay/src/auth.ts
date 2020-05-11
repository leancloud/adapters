import { Adapters } from "@leancloud/adapter-types";

const PROVIDER = "lc_alipay";

function getLoginCode(scopes: string | Array<string>): Promise<string> {
  return new Promise((resolve, reject) => {
    my.getAuthCode({
      scopes,
      success: (res: any) => {
        const failedScopes = Object.keys(res.authErrorScopes);
        if (failedScopes.length) {
          const first = failedScopes[0];
          reject(new Error(`scope "${first}": ${res.authErrorScopes[first]}`));
          return;
        }
        resolve(res.authCode);
      },
      fail: () => reject(new Error("Failed to get login code")),
    });
  });
}

async function _getAuthInfo({
  scopes = "auth_base",
}: {
  platform?: string,
  scopes?: string | Array<string>
} = {}) {
  const code = await getLoginCode(scopes);
  return {
    authData: { code },
    provider: PROVIDER,
  };
}
export const getAuthInfo: Adapters["getAuthInfo"] = _getAuthInfo;
