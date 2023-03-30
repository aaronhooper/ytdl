resource "aws_iam_role" "video_role" {
  name = "video_role"
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

resource "aws_iam_policy" "video_policy" {
  name = "video_policy"
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
        Action   = [
          "dynamodb:PutItem",
          "dynamodb:GetItem"
        ]
        Resource = aws_dynamodb_table.streamJobs_table.arn
        Effect   = "Allow"
      },
      {
        Action = [
          "lambda:InvokeFunctionUrl",
          "lambda:InvokeFunction",
          "lambda:InvokeAsync"
        ]
        Resource = aws_lambda_function.terraform_siphon_func.arn
        Effect   = "Allow"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "attach_video_policy_to_role" {
  role       = aws_iam_role.video_role.name
  policy_arn = aws_iam_policy.video_policy.arn
}

data "archive_file" "zip_video" {
  type        = "zip"
  source_dir  = "${path.module}/../functions/video/"
  output_path = "${path.module}/../dist/video.zip"
}

resource "aws_lambda_function" "terraform_video_func" {
  filename      = "${path.module}/../dist/video.zip"
  function_name = "video"
  role          = aws_iam_role.video_role.arn
  handler       = "index.handler"
  runtime       = "nodejs18.x"
  depends_on    = [aws_iam_role_policy_attachment.attach_video_policy_to_role]
  environment {
    variables = {
      REGION       = var.region
      TABLE_NAME   = var.table_name
      FUNCTION_ARN = aws_lambda_function.terraform_siphon_func.function_name
    }
  }
}

resource "aws_lambda_function_url" "video_url" {
  function_name      = aws_lambda_function.terraform_video_func.function_name
  authorization_type = "NONE"

  cors {
    allow_origins = ["*"]
    allow_methods = ["GET", "POST"]
  }
}
