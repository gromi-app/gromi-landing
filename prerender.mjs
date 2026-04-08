import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function prerender() {
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    build: { ssr: true }
  })

  try {
    const { renderToString } = await import('react-dom/server')
    const { default: App } = await vite.ssrLoadModule('/src/App.jsx')
    const { createElement } = await import('react')

    const html = renderToString(createElement(App))

    const template = fs.readFileSync(path.join(__dirname, 'dist/index.html'), 'utf-8')
    const result = template.replace('<div id="root"></div>', `<div id="root">${html}</div>`)

    fs.writeFileSync(path.join(__dirname, 'dist/index.html'), result)
    console.log('✅ Prerendu généré avec succès')
  } catch (e) {
    console.warn('⚠️  Prérendu ignoré (mode interactif):', e.message)
  } finally {
    await vite.close()
  }
}

prerender()
