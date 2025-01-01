import { execSync } from 'child_process';
import fsPromise from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import { globby } from 'globby';
import GitUrlParse from 'git-url-parse';
import { input as inputPrompt, confirm as confirmPrompt } from '@inquirer/prompts';

const removeTemplateNpmScripts = async () => {
    console.log(chalk.cyanBright('Removing template npm scripts'));

    const packageJsonPath = path.join(process.cwd(), 'package.json')
    const fileContentsRaw = await fsPromise.readFile(
        packageJsonPath,
        { encoding: 'utf8' }
    );
    const packageJson = JSON.parse(fileContentsRaw);
    packageJson.scripts = Object.fromEntries(
        Object.entries(packageJson.scripts).filter(([key]) => {
            return !key.includes('template');
        })
    );

    const adjustedContents = JSON.stringify(packageJson, null, 2);

    await fsPromise.writeFile(packageJsonPath, adjustedContents, { encoding: 'utf8' });

    console.log(chalk.greenBright('File contents replaced'));
}

const checkFileExists = async (filePath) => {
    try {
        await fsPromise.access(filePath, fsPromise.constants.R_OK);

        return true;
    } catch (error) {
        return false;
    }
}

const removeTemplateFiles = async () => {
    console.log(chalk.cyanBright('Removing TEMPLATE_README.md'));

    const templateReadmePath = path.join(process.cwd(), 'TEMPLATE_README.md');
    const packageReadmePath = path.join(process.cwd(), 'PACKAGE_README.md');

    const templateReadmeExists = await checkFileExists(templateReadmePath);   
    const packageReadmeExists = await checkFileExists(packageReadmePath);

    if (packageReadmeExists) {
        console.log(
            chalk.redBright('PACKAGE_README.md still exists! Run template:setup first.')
        );

        return;
    }

    if (!templateReadmeExists) {
        console.log(
            chalk.blueBright('Nothing to do. TEMPLATE_README.md does not exist')
        );

        return;
    }

    await fsPromise.unlink(
        templateReadmePath
    );

    console.log(chalk.greenBright('TEMPLATE_README file removed.'));

    return true;
}

const run = async () => {
    const proceed = await confirmPrompt({ message: 'Are you sure you wish to proceed?', default: false });

    if (!proceed) {
        console.log(chalk.blueBright('Exiting'));

        return;
    }

    const tempalteFilesRemoved = await removeTemplateFiles();

    if (tempalteFilesRemoved) {
        await removeTemplateNpmScripts();
    }
}

run();