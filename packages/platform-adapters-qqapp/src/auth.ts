import { getAuthInfo as getWxAuthInfo } from "@leancloud/platform-adapters-weapp";

const PROVIDER = "lc_qqapp";
const PLATFORM = "qq";

export const getAuthInfo = async function ({
  platform = PLATFORM,
  preferUnionId = false,
  asMainAccount = false,
} = {}) {
  const authInfo = await getWxAuthInfo({
    platform,
    preferUnionId,
    asMainAccount,
  });
  authInfo.provider = PROVIDER;
  return authInfo;
};
