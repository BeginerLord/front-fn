<template>
  <div class="login-shell">
    <header class="login-header">
      <p class="eyebrow">Bienvenido</p>
      <h1>Inicia sesión</h1>
      <p class="sub">Accede a tu panel para gestionar tus finanzas.</p>
    </header>

    <v-form ref="formRef" @submit.prevent="handleSubmit" class="login-form">
      <AppInput
        v-model="form.email"
        label="Correo electrónico"
        type="email"
        icon="mdi-email-outline"
        placeholder="tu@correo.com"
        :rules="[rules.required, rules.email]"
      />

      <AppInput
        v-model="form.password"
        label="Contraseña"
        type="password"
        icon="mdi-lock-outline"
        placeholder="••••••••"
        :rules="[rules.required, rules.minLength(6)]"
      />

      <v-alert
        v-if="loginState.isError"
        type="error"
        variant="tonal"
        density="compact"
        class="mb-4"
      >
        {{ loginState.message || "Error al iniciar sesión" }}
      </v-alert>

      <AppBtn
        type="submit"
        text="Entrar"
        color="teal-darken-2"
        variant="flat"
        :loading="loginState.isLoading"
      />

      <p class="register-link">
        ¿No tienes cuenta?
        <router-link to="/register">Regístrate aquí</router-link>
      </p>
    </v-form>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useAppStore } from "@/stores/app";

definePage({
  meta: {
    layout: "auth",
    publicOnly: true, // Solo accesible si NO está autenticado
  },
});

const router = useRouter();
const auth = useAuthStore();
const app = useAppStore();

const formRef = ref(null);
const form = reactive({
  email: "",
  password: "",
});

const loginState = computed(() => app.requestState("login"));

const rules = {
  required: (v) => !!v || "Campo requerido",
  email: (v) => /.+@.+\..+/.test(v) || "Correo inválido",
  minLength: (min) => (v) =>
    (v && v.length >= min) || `Mínimo ${min} caracteres`,
};

const handleSubmit = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  try {
    await auth.login(form.email, form.password);
    router.push("/dashboard");
  } catch {
    // Error ya manejado por el store
  }
};
</script>

<style scoped>
.login-shell {
  display: grid;
  gap: 16px;
}

.login-header h1 {
  margin: 6px 0 4px;
  letter-spacing: -0.4px;
}

.login-header .eyebrow {
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 1px;
  color: #0f766e;
  margin: 0;
  font-weight: 700;
}

.login-header .sub {
  margin: 0;
  color: #475569;
}

.login-form {
  display: grid;
  gap: 10px;
}

.register-link {
  text-align: center;
  margin-top: 12px;
  color: #64748b;
  font-size: 0.875rem;
}

.register-link a {
  color: #0f766e;
  text-decoration: none;
  font-weight: 600;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>

<route lang="yaml">
meta:
  layout: auth
</route>
