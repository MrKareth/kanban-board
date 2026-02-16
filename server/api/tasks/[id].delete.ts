import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import { broadcastTaskUpdate } from '../stream'

const TASKS_FILE = join(process.cwd(), 'server/data/tasks.json')
const DELETED_TASKS_FILE = join(process.cwd(), 'server/data/deleted-tasks.json')

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  
  if (!existsSync(TASKS_FILE)) {
    throw createError({ statusCode: 404, message: 'Tasks file not found' })
  }
  
  const data = JSON.parse(readFileSync(TASKS_FILE, 'utf-8'))
  const taskIndex = data.tasks.findIndex((t: any) => t.id === id)
  
  if (taskIndex === -1) {
    throw createError({ statusCode: 404, message: 'Task not found' })
  }
  
  // Get the task before removing it
  const deletedTask = data.tasks[taskIndex]
  deletedTask.deletedAt = new Date().toISOString()
  
  // Save to deleted-tasks.json
  let deletedData = { tasks: [] }
  if (existsSync(DELETED_TASKS_FILE)) {
    deletedData = JSON.parse(readFileSync(DELETED_TASKS_FILE, 'utf-8'))
  }
  deletedData.tasks.push(deletedTask)
  writeFileSync(DELETED_TASKS_FILE, JSON.stringify(deletedData, null, 2))
  
  // Remove from tasks.json
  data.tasks.splice(taskIndex, 1)
  writeFileSync(TASKS_FILE, JSON.stringify(data, null, 2))
  
  // Broadcast update
  broadcastTaskUpdate({ type: 'task-deleted', taskId: id })
  
  return { success: true }
})
