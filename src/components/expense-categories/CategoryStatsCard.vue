<template>
  <AppCard title="Estadísticas" subtitle="Basadas en la categoría seleccionada">
    <div v-if="loading" class="text-center py-6">
      <v-progress-circular indeterminate color="teal-darken-2" />
      <p class="text-body-2 text-medium-emphasis mt-2">Cargando estadísticas...</p>
    </div>

    <div v-else-if="!category">
      <p class="text-body-2 text-medium-emphasis mb-0">
        Selecciona una categoría para ver sus estadísticas.
      </p>
    </div>

    <div v-else class="stats-wrapper">
      <div class="summary">
        <p class="summary-name">{{ categorySummary.nombre }}</p>
        <p class="summary-meta">
          Código: {{ categorySummary.codigo }} · Tipo: {{ categorySummary.tipo }}
        </p>
        <p class="summary-meta">
          {{ categorySummary.descripcion }}
        </p>
        <p class="summary-meta">
          Estado: {{ categorySummary.estado }} · Creada: {{ categorySummary.creada }}
        </p>
      </div>

      <div v-if="normalizedStats && Object.keys(normalizedStats).length" class="stats-grid">
        <div
          v-for="(value, key) in normalizedStats"
          :key="key"
          class="stat-item"
        >
          <p class="stat-key">{{ key }}</p>
          <p class="stat-value">{{ value }}</p>
        </div>
      </div>

      <div v-else class="text-body-2 text-medium-emphasis">
        No hay estadísticas disponibles para esta categoría.
      </div>
    </div>
  </AppCard>
</template>

<script setup>
import { computed } from "vue";
import AppCard from "@/components/AppCard.vue";

const props = defineProps({
  category: { type: Object, default: null },
  stats: { type: Object, default: null },
  loading: { type: Boolean, default: false },
});

const categorySummary = computed(() => {
  const fromStats = props.stats?.categoria;
  const base = fromStats || props.category || {};
  return {
    nombre: base.nombre || base.name || "Sin nombre",
    codigo: base.codigo || "—",
    tipo: (base.tipo || "—").toString().toUpperCase(),
    descripcion: base.descripcion || "Sin descripción",
    estado: base.activo ? "Activa" : "Inactiva",
    creada: base.createdAt
      ? new Date(base.createdAt).toLocaleDateString()
      : "—",
  };
});

const normalizedStats = computed(() => {
  if (!props.stats || typeof props.stats !== "object") return null;

  const raw = props.stats.estadisticas || props.stats;
  if (!raw || typeof raw !== "object") return null;

  return Object.entries(raw).reduce((acc, [key, val]) => {
    const label = key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const value = typeof val === "number" ? val.toLocaleString() : val;
    acc[label] = value;
    return acc;
  }, {});
});
</script>

<style scoped>
.stats-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary {
  padding: 12px;
  border: 1px solid rgba(15, 23, 42, 0.06);
  border-radius: 10px;
  background: #f8fafc;
}

.summary-name {
  margin: 0 0 4px;
  font-weight: 700;
  color: #0f172a;
}

.summary-meta {
  margin: 0;
  color: #64748b;
  font-size: 0.9rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}

.stat-item {
  padding: 12px;
  border: 1px solid rgba(15, 23, 42, 0.06);
  border-radius: 10px;
  background: #f8fafc;
}

.stat-key {
  margin: 0 0 4px;
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 600;
}

.stat-value {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.2px;
}
</style>
