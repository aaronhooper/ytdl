resource "aws_iam_role" "requestVideo_role" {
  name = "requestVideo_role"
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

resource "aws_iam_policy" "requestVideo_policy" {
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
          "lambda:InvokeFunctionUrl",
          "lambda:InvokeFunction",
          "lambda:InvokeAsync",
          "dynamodb:PutItem"
        ]
        Resource = [
          "arn:aws:dynamodb:*:*:*",
          "arn:aws:lambda:*:*:*"
        ]
        Effect = "Allow"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "attach_requestVideo_policy_to_role" {
  role = aws_iam_role.requestVideo_role.name
  policy_arn = aws_iam_policy.requestVideo_policy.arn
}

data "archive_file" "zip_requestVideo" {
  type = "zip"
  source_dir = "${path.module}/../requestVideo/"
  output_path = "${path.module}/../requestVideo.zip"
}

resource "aws_lambda_function" "terraform_requestVideo_func" {
  filename = "${path.module}/../requestVideo.zip"
  function_name = "requestVideo"
  role = aws_iam_role.requestVideo_role.arn
  handler = "index.handler"
  runtime = "nodejs18.x"
  depends_on = [aws_iam_role_policy_attachment.attach_requestVideo_policy_to_role]
  environment {
    variables = {
      REGION = var.REGION
      TABLE_NAME = var.TABLE_NAME
      FUNCTION_ARN = aws_lambda_function.terraform_siphon_func.function_name
    }
  }
}

