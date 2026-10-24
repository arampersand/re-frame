// No Apple Developer ID yet: ad-hoc sign so Apple Silicon Macs will run the app.
const { execFileSync } = require('node:child_process')
const { join } = require('node:path')
exports.default = async function (ctx) {
  if (ctx.electronPlatformName !== 'darwin') return
  const app = join(ctx.appOutDir, `${ctx.packager.appInfo.productFilename}.app`)
  execFileSync('codesign', ['--force', '--deep', '--sign', '-', app], { stdio: 'inherit' })
  execFileSync('codesign', ['--verify', '--deep', '--strict', app], { stdio: 'inherit' })
}
