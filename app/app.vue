<script setup lang="ts">
const { tasks, addTask, updateTask, deleteTask, connectWebSocket } = useTasks()

onMounted(() => {
  connectWebSocket()
})

const columns = [
  { id: 'todo', title: 'To Do', color: '#6366f1' },
  { id: 'in-progress', title: 'In Progress', color: '#f59e0b' },
  { id: 'done', title: 'Done', color: '#10b981' }
]

const getTasksByStatus = (status: string) => {
  return tasks.value.filter(t => t.status === status)
}

const newTaskTitle = ref('')
const showAddTask = ref(false)

const handleAddTask = async () => {
  if (!newTaskTitle.value.trim()) return
  await addTask({
    title: newTaskTitle.value,
    status: 'todo'
  })
  newTaskTitle.value = ''
  showAddTask.value = false
}

const handleDrop = async (e: DragEvent, status: string) => {
  e.preventDefault()
  const taskId = e.dataTransfer?.getData('taskId')
  if (taskId) {
    await updateTask(taskId, { status })
  }
}

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    <header class="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h1 class="text-xl font-semibold text-white">Kareth's Task Board</h1>
        </div>
        <button 
          @click="showAddTask = !showAddTask"
          class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Task
        </button>
      </div>
    </header>

    <!-- Add Task Modal -->
    <div v-if="showAddTask" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showAddTask = false">
      <div class="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-slate-700">
        <h2 class="text-lg font-semibold text-white mb-4">Add New Task</h2>
        <input 
          v-model="newTaskTitle"
          @keyup.enter="handleAddTask"
          type="text" 
          placeholder="Task title..."
          class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          autofocus
        />
        <div class="flex justify-end gap-3 mt-4">
          <button 
            @click="showAddTask = false"
            class="px-4 py-2 text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="handleAddTask"
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            Add Task
          </button>
        </div>
      </div>
    </div>

    <main class="max-w-7xl mx-auto px-6 py-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TaskColumn
          v-for="column in columns"
          :key="column.id"
          :column="column"
          :tasks="getTasksByStatus(column.id)"
          @drop="handleDrop($event, column.id)"
          @dragover="handleDragOver"
          @update-task="updateTask"
          @delete-task="deleteTask"
        />
      </div>
    </main>
  </div>
</template>
