import { pickBy } from 'lodash-es'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const { getCookieParams } = useHelpers()

  function request(method, url, params, headers) {
    const tokenCookie = useCookie('jwt', getCookieParams())
    const couponCookie = useCookie('coupon')
    const utmCookie = useCookie('utm')

    // Detect if params is FormData (multipart upload)
    const isFormData = params instanceof FormData

    // Build headers object
    const requestHeaders = {
      ...headers,
      Accept: 'application/json',
      Authorization: tokenCookie?.value ? `Bearer ${tokenCookie.value}` : null,
      'X-Coupon': couponCookie?.value,
      'X-UTM': JSON.stringify(toRaw(utmCookie?.value))
    }

    // Only add Content-Type if NOT FormData (browser sets it automatically with boundary)
    if (!isFormData) {
      requestHeaders['Content-Type'] = 'application/json'
    }

    return $fetch(url, {
      method,
      body: ['POST', 'PATCH', 'PUT'].includes(method) ? params : null,
      query: ['GET', 'DELETE'].includes(method) ? params : null,
      baseURL: config.public.API_URL,
      headers: pickBy(requestHeaders),
      onRequest(arg) {
        console.info('[fetch request]', arg.request)
      },
      onRequestError(arg) {
        console.info('[fetch request error]', arg.request, arg.error)
      },
      onResponse(arg) {
        console.info('[fetch response]', arg.request, arg.response.status)
      },
      onResponseError(arg) {
        console.info('[fetch response error]', arg.request, arg.response.status)
      }
    })
  }

  const api = {
    get(url, params = {}, headers = {}) {
      return request('GET', url, params, headers)
    },
    post(url, params = {}, headers = {}) {
      return request('POST', url, params, headers)
    },
    patch(url, params = {}, headers = {}) {
      return request('PATCH', url, params, headers)
    },
    put(url, params = {}, headers = {}) {
      return request('PUT', url, params, headers)
    },
    delete(url, params = {}, headers = {}) {
      return request('DELETE', url, params, headers)
    }
  }

  return {
    provide: {
      api
    }
  }
})