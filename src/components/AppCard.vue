<template>
  <v-card
    class="app-card"
    :class="{ 'app-card--clickable': clickable }"
    variant="flat"
    rounded="xl"
    @click="clickable && $emit('click', $event)"
  >
    <div v-if="$slots.header || title" class="app-card__header">
      <slot name="header">
        <h3 class="app-card__title">{{ title }}</h3>
        <p v-if="subtitle" class="app-card__subtitle">{{ subtitle }}</p>
      </slot>
    </div>

    <div class="app-card__body">
      <slot />
    </div>

    <div v-if="$slots.footer" class="app-card__footer">
      <slot name="footer" />
    </div>
  </v-card>
</template>

<script setup>
defineProps({
  title: { type: String, default: "" },
  subtitle: { type: String, default: "" },
  clickable: { type: Boolean, default: false },
});

defineEmits(["click"]);
</script>

<style scoped>
.app-card {
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.06);
  transition: box-shadow 0.2s, transform 0.2s;
}

.app-card--clickable {
  cursor: pointer;
}

.app-card--clickable:hover {
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
  transform: translateY(-2px);
}

.app-card__header {
  padding: 20px 20px 0;
}

.app-card__title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #0f172a;
  letter-spacing: -0.3px;
}

.app-card__subtitle {
  margin: 4px 0 0;
  font-size: 0.85rem;
  color: #64748b;
}

.app-card__body {
  padding: 20px;
}

.app-card__footer {
  padding: 0 20px 20px;
  border-top: 1px solid rgba(15, 23, 42, 0.06);
  padding-top: 16px;
}
</style>
