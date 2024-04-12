import typescript from '@rollup/plugin-typescript';

export default [
    {
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
    },
];
