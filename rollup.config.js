import typescript from '@rollup/plugin-typescript';
import { readdirSync } from 'fs';
import { join } from 'path';

export const packageNames = readdirSync(join(__dirname, 'src/_packages'), { recursive: false, withFileTypes: true })
    .filter((dirent) => dirent.isFile())
    .filter((dirent) => dirent.name.endsWith('.index.ts'))
    .map((dirent) => dirent.name.split('.').shift());

export default [{
  input: `./src/index.ts`,
  output: [
      {
          file: `./dist/umd/index.umd.js`,
          name: `webgpt-sdk`,
          format: 'umd',
          sourcemap: true,
      },
      {
          file: `./dist/esm/index.es.js`,
          format: 'es',
          sourcemap: true,
      },
  ],
  plugins: [typescript({ tsconfig: './tsconfig.json' })],
}]
