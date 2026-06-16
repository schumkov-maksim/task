<script lang="ts" setup>
definePageMeta({ layout: "auth" });

const name = ref("");
const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);

async function submit() {
  error.value = "";
  loading.value = true;
  try {
    await $fetch("/api/auth/register", {
      method: "POST",
      body: { name: name.value, email: email.value, password: password.value },
    });
    await navigateTo("/");
  } catch (e: any) {
    error.value = e?.data?.message ?? "Registrierung fehlgeschlagen.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center px-4">
    <div class="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8">
      <div class="mb-8 text-center">
        <h1 class="text-2xl font-bold text-slate-800">Task Manager</h1>
        <p class="text-sm text-slate-500 mt-1">Konto erstellen</p>
      </div>

      <form @submit.prevent="submit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Name</label>
          <input
            v-model="name"
            type="text"
            required
            autocomplete="name"
            placeholder="Max Mustermann"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">E-Mail</label>
          <input
            v-model="email"
            type="email"
            required
            autocomplete="email"
            placeholder="name@beispiel.de"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Passwort</label>
          <input
            v-model="password"
            type="password"
            required
            autocomplete="new-password"
            minlength="8"
            placeholder="Min. 8 Zeichen"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <p v-if="error" class="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
          {{ error }}
        </p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium transition-colors cursor-pointer"
        >
          {{ loading ? "Registrieren…" : "Registrieren" }}
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-slate-500">
        Bereits ein Konto?
        <NuxtLink to="/login" class="text-indigo-600 font-medium hover:underline">
          Anmelden
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
