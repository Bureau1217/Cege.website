import { createReadStream, promises as fs } from 'node:fs'
import path from 'node:path'
import { defineEventHandler, getRouterParam, sendStream, setHeader, setResponseStatus } from 'h3'

const contentRoot = process.env.KIRBY_CONTENT_DIR
  ? path.resolve(process.env.KIRBY_CONTENT_DIR)
  : path.resolve(process.cwd(), '../Cege.cms/content')

const mimeFromExt: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif'
}

const getMimeType = (filePath: string) => {
  const ext = path.extname(filePath).toLowerCase()
  return mimeFromExt[ext] || 'application/octet-stream'
}

async function findFileByUuid(dir: string, uuid: string): Promise<string | null> {
  const entries = await fs.readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      const found = await findFileByUuid(fullPath, uuid)
      if (found) return found
    } else if (entry.isFile() && entry.name.endsWith('.txt')) {
      const content = await fs.readFile(fullPath, 'utf8')
      const match = content.match(/Uuid:\s*([a-z0-9]+)/i)

      if (match && match[1] === uuid) {
        const candidate = fullPath.replace(/\.txt$/, '')
        try {
          const stats = await fs.stat(candidate)
          if (stats.isFile()) {
            return candidate
          }
        } catch {
          // Ignore missing paired file
        }
      }
    }
  }

  return null
}

export default defineEventHandler(async (event) => {
  const uuid = getRouterParam(event, 'uuid')
  if (!uuid) {
    setResponseStatus(event, 400)
    return { error: 'Missing UUID' }
  }

  try {
    const resolved = await findFileByUuid(contentRoot, uuid)

    if (!resolved) {
      setResponseStatus(event, 404)
      return { error: 'File not found' }
    }

    setHeader(event, 'Content-Type', getMimeType(resolved))
    return sendStream(event, createReadStream(resolved))
  } catch (error) {
    console.error('[file-proxy] Failed to resolve uuid', uuid, error)
    setResponseStatus(event, 500)
    return { error: 'Failed to resolve file' }
  }
})
