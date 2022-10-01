# ESBuild Static Tool

CLI tool for statically rendering javascript applications from a single object.

## Install

`npm i -D es-static-build`

Install 'react' or 'preact' for JSX support:

`npm i preact`

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

`npx ex-static-build -i src/index.jsx -o dist`

To rebuild on file change:

`npx ex-static-build -w -i src/index.jsx -o dist`
