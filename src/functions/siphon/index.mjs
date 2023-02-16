import { Upload } from '@aws-sdk/lib-storage'
import { PassThrough } from 'stream'
import { UpdateItemCommand } from '@aws-sdk/client-dynamodb'
import ytdl from 'ytdl-core'
import s3Client from './lib/s3Client.mjs'
import ddbClient from './lib/dynamoDbClient.mjs'
import createS3Url from './util/createS3Url.mjs'

export const handler = async (event) => {
  const url = event.url
  const jobId = event.jobId
  const videoFilename = jobId + '.mp4'
  const passThrough = new PassThrough()

  try {
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: process.env.BUCKET,
        Key: videoFilename,
        Body: passThrough
      }
    })

    ytdl(url, { filter: 'audioandvideo' }).pipe(passThrough)
    await upload.done()
  } catch (err) {
    console.error(err)

    const response = {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Could not stream video data to bucket'
      })
    }

    return response
  }

  try {
    await ddbClient.send(new UpdateItemCommand({
      TableName: process.env.TABLE_NAME,
      Key: { jobId: { S: jobId } },
      UpdateExpression: 'SET #status = :status, downloadLink = :downloadLink',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':status': { S: 'COMPLETED' },
        ':downloadLink': { S: createS3Url(videoFilename) }
      },
      ReturnValues: 'UPDATED_NEW'
    }))
  } catch (err) {
    console.error(err)

    const response = {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Could not update item in database'
      })
    }

    return response
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Done!'
    })
  }

  return response
}
