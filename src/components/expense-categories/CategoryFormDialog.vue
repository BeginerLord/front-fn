<template>
  <v-dialog v-model="dialog" max-width="460" persistent>
    <v-card rounded="lg" color="white" class="category-dialog">
      <v-card-title class="d-flex align-center gap-3 pa-4">
        <v-avatar size="48" color="teal-darken-2">
          <span class="text-white text-h6">{{ initials }}</span>
        </v-avatar>
        <div>
          <span class="text-h6 text-grey-darken-3">
            {{ isEdit ? "Editar categoría" : "Nueva categoría" }}
          </span>
          <p class="text-body-2 text-medium-emphasis mb-0">
            Define el nombre y la descripción
          </p>
        </div>
        <v-spacer />
        <v-btn
          icon
          variant="text"
          size="small"
          @click="close"
          :disabled="loading"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-4">
        <v-form ref="formRef" v-model="isValid" @submit.prevent="handleSubmit">
          <v-text-field
            v-model="form.codigo"
            label="Código"
            variant="outlined"
            density="comfortable"
            :rules="[rules.required, rules.minLength(2)]"
            prepend-inner-icon="mdi-identifier"
            placeholder="Ej: ALM"
            hide-details="auto"
            class="mb-3"
          />

          <v-text-field
            v-model="form.nombre"
            label="Nombre"
            variant="outlined"
            density="comfortable"
            :rules="[rules.required, rules.minLength(2)]"
            prepend-inner-icon="mdi-tag-outline"
          />

          <v-select
            v-model="form.tipo"
            :items="tipoItems"
            label="Tipo"
            variant="outlined"
            density="comfortable"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-shape"
            hide-details="auto"
            class="mb-3"
          />

          <v-textarea
            v-model="form.descripcion"
            label="Descripción"
            variant="outlined"
            density="comfortable"
            auto-grow
            rows="2"
            prepend-inner-icon="mdi-text-short"
          />
        </v-form>

        <v-alert
          v-if="errorMessage"
          type="error"
          variant="tonal"
          class="mt-3"
          closable
          @click:close="errorMessage = ''"
        >
          {{ errorMessage }}
        </v-alert>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn variant="text" @click="close" :disabled="loading"
          >Cancelar</v-btn
        >
        <v-btn
          color="teal-darken-2"
          variant="flat"
          :loading="loading"
          :disabled="!isValid"
          @click="handleSubmit"
        >
          <v-icon start size="small">mdi-content-save-outline</v-icon>
          {{ isEdit ? "Guardar cambios" : "Crear" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue";

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  category: { type: Object, default: null },
  loading: { type: Boolean, default: false },
  errorMessage: { type: String, default: "" },
});

const emit = defineEmits(["update:modelValue", "save", "update:error"]);

const formRef = ref(null);
const isValid = ref(false);
const form = reactive({
  codigo: "",
  nombre: "",
  tipo: "egreso",
  descripcion: "",
});

const tipoItems = [{ title: "Egreso", value: "egreso" }];

const dialog = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const isEdit = computed(() => !!props.category);

const rules = {
  required: (v) => !!v || "Campo requerido",
  minLength: (min) => (v) =>
    (v && v.length >= min) || `Mínimo ${min} caracteres`,
};

const initials = computed(() => {
  const n = form.nombre?.[0] || "";
  const c = form.codigo?.[0] || "";
  const combo = (n + c).trim();
  return combo ? combo.slice(0, 2).toUpperCase() : "?";
});

watch(
  () => props.category,
  (cat) => {
    form.codigo = cat?.codigo || "ALM";
    form.nombre = cat?.nombre || cat?.name || "";
    form.tipo = cat?.tipo || "egreso";
    form.descripcion = cat?.descripcion || cat?.descripcion_corta || "";
    emit("update:error", "");
  },
  { immediate: true }
);

const close = () => {
  dialog.value = false;
  emit("update:error", "");
};

const handleSubmit = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;
  emit("save", { ...form });
};
</script>

<style scoped>
.category-dialog {
  border: 1px solid rgba(15, 23, 42, 0.06);
}
</style>
