# aws-webdeploy
Tiny utility to allow configuring a web application deployment from your package.json and leverage AWS-CDK.

## NPX Usage (Option 1)

Add the `webdeploy` section to your **package.json** file. *(see below for more options)*

```
  "webdeploy": {
    "distPath": "./dist",
    "resourcePrefix": "test-web-stack"
  }
```

Then just do this:

```
npx aws-webdeploy
```

## Integrated as npm-script (Option 2)

`TLDR;` Install this along with the AWS CDK CLI (installed globally) and you can `yarn deploy` your static website out of your **dist** directory.

### Full example project

[https://github.com/dsandor/aws-webdeploy-example](https://github.com/dsandor/aws-webdeploy-example)

[![asciicast](https://asciinema.org/a/XY3ElLm9kXrWmTkCign9QuyMx.svg)](https://asciinema.org/a/XY3ElLm9kXrWmTkCign9QuyMx)

## What are the pre-requisites?

- AWS CLI should be [installed and working](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html).
- AWS Credentials [should be configured](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-envvars.html) in ~/.aws or as environment variables.
- AWS CDK CLI should be [installed and working](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html).

## package.json `webdeploy` settings

In its simplest form you only need to add the following section to your `package.json` file. Here you are specifying the location of your static website files `./dist/` in this case. You are also specifying a prefix to use for your AWS Resources in the CloudFormation stack. This should be a unique prefix to avoid collision with your S3 bucket name.  Pick something like `www-mywebsite-com` which is unique and descriptive.

```
  "webdeploy": {
    "distPath": "./dist",
    "resourcePrefix": "test-web-stack"
  }
```

## Add the deploy script to your package.json

Add the following to your package.json file:

```
  "scripts": {
    "deploy": "cdk deploy --app node_modules/aws-webdeploy/deploy.js"
  },

```

## How to deploy?

```
yarn deploy
```

-or-

```
npm run deploy
```

This kicks off the `cdk deploy` command and uses a small cdk app that will use the parameters you configured in your `package.json` file.

## Full `package.json` file settings

|property|description|
|---|---|
|websiteDistPath|The HTML files to be deployed. e.g. `./dist`|
| deploymentVersion|A version number for your deployment.|
| resourcePrefix|Used to group resources with a prefix. The S3 bucket is prefixed with this value.|
| indexDocument|index document for your website. default: `index.html`|
| certificateArn|the ARN for the SSL certificate for your website. (optional)|
| domainNames|an array of strings representing your website domain name (must match the certificate) e.g. ['mydomain.com', 'www.mydomain.com']|

Please note that if you wish to use your own domain names and not just the Cloud Front Distribution URL you will also need a certificate. It is very simple to create a certificate in AWS console and it is free (assuming you are supporting modern browsers only). Once you have the ARN for your certificate use the `certificateArn` property. You will also need to provide the domain names to the `domainNames` property. The domain names MUST MATCH the domain names you put on your certificate.

## What gets created for me?

- CloudFront Distribution
- CloudFront Origin that maps to a versioned folder in an S3 bucket
- Correct permissions to disallow public access to the S3 bucket.
- Correct permissions for CloudFront to serve the files from S3
- S3 Bucket for the website assets (placed into a folder based on `deploymentVersion` value)
