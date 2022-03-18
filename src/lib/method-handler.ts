import type { NextApiHandler, NextApiResponse } from 'next'

const requestMethods = {
  get: 'get',
  post: 'post',
  put: 'put',
  patch: 'patch',
  delete: 'del',
} as const

export type RequestMethod = keyof typeof requestMethods
export type RequestFunction = typeof requestMethods[RequestMethod]
export type MethodHandler<T> = Partial<
  Record<RequestFunction, NextApiHandler<T>>
>
export type MethodHandlerOptions<T> = {
  notFoundCallback: NextApiHandler<T>
}

export const errorResponse = <T>(res: NextApiResponse<T>, statusCode = 404) => {
  res.status(statusCode).end()
}

const defaultOptions: MethodHandlerOptions<any> = {
  notFoundCallback: (_, res) => errorResponse(res),
}

export const methodHandler = <T = any>(
  handlers: MethodHandler<T>,
  options: Partial<MethodHandlerOptions<T>> = defaultOptions
): NextApiHandler<T> => {
  const { notFoundCallback } = { ...defaultOptions, ...options }

  const nextHandler: NextApiHandler<T> = (req, res) => {
    const method = req.method?.toLowerCase() as RequestMethod
    if (!method) return notFoundCallback(req, res)

    const handlerName = requestMethods[method]

    if (handlerName in handlers) return handlers[handlerName]?.(req, res)
    return notFoundCallback(req, res)
  }
  return nextHandler
}
