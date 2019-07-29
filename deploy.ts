import cdk = require('@aws-cdk/core');
import { StaticWebsiteStack, IStaticWebsiteProps } from 'aws-cdk-static-website';

export class MyWebStack extends StaticWebsiteStack {
  constructor(scope: cdk.App, id: string ) {
    
    super(scope, id, props);
  }
}

const workingPath = process.cwd();

const pkg = require(`${workingPath}/package.json`);

if (!pkg.webdeploy) {
  console.error('Error, package.json should have a "webdeploy" configuration section.');
  process.exit(2);
}

const props: IStaticWebsiteProps = {
  websiteDistPath: pkg.webdeploy.distPath || pkg.webdeploy.websiteDistPath,
  deploymentVersion: pkg.deploymentVersion || pkg.version,
  resourcePrefix: pkg.webdeploy.resourcePrefix,
  indexDocument: pkg.webdeploy.indexDocument || 'index.html',
  certificateArn: pkg.webdeploy.certificateArn,
  domainNames: pkg.webdeploy.domainNames,
};

console.log('Using the following properties for deployment:');
console.table(props);

const app = new cdk.App();
new MyWebStack(app, pkg.webdeploy.stackName || pkg.name);