import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import * as dotenv from 'dotenv'

if (process.env.NODE_ENV === 'development') {
  dotenv.config()
}

const ddbClient = new DynamoDBClient({
  region: process.env.REGION
})

export default ddbClient
