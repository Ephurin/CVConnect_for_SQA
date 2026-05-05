<template>
  <div v-if="isLoading" class="loading-overlay">
    <AppSpinnerHalfCircle class="spinner" />
  </div>
  <Suspense>
    <template #default>
      <NuxtLayout>
        <NuxtLoadingIndicator color="#c90a1f" />
        <UApp :toaster="toasterConfig">
          <NuxtPage />
        </UApp>
      </NuxtLayout>
    </template>

    <template #fallback> </template>
  </Suspense>
</template>
<script setup lang="ts">
import { UApp } from "#components";
import type { ToasterProps } from "@nuxt/ui";
useHead({
  titleTemplate: (title) => {
    return title ? `${title} - CVConnect` : "CVConnect";
  },
  bodyAttrs: {
    class: "light",
  },
});
const loadingStore = useLoadingStore();
const { isLoading } = storeToRefs(loadingStore);
const toasterConfig: ToasterProps = {
  position: "bottom-right",
  progress: false,
};
</script>
<style lang="scss" scoped>
.loading-overlay {
  position: fixed;
  z-index: 999;
  background-color: rgba(black, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;

  .spinner {
    display: block;
    font-size: 32px;
  }
}
</style>
