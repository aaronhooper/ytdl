import { getVideo, postVideo } from './lib/methods.mjs'

export const handler = async (event) => {
  const method = event.requestContext.http.method

  if (method === 'GET') {
    return getVideo(event)
  } else if (method === 'POST') {
    return postVideo(event)
  }

  const response = {
    statusCode: 400,
    body: JSON.stringify({
      message: `Unsupported method '${event.http.method}'`
    })
  }

  return response
}
