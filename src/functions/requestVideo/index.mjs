import { nanoid } from 'nanoid'

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

  const jobId = nanoid()

  // TODO validate url
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
