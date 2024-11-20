import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import TokenManager from '../tokenManager';
import toast from '../toast';

export type Response<T> =
  | {
      data: T;
      success: true;
      errorCode?: string;
      errorMessage?: string;
    }
  | {
      data?: T;
      success: false;
      errorCode: number;
      errorMessage: string;
    };

type ExtractKeys<T extends string> =
  T extends `${string}{${infer Key}}${infer Rest}`
    ? Key | ExtractKeys<Rest>
    : never;

type PathVariables<T extends string> = ExtractKeys<T> extends never
  ? Record<string, string | number>
  : Record<ExtractKeys<T>, string | number>;

type RequestConfig<
  D extends object,
  Q extends object,
  U extends string,
  P = PathVariables<U>
> = Omit<AxiosRequestConfig<D>, 'url' | 'params'> & {
  /**
   * @example '/api/:id' => pathVariables: { id: "1" }
   * @example '/api/:id/:name' => pathVariables: { id: "1", name: "2" }
   */
  url: U;
  ignoreAuth?: boolean; //不為true時 header需附帶Authentication value為token
  silentError?: boolean;
  throwError?: boolean;
  params?: Q;
  /**
   * @example '/api/:id' => { id: "1" }
   * @example '/api/:id/:name' => { id: "1", name: "2" }
   */
  pathVariables?: P;
};

export interface Request {
  <
    T,
    D extends object = any,
    Q extends object = any,
    U extends string = string,
    P = PathVariables<U>
  >(
    args: RequestConfig<D, Q, U, P>
  ): Promise<Response<T>>;
}
const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  timeout: 30000,
});

const request: Request = async <
  T = any,
  D extends object = any,
  Q extends object = any,
  U extends string = string,
  P = PathVariables<U>
>(
  args: RequestConfig<D, Q, U, P>
) => {
  try {
    const token = TokenManager.getToken();

    const headers = args.ignoreAuth
      ? {}
      : { Authorization: `Bearer ${token?.access || ''}` };

    const response = await instance.request<Response<T>>({
      ...args,
      headers,
    });
    if (!response.data?.success) {
      throw new AxiosError(
        response.data.errorMessage || "Request failed",
        // 可以自定义 code
        response.status.toString(),
        response.config,
        response.request,
        response
      );
    }
    return response.data;
  } catch (error) {
    const err = error as AxiosError<Response<T>>;
    const errorMessage =
      err.response?.data?.errorMessage || 'An error occurred';
    if (args.silentError) {
      // Handle silent error
    } else {
      // 请求失败的默认行为
      toast.error(errorMessage);
    }
    if (args.throwError) {
      throw new Error(errorMessage);
    }
    return {
      success: false,
      errorCode: err.response?.status || 500,
      errorMessage,
    };
  }
};

export default request;
