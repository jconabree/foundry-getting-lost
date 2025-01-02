import fsPromise from 'fs/promises';
import { globby } from 'globby';

const run = async () => {
    const folders = await globby([
        'src/*',
        '!src/scripts'
    ], {
        deep: 1,
        expandDirectories: false,
        onlyDirectories: true
    });

    const paths = await Promise.all(
        folders.map(async (folderPath) => {
            const distFolder = folderPath.replace('src/', 'dist/');
            await fsPromise.rm(distFolder, { recursive: true, force: true });
            await fsPromise.cp(folderPath, distFolder, { recursive: true });
        })
    );
}

run();