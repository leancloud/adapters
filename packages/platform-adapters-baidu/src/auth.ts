import { AuthData } from "@leancloud/adapter-types";

const PROVIDER = "lc_baidu";
const PLATFORM = "baidu";

function getLoginCode(): Promise<string> {
  return new Promise((resolve, reject) => {
    swan.login({
      success: (res: any) => resolve(res.code),
      fail: () => reject(), // no error message provided, for now.
    });
  });
}

export const getAuthInfo = async function ({
  platform = PLATFORM,
} = {}) {
  const code = await getLoginCode();
  let authData: AuthData = { code };
  return {
    authData,
    platform,
    provider: PROVIDER,
  };
}
