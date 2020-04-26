import { Adapters } from "@leancloud/adapter-types";
import "miniprogram-api-typings";

const PLATFORM = "lc_weapp";

function getLoginCode(): Promise<string> {
    return new Promise((resolve, reject) => {
        wx.login({
            success: res =>
                res.code ? resolve(res.code) : reject(new Error(res.errMsg)),
            fail: ({errMsg}) => reject(new Error(errMsg))
        });
    });
}

export const getAuthData: Adapters["getAuthData"] = async function() {
    let code = await getLoginCode();
    return [PLATFORM, { code }];
}
