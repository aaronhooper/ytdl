import { nanoid } from 'nanoid'
import { isValidUrl } from './util.mjs'
import ddbClient from './dynamoDbClient.mjs'
import { GetItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb'
import lambdaClient from './lambdaClient.mjs'
import { InvokeCommand } from '@aws-sdk/client-lambda'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'

export const getVideo = async (event) => {
  if (!event.queryStringParameters.jobId) {
    const response = {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Request must contain a jobId parameter'
      })
    }

    return response
  }

  const jobId = event.queryStringParameters.jobId

  try {
    const { Item } = await ddbClient.send(new GetItemCommand({
      TableName: process.env.TABLE_NAME,
      Key: marshall({ jobId })
    }))

    if (typeof Item === 'undefined') {
      const response = {
        statusCode: 404,
        body: JSON.stringify({
          message: 'No job found with given id'
        })
      }

      return response
    }

    const data = unmarshall(Item)

    const response = {
      statusCode: 200,
      body: JSON.stringify(data)
    }

    return response
  } catch (err) {
    console.error(err)

    const response = {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Unable to get info from database'
      })
    }

    return response
  }
}

export const postVideo = async (event) => {
  const json = JSON.parse(event.body)

  if (!json.url) {
    const response = {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Request must contain a url property'
      })
    }

    return response
  }

  const url = json.url
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

  try {
    await ddbClient.send(new PutItemCommand({
      TableName: process.env.TABLE_NAME,
      Item: {
        jobId: { S: jobId },
        status: { S: 'IN_PROGRESS' },
        sourceUrl: { S: url }
      }
    }))
  } catch (err) {
    console.error(err)

    const response = {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Could not create item in database'
      })
    }

    return response
  }

  try {
    await lambdaClient.send(new InvokeCommand({
      InvocationType: 'Event',
      FunctionName: process.env.FUNCTION_ARN,
      Payload: JSON.stringify({ url, jobId })
    }))
  } catch (err) {
    console.error(err)

    const response = {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Could not invoke siphon'
      })
    }

    return response
  }

  const response = {
    statusCode: 202,
    body: JSON.stringify({
      message: 'Job added to queue',
      jobId
    })
  }

  return response
}
