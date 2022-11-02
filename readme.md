# ESBuild Static Tool

CLI tool for statically rendering javascript applications from a single object.

## Install

`npm i -D es-static-build`

Install 'react' or 'preact' for JSX support:

`npm i preact preact-render-to-string`

## Usage

Create a javascript file with an object default export:

```javascript
import 'preact/debug'
import { render } from 'preact-render-to-string'

export default {
    file: render(<div>file contents</div>),
    folderName: {
        otherFile: render(<div>otherFile contents</div>)
    }
}
```

Run CLI tool with input and output directories:

`npx es-static-build -i src/index.jsx -o dist`

To rebuild on file change:

`npx es-static-build -w -i src/index.jsx -o dist`

You can provide a JSON config file to override the default build configuration options:

esbuild-config.json:

```
{
    "loader": {
        ".gql": "text"
    }
}
```

`npx es-static-build -i src/index.jsx -o dist -c esbuild-config.json`
