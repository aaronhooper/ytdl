import * as dotenv from 'dotenv'
import path from 'path'
import { CreateTableCommand } from '@aws-sdk/client-dynamodb'
import ddbClient from '../lib/dynamoDbClient.mjs'

if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: path.join(__dirname, '../.env') })
}

const params = {
  AttributeDefinitions: [
    {
      AttributeName: 'jobId',
      AttributeType: 'S'
    }
  ],
  KeySchema: [
    {
      AttributeName: 'jobId',
      KeyType: 'HASH'
    }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1
  },
  TableName: 'streamJobs'
}

ddbClient.send(new CreateTableCommand(params))
  .then(data => console.log('table created', data))
  .catch(err => console.log(err))
