<template>
  <q-card bordered flat class="q-my-sm opaque">
    <q-card-section class="q-py-xs q-px-sm">
      <details v-if="auth.loggedUser?.rol == 'ROLE_ADMIN'">
        <summary class="cursor-pointer">
          Información para desarrolladores:
        </summary>
        <pre
          class="text-caption bg-dark text-white overflow-auto rounded-borders"
          style="height: 40vh; min-height: 80px; resize: vertical"
        >
              <slot></slot>
            </pre>
      </details>
    </q-card-section>
  </q-card>
</template>
<script setup>
import state from "src/composables/useState.js";
import { useAuthStore } from "src/stores/authStore";
const auth = useAuthStore();
</script>
<style lang="sass">
summary
  color: var(--q-dark)
body.body--dark summary
  color:  var(--q-info)
</style>
