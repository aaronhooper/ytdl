import { v4 as uuidv4 } from 'uuid'

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

  const jobId = uuidv4()

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
