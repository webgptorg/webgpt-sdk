#!/usr/bin/env ts-node

import colors from 'colors';
import commander from 'commander';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import spaceTrim from 'spacetrim';
import { PackageJson } from 'type-fest';
import YAML from 'yaml';
import { packageNames } from '../../rollup.config';
import { commit } from '../utils/autocommit/commit';
import { isWorkingTreeClean } from '../utils/autocommit/isWorkingTreeClean';
import { execCommand } from '../utils/execCommand/execCommand';

if (process.cwd() !== join(__dirname, '../..')) {
    console.error(colors.red(`CWD must be root of the project`));
    process.exit(1);
}

const program = new commander.Command();
program.option('--commit', `Autocommit changes`, false);
program.parse(process.argv);

const { commit: isCommited } = program.opts();

generatePackages({ isCommited })
    .catch((error: Error) => {
        console.error(colors.bgRed(error.name));
        console.error(error);
        process.exit(1);
    })
    .then(() => {
        process.exit(0);
    });

async function generatePackages({ isCommited }: { isCommited: boolean }) {
    console.info(`📦  Generating packages`);

    if (isCommited && !(await isWorkingTreeClean(process.cwd()))) {
        throw new Error(`Working tree is not clean`);
    }

    for (const packageName of packageNames) {
        await execCommand(`rm -rf ./packages/${packageName}/umd`);
        await execCommand(`rm -rf ./packages/${packageName}/esm`);
    }

    await execCommand(`npx rollup --config rollup.config.js`);

    const mainPackageJson = JSON.parse(await readFile('./package.json', 'utf-8')) as PackageJson;

    if (!mainPackageJson.version) {
        throw new Error(`Version is not defined in the package.json`);
    }

    console.info(colors.bgWhite(mainPackageJson.version));

    for (const packageName of packageNames) {
        await writeFile(
            `./packages/${packageName}/README.md`,
            spaceTrim(`

                # 📖 Promptbook

                Library to supercharge your use of large language models

                [Read the manual](https://github.com/webgptorg/promptbook)

        `), // <- TODO: [🧠] !!! Better README.md for each package
            // <- TODO: [🧠] Maybe make custom README.md for each package
        );

        const packageJson = JSON.parse(JSON.stringify(mainPackageJson) /* <- Note: Make deep copy */) as PackageJson;
        delete packageJson.scripts;
        delete packageJson.devDependencies;
        packageJson.name = `@promptbook/${packageName}`;
        if (packageName !== 'core') {
            packageJson.peerDependencies = {
                '@promptbook/core': packageJson.version,
            };
        }
        const indexContent = await readFile(`./packages/${packageName}/esm/index.es.js`, 'utf-8');
        for (const dependencyName in packageJson.dependencies) {
            if (!indexContent.includes(`from '${dependencyName}'`)) {
                delete packageJson.dependencies[dependencyName];
            }
        }
        packageJson.main = `./umd/index.umd.js`;
        packageJson.module = `./esm/index.es.js`;
        packageJson.typings = `./esm/typings/_packages/${packageName}.index.d.ts`;

        if (packageName === 'cli') {
            packageJson.bin = {
                promptbook: 'bin/promptbook-cli.js',
            };
        }

        // TODO: !! Filter out dependencies only for the current package
        await writeFile(`./packages/${packageName}/package.json`, JSON.stringify(packageJson, null, 4) + '\n');

        await writeFile(`./packages/${packageName}/.gitignore`, ['esm', 'umd'].join('\n'));
        await writeFile(`./packages/${packageName}/.npmignore`, '');
    }

    await writeFile(
        `./.github/workflows/publish.yml`,
        YAML.stringify(
            {
                name: 'Publish new version',
                on: {
                    push: {
                        tags: ['v*'],
                    },
                },
                jobs: {
                    'publish-npm': {
                        name: 'Publish on NPM package registry',
                        'runs-on': 'ubuntu-latest',
                        steps: [
                            {
                                name: 'Checkout',
                                uses: 'actions/checkout@v2',
                            },
                            {
                                name: 'Setup Node.js',
                                uses: 'actions/setup-node@v1',
                                with: {
                                    'node-version': 18,
                                    'registry-url': 'https://registry.npmjs.org/',
                                },
                            },
                            {
                                name: 'Install dependencies',
                                run: 'npm ci',
                            },
                            {
                                name: 'Build packages bundles',
                                // Note: Generate packages before publishing to put the recent version in each package.json
                                // TODO: It will be better to have here just "npx rollup --config rollup.config.js" BUT it will not work because:
                                //       This is run after a version tag is pushed to the repository, so used publish.yml is one version behing
                                run: `npx ts-node ./scripts/generate-packages/generate-packages.ts`,
                            },
                            ...packageNames.map((packageName) => ({
                                name: `Publish @promptbook/${packageName}`,
                                'working-directory': `./packages/${packageName}`,
                                run: 'npm publish --access public',
                                env: {
                                    NODE_AUTH_TOKEN: '${{secrets.NPM_TOKEN}}',
                                },
                            })),
                        ],
                    },
                },
            },
            { indent: 4 },
        )
            .split('"')
            .join("'") /* <- TODO: Can the replace be done directly in YAML.stringify options? */,
    );

    if (isCommited) {
        await commit('packages', `📦 Generating packages`);
        await commit('.github', `📦 Update publish workflow for generated packages`);
    }

    console.info(`[ 📦  Generating packages ]`);
}

/**
 * TODO: !! [👵] test before publish
 * TODO: !! Add warning to the copy/generated files
 * TODO: !! Use prettier to format the generated files
 * TODO: !! Normalize order of keys in package.json
 */
