<template>
  <v-card rounded="lg" class="users-table-card">
    <v-card-title class="d-flex align-center justify-space-between pa-4">
      <div>
        <span class="text-h6">Usuarios</span>
        <p class="text-body-2 text-medium-emphasis mb-0">
          {{ pagination.total }} usuarios registrados
        </p>
      </div>
      <v-btn
        icon
        variant="text"
        size="small"
        :loading="isLoading"
        @click="refresh"
      >
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </v-card-title>

    <v-divider />

    <!-- Desktop: Tabla -->
    <v-data-table
      v-if="!isMobile"
      :headers="headers"
      :items="users"
      :loading="isLoading"
      :items-per-page="pagination.limit"
      class="users-table"
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
              {{ item.nombre }} {{ item.apellido }}
            </p>
            <p class="mb-0 text-body-2 text-medium-emphasis">
              {{ item.email }}
            </p>
          </div>
        </div>
      </template>

      <template #item.documento="{ item }">
        <span class="text-body-2">
          {{ item.documento_tipo }}: {{ item.documento_numero }}
        </span>
      </template>

      <template #item.telefono="{ item }">
        <span class="text-body-2">{{ item.telefono || "-" }}</span>
      </template>

      <template #item.tipo_usuario="{ item }">
        <v-chip size="small" variant="tonal" color="primary">
          {{ item.tipo_usuario }}
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

      <template #item.fecha_registro="{ item }">
        {{ formatDate(item.fecha_registro) }}
      </template>

      <template #item.detalles="{ item }">
        <v-btn icon variant="text" size="small" @click="openDetails(item)">
          <v-icon size="small">mdi-eye-outline</v-icon>
          <v-tooltip activator="parent" location="top">Ver detalles</v-tooltip>
        </v-btn>
      </template>

      <template #item.actions="{ item }">
        <v-btn icon variant="text" size="small">
          <v-icon size="small">mdi-pencil-outline</v-icon>
        </v-btn>
        <v-btn icon variant="text" size="small" color="error">
          <v-icon size="small">mdi-delete-outline</v-icon>
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

    <!-- Mobile: Lista -->
    <div v-else>
      <v-progress-linear v-if="isLoading" indeterminate color="teal-darken-2" />

      <v-list v-if="users.length" class="pa-0">
        <template v-for="(user, i) in users" :key="user._id || i">
          <v-list-item class="py-3" @click="openDetails(user)">
            <template #prepend>
              <v-avatar size="40" color="teal-darken-2">
                <span class="text-white">{{ getInitials(user) }}</span>
              </v-avatar>
            </template>

            <v-list-item-title class="font-weight-medium">
              {{ user.nombre }} {{ user.apellido }}
            </v-list-item-title>
            <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>

            <template #append>
              <div class="d-flex flex-column align-end gap-1">
                <v-chip
                  size="x-small"
                  :color="user.activo ? 'success' : 'error'"
                  variant="flat"
                >
                  {{ user.activo ? "Activo" : "Inactivo" }}
                </v-chip>
                <span class="text-caption text-medium-emphasis">
                  {{ user.tipo_usuario }}
                </span>
              </div>
            </template>
          </v-list-item>
          <v-divider v-if="i < users.length - 1" />
        </template>
      </v-list>

      <div v-else-if="!isLoading" class="pa-6 text-center">
        <v-icon size="48" color="grey-lighten-1"
          >mdi-account-group-outline</v-icon
        >
        <p class="text-body-2 text-medium-emphasis mt-2">No hay usuarios</p>
      </div>

      <!-- Paginación mobile -->
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

    <!-- Dialog de Detalles del Usuario -->
    <v-dialog v-model="detailsDialog" max-width="500">
      <v-card
        v-if="selectedUser"
        rounded="lg"
        color="white"
        class="details-dialog"
      >
        <v-card-title class="d-flex align-center gap-3 pa-4">
          <v-avatar size="48" color="teal-darken-2">
            <span class="text-white text-h6">{{
              getInitials(selectedUser)
            }}</span>
          </v-avatar>
          <div>
            <span class="text-h6 text-grey-darken-3"
              >{{ selectedUser.nombre }} {{ selectedUser.apellido }}</span
            >
            <p class="text-body-2 text-medium-emphasis mb-0">
              Detalles del usuario
            </p>
          </div>
          <v-spacer />
          <v-btn
            icon
            variant="text"
            size="small"
            @click="detailsDialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-0">
          <v-list density="compact" class="pa-2">
            <v-list-item>
              <template #prepend>
                <v-icon size="small" color="grey">mdi-email-outline</v-icon>
              </template>
              <v-list-item-title class="text-body-2">Email</v-list-item-title>
              <v-list-item-subtitle>{{
                selectedUser.email
              }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template #prepend>
                <v-icon size="small" color="grey">mdi-account-outline</v-icon>
              </template>
              <v-list-item-title class="text-body-2"
                >Tipo de Usuario</v-list-item-title
              >
              <v-list-item-subtitle>
                <v-chip size="x-small" variant="tonal" color="primary">
                  {{ selectedUser.tipo_usuario }}
                </v-chip>
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template #prepend>
                <v-icon size="small" color="grey"
                  >mdi-card-account-details-outline</v-icon
                >
              </template>
              <v-list-item-title class="text-body-2"
                >Documento</v-list-item-title
              >
              <v-list-item-subtitle>
                {{ selectedUser.documento_tipo }}:
                {{ selectedUser.documento_numero }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template #prepend>
                <v-icon size="small" color="grey">mdi-phone-outline</v-icon>
              </template>
              <v-list-item-title class="text-body-2"
                >Teléfono</v-list-item-title
              >
              <v-list-item-subtitle>{{
                selectedUser.telefono || "No registrado"
              }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template #prepend>
                <v-icon size="small" color="grey"
                  >mdi-check-circle-outline</v-icon
                >
              </template>
              <v-list-item-title class="text-body-2">Estado</v-list-item-title>
              <v-list-item-subtitle>
                <v-chip
                  size="x-small"
                  :color="selectedUser.activo ? 'success' : 'error'"
                  variant="flat"
                >
                  {{ selectedUser.activo ? "Activo" : "Inactivo" }}
                </v-chip>
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template #prepend>
                <v-icon size="small" color="grey">mdi-calendar-outline</v-icon>
              </template>
              <v-list-item-title class="text-body-2"
                >Fecha de Registro</v-list-item-title
              >
              <v-list-item-subtitle>{{
                formatDateTime(selectedUser.fecha_registro)
              }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item v-if="selectedUser.createdAt">
              <template #prepend>
                <v-icon size="small" color="grey">mdi-clock-outline</v-icon>
              </template>
              <v-list-item-title class="text-body-2">Creado</v-list-item-title>
              <v-list-item-subtitle>{{
                formatDateTime(selectedUser.createdAt)
              }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item v-if="selectedUser.updatedAt">
              <template #prepend>
                <v-icon size="small" color="grey">mdi-update</v-icon>
              </template>
              <v-list-item-title class="text-body-2"
                >Última Actualización</v-list-item-title
              >
              <v-list-item-subtitle>{{
                formatDateTime(selectedUser.updatedAt)
              }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-3">
          <v-spacer />
          <v-btn variant="text" @click="detailsDialog = false">Cerrar</v-btn>
          <v-btn color="primary" variant="flat">
            <v-icon start size="small">mdi-pencil-outline</v-icon>
            Editar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useDisplay } from "vuetify";
import { useUserStore } from "@/stores/user";
import { useAppStore } from "@/stores/app";

const userStore = useUserStore();
const appStore = useAppStore();
const { mobile } = useDisplay();

const currentPage = ref(1);
const detailsDialog = ref(false);
const selectedUser = ref(null);

const users = computed(() => userStore.users);
const pagination = computed(() => userStore.pagination);
const isLoading = computed(() => appStore.requestState("users:list").isLoading);
const isMobile = computed(() => mobile.value);

const headers = [
  { title: "Usuario", key: "nombre", sortable: false },
  { title: "Documento", key: "documento", sortable: false },
  { title: "Teléfono", key: "telefono", sortable: false },
  { title: "Tipo", key: "tipo_usuario", sortable: false },
  { title: "Estado", key: "activo", sortable: false },
  { title: "Registro", key: "fecha_registro", sortable: false },
  { title: "Detalles", key: "detalles", sortable: false, align: "center" },
  { title: "", key: "actions", sortable: false, align: "end" },
];

const getInitials = (user) => {
  const n = user.nombre?.[0] || "";
  const a = user.apellido?.[0] || "";
  return (n + a).toUpperCase() || "?";
};

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString();
};

const formatDateTime = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleString();
};

const openDetails = (user) => {
  selectedUser.value = user;
  detailsDialog.value = true;
};

const fetchUsers = async (page = 1) => {
  try {
    await userStore.fetchUsers({ page, limit: 10 });
  } catch (err) {
    console.error("Error cargando usuarios", err);
  }
};

const refresh = () => fetchUsers(currentPage.value);

watch(currentPage, (page) => fetchUsers(page));

onMounted(() => fetchUsers(1));
</script>

<style scoped>
.users-table-card {
  overflow: hidden;
  background: #ffffff;
}

.users-table {
  background: #ffffff !important;
}

.users-table :deep(th) {
  font-weight: 600 !important;
  color: #64748b !important;
  font-size: 0.75rem !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: #f8fafc !important;
}

.users-table :deep(td) {
  color: #334155 !important;
}

.users-table :deep(tr:hover td) {
  background: #f1f5f9 !important;
}

/* Modal de detalles - tema claro */
.details-dialog {
  background: #ffffff !important;
}

.details-dialog :deep(.v-list-item-title) {
  color: #334155 !important;
}

.details-dialog :deep(.v-list-item-subtitle) {
  color: #64748b !important;
}

.details-dialog :deep(.v-list) {
  background: transparent !important;
}
</style>
