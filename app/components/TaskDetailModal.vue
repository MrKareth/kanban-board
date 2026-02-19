<script setup lang="ts">
import type { Task } from '~/composables/useTasks'

interface Props {
  task: Task | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const statusColors: Record<string, string> = {
  'todo': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  'in-progress': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  'done': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'archived': 'bg-slate-500/20 text-slate-300 border-slate-500/30'
}

const statusLabels: Record<string, string> = {
  'todo': 'To Do',
  'in-progress': 'In Progress',
  'done': 'Done',
  'archived': 'Archived'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <Transition name="modal">
    <div 
      v-if="task"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="emit('close')"
    >
      <div class="bg-slate-800 rounded-xl w-full max-w-lg border border-slate-700 shadow-2xl">
        <!-- Header -->
        <div class="p-6 border-b border-slate-700">
          <div class="flex items-start justify-between gap-4">
            <h2 class="text-xl font-semibold text-white leading-tight">
              {{ task.title }}
            </h2>
            <button 
              @click="emit('close')"
              class="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors shrink-0"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Status Badge -->
          <div class="mt-3">
            <span 
              class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border"
              :class="statusColors[task.status]"
            >
              {{ statusLabels[task.status] }}
            </span>
          </div>
        </div>
        
        <!-- Content -->
        <div class="p-6">
          <!-- Description -->
          <div v-if="task.description" class="mb-6">
            <h3 class="text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              Description
            </h3>
            <p class="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
              {{ task.description }}
            </p>
          </div>
          
          <div v-else class="mb-6 text-slate-500 text-sm italic">
            No description provided
          </div>
          
          <!-- Metadata -->
          <div class="space-y-3 pt-4 border-t border-slate-700">
            <h3 class="text-sm font-medium text-slate-400 flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Details
            </h3>
            
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-slate-500">Task ID</span>
                <p class="text-slate-300 font-mono text-xs mt-0.5 truncate">{{ task.id }}</p>
              </div>
              <div>
                <span class="text-slate-500">Created</span>
                <p class="text-slate-300 mt-0.5">{{ formatDate(task.createdAt) }}</p>
              </div>
              <div v-if="task.createdBy">
                <span class="text-slate-500">Created by</span>
                <p class="mt-0.5">
                  <span 
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                    :class="task.createdBy === 'Kareth' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-emerald-500/20 text-emerald-300'"
                  >
                    {{ task.createdBy }}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="px-6 py-4 bg-slate-900/50 rounded-b-xl border-t border-slate-700">
          <button 
            @click="emit('close')"
            class="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.95) translateY(10px);
}
</style>
