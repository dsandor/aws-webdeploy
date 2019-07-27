/*
TODO: Make this take all the parameters from the package.json.
*/
import cdk = require('@aws-cdk/core');
import { StaticWebsiteStack, IStaticWebsiteProps } from 'aws-cdk-static-website';

export class MyWebStack extends StaticWebsiteStack {
  constructor(scope: cdk.App, id: string ) {
    const props: IStaticWebsiteProps = {
      websiteDistPath: './dist',
      deploymentVersion: '1.0.0',
      resourcePrefix: 'my-web-stack',
      indexDocument: 'index.html',
    };

    super(scope, id, props);
  }
}

const app = new cdk.App();
new MyWebStack(app, 'MyWebStack');