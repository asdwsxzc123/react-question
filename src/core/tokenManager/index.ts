/**
 * 该文件只做token管理，token设置在 service 文件下面处理
 */
import { refreshToken } from '@/api/interface/auth';

/** 获取 Token */
function getToken(): InternalToken.Token | null {
  const tokenString = localStorage.getItem('token');
  if (tokenString) {
    return JSON.parse(tokenString);
  }
  return null;
}

/** 持久化 Token */
function setToken(token: InternalToken.Token): void {
  const tokenString = JSON.stringify(token);
  localStorage.setItem('token', tokenString);
}

/** 刷新 Token */
async function refreshNewToken(): Promise<InternalToken.Token | null> {
  const token = getToken();
  if (token && token.refreshExpiredAt > Date.now()) {
    // 发起刷新 Token 的请求，获取新的 Token
    const res = await refreshToken({
      refreshToken: token.refresh,
    });
    const newToken = res.data
    if (!newToken) return null
    setToken(newToken); // 更新持久化的 Token
    return newToken;
  }
  // TODO: 业务逻辑需要处理刷新过期的场景
  return null;
}

/** 删除 Token */
function deleteToken(): void {
  localStorage.removeItem('token');
}

const TokenManager = {
  getToken,
  setToken,
  refreshNewToken,
  deleteToken,
};

export default TokenManager;
