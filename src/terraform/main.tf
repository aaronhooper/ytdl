variable "REGION" {}
variable "BUCKET" {}
variable "TABLE_NAME" {}

terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region = var.REGION
}
