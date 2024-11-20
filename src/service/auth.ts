import {
  loginBySmsOtp,
  loginByPassword,
  logout,
} from '../api/interface/auth';
import TokenManager from '../core/tokenManager';

/** 手机otp登錄 */
export async function loginBySmsOtpService(
  data: Parameters<typeof loginBySmsOtp>[0]
) {
  const res = await loginBySmsOtp(data);
  if (res.success) {
    TokenManager.setToken(res.data)
  }
}
/** 手機號與登入密碼登錄 */
export async function loginByPasswordService(
  data: Parameters<typeof loginByPassword>[0]
) {
  const res = await loginByPassword(data);
  if (res.success) {
    TokenManager.setToken(res.data)
  }
}
/** 登出 */
export async function logoutService() {
  const res = await logout();
  if (res.success) {
    TokenManager.deleteToken()
    // TODO：执行跳转逻辑
  }

}
