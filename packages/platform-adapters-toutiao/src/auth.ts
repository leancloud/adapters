const PROVIDER = "lc_tt";

function getLoginCode(force: boolean): Promise<string> {
  return new Promise((resolve, reject) => {
    tt.login({
      force,
      success: (res: any) => resolve(res.code),
      fail: (res: any) => reject(new Error(res.errMsg)),
    });
  });
}

export async function getAuthInfo({
  force = false,
}: {
  force?: boolean;
} = {}) {
  const code = await getLoginCode(force);
  return {
    authData: { code },
    provider: PROVIDER,
  };
}
