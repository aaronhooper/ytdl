import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import * as dotenv from 'dotenv'
import findConfig from 'find-config'

// TODO figure out a better way of doing this
dotenv.config({ path: findConfig(`.env.${process.env.NODE_ENV}`) })

const ddbClient = new DynamoDBClient({
  region: process.env.REGION,
  endpoint: process.env.DDB_ENDPOINT,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY
  }
})

export default ddbClient
