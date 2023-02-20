import { getVideo, postVideo } from './lib/methods.mjs'

export const handler = async (event) => {
  if (event.requestContext.http.method === 'GET') {
    return getVideo(event)
  } else if (event.requestContext.http.method === 'POST') {
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
