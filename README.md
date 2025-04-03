## Prerequisites
- DynamoDB
- API Gateway
- Lambda

## Manual Deployment
- Package the files to a **.zip**
- Under the Lambda function, select **Upload from** > **.zip file** and select the package file created from the previous step

## Local
- [Install the AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html#install-sam-cli-instructions)
- Update env variables in **./devfiles/template.yaml**
- Run the following command

```
npm run local
```
