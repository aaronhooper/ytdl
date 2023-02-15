import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import * as dotenv from 'dotenv'

if (process.env.NODE_ENV === 'development') {
  dotenv.config()
}

const ddbClient = new DynamoDBClient({
  region: process.env.REGION,
  endpoint: process.env.DDB_ENDPOINT,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY
  }
})

export default ddbClient
