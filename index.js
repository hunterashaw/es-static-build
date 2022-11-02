#!/usr/bin/env node
const esbuild = require('esbuild')
const { program } = require('commander')
const fs = require('fs')
const { resolve } = require('path')

async function run() {
    const options = program
        .requiredOption('-i <path>', 'Input file')
        .requiredOption('-o <path>', 'Output directory')
        .option(
            '-c <path>',
            'Provide additional json configuration file for esbuild.'
        )
        .option('-w', 'Watch & rebuild on file change')
        .option('-ext <extension>', 'Default extension', '.html')
        .parse()
        .opts()

    let {
        i: input,
        o: output,
        c: configPath,
        w,
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
        if (require.cache[temp]) delete require.cache[temp]
        const directory = require(temp).default
        renderDirectory(directory, output)
        console.log('Rendered.')
        try {
            fs.rmSync(temp)
        } catch (e) {}
    }

    const config = configPath
        ? JSON.parse(fs.readFileSync(configPath, 'utf8'))
        : {}
    const defaultConfig = {
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
        jsxImportSource: 'preact'
    }
    const constantKeys = ['outfile', 'entryPoints', 'watch']
    for (const key in defaultConfig)
        if (constantKeys.includes(key) || config[key] === undefined)
            config[key] = defaultConfig[key]

    const { errors } = await esbuild.build(config)
    if (errors.length) console.error(errors)
    else render()
}

run()
