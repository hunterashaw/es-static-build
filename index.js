#!/usr/bin/env node
const esbuild = require('esbuild')
const { program } = require('commander')
const fs = require('fs')
const { resolve } = require('path')

async function run() {
    const options = program
        .requiredOption('-i <path>', 'Input file')
        .requiredOption('-o <path>', 'Output directory')
        .option('-w', 'Watch & rebuild on file change')
        .option('-jsx <package>', 'JSX import source', 'preact')
        .option('-ext <extension>', 'Default extension', '.html')
        .parse()
        .opts()

    let {
        i: input,
        o: output,
        w,
        Jsx: jsxImportSource,
        Ext: defaultExtension
    } = options

    output = output.endsWith('/') ? output : `${output}/`
    const temp = resolve(`${output}temp.js`)

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
        delete require.cache[temp]
        const directory = require(temp).default
        renderDirectory(directory, output)
        console.log('Rendered.')
        fs.rmSync(temp)
    }

    await esbuild.build({
        outfile: temp,
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
