import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import { broadcastTaskUpdate } from '../stream'

const TASKS_FILE = join(process.cwd(), 'server/data/tasks.json')

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  let data = { tasks: [] }
  if (existsSync(TASKS_FILE)) {
    data = JSON.parse(readFileSync(TASKS_FILE, 'utf-8'))
  }
  
  const newTask = {
    id: Date.now().toString(),
    title: body.title || 'Untitled Task',
    description: body.description || '',
    status: body.status || 'todo',
    createdAt: new Date().toISOString()
  }
  
  data.tasks.push(newTask)
  writeFileSync(TASKS_FILE, JSON.stringify(data, null, 2))
  
  // Broadcast update
  broadcastTaskUpdate({ type: 'task-added', task: newTask })
  
  return newTask
})
