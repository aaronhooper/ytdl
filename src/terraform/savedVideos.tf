resource "aws_s3_bucket" "savedVideos_bucket" {
  bucket = var.BUCKET
}

resource "aws_s3_bucket_acl" "savedVideos_acl" {
  bucket = aws_s3_bucket.savedVideos_bucket.id
  acl = "public-read"
}
