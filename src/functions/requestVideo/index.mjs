import { nanoid } from 'nanoid'
import { isValidUrl } from './lib/util.mjs'

export const handler = async (event) => {
  if (!event.url) {
    const response = {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Request must contain a url property'
      })
    }

    return response
  }

  const url = event.url
  const jobId = nanoid()

  if (!isValidUrl(url)) {
    const response = {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Url is not valid'
      })
    }

    return response
  }

  // TODO connect to dynamodb
  // TODO insert entry
  // TODO invoke siphon lambda

  const response = {
    statusCode: 202,
    body: JSON.stringify({
      message: 'Job added to queue',
      jobId
    })
  }

  return response
}
