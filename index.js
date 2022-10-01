#!/usr/bin/env node
const esbuild = require('esbuild')
const { program } = require('commander')
const fs = require('fs')

async function run() {
    const options = program
        .requiredOption('-i <path>', 'Input file')
        .requiredOption('-o <path>', 'Output directory')
        .option('-w', 'Watch & rebuild on file change')
        .option('-jsx <package>', 'JSX import source', 'preact')
        .option('-ext <extension>', 'Default extension', '.html')
        .parse()
        .opts()

    const {
        i: input,
        o: output,
        w,
        Jsx: jsxImportSource,
        Ext: defaultExtension
    } = options

    function renderDirectory(directory, root) {
        if (!fs.existsSync(root)) fs.mkdirSync(root)
        for (const [name, content] of Object.entries(directory)) {
            if (typeof content === 'string') {
                fs.writeFileSync(
                    `${root}${name}${
                        name.includes('.') ? '' : defaultExtension
                    }`,
                    content
                )
                continue
            }
            if (typeof content === 'object')
                renderDirectory(content, `${root}${name}/`)
        }
    }

    function render() {
        delete require.cache[require.resolve(`./dist/temp.js`)]
        const directories = require(`./dist/temp.js`).default
        renderDirectory(
            directories,
            output.endsWith('/') ? output : `${output}/`
        )
        console.log('Rendered.')
    }

    await esbuild.build({
        outfile: './dist/temp.js',
        entryPoints: [input],
        bundle: true,
        format: 'cjs',
        sourcemap: 'inline',
        watch: w
            ? {
                  onRebuild(error) {
                      if (error) console.error(error)
                      else render()
                  }
              }
            : undefined,
        jsx: 'automatic',
        jsxImportSource
    })
    render()
}

run()
