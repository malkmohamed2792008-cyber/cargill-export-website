import { Client } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

async function main() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    console.log('No DATABASE_URL set, skipping DB table creation')
    return
  }
  const client = new Client({ connectionString })
  await client.connect()
  await client.query(`
    CREATE TABLE IF NOT EXISTS "MediaAsset" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "filename" TEXT NOT NULL,
      "originalName" TEXT NOT NULL,
      "url" TEXT NOT NULL,
      "mimeType" TEXT NOT NULL,
      "size" INTEGER NOT NULL,
      "width" INTEGER,
      "height" INTEGER,
      "altText" TEXT,
      "folder" TEXT NOT NULL DEFAULT 'general',
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `)
  console.log('MediaAsset table created or verified successfully in PostgreSQL database.')
  await client.end()
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
