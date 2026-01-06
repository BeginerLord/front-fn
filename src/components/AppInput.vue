<template>
  <v-text-field
    v-model="model"
    :label="label"
    :type="inputType"
    :placeholder="placeholder"
    :prepend-inner-icon="icon"
    :append-inner-icon="
      isPassword ? (showPassword ? 'mdi-eye-off' : 'mdi-eye') : undefined
    "
    :error-messages="errorMessages"
    :disabled="disabled"
    :readonly="readonly"
    :rules="rules"
    variant="outlined"
    density="comfortable"
    hide-details="auto"
    class="mb-3"
    @click:append-inner="togglePassword"
  />
</template>

<script setup>
import { ref, computed } from "vue";

const model = defineModel({ type: String, default: "" });

const props = defineProps({
  label: { type: String, default: "" },
  type: { type: String, default: "text" },
  placeholder: { type: String, default: "" },
  icon: { type: String, default: "" },
  errorMessages: { type: [String, Array], default: () => [] },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  rules: { type: Array, default: () => [] },
});

const showPassword = ref(false);

const isPassword = computed(() => props.type === "password");

const inputType = computed(() => {
  if (isPassword.value) {
    return showPassword.value ? "text" : "password";
  }
  return props.type;
});

const togglePassword = () => {
  if (isPassword.value) {
    showPassword.value = !showPassword.value;
  }
};
</script>
