import { AuthData } from "@leancloud/adapter-types";

const PROVIDER = "lc_weapp";
const PLATFORM = "weixin";

function getLoginCode(): Promise<string> {
  return new Promise((resolve, reject) => {
    wx.login({
      success: (res) =>
        res.code ? resolve(res.code) : reject(new Error(res.errMsg)),
      fail: ({ errMsg }) => reject(new Error(errMsg)),
    });
  });
}

export const getAuthInfo = async function ({
  platform = PLATFORM,
  preferUnionId = false,
  asMainAccount = false,
} = {}) {
  const code = await getLoginCode();
  let authData: AuthData = { code };
  if (preferUnionId) {
    authData.platform = platform;
    authData.main_account = asMainAccount;
  }
  return {
    authData,
    platform,
    provider: PROVIDER,
  };
};
