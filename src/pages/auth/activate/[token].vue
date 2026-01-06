<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card rounded="xl" elevation="8" class="pa-6">
          <!-- Loading state -->
          <div v-if="isLoading" class="text-center py-8">
            <v-progress-circular
              indeterminate
              color="teal-darken-2"
              size="64"
              width="6"
            />
            <p class="text-h6 mt-4 text-grey-darken-1">
              Activando tu cuenta...
            </p>
            <p class="text-body-2 text-medium-emphasis">
              Por favor espera un momento
            </p>
          </div>

          <!-- Success state -->
          <div v-else-if="activateStore.activated" class="text-center py-8">
            <v-avatar size="80" color="success" variant="tonal" class="mb-4">
              <v-icon size="48" color="success">mdi-check-circle</v-icon>
            </v-avatar>
            <h2 class="text-h5 font-weight-bold text-grey-darken-3 mb-2">
              ¡Cuenta activada!
            </h2>
            <p class="text-body-1 text-medium-emphasis mb-6">
              {{ activateStore.message }}
            </p>
            <v-btn
              color="teal-darken-2"
              variant="flat"
              size="large"
              rounded="lg"
              block
              to="/"
            >
              <v-icon start>mdi-login</v-icon>
              Iniciar sesión
            </v-btn>
          </div>

          <!-- Error state -->
          <div v-else-if="hasError" class="text-center py-8">
            <v-avatar size="80" color="error" variant="tonal" class="mb-4">
              <v-icon size="48" color="error">mdi-alert-circle</v-icon>
            </v-avatar>
            <h2 class="text-h5 font-weight-bold text-grey-darken-3 mb-2">
              Error de activación
            </h2>
            <p class="text-body-1 text-medium-emphasis mb-2">
              {{ errorMessage }}
            </p>
            <p class="text-body-2 text-medium-emphasis mb-6">
              El enlace puede haber expirado o ya fue utilizado.
            </p>
            <v-btn
              color="teal-darken-2"
              variant="flat"
              size="large"
              rounded="lg"
              block
              class="mb-3"
              @click="retryActivation"
            >
              <v-icon start>mdi-refresh</v-icon>
              Reintentar
            </v-btn>
            <v-btn variant="text" color="teal-darken-2" to="/">
              Volver al inicio
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { useAppStore } from "@/stores/app";
import { useActivateStore } from "@/stores/auth";

const route = useRoute();
const appStore = useAppStore();
const activateStore = useActivateStore();

const token = computed(() => route.params.token);

const requestState = computed(() => appStore.requestState("activate"));
const isLoading = computed(() => requestState.value.isLoading);
const hasError = computed(() => requestState.value.hasError);
const errorMessage = computed(
  () => requestState.value.error || "No se pudo activar la cuenta"
);

const activateAccount = async () => {
  if (!token.value) return;
  try {
    await activateStore.activate(token.value);
  } catch (err) {
    console.error("Error activando cuenta:", err);
  }
};

const retryActivation = () => {
  appStore.clearRequestState("activate");
  activateAccount();
};

onMounted(() => {
  activateAccount();
});

onUnmounted(() => {
  activateStore.clearActivation();
});
</script>

<style scoped>
.v-container {
  background: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%);
}
</style>

<route lang="yaml">
meta:
  layout: auth
  requiresAuth: false
</route>
