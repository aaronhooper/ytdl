resource "aws_dynamodb_table" "streamJobs_table" {
  billing_mode     = "PAY_PER_REQUEST"
  hash_key         = "jobId"
  name             = var.table_name
  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"

  attribute {
    name = "jobId"
    type = "S"
  }
}

