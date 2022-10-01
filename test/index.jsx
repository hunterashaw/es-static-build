import 'preact/debug'
import { render } from 'preact-render-to-string'

export default {
    file: render(<div>file contents</div>),
    folderName: {
        otherFile: render(<div>otherFile contents</div>)
    }
}
