<template>
  <div class="register-shell">
    <header class="register-header">
      <p class="eyebrow">Nuevo usuario</p>
      <h1>Crear cuenta</h1>
      <p class="sub">Regístrate para comenzar a gestionar tus finanzas.</p>
    </header>

    <v-form ref="formRef" @submit.prevent="handleSubmit" class="register-form">
      <v-row dense>
        <v-col cols="12" sm="6">
          <AppInput
            v-model="form.nombre"
            label="Nombre"
            icon="mdi-account-outline"
            placeholder="Juan"
            :rules="[rules.required, rules.minLength(2)]"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <AppInput
            v-model="form.apellido"
            label="Apellido"
            icon="mdi-account-outline"
            placeholder="Pérez"
            :rules="[rules.required, rules.minLength(2)]"
          />
        </v-col>
      </v-row>

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
        :rules="[rules.required, rules.minLength(8), rules.password]"
      />

      <AppInput
        v-model="form.confirmPassword"
        label="Confirmar contraseña"
        type="password"
        icon="mdi-lock-check-outline"
        placeholder="••••••••"
        :rules="[rules.required, rules.matchPassword]"
      />

      <AppInput
        v-model="form.telefono"
        label="Teléfono"
        type="tel"
        icon="mdi-phone-outline"
        placeholder="+34600123456"
        :rules="[rules.phone]"
      />

      <v-row dense>
        <v-col cols="12" sm="4">
          <v-select
            v-model="form.documento_tipo"
            label="Tipo Doc."
            :items="documentTypes"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-card-account-details-outline"
            :rules="[rules.required]"
            class="mb-3"
            hide-details="auto"
          />
        </v-col>
        <v-col cols="12" sm="8">
          <AppInput
            v-model="form.documento_numero"
            label="Número de documento"
            icon="mdi-numeric"
            placeholder="12345678"
            :rules="[rules.required, rules.minLength(5)]"
          />
        </v-col>
      </v-row>

      <v-alert
        v-if="registerState.isError"
        type="error"
        variant="tonal"
        density="compact"
        class="mb-4"
      >
        {{ registerState.message || "Error al crear la cuenta" }}
      </v-alert>

      <v-alert
        v-if="successMessage"
        type="success"
        variant="tonal"
        density="compact"
        class="mb-4"
      >
        {{ successMessage }}
      </v-alert>

      <AppBtn
        type="submit"
        text="Crear cuenta"
        color="teal-darken-2"
        variant="flat"
        :loading="registerState.isLoading"
      />

      <p class="login-link">
        ¿Ya tienes cuenta?
        <router-link to="/">Inicia sesión aquí</router-link>
      </p>
    </v-form>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useRegisterStore } from "@/stores/auth";
import { useAppStore } from "@/stores/app";
import { DOCUMENTO_TIPOS } from "@/models";

definePage({
  meta: {
    layout: "auth",
    publicOnly: true,
  },
});

const router = useRouter();
const registerStore = useRegisterStore();
const app = useAppStore();

const formRef = ref(null);
const successMessage = ref("");

const form = reactive({
  nombre: "",
  apellido: "",
  email: "",
  password: "",
  confirmPassword: "",
  telefono: "",
  documento_tipo: "DNI",
  documento_numero: "",
});

const documentTypes = DOCUMENTO_TIPOS;

const registerState = computed(() => app.requestState("register"));

const rules = {
  required: (v) => !!v || "Campo requerido",
  email: (v) => /.+@.+\..+/.test(v) || "Correo inválido",
  minLength: (min) => (v) =>
    (v && v.length >= min) || `Mínimo ${min} caracteres`,
  password: (v) => {
    if (!v) return true;
    if (!/[A-Z]/.test(v)) return "Debe contener al menos una mayúscula";
    if (!/[a-z]/.test(v)) return "Debe contener al menos una minúscula";
    if (!/[0-9]/.test(v)) return "Debe contener al menos un número";
    if (!/[!@#$%^&*]/.test(v))
      return "Debe contener un carácter especial (!@#$%^&*)";
    return true;
  },
  matchPassword: (v) => v === form.password || "Las contraseñas no coinciden",
  phone: (v) => !v || /^\+?[0-9]{9,15}$/.test(v) || "Teléfono inválido",
};

const handleSubmit = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  try {
    const { confirmPassword, ...userData } = form;
    await registerStore.register(userData);

    successMessage.value =
      "¡Cuenta creada exitosamente! Redirigiendo al login...";

    setTimeout(() => {
      registerStore.clearRegistration();
      router.push("/");
    }, 2000);
  } catch {
    // Error ya manejado por el store
  }
};
</script>

<style scoped>
.register-shell {
  display: grid;
  gap: 16px;
}

.register-header h1 {
  margin: 6px 0 4px;
  letter-spacing: -0.4px;
}

.register-header .eyebrow {
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 1px;
  color: #0f766e;
  margin: 0;
  font-weight: 700;
}

.register-header .sub {
  margin: 0;
  color: #475569;
}

.register-form {
  display: grid;
  gap: 6px;
}

.login-link {
  text-align: center;
  margin-top: 12px;
  color: #64748b;
  font-size: 0.875rem;
}

.login-link a {
  color: #0f766e;
  text-decoration: none;
  font-weight: 600;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>

<route lang="yaml">
meta:
  layout: auth
</route>
