#!/usr/bin/env node
const fs = require('fs-extra');
const path = require('path');
const prompts = require('prompts');

const executingFromPath = process.cwd();
const packageJsonFilePath = `${executingFromPath}/package.json`;
const pkg = require(packageJsonFilePath);

if (!pkg) {
	console.error(`package.json was not found in ${executingFromPath}`);
	process.exit(1);
}

console.log('process.argv:', process.argv);

const existingConfig = pkg.webdeploy || {};
const shouldInit = process.argv.length > 2 ? process.argv[2] === 'init' : false;

if (!pkg.webdeploy || shouldInit) {
	promptForConfig();
}

async function promptForConfig() {
	const promptConfig = [
		{
			type: 'text',
			name: 'websiteDistPath',
			message: 'What directory contains your website?',
			initial: existingConfig.websiteDistPath || './dist',
		},
		{
			type: 'text',
			name: 'deploymentVersion',
			message: 'What is the deployment version? (Leave blank to use version from package.json)',
		},
		{
			type: 'text',
			name: 'resourcePrefix',
			message: 'Set a prefix for this AWS Stack?',
			initial: existingConfig.resourcePrefix || pkg.name,
		},
		{
			type: 'text',
			name: 'indexDocument',
			message: 'What is your index document for the website?',
			initial: existingConfig.indexDocument || 'index.html',
		},
		{
			type: 'text',
			name: 'certificateArn',
			message: 'Enter the AWS ARN for the SSL Certificate for this website? (e.g. arn:aws:acm:us-east-1:123456789012:certificate/00000000-0000-0000-0000-000000000000)',
			initial: existingConfig.certificateArn,
		},
		{
			type: 'text',
			name: 'domainNames',
			message: 'Domain name(s) for this webiste: (separate with commas)',
			initial: existingConfig.domainNames ? existingConfig.domainNames.join(',') : undefined,
		},
	];

	let response = await prompts(promptConfig);

	if (response.certificateArn === '') delete response.certificateArn;
	if (response.domainNames === '') delete response.domainNames;

	pkg.webdeploy = { ...response };

	await fs.writeJSON(packageJsonFilePath, pkg);
	console.log('package.json has been updated with this config:\n');
	console.table(response);
}
