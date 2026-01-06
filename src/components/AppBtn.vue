<template>
  <v-btn
    :type="type"
    :color="color"
    :variant="variant"
    :size="size"
    :loading="loading"
    :disabled="disabled || loading"
    :block="block"
    class="text-none"
    @click="$emit('click', $event)"
  >
    <slot>{{ text }}</slot>
  </v-btn>
</template>

<script setup>
defineProps({
  text: { type: String, default: "" },
  type: { type: String, default: "button" },
  color: { type: String, default: "primary" },
  variant: { type: String, default: "elevated" },
  size: { type: String, default: "large" },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  block: { type: Boolean, default: true },
});

defineEmits(["click"]);
</script>
