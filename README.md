## Setup & Deploy

1. Run `npm install` in project root and every `src/functions`
   subdirectory.
2. Configure AWS credentials by exporting `AWS_ACCESS_KEY_ID`,
   `AWS_SECRET_ACCESS_KEY` and `AWS_SESSION_TOKEN`. These can be found
   in your `awsapps.com` login under _Command line or programmatic
   access_.
3. Change directory to `src/terraform` and set the variables listed at
   the top of `main.tf`, either by exporting them in your environment
   with a `TF_VAR_` prefix or by creating a `terraform.tfvars` file and
   setting them there.
4. Run `terraform init` and `terraform apply`.
