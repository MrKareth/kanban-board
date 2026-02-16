<script setup lang="ts">
import type { Task } from '~/composables/useTasks'

interface Props {
  task: Task
}

const props = defineProps<Props>()

const emit = defineEmits<{
  update: [updates: Partial<Task>]
  delete: []
}>()

const isDragging = ref(false)
const isEditing = ref(false)
const editTitle = ref('')
const editDescription = ref('')

const handleDragStart = (e: DragEvent) => {
  isDragging.value = true
  e.dataTransfer?.setData('taskId', props.task.id)
  e.dataTransfer!.effectAllowed = 'move'
}

const handleDragEnd = () => {
  isDragging.value = false
}

const startEdit = () => {
  editTitle.value = props.task.title
  editDescription.value = props.task.description || ''
  isEditing.value = true
}

const saveEdit = () => {
  if (editTitle.value.trim()) {
    emit('update', { title: editTitle.value, description: editDescription.value })
  }
  isEditing.value = false
}
</script>

<template>
  <div 
    class="group bg-slate-700/50 border border-slate-600/50 rounded-lg p-4 cursor-grab active:cursor-grabbing hover:border-slate-500/50 transition-all"
    :class="{ 'opacity-50 scale-95': isDragging }"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
  >
    <div class="flex items-start justify-between gap-2">
      <div class="flex-1 min-w-0">
        <div v-if="isEditing" class="space-y-2">
          <input 
            v-model="editTitle"
            @keyup.escape="isEditing = false"
            class="w-full px-2 py-1 bg-slate-600 border border-slate-500 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autofocus
          />
          <textarea 
            v-model="editDescription"
            placeholder="Description..."
            rows="2"
            class="w-full px-2 py-1 bg-slate-600 border border-slate-500 rounded text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          ></textarea>
          <div class="flex gap-2">
            <button 
              @click="saveEdit"
              class="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded transition-colors"
            >
              Save
            </button>
            <button 
              @click="isEditing = false"
              class="px-3 py-1 text-slate-400 hover:text-white text-xs transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
        <template v-else>
          <h3 
            class="text-white font-medium text-sm truncate cursor-pointer hover:text-indigo-300"
            @dblclick="startEdit"
          >
            {{ task.title }}
          </h3>
          <p v-if="task.description" class="text-slate-400 text-xs mt-1 line-clamp-2">
            {{ task.description }}
          </p>
        </template>
      </div>
      
      <div v-if="!isEditing" class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          v-if="task.status !== 'archived'"
          @click="$emit('update', { status: 'archived' })"
          class="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-600 rounded transition-colors"
          title="Archive"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
        </button>
        <button 
          v-if="task.status === 'archived'"
          @click="$emit('update', { status: 'todo' })"
          class="p-1 text-slate-400 hover:text-green-400 hover:bg-slate-600 rounded transition-colors"
          title="Restore"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        </button>
        <button 
          @click="startEdit"
          class="p-1 text-slate-400 hover:text-white hover:bg-slate-600 rounded transition-colors"
          title="Edit"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button 
          @click="$emit('delete')"
          class="p-1 text-slate-400 hover:text-red-400 hover:bg-slate-600 rounded transition-colors"
          title="Delete"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
    
    <div v-if="!isEditing" class="mt-3 flex items-center justify-between">
      <span class="text-xs text-slate-500">
        {{ new Date(task.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) }}
      </span>
    </div>
  </div>
</template>
