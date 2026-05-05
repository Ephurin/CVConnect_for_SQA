<template>
  <div class="header">
    <AppBreadcrumb class="breadcrumb" />
    <!-- <AppHeaderSearch /> -->
    <AppPublicHeaderChatPopup v-if="isHr" class="chat-btn" :is-hr="true" />
    <AppHeaderNotificationBell />
    <AppHeaderAvatar />
  </div>
</template>
<script setup lang="ts">
const authStore = useAuthStore();
const { currentRole } = storeToRefs(authStore);

// console.log({ currentRole: currentRole.value });

const isHr = computed(() => {
  // console.log({ role: currentRole.value });
  return currentRole.value?.code == "HR";
});
</script>
<style lang="scss" scoped>
.header {
  width: 100%;
  height: 48px;
  min-height: 48px;
  display: flex;
  gap: 12px;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  top: 0px;
  padding-right: 20px;
  padding-left: 20px;

  .breadcrumb {
    @media (max-width: $breakpoint-lg) {
      display: none;
    }
  }

  .chat-btn {
    :deep(.btn) {
      box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
      background-color: white;
    }
    :deep(.iconify) {
      color: $text-light;
      display: block;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
  }
}
</style>
