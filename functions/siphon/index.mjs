import { Upload } from '@aws-sdk/lib-storage'
import { PassThrough } from 'stream'
import { UpdateItemCommand } from '@aws-sdk/client-dynamodb'
import ytdl from 'ytdl-core'
import s3Client from './lib/s3Client.mjs'
import ddbClient from './lib/dynamoDbClient.mjs'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { createResponseObject as response } from './lib/util.mjs'

export const handler = async (event) => {
  const url = event.url
  const jobId = event.jobId
  const videoFilename = jobId + '.mp4'
  const passThrough = new PassThrough()
  let signedUrl = ''

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
    return response({ message: 'Could not stream video data to bucket' }, 500)
  }

  try {
    const getVideoCommand = new GetObjectCommand({
      Bucket: process.env.BUCKET,
      Key: videoFilename
    })

    signedUrl = await getSignedUrl(s3Client, getVideoCommand, {
      expiresIn: 3600
    })
  } catch (err) {
    console.error(err)
    return response({ message: 'Could not create presigned url' }, 500)
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
        ':downloadLink': { S: signedUrl }
      },
      ReturnValues: 'UPDATED_NEW'
    }))
  } catch (err) {
    console.error(err)
    return response({ message: 'Could not update item in database' }, 500)
  }

  return response({ message: 'Done!' })
}
