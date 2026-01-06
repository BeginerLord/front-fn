<template>
 
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

<route lang="yaml">
meta:
  layout: default
  requiresAuth: true
</route>

