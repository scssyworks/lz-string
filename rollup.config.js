import babel from "rollup-plugin-babel";
import { uglify } from "rollup-plugin-uglify";

export default [
    {
        input: "src/lz-string.js",
        output: {
            file: "dist/lzString.js",
            format: "umd",
            name: "LZString",
            sourcemap: true
        },
        plugins: [
            babel({
                exclude: "node_modules/**"
            })
        ]
    },
    {
        input: "src/lz-string.js",
        output: {
            file: "dist/lzString.min.js",
            format: "umd",
            name: "LZString"
        },
        plugins: [
            babel({
                exclude: "node_modules/**"
            }),
            uglify()
        ]
    },
    {
        input: "src/base64-string.js",
        output: {
            file: "dist/base64String.js",
            format: "umd",
            name: "Base64String",
            sourcemap: true
        },
        plugins: [
            babel({
                exclude: "node_modules/**"
            })
        ]
    },
    {
        input: "src/base64-string.js",
        output: {
            file: "dist/base64String.min.js",
            format: "umd",
            name: "Base64String"
        },
        plugins: [
            babel({
                exclude: "node_modules/**"
            }),
            uglify()
        ]
    }
]