resource "aws_iam_role" "siphon_role" {
  name = "siphon_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
        Effect = "Allow"
      }
    ]
  })
}

resource "aws_iam_policy" "siphon_policy" {
  name = "siphon_policy"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
        Effect   = "Allow"
      },
      {
        Action = [
          "dynamodb:PutItem",
          "dynamodb:ReadItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem"
        ]
        Resource = aws_dynamodb_table.streamJobs_table.arn
        Effect   = "Allow"
      },
      {
        Action = [
          "s3:PutObject",
          "s3:PutObjectAcl",
          "s3:GetObject"
        ]
        Resource = "${aws_s3_bucket.savedVideos_bucket.arn}/*"
        Effect   = "Allow"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "attach_siphon_policy_to_role" {
  role       = aws_iam_role.siphon_role.name
  policy_arn = aws_iam_policy.siphon_policy.arn
}

data "archive_file" "zip_siphon" {
  type        = "zip"
  source_dir  = "${path.module}/../functions/siphon/"
  output_path = "${path.module}/../dist/siphon.zip"
}

resource "aws_lambda_function" "terraform_siphon_func" {
  filename      = "${path.module}/../dist/siphon.zip"
  function_name = "siphon"
  role          = aws_iam_role.siphon_role.arn
  handler       = "index.handler"
  runtime       = "nodejs18.x"
  depends_on    = [aws_iam_role_policy_attachment.attach_siphon_policy_to_role]
  timeout       = 300

  environment {
    variables = {
      REGION     = var.region
      TABLE_NAME = var.table_name
      BUCKET     = var.bucket
    }
  }
}

