// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { Users } from './collections/Users'
import { Vendor } from './collections/Vendor'
import { Stone } from './collections/Stone'
import { Todi } from './collections/Todi'
import { TodiRaskat } from './collections/TodiRaskat'
import { Gala } from './collections/Gala'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users,Vendor,Stone,Todi,TodiRaskat,Gala],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
 db: postgresAdapter({
   pool: {
     host: process.env.DB_HOST,
     port: parseInt(process.env.DB_PORT || '6543'),
     user: process.env.DB_USER,
     password: process.env.DB_PASSWORD,
     database: process.env.DB_NAME,
     ssl: {
       rejectUnauthorized: false
     }
   }
 }),
  sharp,
  cors: ['https://*.vercel.app', 'http://localhost:3000'],
  plugins: [
    payloadCloudPlugin(),
  ],
})
