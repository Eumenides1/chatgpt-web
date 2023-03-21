import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'
import { get, post } from '@/utils/request'

export function fetchChatAPI<T = any>(
  prompt: string,
  options?: { conversationId?: string; parentMessageId?: string },
  signal?: GenericAbortSignal,
) {
  return post<T>({
    url: '/chat',
    data: { prompt, options },
    signal,
  })
}

export function fetchChatAPIProcess<T = any>(
  params: {
    prompt: string
    options?: { conversationId?: string; parentMessageId?: string }
    signal?: GenericAbortSignal
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void },
) {
  return post<T>({
    url: '/chat-process',
    data: { prompt: params.prompt, options: params.options },
    signal: params.signal,
    onDownloadProgress: params.onDownloadProgress,
  })
}

export function fetchChatConfig<T = any>() {
  return post<T>({
    url: '/config',
  })
}

export function sendEmail<T = any>(
  email: string,
  token: string,
) {
  return post<T>({
    url: '/sendMail',
    data: { email, token },
  })
}

export function accountLogin<T = any>(
  email: string,
  code: string,
) {
  return post<T>({
    url: '/login',
    data: { email, code },
  })
}

export function accountlogout<T = any>() {
  return get<T>({
    url: '/logout',
  })
}

export function fetchUsetInfo<T = any>() {
  return get<T>({
    url: '/user',
  })
}
