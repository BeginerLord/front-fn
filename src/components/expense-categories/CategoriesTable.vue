<template>
  <v-card
    rounded="lg"
    class="categories-table-card"
    color="white"
    theme="light"
  >
    <v-card-title
      class="d-flex flex-column flex-md-row align-start align-md-center justify-space-between pa-4 gap-3"
    >
      <div>
        <span class="text-h6">Categorías de gasto</span>
        <p class="text-body-2 text-medium-emphasis mb-0">
          {{ pagination.total }} categorías registradas
        </p>
      </div>
      <div class="header-actions">
        <v-autocomplete
          v-model="internalSelectedId"
          :items="categoryOptions"
          item-title="title"
          item-value="value"
          label="Buscar por ID"
          variant="outlined"
          density="compact"
          prepend-inner-icon="mdi-magnify"
          hide-details="auto"
          clearable
          :loading="loading"
          class="search-field"
          @update:model-value="onSelectById"
        >
          <template #item="{ props: itemProps, item }">
            <v-list-item v-bind="itemProps">
              <v-list-item-title>{{ item.title }}</v-list-item-title>
              <v-list-item-subtitle class="text-caption"
                >ID: {{ item.raw.value }}</v-list-item-subtitle
              >
            </v-list-item>
          </template>
        </v-autocomplete>
        <div class="d-flex align-center gap-2">
          <v-btn
            color="teal-darken-2"
            variant="flat"
            size="small"
            prepend-icon="mdi-plus"
            @click="$emit('create')"
          >
            Nueva categoría
          </v-btn>
          <v-btn
            icon
            variant="text"
            size="small"
            :loading="loading"
            @click="$emit('refresh')"
          >
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </div>
      </div>
    </v-card-title>

    <v-divider />

    <v-data-table
      v-if="!isMobile"
      :headers="headers"
      :items="categories"
      :loading="loading"
      :items-per-page="pagination.limit"
      class="categories-table"
      theme="light"
      hover
      hide-default-footer
    >
      <template #item.nombre="{ item }">
        <div class="d-flex align-center gap-3 py-2">
          <v-avatar size="36" color="teal-darken-2">
            <span class="text-white text-body-2">{{ getInitials(item) }}</span>
          </v-avatar>
          <div>
            <p class="mb-0 font-weight-medium">
              {{ item.nombre || item.name || "Sin nombre" }}
            </p>
            <p class="mb-0 text-body-2 text-medium-emphasis">
              {{
                item.descripcion || item.descripcion_corta || "Sin descripción"
              }}
            </p>
          </div>
        </div>
      </template>

      <template #item.codigo="{ item }">
        <span class="text-body-2 font-weight-medium">{{
          item.codigo || "-"
        }}</span>
      </template>

      <template #item.tipo="{ item }">
        <v-chip size="small" variant="tonal" color="indigo">
          {{ (item.tipo || "—").toString().toUpperCase() }}
        </v-chip>
      </template>

      <template #item.activo="{ item }">
        <v-chip
          size="small"
          :color="item.activo ? 'success' : 'error'"
          variant="flat"
        >
          {{ item.activo ? "Activo" : "Inactivo" }}
        </v-chip>
      </template>

      <template #item.createdAt="{ item }">
        <span class="text-body-2 text-medium-emphasis">
          {{
            formatDate(item.createdAt || item.updatedAt || item.fecha_creacion)
          }}
        </span>
      </template>

      <template #item.detalles="{ item }">
        <v-btn icon variant="text" size="small" @click="$emit('select', item)">
          <v-icon size="small">mdi-eye-outline</v-icon>
          <v-tooltip activator="parent" location="top">Ver stats</v-tooltip>
        </v-btn>
      </template>

      <template #item.actions="{ item }">
        <v-btn icon variant="text" size="small" @click="$emit('edit', item)">
          <v-icon size="small">mdi-pencil-outline</v-icon>
          <v-tooltip activator="parent" location="top">Editar</v-tooltip>
        </v-btn>
        <v-btn
          icon
          variant="text"
          size="small"
          color="error"
          @click="$emit('delete', item)"
        >
          <v-icon size="small">mdi-delete-outline</v-icon>
          <v-tooltip activator="parent" location="top">Eliminar</v-tooltip>
        </v-btn>
      </template>

      <template #bottom>
        <v-divider />
        <div class="d-flex align-center justify-space-between pa-4">
          <span class="text-body-2 text-medium-emphasis">
            Página {{ pagination.page }} de {{ pagination.totalPages }}
          </span>
          <v-pagination
            v-model="currentPage"
            :length="pagination.totalPages"
            :total-visible="5"
            density="comfortable"
            rounded
            size="small"
          />
        </div>
      </template>
    </v-data-table>

    <!-- Mobile -->
    <div v-else>
      <v-progress-linear v-if="loading" indeterminate color="teal-darken-2" />

      <v-list v-if="categories.length" class="pa-0">
        <template v-for="(cat, i) in categories" :key="cat._id || cat.id || i">
          <v-list-item class="py-3" @click="$emit('select', cat)">
            <template #prepend>
              <v-avatar size="40" color="teal-darken-2">
                <span class="text-white">{{ getInitials(cat) }}</span>
              </v-avatar>
            </template>

            <v-list-item-title class="font-weight-medium">
              {{ cat.nombre || cat.name || "Sin nombre" }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ cat.codigo ? `Código: ${cat.codigo}` : "Sin código" }} ·
              {{ cat.tipo ? cat.tipo.toUpperCase() : "—" }}
            </v-list-item-subtitle>

            <template #append>
              <div class="d-flex flex-column align-end gap-1">
                <v-chip
                  size="x-small"
                  :color="cat.activo ? 'success' : 'error'"
                  variant="flat"
                >
                  {{ cat.activo ? "Activo" : "Inactivo" }}
                </v-chip>
                <v-btn
                  icon
                  variant="text"
                  size="small"
                  @click.stop="$emit('edit', cat)"
                >
                  <v-icon size="small">mdi-pencil-outline</v-icon>
                </v-btn>
              </div>
            </template>
          </v-list-item>
          <v-divider v-if="i < categories.length - 1" />
        </template>
      </v-list>

      <div v-else-if="!loading" class="pa-6 text-center">
        <v-icon size="48" color="grey-lighten-1">mdi-tag-off-outline</v-icon>
        <p class="text-body-2 text-medium-emphasis mt-2">No hay categorías</p>
      </div>

      <v-divider v-if="pagination.totalPages > 1" />
      <div v-if="pagination.totalPages > 1" class="d-flex justify-center pa-4">
        <v-pagination
          v-model="currentPage"
          :length="pagination.totalPages"
          :total-visible="3"
          density="comfortable"
          rounded
          size="small"
        />
      </div>
    </div>
  </v-card>
