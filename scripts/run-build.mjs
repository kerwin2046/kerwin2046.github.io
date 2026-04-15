import { spawnSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"

const root = process.cwd()
const apiDir = path.join(root, "app", "api")
const apiBackup = path.join(root, ".api-export-tmp")
const exportMode = process.env.EXPORT === "1"

function moveApiOut() {
  if (fs.existsSync(apiDir)) {
    fs.renameSync(apiDir, apiBackup)
  }
}

function moveApiIn() {
  if (fs.existsSync(apiBackup)) {
    if (fs.existsSync(apiDir)) {
      fs.rmSync(apiDir, { recursive: true })
    }
    fs.renameSync(apiBackup, apiDir)
  }
}

if (exportMode) {
  moveApiOut()
}

let status = 1
try {
  const result = spawnSync("npx", ["next", "build"], {
    stdio: "inherit",
    shell: true,
    cwd: root,
  })
  status = result.status ?? 1
} finally {
  if (exportMode) {
    moveApiIn()
  }
}

process.exit(status)
