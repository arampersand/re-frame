// /download/arm64 | /download/x64 → short-lived signed link to the DMG in R2.
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
  const arch = req.query.arch === 'x64' ? 'x64' : 'arm64'
  const file = `MyBrainBook-${VERSION}-${arch}.dmg`
  const url = await getSignedUrl(s3, new GetObjectCommand({
    Bucket: process.env.R2_BUCKET,
    Key: `mybrainbook/${file}`,
    ResponseContentDisposition: `attachment; filename="${file}"`
  }), { expiresIn: 3600 })
  res.setHeader('Cache-Control', 'no-store')
  res.redirect(302, url)
}
