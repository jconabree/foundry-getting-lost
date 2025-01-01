import { execSync } from 'child_process';
import fsPromise from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import { globby } from 'globby';
import GitUrlParse from 'git-url-parse';
import { input as inputPrompt, confirm as confirmPrompt } from '@inquirer/prompts';

const getGitUrl = () => {
    try {
        const url = execSync("git config --get remote.origin.url", { encoding: "utf-8" }).trim();

        return url || false;
    } catch (error) {
        return false;
    }
}
const getGitInfo = (url) => {
    const gitUrl = url || getGitUrl();

    return gitUrl ? GitUrlParse(gitUrl) : false;
}

const sanitizePackageName = (value) => value.replace(/[^\w]/g, '-').replace(/--+/g, '-').toLowerCase();

const replaceValuesInFiles = async (replacements) => {
    console.log(chalk.cyanBright('Replacing values in files.'));

    const paths = await globby([
        'module.json',
        'package.json',
        'package-lock.json',
        'PACKAGE_README.md',
        'src/**/*.{ts,js,json}'
    ]);

    await Promise.all(
        paths.map(async (filePath) => {
            const fileContents = await fsPromise.readFile(filePath, { encoding: 'utf8' });

            const adjustedContents = Object.entries(replacements).reduce((replacedContent, [key, value]) => {
                return replacedContent.replaceAll(key, value);
            }, fileContents);

            await fsPromise.writeFile(filePath, adjustedContents, { encoding: 'utf8' });
        })
    );

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

const swapReadmeFiles = async () => {
    console.log(chalk.cyanBright('Moving PACKAGE_README.md to README.md'));

    const mainReadmePath = path.join(process.cwd(), 'README.md');
    const packageReadmePath = path.join(process.cwd(), 'PACKAGE_README.md');
    const templateReadmePath = path.join(process.cwd(), 'TEMPLATE_README.md');

    const packageReadmeExists = await checkFileExists(packageReadmePath);
    const templateReadmeExists = await checkFileExists(templateReadmePath);

    if (!packageReadmeExists && templateReadmeExists) {
        console.log(
            chalk.blueBright('Nothing to do. The swap has already be executed.')
        );

        return;
    }

    if (!packageReadmeExists) {
        console.log(
            chalk.blueBright('Failed to swap. PACKAGE_README.md does not exist')
        );

        return;
    }

    await fsPromise.rename(
        mainReadmePath,
        templateReadmePath
    );

    await fsPromise.rename(
        packageReadmePath,
        mainReadmePath
    );

    console.log(chalk.greenBright('README files moved.'));
}

const run = async () => {
    const folderGitUrl = getGitUrl();

    const answers = [
        {
            key: 'gitUrl',
            question: 'Github URL',
            answer: await inputPrompt({
                message: 'Github URL?',
                default: folderGitUrl || undefined,
                validate: (value) => Boolean(getGitInfo(value)?.owner) || 'Invalid github URL'
            })
        },
        {
            key: 'AUTHOR_NAME',
            question: 'Author Name',
            answer: await inputPrompt({
                message: 'Author Name?',
                default: 'Justin Conabree',
            })
        },
        {
            key: 'MODULE_NAME',
            question: 'Module Name (eg "My Module")',
            answer: await inputPrompt({
                message: 'Module Name (eg "My Module")?',
                required: true
            })
        },
        {
            key: 'PACKAGE_NAME',
            question: 'Package Name (eg "my-module")',
            answer: await inputPrompt({
                message: 'Package Name (eg "my-module")?',
                required: true,
                transformer: sanitizePackageName
            })
        },
    ];

    Object.values(answers).forEach(({ question, answer }) => {
        console.log(
            `${chalk.blueBright(question)}: ${chalk.white(answer)}`
        );
    })

    const confirm = await confirmPrompt({
        message: 'Proceed? File contents will be replaced and readme will be moved',
        default: true
    });

    if (!confirm) {
        console.log(chalk.blueBright('Ending command'));

        return;
    }

    const replacements = Object.fromEntries(
        answers.reduce((replaceEntries, { key, answer }) => {
            if (key === 'gitUrl') {
                const gitInfo = getGitInfo(answer);

                replaceEntries.push(
                    ['{{GITHUB_FULLNAME}}', gitInfo.full_name],
                    ['{{GITHUB_OWNER}}', gitInfo.owner],
                    ['{{GITHUB_NAME}}', gitInfo.name],
                    ['{{GITHUB_URL}}', answer],
                );

                return replaceEntries;
            }

            replaceEntries.push([
                `{{${key}}}`,
                key === 'PACKAGE_NAME' ? sanitizePackageName(answer) : answer
            ]);

            return replaceEntries;
        }, [])
    );

    await replaceValuesInFiles(replacements);
    await swapReadmeFiles();
}

run();