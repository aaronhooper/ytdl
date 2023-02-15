resource "aws_dynamodb_table" "streamJobs_table" {
  billing_mode = "PAY_PER_REQUEST"
  hash_key = "jobId"
  name = var.TABLE_NAME
  stream_enabled = true

  attribute {
    name = "jobId"
    type = "S"
  }
}

