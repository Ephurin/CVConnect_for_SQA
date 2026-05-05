<template>
  <div class="system-admin-layout">
    <AppSidebar />
    <div class="main-content">
      <AppHeader />
      <slot />
      <ModalsUpdateProfileReminder v-model="isReminderOpen" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { PERMISSION_CHECK_TYPE } from "~/const/permission";
import type { TPermissionCheckType } from "~/types/permision";

const permittedRole: TRole = "SYSTEM_ADMIN";
const permissionType: TPermissionCheckType = PERMISSION_CHECK_TYPE.ROLE;

await useLayoutPermission(permissionType, permittedRole);

const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);
const isReminderOpen = ref<boolean>(false);

watch(
  () => userInfo.value,
  (val) => {
    if (val) {
      if (!val.phoneNumber && !checkDontAskAgain(val.id)) {
        isReminderOpen.value = true;
      }
    }
  },
);
</script>
<style lang="scss" scoped>
.system-admin-layout {
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
}
</style>
