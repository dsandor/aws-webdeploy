import cdk = require('@aws-cdk/core');
import { StaticWebsiteStack } from 'aws-cdk-static-website';

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

let props: any, stackName: string;

if (process.env['WEBDEPLOY_CONFIG_NAME'] && pkg.webdeploy[process.env['WEBDEPLOY_CONFIG_NAME'] || '']) {
  const configName: any = process.env['WEBDEPLOY_CONFIG_NAME'];
  console.log('Using web deploy configuration:', configName);
  stackName = pkg.webdeploy[configName].stackName;

  props = {
    websiteDistPath: pkg.webdeploy[configName].distPath || pkg.webdeploy[configName].websiteDistPath,
    deploymentVersion: pkg.webdeploy[configName].deploymentVersion || pkg.version,
    resourcePrefix: pkg.webdeploy[configName].resourcePrefix,
    indexDocument: pkg.webdeploy[configName].indexDocument || 'index.html',
    certificateArn: pkg.webdeploy[configName].certificateArn,
    domainNames: pkg.webdeploy[configName].domainNames,
  };
} else {
  stackName = pkg.webdeploy.stackName;

  props = {
    websiteDistPath: pkg.webdeploy.distPath || pkg.webdeploy.websiteDistPath,
    deploymentVersion: pkg.webdeploy.deploymentVersion || pkg.version,
    resourcePrefix: pkg.webdeploy.resourcePrefix,
    indexDocument: pkg.webdeploy.indexDocument || 'index.html',
    certificateArn: pkg.webdeploy.certificateArn,
    domainNames: pkg.webdeploy.domainNames,
  };
}

console.log('Using the following properties for deployment:');
console.table(props);

const app = new cdk.App();
new MyWebStack(app, stackName || pkg.name);