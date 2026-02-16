export interface Task {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in-progress' | 'done'
  createdAt: string
}

const tasks = ref<Task[]>([])
let ws: WebSocket | null = null
let reconnectAttempts = 0
const MAX_RECONNECT_ATTEMPTS = 5

export const useTasks = () => {
  const fetchTasks = async () => {
    try {
      const data = await $fetch<{ tasks: Task[] }>('/api/tasks')
      tasks.value = data.tasks
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    }
  }

  const connectWebSocket = () => {
    // First fetch existing tasks
    fetchTasks()

    // Then connect to WebSocket for real-time updates
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const wsUrl = `${protocol}//${window.location.host}/api/stream`
    
    const connect = () => {
      if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
        console.log('Max reconnect attempts reached, falling back to polling')
        // Fallback to polling every 5 seconds
        setInterval(fetchTasks, 5000)
        return
      }

      try {
        ws = new WebSocket(wsUrl)
        
        ws.onopen = () => {
          console.log('WebSocket connected')
          reconnectAttempts = 0
        }
        
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            handleWebSocketMessage(data)
          } catch (e) {
            console.error('Failed to parse WebSocket message:', e)
          }
        }
        
        ws.onclose = () => {
          console.log('WebSocket disconnected')
          reconnectAttempts++
          setTimeout(connect, 2000)
        }
        
        ws.onerror = (error) => {
          console.error('WebSocket error:', error)
        }
      } catch (error) {
        console.error('Failed to create WebSocket:', error)
        reconnectAttempts++
        setTimeout(connect, 2000)
      }
    }

    connect()
  }

  const handleWebSocketMessage = (data: any) => {
    switch (data.type) {
      case 'task-added':
        if (!tasks.value.find(t => t.id === data.task.id)) {
          tasks.value.push(data.task)
        }
        break
      case 'task-updated':
        const updateIndex = tasks.value.findIndex(t => t.id === data.task.id)
        if (updateIndex !== -1) {
          tasks.value[updateIndex] = data.task
        }
        break
      case 'task-deleted':
        tasks.value = tasks.value.filter(t => t.id !== data.taskId)
        break
    }
  }

  const addTask = async (task: Partial<Task>) => {
    try {
      await $fetch('/api/tasks', {
        method: 'POST',
        body: task
      })
    } catch (error) {
      console.error('Failed to add task:', error)
    }
  }

  const updateTask = async (id: string, updates: Partial<Task>) => {
    // Optimistic update
    const index = tasks.value.findIndex(t => t.id === id)
    if (index !== -1) {
      tasks.value[index] = { ...tasks.value[index], ...updates }
    }

    try {
      await $fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        body: updates
      })
    } catch (error) {
      console.error('Failed to update task:', error)
      // Revert on error
      await fetchTasks()
    }
  }

  const deleteTask = async (id: string) => {
    // Optimistic delete
    tasks.value = tasks.value.filter(t => t.id !== id)

    try {
      await $fetch(`/api/tasks/${id}`, {
        method: 'DELETE'
      })
    } catch (error) {
      console.error('Failed to delete task:', error)
      // Revert on error
      await fetchTasks()
    }
  }

  return {
    tasks: readonly(tasks),
    fetchTasks,
    connectWebSocket,
    addTask,
    updateTask,
    deleteTask
  }
}
