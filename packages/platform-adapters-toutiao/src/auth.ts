const PROVIDER = "lc_tt";

export function getAuthInfo({
  force = false,
}: {
  force?: boolean;
} = {}) {
  return new Promise(function(resolve, reject) {
    tt.login({
      force,
      success: (res: any) => resolve({
        authData: { code: res.code, anonymousCode: res.anonymousCode },
        provider: PROVIDER,
      }),
      fail: (res: any) => reject(new Error(res.errMsg)),
    });
  })
}
