import { getVideo, postVideo } from './lib/methods.mjs'
import { createResponseObject as response } from './lib/util.mjs'

export const handler = async (event) => {
  const method = event.requestContext.http.method

  if (method === 'GET') {
    return getVideo(event)
  } else if (method === 'POST') {
    return postVideo(event)
  }

  return response({ message: `Unsupported method '${event.http.method}'` }, 400)
}
