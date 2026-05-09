import { copyFileSync, existsSync } from 'fs'
import { resolve } from 'path'

const shell = resolve('dist/client/_shell.html')
const index = resolve('dist/client/index.html')

if (!existsSync(shell)) {
  console.error('postbuild: dist/client/_shell.html not found — SPA prerender may have failed')
  process.exit(1)
}

copyFileSync(shell, index)
console.log('postbuild: ✓ Copied dist/client/_shell.html → dist/client/index.html')