</template>

<script setup>
import { computed } from "vue";
import { useDisplay } from "vuetify";

const props = defineProps({
  categories: { type: Array, default: () => [] },
  pagination: {
    type: Object,
    default: () => ({ page: 1, totalPages: 1, total: 0, limit: 10 }),
  },
  loading: { type: Boolean, default: false },
  categoryOptions: { type: Array, default: () => [] },
  selectedId: { type: [String, null], default: null },
});

const emit = defineEmits([
  "refresh",
  "edit",
  "delete",
  "select",
  "page-change",
  "create",
  "select-by-id",
]);

const { mdAndDown } = useDisplay();
const isMobile = computed(() => mdAndDown.value);

const headers = [
  { title: "Nombre", value: "nombre", sortable: false },
  { title: "Código", value: "codigo", sortable: false, width: 100 },
  { title: "Tipo", value: "tipo", sortable: false, width: 110 },
  { title: "Estado", value: "activo", sortable: false, width: 110 },
  { title: "Creación", value: "createdAt", sortable: false },
  { title: "Stats", value: "detalles", sortable: false, width: 90 },
  { title: "Acciones", value: "actions", sortable: false, width: 120 },
];

const currentPage = computed({
  get: () => props.pagination?.page || 1,
  set: (val) => emit("page-change", val),
});

const internalSelectedId = computed({
  get: () => props.selectedId,
  set: () => {},
});

const onSelectById = (val) => {
  emit("select-by-id", val || null);
};

const getInitials = (item) => {
  const n = item?.nombre?.[0] || item?.name?.[0] || "";
  const c = item?.codigo?.[0] || "";
  return (n + c).toUpperCase() || "?";
};

const formatDate = (date) => {
  if (!date) return "-";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString();
};
</script>

<style scoped>
.categories-table-card {
  background: #fdfefc;
  border: 1px solid rgba(15, 23, 42, 0.06);
}

.categories-table .v-data-table__tr:hover {
  background: rgba(15, 118, 110, 0.04);
}

:deep(.categories-table .v-data-table__thead) {
  background: #f4fbf6;
}

:deep(.categories-table .v-data-table__th) {
  color: #0f172a;
}

.header-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.search-field {
  min-width: 220px;
  max-width: 280px;
}

@media (max-width: 960px) {
  .header-actions {
    width: 100%;
  }
  .search-field {
    min-width: 100%;
    max-width: 100%;
  }
}
</style>
