<template>
  <v-text-field
    v-model="model"
    :label="label"
    :type="type"
    :placeholder="placeholder"
    :prepend-inner-icon="icon"
    :error-messages="errorMessages"
    :disabled="disabled"
    :readonly="readonly"
    :rules="rules"
    variant="outlined"
    density="comfortable"
    hide-details="auto"
    class="mb-3"
  />
</template>

<script setup>
const model = defineModel({ type: String, default: "" });

defineProps({
  label: { type: String, default: "" },
  type: { type: String, default: "text" },
  placeholder: { type: String, default: "" },
  icon: { type: String, default: "" },
  errorMessages: { type: [String, Array], default: () => [] },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  rules: { type: Array, default: () => [] },
});
</script>
