const assert = require('assert')
const fs = require('fs')

function fileIsCorrect(path, contents) {
    assert.equal(true, fs.existsSync(path))
    assert.deepStrictEqual(contents, fs.readFileSync(path, 'utf8'))
}

fileIsCorrect('./dist/file.html', '<div>file contents</div>')
fileIsCorrect(
    './dist/folderName/otherFile.html',
    '<div>otherFile contents</div>'
)

console.log('Passed test.')
