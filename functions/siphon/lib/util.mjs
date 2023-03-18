import { PassThrough } from 'stream'
import { Upload } from '@aws-sdk/lib-storage'
import ytdl from 'ytdl-core'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { UpdateItemCommand } from '@aws-sdk/client-dynamodb'
import ddbClient from './lib/dynamoDbClient.mjs'
import s3Client from './s3Client.mjs'

export function createResponseObject (object, statusCode = 200) {
  return {
    statusCode,
    body: JSON.stringify(object)
  }
}

export function pipeVideoToS3Bucket (url, filename) {
  const passThrough = new PassThrough()
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: process.env.BUCKET,
      Key: filename,
      Body: passThrough
    }
  })

  ytdl(url, { filter: 'audioandvideo' }).pipe(passThrough)
  return upload.done()
}

export function generateS3Url (filename, expiresIn) {
  const getObjectCommand = new GetObjectCommand({
    Bucket: process.env.BUCKET,
    Key: filename
  })

  return getSignedUrl(s3Client, getObjectCommand, { expiresIn })
}

export function appendDownloadLinkToJob (jobId, downloadLink) {
  return ddbClient.send(new UpdateItemCommand({
    TableName: process.env.TABLE_NAME,
    Key: { jobId: { S: jobId } },

    // 'status' is a magic word in DynamoDB, so we have to use a
    // name attribute to tell it that we are talking about our
    // field.
    UpdateExpression: 'SET #status = :status, downloadLink = :downloadLink',
    ExpressionAttributeNames: {
      '#status': 'status'
    },
    ExpressionAttributeValues: {
      ':status': { S: 'COMPLETED' },
      ':downloadLink': { S: downloadLink }
    },
    ReturnValues: 'UPDATED_NEW'
  }))
}
