<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useCounterStore } from "../store/store";

const store = useCounterStore();
const { showTaskOverview, TaskId, tasks } = storeToRefs(store);
const { changeShowTaskOverview } = store;

const selectedTask = computed(() =>
  tasks.value.find((task) => task.id === TaskId.value),
);

const addComment = () => {
  if (comment.value.trim() && selectedTask.value) {
    if (!selectedTask.value.comments) {
      selectedTask.value.comments = [];
    }
    selectedTask.value.comments.push(comment.value.trim());
    comment.value = "";
  }
};

const comment = ref("");
</script>

<template>
  <Transition name="fade">
    <div
      v-if="showTaskOverview"
      class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
      @click.self="changeShowTaskOverview('')"
    >
      <div
        class="absolute right-0 top-0 h-full w-96 bg-white shadow-2xl flex flex-col"
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between px-6 py-4 border-b border-slate-200"
        >
          <h2 class="text-lg font-semibold text-slate-800 truncate pr-4">
            {{ selectedTask?.title }}
          </h2>
          <button
            @click="changeShowTaskOverview('')"
            class="text-slate-400 hover:text-slate-600 transition-colors text-2xl leading-none cursor-pointer shrink-0"
          >
            &times;
          </button>
        </div>

        <!-- Body -->
        <div class="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          <!-- Description -->
          <div>
            <p
              class="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1"
            >
              Description
            </p>
            <p class="text-sm text-slate-700 leading-relaxed">
              {{ selectedTask?.description || "No description provided." }}
            </p>
          </div>

          <!-- Assignee -->
          <div v-if="selectedTask?.user">
            <p
              class="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2"
            >
              Assignee
            </p>
            <div class="flex items-center gap-2">
              <div
                class="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold"
              >
                {{ selectedTask.user.charAt(0).toUpperCase() }}
              </div>
              <span class="text-sm text-slate-700">{{
                selectedTask.user
              }}</span>
            </div>
          </div>

          <!-- Divider -->
          <div class="border-t border-slate-100" />

          <!-- Comments -->
          <div>
            <p
              class="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3"
            >
              Comments
            </p>
            <p
              v-if="!selectedTask?.comments?.length"
              class="text-sm text-slate-400"
            >
              No comments yet.
            </p>
            <ul v-else class="space-y-2 mb-3">
              <li
                v-for="(c, i) in selectedTask.comments"
                :key="i"
                class="bg-slate-50 rounded-lg px-3 py-2 text-sm text-slate-700"
              >
                {{ c }}
              </li>
            </ul>

            <textarea
              v-model="comment"
              rows="5"
              placeholder="Add a comment..."
              class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-slate-200 flex gap-3">
          <button
            @click="changeShowTaskOverview('')"
            class="flex-1 py-2 px-4 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            :disabled="!comment.trim()"
            @click="addComment"
            class="flex-1 py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium text-white transition-colors cursor-pointer"
          >
            Add Comment
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
