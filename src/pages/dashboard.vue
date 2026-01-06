<template>
  <div class="dashboard">
    <p class="dashboard__subtitle">Bienvenido al dashboard</p>
    
    <UsersTable />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import UsersTable from "@/components/dashboard/UsersTable.vue";

definePage({
  meta: { layout: "default", requiresAuth: true },
});

const auth = useAuthStore();

const userName = computed(() => auth.user?.nombre);
</script>

<style scoped>
.dashboard {
  padding: clamp(16px, 3vw, 32px);
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard__subtitle {
  color: #64748b;
  margin: 0 0 24px;
}
</style>
