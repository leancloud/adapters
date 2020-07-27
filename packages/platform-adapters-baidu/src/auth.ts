import { AuthInfo, Adapters } from "@leancloud/adapter-types";

const PROVIDER = "lc_baidu";
const PLATFORM = "baidu";

function getLoginCode(): Promise<string> {
  return new Promise((resolve, reject) => {
    swan.login({
      success: (res) => resolve(res.code),
      fail: reject, // no error message provided, for now.
    });
  });
}

interface GetAuthInfoOption {
  platform?: string;
}
async function _getAuthInfo(option?: GetAuthInfoOption): Promise<AuthInfo> {
  const { platform = PLATFORM } = option || {};
  const code = await getLoginCode();
  return {
    platform,
    authData: { code },
    provider: PROVIDER,
  };
}
export const getAuthInfo: Adapters["getAuthInfo"] = _getAuthInfo;
