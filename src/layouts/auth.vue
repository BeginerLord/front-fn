<template>
  <v-app>
    <v-main class="auth-shell">
      <div class="auth-pane form-pane">
        <header class="brand">
          <div class="brand-mark">ƒn</div>
          <div>
            <p class="brand-title">Finanzas</p>
            <p class="brand-sub">Plataforma segura</p>
          </div>
        </header>

        <div class="form-surface">
          <router-view />
        </div>
      </div>

      <div class="auth-pane art-pane">
        <div class="art-card">
          <img
            src="/login-illustration.png"
            alt="Ilustración de negocios"
            class="art-img"
          />
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<script setup>
//
</script>

<style scoped>
.auth-shell {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  min-height: 100vh;
  background: linear-gradient(135deg, #e8f8f2 0%, #d9f4ec 100%);
  color: #0f172a;
}

.auth-pane {
  position: relative;
  padding: clamp(24px, 4vw, 48px);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form-pane {
  gap: 32px;
  align-items: center;
  padding-left: clamp(48px, 8vw, 120px);
  padding-right: clamp(24px, 4vw, 48px);
}

.brand {
  display: flex;
  align-items: center;
  gap: 14px;
}

.brand-mark {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #0f766e;
  color: white;
  display: grid;
  place-items: center;
  font-weight: 700;
  letter-spacing: -0.5px;
  box-shadow: 0 10px 30px rgba(15, 118, 110, 0.18);
}

.brand-title {
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.4px;
}

.brand-sub {
  margin: 0;
  color: #475569;
  font-size: 0.95rem;
}

.form-surface {
  background: transparent;
  border-radius: 18px;
  padding: clamp(32px, 5vw, 48px);
  max-width: 520px;
  width: 100%;
  min-height: 420px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.art-pane {
  display: grid;
  place-items: center;
}

.art-card {
  position: relative;
  width: min(520px, 100%);
  border-radius: 28px;
  background: transparent;
  overflow: hidden;
  display: grid;
  place-items: center;
  padding: 24px;
}

.art-img {
  width: 100%;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 10px 30px rgba(15, 23, 42, 0.1));
}

@media (max-width: 960px) {
  .auth-shell {
    grid-template-columns: 1fr;
  }
  .art-pane {
    order: -1;
    padding: 24px;
  }
}
</style>
