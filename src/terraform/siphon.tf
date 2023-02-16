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
  name = "requestVideo_policy"
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
        Effect = "Allow"
      },
      {
        Action = [
          "dynamodb:PutItem",
          "dynamodb:ReadItem",
          "dynamodb:DeleteItem"
        ]
        Resource = [
          "arn:aws:dynamodb:*:*:*",
          "arn:aws:s3:*:*:*"
        ]
        Effect = "Allow"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "attach_siphon_policy_to_role" {
  role = aws_iam_role.siphon.name
  policy_arn = aws_iam_policy.siphon.arn
}

data "archive_file" "zip_siphon" {
  type = "zip"
  source_dir = "${path.module}/../functions/siphon/"
  output_path = "${path.module}/../functions/siphon.zip"
}

resource "aws_lambda_function" "terraform_siphon_func" {
  filename = "${path.module}/../functions/siphon.zip"
  function_name = "siphon"
  role = aws_iam_role.siphon.arn
  handler = "index.handler"
  runtime = "nodejs18.x"
  depends_on = [aws_iam_role_policy_attachment.attach_siphon_policy_to_role]
  environment {
    variables = {
      REGION = var.REGION
      TABLE_NAME = var.TABLE_NAME
      BUCKET = var.BUCKET
    }
  }
}

