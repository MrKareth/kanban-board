<script setup lang="ts">
import type { Task } from '~/composables/useTasks'

interface Column {
  id: string
  title: string
  color: string
}

interface Props {
  column: Column
  tasks: Task[]
}

defineProps<Props>()

const emit = defineEmits<{
  drop: [e: DragEvent]
  dragover: [e: DragEvent]
  'update-task': [id: string, updates: Partial<Task>]
  'delete-task': [id: string]
  'view-task': [id: string]
}>()
</script>

<template>
  <div 
    class="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden"
    @drop="$emit('drop', $event)"
    @dragover="$emit('dragover', $event)"
  >
    <div class="p-4 border-b border-slate-700/50 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div 
          class="w-3 h-3 rounded-full"
          :style="{ backgroundColor: column.color }"
        ></div>
        <h2 class="font-semibold text-white">{{ column.title }}</h2>
      </div>
      <span class="px-2 py-0.5 text-xs font-medium bg-slate-700 text-slate-300 rounded-full">
        {{ tasks.length }}
      </span>
    </div>
    
    <div class="p-4 space-y-3 min-h-[200px]">
      <TransitionGroup name="list">
        <TaskCard
          v-for="task in tasks"
          :key="task.id"
          :task="task"
          @update="(updates) => $emit('update-task', task.id, updates)"
          @delete="$emit('delete-task', task.id)"
          @view="$emit('view-task', task.id)"
        />
      </TransitionGroup>
      
      <div v-if="tasks.length === 0" class="text-center py-8 text-slate-500">
        <svg class="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p class="text-sm">No tasks</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
