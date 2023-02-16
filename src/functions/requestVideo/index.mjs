import * as dotenv from 'dotenv'
import { nanoid } from 'nanoid'
import { isValidUrl } from './lib/util.mjs'
import ddbClient from './lib/dynamoDbClient.mjs'
import { PutItemCommand } from '@aws-sdk/client-dynamodb'
import lambdaClient from './lib/lambdaClient.mjs'
import { InvokeCommand } from '@aws-sdk/client-lambda'

if (process.env.NODE_ENV === 'development') {
  dotenv.config()
}

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

  await ddbClient.send(new PutItemCommand({
    TableName: process.env.TABLE_NAME,
    Item: {
      jobId: { S: jobId },
      status: { S: 'IN_PROGRESS' },
      sourceUrl: { S: url }
    }
  }))

  await lambdaClient.send(new InvokeCommand({
    InvocationType: 'Event',
    FunctionName: process.env.FUNCTION_ARN,
    Payload: JSON.stringify({ url, jobId })
  }))

  const response = {
    statusCode: 202,
    body: JSON.stringify({
      message: 'Job added to queue',
      jobId
    })
  }

  return response
}
