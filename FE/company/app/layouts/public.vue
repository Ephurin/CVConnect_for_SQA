<template>
  <div class="public-layout">
    <div class="main-content">
      <AppPublicHeader />
      <slot />
      <ModalsUpdateProfileReminder v-model="isReminderOpen" />
    </div>
  </div>
</template>
<script setup lang="ts">
const { setLoading } = useLoadingStore();
const { verifyToken, getMe } = useAuth();
const { getMyRoles } = useRoleApi();
const userStore = useUserStore();
const { setUser } = userStore;
const authStore = useAuthStore();
const { currentRole, roles } = storeToRefs(authStore);
const { handleSetRole } = usePermission();
const { setRoles } = authStore;

const route = useRoute();
const router = useRouter();

const isReminderOpen = ref<boolean>(false);

onBeforeMount(async () => {
  setLoading(true);

  // Handle google login
  // method=google
  const method = route.query.method;
  if (method == "google") {
    const rolesRes = await getMyRoles();
    if (rolesRes) {
      setRoles(rolesRes.data);
      handleSetRole();
      const myInfoRes = await getMe(rolesRes.data[0]);
      if (myInfoRes) {
        setUser(myInfoRes.data);
        if (
          !myInfoRes.data.phoneNumber &&
          !checkDontAskAgain(myInfoRes.data.id)
        ) {
          isReminderOpen.value = true;
        }
      }
    }
    router.replace({ query: {} });
  } else {
    // Check for logged account
    const res = await verifyToken();
    if (res?.data?.isValid) {
      const rolesRes = await getMyRoles();
      if (rolesRes) {
        setRoles(rolesRes.data);
        handleSetRole();
        const myInfoRes = await getMe(rolesRes.data[0]);
        if (myInfoRes) {
          setUser(myInfoRes.data);
          if (
            !myInfoRes.data.phoneNumber &&
            !checkDontAskAgain(myInfoRes.data.id)
          ) {
            isReminderOpen.value = true;
          }
        }
      }
    }
  }

  setLoading(false);
});
</script>
<style lang="scss" scoped>
.public-layout {
  display: flex;
  min-height: 100vh;
  height: 100vh;
  max-height: 100vh;
  background-color: $color-gray-100;
  width: 100%;
  overflow: hidden;

  :deep(.main-content) {
    width: 100%;
    max-height: 100%;
    display: flex;
    flex-direction: column;
  }
}
</style>
