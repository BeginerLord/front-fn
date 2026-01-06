<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app>
      <div class="nav-brand">
        <div class="brand-mark">ƒn</div>
        <div>
          <p class="brand-title">Finanzas</p>
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
          <v-list-item prepend-icon="mdi-account-outline" title="Mi perfil" />
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
      <slot />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const auth = useAuthStore();

const drawer = ref(true);

const userInitials = computed(() => {
  const user = auth.user;
  if (!user) return "?";
  const nombre = user.nombre?.[0] || "";
  const apellido = user.apellido?.[0] || "";
  return (nombre + apellido).toUpperCase() || "?";
});

const navItems = [
  { title: "Dashboard", icon: "mdi-view-dashboard-outline", to: "/dashboard" },
  { title: "Transacciones", icon: "mdi-swap-horizontal", to: "/transacciones" },
  { title: "Cuentas", icon: "mdi-wallet-outline", to: "/cuentas" },
  { title: "Reportes", icon: "mdi-chart-bar", to: "/reportes" },
  { title: "Configuración", icon: "mdi-cog-outline", to: "/configuracion" },
];

const handleLogout = () => {
  auth.logout();
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

.main-content {
  background: linear-gradient(135deg, #f8fdfb 0%, #f1faf6 100%);
  min-height: 100vh;
}
</style>
