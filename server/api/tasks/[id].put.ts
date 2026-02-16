import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import { broadcastTaskUpdate } from '../stream'

const TASKS_FILE = join(process.cwd(), 'server/data/tasks.json')

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  
  if (!existsSync(TASKS_FILE)) {
    throw createError({ statusCode: 404, message: 'Tasks file not found' })
  }
  
  const data = JSON.parse(readFileSync(TASKS_FILE, 'utf-8'))
  const taskIndex = data.tasks.findIndex((t: any) => t.id === id)
  
  if (taskIndex === -1) {
    throw createError({ statusCode: 404, message: 'Task not found' })
  }
  
  data.tasks[taskIndex] = { ...data.tasks[taskIndex], ...body }
  writeFileSync(TASKS_FILE, JSON.stringify(data, null, 2))
  
  // Broadcast update
  broadcastTaskUpdate({ type: 'task-updated', task: data.tasks[taskIndex] })
  
  return data.tasks[taskIndex]
})
