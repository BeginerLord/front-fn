<template>
  <div class="dashboard">
    <header class="dashboard__header">
      <div>
        <h1 class="dashboard__title">Hola, {{ userName }} 👋</h1>
        <p class="dashboard__subtitle">Aquí está el resumen de tus finanzas</p>
      </div>
      <v-btn
        color="teal-darken-2"
        prepend-icon="mdi-plus"
        variant="flat"
        rounded="lg"
      >
        Nueva transacción
      </v-btn>
    </header>

    <section class="dashboard__stats">
      <AppStatCard
        icon="mdi-wallet-outline"
        label="Balance total"
        value="$24,500.00"
        subtitle="Todas las cuentas"
        trend="+12.5%"
        trend-direction="up"
      />
      <AppStatCard
        icon="mdi-arrow-down"
        icon-color="green-darken-2"
        icon-bg="rgba(34, 197, 94, 0.1)"
        label="Ingresos"
        value="$8,200.00"
        subtitle="Este mes"
        trend="+8.2%"
        trend-direction="up"
      />
      <AppStatCard
        icon="mdi-arrow-up"
        icon-color="red-darken-2"
        icon-bg="rgba(239, 68, 68, 0.1)"
        label="Gastos"
        value="$3,450.00"
        subtitle="Este mes"
        trend="-3.1%"
        trend-direction="down"
      />
      <AppStatCard
        icon="mdi-piggy-bank-outline"
        icon-color="blue-darken-2"
        icon-bg="rgba(59, 130, 246, 0.1)"
        label="Ahorros"
        value="$4,750.00"
        subtitle="Meta: $10,000"
        trend="+15.3%"
        trend-direction="up"
      />
    </section>

    <section class="dashboard__grid">
      <AppCard title="Últimas transacciones" subtitle="Movimientos recientes">
        <v-list density="compact" class="transaction-list">
          <v-list-item
            v-for="(tx, i) in recentTransactions"
            :key="i"
            :prepend-icon="tx.icon"
            :title="tx.description"
            :subtitle="tx.date"
          >
            <template #append>
              <span :class="['tx-amount', tx.type]">{{ tx.amount }}</span>
            </template>
          </v-list-item>
        </v-list>
        <template #footer>
          <v-btn variant="text" color="teal-darken-2" size="small">
            Ver todas las transacciones
          </v-btn>
        </template>
      </AppCard>

      <AppCard title="Metas de ahorro" subtitle="Tu progreso actual">
        <div class="goals-list">
          <div v-for="(goal, i) in savingsGoals" :key="i" class="goal-item">
            <div class="goal-info">
              <p class="goal-name">{{ goal.name }}</p>
              <p class="goal-progress-text">
                {{ goal.current }} / {{ goal.target }}
              </p>
            </div>
            <v-progress-linear
              :model-value="goal.percent"
              color="teal-darken-2"
              rounded
              height="8"
            />
          </div>
        </div>
      </AppCard>
    </section>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useAuthStore } from "@/stores/auth";

definePage({
  meta: { layout: "default", requiresAuth: true },
});

const auth = useAuthStore();

const userName = computed(() => auth.user?.nombre || "Usuario");

const recentTransactions = [
  {
    icon: "mdi-cart-outline",
    description: "Supermercado",
    date: "Hoy, 10:30 AM",
    amount: "-$125.50",
    type: "expense",
  },
  {
    icon: "mdi-bank-transfer-in",
    description: "Depósito nómina",
    date: "Ayer, 9:00 AM",
    amount: "+$2,500.00",
    type: "income",
  },
  {
    icon: "mdi-gas-station",
    description: "Gasolina",
    date: "3 Ene, 4:15 PM",
    amount: "-$45.00",
    type: "expense",
  },
  {
    icon: "mdi-netflix",
    description: "Netflix",
    date: "2 Ene, 12:00 AM",
    amount: "-$15.99",
    type: "expense",
  },
  {
    icon: "mdi-transfer",
    description: "Transferencia recibida",
    date: "1 Ene, 6:00 PM",
    amount: "+$300.00",
    type: "income",
  },
];

const savingsGoals = [
  {
    name: "Fondo de emergencia",
    current: "$4,750",
    target: "$10,000",
    percent: 47.5,
  },
  { name: "Vacaciones", current: "$1,200", target: "$3,000", percent: 40 },
  { name: "Nuevo auto", current: "$8,500", target: "$25,000", percent: 34 },
];
</script>

<route lang="yaml">
meta:
  layout: default
  requiresAuth: true
</route>

<style scoped>
.dashboard {
  padding: clamp(16px, 3vw, 32px);
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
}

.dashboard__title {
  margin: 0;
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.5px;
}

.dashboard__subtitle {
  margin: 4px 0 0;
  color: #64748b;
}

.dashboard__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.dashboard__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 16px;
}

.transaction-list {
  background: transparent !important;
}

.tx-amount {
  font-weight: 600;
  font-size: 0.9rem;
}

.tx-amount.income {
  color: #0f766e;
}

.tx-amount.expense {
  color: #dc2626;
}

.goals-list {
  display: grid;
  gap: 20px;
}

.goal-item {
  display: grid;
  gap: 8px;
}

.goal-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.goal-name {
  margin: 0;
  font-weight: 500;
  color: #0f172a;
}

.goal-progress-text {
  margin: 0;
  font-size: 0.85rem;
  color: #64748b;
}
</style>
