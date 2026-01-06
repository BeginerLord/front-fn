<template>
  <v-dialog v-model="dialog" max-width="400" persistent>
    <v-card rounded="lg" color="white" class="session-dialog">
      <v-card-title class="d-flex align-center gap-3 pa-4">
        <v-avatar size="48" color="warning" variant="tonal">
          <v-icon color="warning">mdi-clock-alert-outline</v-icon>
        </v-avatar>
        <div>
          <span class="text-h6 text-grey-darken-3">Sesión por expirar</span>
          <p class="text-body-2 text-medium-emphasis mb-0">
            Tu sesión expirará pronto
          </p>
        </div>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-4 text-center">
        <v-progress-circular
          :model-value="progress"
          :size="80"
          :width="6"
          color="warning"
          class="mb-3"
        >
          <span class="text-h5 font-weight-bold">{{ countdown }}</span>
        </v-progress-circular>
        <p class="text-body-1 text-grey-darken-2 mb-0">
          ¿Deseas extender tu sesión?
        </p>
        <p class="text-body-2 text-medium-emphasis mt-1">
          De lo contrario, serás desconectado automáticamente.
        </p>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-btn variant="text" color="error" @click="handleLogout">
          Cerrar sesión
        </v-btn>
        <v-spacer />
        <v-btn
          color="primary"
          variant="flat"
          :loading="isRefreshing"
          @click="handleExtend"
        >
          <v-icon start>mdi-refresh</v-icon>
          Extender sesión
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useAppStore } from "@/stores/app";

const router = useRouter();
const auth = useAuthStore();
const appStore = useAppStore();

const dialog = ref(false);
const countdown = ref(60);
const progress = ref(100);

let sessionCheckInterval = null;
let countdownInterval = null;

const WARN_BEFORE_EXPIRY = 60 * 1000; // 60 segundos antes

const isRefreshing = computed(() => appStore.requestState("refresh").isLoading);

// === Session Management ===
const startSessionCheck = () => {
  stopSessionCheck();
  sessionCheckInterval = setInterval(() => {
    const timeLeft = auth.timeUntilExpiry;

    if (timeLeft === null || !auth.isAuthenticated) {
      stopSessionCheck();
      return;
    }

    if (timeLeft <= WARN_BEFORE_EXPIRY && timeLeft > 0 && !dialog.value) {
      showWarning();
    }

    if (timeLeft <= 0) {
      handleExpired();
    }
  }, 1000);
};

const stopSessionCheck = () => {
  if (sessionCheckInterval) {
    clearInterval(sessionCheckInterval);
    sessionCheckInterval = null;
  }
  stopCountdown();
};

const showWarning = () => {
  dialog.value = true;
  countdown.value = Math.ceil(auth.timeUntilExpiry / 1000);
  progress.value = 100;
  startCountdown();
};

const startCountdown = () => {
  stopCountdown();
  const initialSeconds = countdown.value;

  countdownInterval = setInterval(() => {
    countdown.value--;
    progress.value = (countdown.value / initialSeconds) * 100;

    if (countdown.value <= 0) {
      handleExpired();
    }
  }, 1000);
};

const stopCountdown = () => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
};

const handleExtend = async () => {
  try {
    await auth.refreshToken();
    dialog.value = false;
    stopCountdown();
  } catch (err) {
    console.error("Error extendiendo sesión:", err);
    handleExpired();
  }
};

const handleLogout = async () => {
  dialog.value = false;
  stopSessionCheck();
  await auth.logout();
  router.push("/");
};

const handleExpired = async () => {
  dialog.value = false;
  stopSessionCheck();
  await auth.logout();
  router.push("/");
};

onMounted(() => {
  if (auth.isAuthenticated) {
    startSessionCheck();
  }
});

onUnmounted(() => {
  stopSessionCheck();
});

watch(
  () => auth.isAuthenticated,
  (isAuth) => {
    if (isAuth) {
      startSessionCheck();
    } else {
      stopSessionCheck();
    }
  }
);
</script>

<style scoped>
.session-dialog {
  background: #ffffff !important;
}
</style>
