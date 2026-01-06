<template>
  <v-card
    class="app-stat-card"
    :class="{ 'app-stat-card--clickable': clickable }"
    variant="flat"
    rounded="xl"
    @click="clickable && $emit('click', $event)"
  >
    <div class="app-stat-card__icon" :style="{ background: iconBg }">
      <v-icon :icon="icon" :color="iconColor" size="24" />
    </div>

    <div class="app-stat-card__content">
      <p class="app-stat-card__label">{{ label }}</p>
      <p class="app-stat-card__value">{{ value }}</p>
      <p v-if="subtitle" class="app-stat-card__subtitle">{{ subtitle }}</p>
    </div>

    <div
      v-if="trend"
      class="app-stat-card__trend"
      :class="`trend--${trendDirection}`"
    >
      <v-icon
        :icon="
          trendDirection === 'up' ? 'mdi-trending-up' : 'mdi-trending-down'
        "
        size="16"
      />
      <span>{{ trend }}</span>
    </div>
  </v-card>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  icon: { type: String, default: "mdi-chart-box-outline" },
  iconColor: { type: String, default: "teal-darken-2" },
  iconBg: { type: String, default: "rgba(15, 118, 110, 0.1)" },
  label: { type: String, default: "" },
  value: { type: [String, Number], default: "" },
  subtitle: { type: String, default: "" },
  trend: { type: String, default: "" },
  trendDirection: { type: String, default: "up" },
  clickable: { type: Boolean, default: false },
});

defineEmits(["click"]);
</script>

<style scoped>
.app-stat-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.06);
  transition: box-shadow 0.2s, transform 0.2s;
}

.app-stat-card--clickable {
  cursor: pointer;
}

.app-stat-card--clickable:hover {
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
  transform: translateY(-2px);
}

.app-stat-card__icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.app-stat-card__content {
  flex: 1;
  min-width: 0;
}

.app-stat-card__label {
  margin: 0;
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 500;
}

.app-stat-card__value {
  margin: 4px 0 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.5px;
}

.app-stat-card__subtitle {
  margin: 4px 0 0;
  font-size: 0.8rem;
  color: #94a3b8;
}

.app-stat-card__trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
}

.trend--up {
  color: #0f766e;
  background: rgba(15, 118, 110, 0.1);
}

.trend--down {
  color: #dc2626;
  background: rgba(220, 38, 38, 0.1);
}
</style>
