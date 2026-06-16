// Parche: navium-ui-lib publica un CSS que hace @import "./variables.css"
// pero no incluye ese archivo en el paquete. Lo copiamos desde vendor/.
import { copyFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const src  = join(__dirname, '..', 'vendor', 'variables.css')
const dist = join(__dirname, '..', 'node_modules', 'navium-ui-lib', 'dist')
const dest = join(dist, 'variables.css')

if (existsSync(src) && existsSync(dist)) {
  copyFileSync(src, dest)
  console.log('[postinstall] variables.css copiado a navium-ui-lib/dist ✓')
} else {
  console.warn('[postinstall] no se pudo copiar variables.css (¿navium-ui-lib instalado?)')
}
