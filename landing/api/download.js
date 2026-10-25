// /download/arm64 | /download/x64 | /download/win → short-lived signed link to the installer in R2.
// The bucket stays private; R2 keys live only in Vercel env vars.
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const VERSION = '0.2.0'
const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY }
})

export default async function handler(req, res) {
  const files = {
    arm64: `MyBrainBook-${VERSION}-arm64.dmg`,
    x64: `MyBrainBook-${VERSION}-x64.dmg`,
    win: `MyBrainBook-Setup-${VERSION}-x64.exe`
  }
  const file = files[req.query.arch] ?? files.arm64
  const url = await getSignedUrl(s3, new GetObjectCommand({
    Bucket: process.env.R2_BUCKET,
    Key: `mybrainbook/${file}`,
    ResponseContentDisposition: `attachment; filename="${file}"`
  }), { expiresIn: 3600 })
  res.setHeader('Cache-Control', 'no-store')
  res.redirect(302, url)
}
