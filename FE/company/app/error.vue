<template>
  <div class="page404">
    <div class="notice">404 - Not Found</div>
    <div class="message">Trang không tồn tại.</div>
    <div class="row">
      <AppButton
        v-if="canGoBack"
        :text="'Đưa tôi quay lại'"
        class="button outline"
        @click="handleGoBack"
      >
        <template #icon>
          <Icon name="ic:round-arrow-back" />
        </template>
      </AppButton>
      <AppButton
        v-if="hasDefaultRoute"
        :text="'Về trang chủ'"
        class="button"
        @click="handleToHome"
      >
        <template #icon>
          <Icon name="ic:round-home" />
        </template>
      </AppButton>
    </div>
  </div>
</template>
<script setup lang="ts">
import { PERMISSION_CHECK_TYPE } from "./const/permission";
import type { TPermissionCheckType } from "./types/permision";

definePageMeta({
  layout: false,
});

const permittedRole: string = "ANY";
const permissionType: TPermissionCheckType = PERMISSION_CHECK_TYPE.ROLE;

await useLayoutPermission(permissionType, permittedRole);
const sidebarStore = useSidebarStore();
const { sidebarData } = storeToRefs(sidebarStore);

const router = useRouter();

const canGoBack = computed(() => {
  return window.history.state?.back;
});

const hasDefaultRoute = computed(() => {
  return sidebarData.value?.length > 0 && sidebarData.value?.[0]?.menuUrl;
});

function handleGoBack() {
  if (canGoBack.value) {
    router.back();
  }
}

function handleToHome() {
  if (hasDefaultRoute.value && sidebarData.value?.[0]?.menuUrl) {
    router.push({ path: sidebarData.value[0].menuUrl });
  }
}
</script>
<style lang="scss" scoped>
.page404 {
  color: $text-light;
  display: flex;
  height: 100vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  .notice {
    font-size: 26px;
    line-height: 30px;
    font-weight: 500;
  }

  .message {
    font-size: 14px;
    line-height: 20px;
    font-weight: 400;
  }

  .button {
    padding: 8px 12px 8px 8px;
    background-color: $color-primary-500;
    border: 1px solid $color-primary-500;
    color: $text-dark;

    &.outline {
      padding: 8px 12px 8px 8px;
      background-color: white;
      color: $color-primary-500;
    }
  }

  .row {
    display: flex;
    flex-direction: row;
    gap: 8px;
  }
}
</style>
