<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app>
      <div class="nav-brand">
        <div class="brand-mark">ƒn</div>
        <div>
          <p class="brand-title">Fi</p>
          <p class="brand-sub">Panel de control</p>
        </div>
      </div>

      <v-divider class="my-2" />

      <v-list density="compact" nav>
        <v-list-item
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          rounded="lg"
          color="teal-darken-2"
        />
      </v-list>

      <template #append>
        <div class="pa-4">
          <v-btn
            block
            variant="tonal"
            color="teal-darken-2"
            prepend-icon="mdi-logout"
            @click="handleLogout"
          >
            Cerrar sesión
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar app flat class="app-header">
      <v-app-bar-nav-icon @click="drawer = !drawer" />

      <span class="greeting">Hola, {{ fullName }} 👋</span>

      <v-spacer />

      <v-btn icon variant="text">
        <v-icon>mdi-bell-outline</v-icon>
      </v-btn>

      <v-menu>
        <template #activator="{ props }">
          <v-btn icon v-bind="props" variant="text">
            <v-avatar size="32" color="teal-darken-2">
              <span class="text-white text-body-2">{{ userInitials }}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-list density="compact">
          <v-list-item
            prepend-icon="mdi-account-outline"
            title="Mi perfil"
            @click="openProfile"
          />
          <v-list-item prepend-icon="mdi-cog-outline" title="Configuración" />
          <v-divider />
          <v-list-item
            prepend-icon="mdi-logout"
            title="Cerrar sesión"
            @click="handleLogout"
          />
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main class="main-content">
      <router-view />
    </v-main>

    <!-- Profile Dialog -->
    <v-dialog v-model="profileDialog" max-width="420">
      <v-card rounded="lg">
        <v-card-title class="d-flex align-center gap-3 pa-4">
          <v-avatar size="48" color="teal-darken-2">
            <span class="text-white text-h6">{{ userInitials }}</span>
          </v-avatar>
          <div>
            <p class="text-h6 mb-0">{{ fullName }}</p>
          </div>
        </v-card-title>
        <v-divider />
        <v-card-text v-if="profileLoading" class="text-center py-6">
          <v-progress-circular indeterminate color="teal-darken-2" />
        </v-card-text>
        <v-card-text v-else class="pa-4">
          <v-list density="compact" class="bg-transparent">
            <v-list-item v-if="userStore.me?.email">
              <template #prepend
                ><v-icon size="small">mdi-email-outline</v-icon></template
              >
              <v-list-item-title>Email</v-list-item-title>
              <v-list-item-subtitle>{{
                userStore.me.email
              }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item v-if="userStore.me?.tipo_usuario">
              <template #prepend
                ><v-icon size="small"
                  >mdi-shield-account-outline</v-icon
                ></template
              >
              <v-list-item-title>Tipo de usuario</v-list-item-title>
              <v-list-item-subtitle>{{
                userStore.me.tipo_usuario
              }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item v-if="userStore.me?.fecha_registro">
              <template #prepend
                ><v-icon size="small">mdi-calendar-outline</v-icon></template
              >
              <v-list-item-title>Fecha de registro</v-list-item-title>
              <v-list-item-subtitle>{{
                new Date(userStore.me.fecha_registro).toLocaleDateString()
              }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <template #prepend
                ><v-icon size="small"
                  >mdi-check-circle-outline</v-icon
                ></template
              >
              <v-list-item-title>Estado</v-list-item-title>
              <v-list-item-subtitle>
                <v-chip
                  :color="userStore.me?.activo ? 'success' : 'error'"
                  size="x-small"
                  label
                >
                  {{ userStore.me?.activo ? "Activo" : "Inactivo" }}
                </v-chip>
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="profileDialog = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Session Expiry Dialog -->
    <SessionExpiryDialog />
  </v-app>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useUserStore } from "@/stores/user";
import { useAppStore } from "@/stores/app";
import SessionExpiryDialog from "@/components/ui/SessionExpiryDialog.vue";

const router = useRouter();
const auth = useAuthStore();
const userStore = useUserStore();
const appStore = useAppStore();

const drawer = ref(true);
const profileDialog = ref(false);

const profileLoading = computed(
  () => appStore.requestState("users:me").isLoading
);

const openProfile = async () => {
  profileDialog.value = true;
  try {
    await userStore.fetchMe();
  } catch (err) {
    console.error("Error cargando perfil", err);
  }
};

const userInitials = computed(() => {
  const user = userStore.me || auth.user;
  if (!user) return "?";
  const nombre = user.nombre?.[0] || user.name?.[0] || "";
  const apellido = user.apellido?.[0] || "";
  return (
    (nombre + apellido).toUpperCase() || user.email?.[0]?.toUpperCase() || "?"
  );
});

const fullName = computed(() => {
  const me = userStore.me || auth.user;
  if (!me) return "Usuario";
  const name = [me.nombre, me.apellido].filter(Boolean).join(" ").trim();
  return name || me.name || me.username || "Usuario";
});

const userEmail = computed(() => {
  const me = userStore.me || auth.user;
  return me?.email || "";
});

const navItems = [
  { title: "Dashboard", icon: "mdi-view-dashboard-outline", to: "/dashboard" },
  { title: "Categorías", icon: "mdi-tag-multiple-outline", to: "/categorias" },
];

const handleLogout = async () => {
  await auth.logout();
  router.push("/");
};
</script>

<style scoped>
.nav-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
}

.brand-mark {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #0f766e;
  color: white;
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 1.1rem;
}

.brand-title {
  margin: 0;
  font-weight: 700;
  font-size: 1rem;
  color: #0f172a;
}

.brand-sub {
  margin: 0;
  font-size: 0.8rem;
  color: #64748b;
}

.app-header {
  background: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
}

.greeting {
  font-size: 1.1rem;
  font-weight: 600;
  color: #0f172a;
  margin-left: 8px;
}

.main-content {
  background: linear-gradient(135deg, #f8fdfb 0%, #f1faf6 100%);
  min-height: 100vh;
}

/* Session Dialog */
.session-dialog {
  background: #ffffff !important;
}
</style>
