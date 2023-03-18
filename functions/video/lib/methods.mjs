import { nanoid } from 'nanoid'
import { isValidUrl, createResponseObject as response } from './util.mjs'
import ddbClient from './dynamoDbClient.mjs'
import { GetItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb'
import lambdaClient from './lambdaClient.mjs'
import { InvokeCommand } from '@aws-sdk/client-lambda'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'

export const getVideo = async (event) => {
  const jobId = event.queryStringParameters?.jobId

  if (!jobId) {
    return response({ message: 'Request must contain a jobId parameter' }, 400)
  }

  try {
    const { Item } = await ddbClient.send(new GetItemCommand({
      TableName: process.env.TABLE_NAME,
      Key: marshall({ jobId })
    }))

    if (!Item) {
      return response({ message: 'No job found with given id' }, 404)
    }

    return response(unmarshall(Item))
  } catch (err) {
    console.error(err)
    return response({ message: 'Unable to get info from database' }, 500)
  }
}

export const postVideo = async (event) => {
  const json = JSON.parse(event.body)

  if (!json.url) {
    return response({ message: 'Request must contain a url property' }, 400)
  }

  const url = json.url
  const jobId = nanoid()

  if (!isValidUrl(url)) {
    return response({ message: 'Url is not valid' }, 400)
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
    return response({ message: 'Could not create item in database' }, 500)
  }

  try {
    await lambdaClient.send(new InvokeCommand({
      InvocationType: 'Event',
      FunctionName: process.env.FUNCTION_ARN,
      Payload: JSON.stringify({ url, jobId })
    }))
  } catch (err) {
    console.error(err)
    return response({ message: 'Could not invoke siphon' }, 500)
  }

  return response({ message: 'Job added to queue', jobId }, 202)
}
