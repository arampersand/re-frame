// Sign the Mac app. With a stable local identity ("mybrainbook-dev", see scripts/sign-identity.sh) macOS
// remembers keychain and microphone permissions across updates; otherwise fall back to ad-hoc.
const { execFileSync } = require('node:child_process')
const { join } = require('node:path')
exports.default = async function (ctx) {
  if (ctx.electronPlatformName !== 'darwin') return
  const app = join(ctx.appOutDir, `${ctx.packager.appInfo.productFilename}.app`)
  let identity = '-'
  try {
    if (execFileSync('security', ['find-identity', '-p', 'codesigning'], { encoding: 'utf8' }).includes('"mybrainbook-dev"')) identity = 'mybrainbook-dev'
  } catch { /* no keychain access: ad-hoc */ }
  execFileSync('codesign', ['--force', '--deep', '--sign', identity, app], { stdio: 'inherit' })
  execFileSync('codesign', ['--verify', '--deep', '--strict', app], { stdio: 'inherit' })
  console.log(`  • signed with ${identity === '-' ? 'ad-hoc identity' : identity}`)
}
