// types/axios.d.ts
import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipAuth?: boolean;
    // TODO: add other common params here like page, limit, sort, etc.
  }
}
