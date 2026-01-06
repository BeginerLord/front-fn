<template>
  <div class="dashboard">
    <p>Bienvenido al dashboard</p>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useAuthStore } from "@/stores/auth";

definePage({
  meta: { layout: "default", requiresAuth: true },
});

const auth = useAuthStore();

const userName = computed(() => auth.user?.nombre);
</script>

<style scoped>
.dashboard {
  padding: 32px;
}

.dashboard h1 {
  color: #0f172a;
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 8px;
}

.dashboard p {
  color: #64748b;
  margin: 0;
}
</style>
