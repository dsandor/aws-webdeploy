#!/usr/bin/env node
/*
TODO: Make this take all the parameters from the package.json.
*/
import cdk = require('@aws-cdk/core');
import { StaticWebsiteStack, IStaticWebsiteProps } from 'aws-cdk-static-website';

export class MyWebStack extends StaticWebsiteStack {
  constructor(scope: cdk.App, id: string ) {
    const props: IStaticWebsiteProps = {
      websiteDistPath: pkg.webdeploy.distPath,
      deploymentVersion: pkg.version,
      resourcePrefix: pkg.webdeploy.resourcePrefix,
      indexDocument: pkg.webdeploy.indexDocument,
    };

    super(scope, id, props);
  }
}

if (process.argv.length !== 3) {
  console.error('FAIL, please pass current working directory to command. E.g. "aws-webdeploy $(pwd)" in "scripts"');
  process.exit(1);
}

const workingPath = process.argv[2];
const pkg = require(`${workingPath}/package.json`);

console.log('pkg:', pkg);

if (!pkg.webdeploy) {
  console.error('Error, package.json should have a "webdeploy" configuration section.');
  process.exit(2);
}

const app = new cdk.App();
new MyWebStack(app, pkg.webdeploy.stackName || pkg.name);