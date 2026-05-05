<template>
  <div v-if="!currentRole" class="spinner"></div>
  <div v-else-if="currentRole.code != 'CANDIDATE'" class="authenticated-layout">
    <AppSidebar />
    <div class="main-content">
      <AppHeader />
      <slot />
    </div>
  </div>
  <div v-else>
    <div class="public-layout">
      <div class="main-content">
        <AppPublicHeader />
        <div class="slot-wrapper">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { PERMISSION_CHECK_TYPE } from "~/const/permission";
import type { TPermissionCheckType } from "~/types/permision";

const permittedRole: string = "ANY";
const permissionType: TPermissionCheckType = PERMISSION_CHECK_TYPE.MEMBER_TYPE;

await useLayoutPermission(permissionType, permittedRole);

const authStore = useAuthStore();
const { currentRole } = storeToRefs(authStore);

const breadcrumbStore = useBreadcrumbStore();
const { overrideItems, clearOverrideItems } = breadcrumbStore;

onBeforeMount(() => {
  const baseBreadcrumb = {
    name: "Hồ sơ cá nhân",
    icon: "i-mdi:clipboard-account",
    url: "/profile",
  };
  overrideItems([baseBreadcrumb]);
});

onBeforeUnmount(() => {
  clearOverrideItems();
});
</script>
<style lang="scss" scoped>
.spinner {
  display: flex;
  align-items: center;
  height: 100vh;
  width: 100vw;
  justify-content: center;
}

.authenticated-layout {
  display: flex;
  min-height: 100vh;
  height: 100vh;
  background-color: $color-gray-100;

  .main-content {
    max-height: 100%;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    padding: 16px 16px 16px 8px;
    flex: 1;
  }

  @media (max-width: 968px) {
    :deep(.body) {
      flex-direction: column;
      gap: 8px;

      .left,
      .right {
        width: 100%;
      }

      .btn {
        width: 360px !important;
      }
    }
  }
}

.public-layout {
  display: flex;
  min-height: 100vh;
  height: 100vh;
  max-height: 100vh;
  background-color: $color-gray-100;
  width: 100%;
  overflow: hidden;

  @media (max-width: 768px) {
    :deep(.body) {
      flex-direction: column;
      gap: 8px;

      .left,
      .right {
        width: 100%;
      }

      .btn {
        width: 360px !important;
      }
    }
  }

  :deep(.main-content) {
    width: 100%;
    max-height: 100%;
    display: flex;
    flex-direction: column;

    .slot-wrapper {
      padding: 48px 16px 16px 16px;
      flex: 1;
      min-height: 0;
      max-height: calc(100vh - 62px);
      overflow: hidden;
    }
  }
}
</style>
