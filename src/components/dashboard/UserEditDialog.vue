<template>
  <v-dialog v-model="dialog" max-width="450" persistent>
    <v-card rounded="lg" color="white" class="edit-dialog">
      <v-card-title class="d-flex align-center gap-3 pa-4">
        <v-avatar size="48" color="teal-darken-2">
          <span class="text-white text-h6">{{ getInitials }}</span>
        </v-avatar>
        <div>
          <span class="text-h6 text-grey-darken-3">Editar Usuario</span>
          <p class="text-body-2 text-medium-emphasis mb-0">
            Modifica los datos del usuario
          </p>
        </div>
        <v-spacer />
        <v-btn
          icon
          variant="text"
          size="small"
          @click="close"
          :disabled="isLoading"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-4">
        <v-form
          ref="formRef"
          v-model="isFormValid"
          @submit.prevent="handleSubmit"
        >
          <v-row dense>
            <!-- Nombre -->
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.nombre"
                label="Nombre"
                variant="outlined"
                density="comfortable"
                :rules="[rules.required]"
                prepend-inner-icon="mdi-account-outline"
              />
            </v-col>

            <!-- Apellido -->
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.apellido"
                label="Apellido"
                variant="outlined"
                density="comfortable"
                :rules="[rules.required]"
                prepend-inner-icon="mdi-account-outline"
              />
            </v-col>

            <!-- Teléfono -->
            <v-col cols="12">
              <v-text-field
                v-model="form.telefono"
                label="Teléfono"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-phone-outline"
                placeholder="+34600123456"
              />
            </v-col>

            <!-- Avatar URL -->
            <v-col cols="12">
              <v-text-field
                v-model="form.avatar"
                label="URL del Avatar"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-image-outline"
                placeholder="https://ejemplo.com/avatar.jpg"
                hint="URL de la imagen de perfil (opcional)"
                persistent-hint
              />
            </v-col>
          </v-row>
        </v-form>

        <!-- Info: campos no editables -->
        <v-alert type="info" variant="tonal" density="compact" class="mt-3">
          <span class="text-body-2">
            Email, documento y tipo de usuario no son editables.
          </span>
        </v-alert>
      </v-card-text>

      <!-- Mensaje de error -->
      <v-alert
        v-if="errorMessage"
        type="error"
        variant="tonal"
        closable
        class="mx-4 mb-2"
        @click:close="errorMessage = ''"
      >
        {{ errorMessage }}
      </v-alert>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn variant="text" @click="close" :disabled="isLoading">
          Cancelar
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          :loading="isLoading"
          :disabled="!isFormValid"
          @click="handleSubmit"
        >
          <v-icon start size="small">mdi-content-save-outline</v-icon>
          Guardar Cambios
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useUserStore } from "@/stores/user";
import { useAppStore } from "@/stores/app";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  user: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["update:modelValue", "saved"]);

const userStore = useUserStore();
const appStore = useAppStore();

const formRef = ref(null);
const isFormValid = ref(false);
const errorMessage = ref("");

// Solo campos que la API permite actualizar
const form = ref({
  nombre: "",
  apellido: "",
  telefono: "",
  avatar: "",
});

const rules = {
  required: (v) => !!v || "Este campo es requerido",
};

const dialog = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const isLoading = computed(
  () => appStore.requestState("users:update").isLoading
);

const getInitials = computed(() => {
  const n = form.value.nombre?.[0] || "";
  const a = form.value.apellido?.[0] || "";
  return (n + a).toUpperCase() || "?";
});

// Cargar datos del usuario cuando se abre el dialog
watch(
  () => props.user,
  (user) => {
    if (user) {
      form.value = {
        nombre: user.nombre || "",
        apellido: user.apellido || "",
        telefono: user.telefono || "",
        avatar: user.avatar || "",
      };
      errorMessage.value = "";
    }
  },
  { immediate: true }
);

const close = () => {
  dialog.value = false;
  errorMessage.value = "";
};

const handleSubmit = async () => {
  if (!formRef.value) return;

  const { valid } = await formRef.value.validate();
  if (!valid) return;

  try {
    errorMessage.value = "";
    const userId = props.user?._id || props.user?.id;

    // Solo enviar campos permitidos por la API
    const payload = {
      nombre: form.value.nombre,
      apellido: form.value.apellido,
      telefono: form.value.telefono,
    };

    // Solo incluir avatar si tiene valor
    if (form.value.avatar) {
      payload.avatar = form.value.avatar;
    }

    await userStore.updateUser(userId, payload);

    emit("saved");
    close();
  } catch (err) {
    console.error("Error actualizando usuario:", err);
    errorMessage.value =
      err?.response?.data?.message ||
      err?.message ||
      "Error al guardar los cambios";
  }
};
</script>

<style scoped>
.edit-dialog {
  background: #ffffff !important;
}

.edit-dialog :deep(.v-field) {
  color: #334155;
}

.edit-dialog :deep(.v-field__input) {
  color: #334155 !important;
}

.edit-dialog :deep(.v-label) {
  color: #64748b;
}
</style>
