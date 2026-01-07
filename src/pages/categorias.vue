<template>
  <div class="categories-page">
    <v-container class="py-6" fluid>
      <v-row class="mb-4" dense>
        <v-col cols="12" md="4">
          <AppStatCard
            icon="mdi-tag-multiple-outline"
            label="Categorías"
            :value="pagination.total || categories.length"
            subtitle="Total registradas"
            icon-bg="rgba(15,118,110,0.1)"
          />
        </v-col>
        <v-col cols="12" md="4">
          <AppStatCard
            icon="mdi-chart-bar-stacked"
            label="Stats seleccionadas"
            :value="selectedCategory ? selectedCategory.nombre || selectedCategory.name : 'Sin selección'"
            subtitle="Elige una categoría para ver stats"
            icon-color="amber-darken-3"
            icon-bg="rgba(245,158,11,0.1)"
          />
        </v-col>
      </v-row>

      <v-row align="stretch" dense>
        <v-col cols="12" lg="8">
          <CategoriesTable
            :categories="categories"
            :pagination="pagination"
            :loading="listLoading"
            @refresh="loadCategories(pagination.page)"
            @create="openCreate"
            @edit="openEdit"
            @delete="openDelete"
            @select="selectCategory"
            @page-change="loadCategories"
          />
        </v-col>
        <v-col cols="12" lg="4">
          <CategoryStatsCard
            :category="selectedCategory"
            :stats="selectedStats"
            :loading="statsLoading"
          />
        </v-col>
      </v-row>
    </v-container>

    <CategoryFormDialog
      v-model="dialog"
      :category="editingCategory"
      :loading="saveLoading"
      :error-message="errorMessage"
      @save="handleSave"
      @update:error="(v) => (errorMessage = v)"
    />

    <v-dialog v-model="deleteDialog" max-width="420">
      <v-card rounded="lg">
        <v-card-title class="d-flex align-center gap-2">
          <v-icon color="error">mdi-alert-circle-outline</v-icon>
          Confirmar eliminación
        </v-card-title>
        <v-card-text>
          ¿Eliminar la categoría
          <strong>{{ deleteTarget?.nombre || deleteTarget?.name }}</strong>?
          Esta acción no se puede deshacer.
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" variant="flat" :loading="deleteLoading" @click="confirmDelete">
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import AppStatCard from "@/components/AppStatCard.vue";
import CategoriesTable from "@/components/expense-categories/CategoriesTable.vue";
import CategoryFormDialog from "@/components/expense-categories/CategoryFormDialog.vue";
import CategoryStatsCard from "@/components/expense-categories/CategoryStatsCard.vue";
import { useExpenseCategoriesStore } from "@/stores/expense-categories";
import { useAppStore } from "@/stores/app";

definePage({
  meta: { layout: "default", requiresAuth: true },
});

const store = useExpenseCategoriesStore();
const appStore = useAppStore();

const dialog = ref(false);
const editingCategory = ref(null);
const deleteDialog = ref(false);
const deleteTarget = ref(null);
const selectedCategoryId = ref(null);
const errorMessage = ref("");

const categories = computed(() => store.categories);
const pagination = computed(() => store.pagination);
const selectedCategory = computed(() => {
  if (!selectedCategoryId.value) return null;
  return store.getById(selectedCategoryId.value);
});
const selectedStats = computed(() =>
  selectedCategoryId.value ? store.getStats(selectedCategoryId.value) : null
);

const listLoading = computed(
  () => appStore.requestState("categories:list").isLoading
);
const saveLoading = computed(() =>
  appStore.requestState("categories:create").isLoading ||
  appStore.requestState("categories:update").isLoading
);
const deleteLoading = computed(
  () => appStore.requestState("categories:delete").isLoading
);
const statsLoading = computed(
  () => appStore.requestState("categories:stats").isLoading
);

const loadCategories = async (page = 1) => {
  await store.fetchCategories({ page });
};

const openCreate = () => {
  editingCategory.value = null;
  dialog.value = true;
};

const openEdit = (cat) => {
  editingCategory.value = cat;
  dialog.value = true;
};

const handleSave = async (payload) => {
  try {
    if (editingCategory.value) {
      const id = editingCategory.value._id || editingCategory.value.id;
      await store.updateCategory(id, payload);
    } else {
      await store.createCategory(payload);
    }
    await loadCategories(pagination.value.page);
    dialog.value = false;
    editingCategory.value = null;
  } catch (err) {
    const msg = err?.response?.data?.message || "No se pudo guardar";
    errorMessage.value = msg;
  }
};

const openDelete = (cat) => {
  deleteTarget.value = cat;
  deleteDialog.value = true;
};

const confirmDelete = async () => {
  if (!deleteTarget.value) return;
  const id = deleteTarget.value._id || deleteTarget.value.id;
  await store.deleteCategory(id);
  deleteDialog.value = false;
  deleteTarget.value = null;
  if (selectedCategoryId.value === id) {
    selectedCategoryId.value = null;
  }
  await loadCategories(pagination.value.page);
};

const selectCategory = async (cat) => {
  const id = cat?._id || cat?.id;
  selectedCategoryId.value = id;
  if (id) {
    await store.fetchCategoryStats(id);
  }
};

onMounted(() => {
  loadCategories();
});
</script>

<style scoped>
.categories-page {
  background: linear-gradient(135deg, #f8fdfb 0%, #f1faf6 100%);
  min-height: 100vh;
}
</style>
