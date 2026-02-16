import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const TASKS_FILE = join(process.cwd(), 'server/data/tasks.json')

export default defineEventHandler(() => {
  if (!existsSync(TASKS_FILE)) {
    return { tasks: [] }
  }
  
  const data = readFileSync(TASKS_FILE, 'utf-8')
  return JSON.parse(data)
})
