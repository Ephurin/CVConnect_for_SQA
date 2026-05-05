<template>
  <div class="create-modal">
    <UModal
      v-model:open="isOpen"
      :title="modalTitle"
      :ui="{ content: 'w-[640px] max-w-[640px]' }"
    >
      <template #body>
        <div class="body">
          <div
            v-if="isLoading"
            class="spinner flex justify-center items-center h-[64px]"
          >
            <AppSpinnerHalfCircle />
          </div>
          <template v-else-if="detail">
            <div class="top-wrapper">
              <div class="top">
                <AppAvatar :user-info="userInfo" />
                <div class="info">
                  <div class="name">
                    {{ detail.fullName }}
                    <div v-if="isAdmin" class="tag ml-2 active">
                      Quản trị viên
                    </div>
                  </div>
                  <div class="info-line">
                    <div v-if="detail.email" class="line-info-block">
                      <Icon name="material-symbols:mail-outline-rounded" />
                      <div class="email-text">{{ detail.email }}</div>
                    </div>
                    <div v-if="detail.phoneNumber" class="line-info-block">
                      <Icon name="material-symbols:call-outline-rounded" />
                      <div class="email-text">{{ detail.phoneNumber }}</div>
                    </div>
                  </div>
                  <div v-if="detail.address" class="info-line">
                    <div class="line-info-block">
                      <Icon
                        name="material-symbols:location-on-outline-rounded"
                      />
                      <div class="email-text">{{ detail.address }}</div>
                    </div>
                  </div>
                  <div class="info-line mt-1">
                    <div
                      class="tag"
                      :class="{
                        active: detail.isEmailVerified,
                        inactive: !detail.isEmailVerified,
                      }"
                    >
                      {{
                        detail.isEmailVerified ? `Đã xác thực` : `Chưa xác thực`
                      }}
                    </div>
                    <div
                      class="tag"
                      :class="{
                        active: detail.isActive,
                        inactive: !detail.isActive,
                      }"
                    >
                      {{
                        detail.isActive ? `Đang hoạt động` : `Ngưng hoạt động`
                      }}
                    </div>
                  </div>
                </div>
              </div>
              <AppButton
                :text="isAdmin ? 'Tước quyền' : 'Cấp quyền quản trị'"
                class="revoke-btn"
                :is-loading="isSubmiting"
                :title="revokeBtnTooltip"
                :is-disabled="
                  !detail.isEmailVerified || currentUserInfo?.id == props.userId
                "
                @click="handleRevokeClick"
              />
            </div>
            <div class="divider"></div>
            <div class="info-block">
              <div class="info-row">
                <div class="label">Phương thức truy cập</div>
                <div class="tag-list">
                  <div
                    v-for="(method, index) of detail.accessMethods"
                    :key="index"
                    class="tag"
                  >
                    {{ method.label }}
                  </div>
                </div>
              </div>
              <div class="info-row">
                <div class="label">Vai trò</div>
                <div class="tag-list">
                  <div
                    v-for="(role, index) of detail.roles"
                    :key="index"
                    class="tag"
                  >
                    {{ role.name }}
                  </div>
                </div>
              </div>
              <div class="info-row">
                <div class="label">Ngày tạo</div>
                <div class="value">
                  {{ formatDateTime(detail.createdAt, "DD/MM/YYYY HH:mm") }}
                </div>
              </div>
              <div v-if="detail.updatedAt" class="info-row">
                <div class="label">Ngày chỉnh sửa</div>
                <div class="value">
                  {{ formatDateTime(detail.updatedAt, "DD/MM/YYYY HH:mm") }}
                </div>
              </div>
              <div v-if="detail.updatedBy" class="info-row">
                <div class="label">Người chỉnh sửa</div>
                <div class="value">
                  {{ detail.updatedBy }}
                </div>
              </div>
            </div>
            <div v-if="detail.orgMember" class="divider"></div>
            <div v-if="detail.orgMember" class="org-info-block">
              <!-- <div class="label">Thành viên của tổ chức</div> -->
              <div class="org-info-card">
                <div class="org-top">
                  <!-- <div class="logo"> -->
                  <!--   <img -->
                  <!--     :src="detail.orgMember?.org?.logoUrl ?? '/blankuser.jpg'" -->
                  <!--     alt="" -->
                  <!--   /> -->
                  <!-- </div> -->
                  <div class="info">
                    <div class="name">
                      {{ detail.orgMember?.org?.name }}
                      <Icon
                        class="link-icon"
                        name="ci:external-link"
                        @click="handleGoProfileOrg"
                      />
                    </div>
                    <div class="misc">
                      <div
                        v-if="detail.orgMember?.org?.website"
                        class="info-row-block"
                      >
                        <Icon name="mdi:web" />
                        <a
                          :href="detail.orgMember?.org?.website"
                          target="_blank"
                          class="value link"
                          >{{ detail.orgMember?.org?.website }}</a
                        >
                      </div>
                      <div class="info-row-block">
                        <Icon name="streamline-plump:office-worker-remix" />
                        <div class="value">{{ employeeCount }}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="info-row">
                  <div class="label">Tình trạng thành viên</div>
                  <div
                    class="tag"
                    :class="{
                      active: detail.orgMember?.isActive,
                      inactive: !detail.orgMember?.isActive,
                    }"
                  >
                    {{
                      detail.orgMember?.isActive
                        ? "Hoạt động"
                        : "Ngừng hoạt động"
                    }}
                  </div>
                </div>
                <div
                  v-if="detail.orgMember?.org?.description"
                  class="description-block"
                >
                  <div class="label">Mô tả doanh nghiệp</div>
                  <div
                    class="desc"
                    v-html="detail.orgMember?.org?.description || 'Không có'"
                  ></div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </template>
      <template #footer>
        <div class="footer">
          <div class="buttons">
            <AppButton
              :text="'OK'"
              class="submit-button"
              @click="handleCloseModal"
            />
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
<script setup lang="ts">
type TProps = {
  modelValue: boolean;
  userId: any;
};

const router = useRouter();

const props = defineProps<TProps>();
const emits = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "submit" | "refetch"): void;
}>();

const { getUserDetailAdmin, changeAdminStatus } = useSystemUserApi();
const { logout } = useAuth();
const userStore = useUserStore();
const { userInfo: currentUserInfo } = storeToRefs(userStore);

const isSubmiting = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const detail = ref<any>(null);

// computed getter/setter to bind v-model
const isOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emits("update:modelValue", value),
});

const isAdmin = computed(() => {
  const adminRole = detail.value.roles?.find(
    (r: any) => r.code == "SYSTEM_ADMIN",
  );

  return adminRole;
});

const modalTitle = computed(() => {
  return "Thông tin người dùng";
});

async function fetchDetails() {
  isLoading.value = true;
  const res = await getUserDetailAdmin(props.userId);
  detail.value = res.data;
  isLoading.value = false;
}

const userInfo = computed(() => {
  return {
    fullName: detail.value.fullName,
    id: detail.value.id,
    avatarUrl: detail.value.avatarUrl,
  };
});

const revokeBtnTooltip = computed(() => {
  if (!detail.value.isEmailVerified) {
    return "Người dùng cần xác thực email để được đặt làm quản trị hệ thống";
  }

  if (currentUserInfo.value?.id == props.userId) {
    return "Không thể tự tước quyền quản trị hệ thống của chính mình";
  }

  return isAdmin.value
    ? "Tước quyền quản trị viên hệ thống của thành viên này"
    : "Đặt thành viên này làm quản trị viên hệ thống";
});

const employeeCount = computed(() => {
  if (!detail.value.orgMember) {
    return "";
  }

  const from = detail.value.orgMember?.org?.staffCountFrom;
  const to = detail.value.orgMember?.org?.staffCountTo;
  if (from && to) {
    return `Từ ${from} đến ${to}`;
  }
  if (!from && to) {
    return `Từ 1 đến ${to}`;
  }
  if (from && !to) {
    return `Trên ${from}`;
  }

  return "";
});

function handleCloseModal() {
  emits("update:modelValue", false);
}

function handleGoProfileOrg() {
  const link = router.resolve({
    path: `/system-admin/organizations`,
    query: {
      targetId: detail.value.orgMember?.org?.id,
    },
  });
  window.open(link.href, "_blank");
}

async function handleRevokeClick() {
  isSubmiting.value = true;
  const res = await changeAdminStatus(props.userId, !isAdmin.value);
  isSubmiting.value = false;
  // if (isAdmin.value && currentUserInfo.value?.id == props.userId) {
  //   await logout();
  //   router.push({ path: "/auth/login" });
  //   return;
  // }
  fetchDetails();
}

watch(
  () => props.modelValue,
  async (value) => {
    if (value) {
      await fetchDetails();
    }
  },
  { immediate: true },
);
</script>
<style lang="scss" scoped>
.body {
  @include custom-scrollbar;
  max-height: 100%;

  display: flex;
  flex-direction: column;
  gap: 4px;

  .tag {
    font-size: 12px;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 999px;
    background-color: $color-gray-100;
    color: $text-light;
    width: fit-content;

    &.active {
      border: 1px solid $color-success;
      background-color: rgba($color-success, 0.1);
      color: $color-success;
      font-weight: 400;
    }

    &.inactive {
      border: 1px solid $color-danger;
      background-color: rgba($color-danger, 0.1);
      color: $color-danger;
      font-weight: 400;
    }
  }

  .divider {
    width: 100%;
    height: 1px;
    display: block;
    background-color: $color-gray-300;
  }

  .top-wrapper {
    display: flex;
    flex-direction: row;
    gap: 8px;
    justify-content: space-between;
    padding: 0px 32px;

    .revoke-btn {
      background-color: $color-primary-500;
      font-size: 14px;
      height: fit-content;
      padding: 4px 6px;
      color: $text-dark;

      &.disabled {
        background-color: $color-gray-400;
      }
    }
  }
  .top {
    display: flex;
    flex-direction: row;
    gap: 8px;
    margin-bottom: 8px;
    align-items: center;

    .avatar {
      height: 64px;
      width: 64px;

      :deep(.monogram) {
        font-size: 32px;
      }
    }

    .info {
      display: flex;
      flex-direction: column;
      gap: 2px;

      .name {
        display: flex;
        flex-direction: row;
        gap: 4px;
        font-size: 16px;
        color: $text-light;
        font-weight: 600;
      }

      .info-line {
        display: flex;
        flex-direction: row;
        gap: 16px;
        align-items: center;
        font-size: 13px;
        color: $color-gray-500;
        font-weight: 400;
        // margin-bottom: 4px;

        .line-info-block {
          display: flex;
          flex-direction: row;
          gap: 4px;
          align-items: center;
        }
      }

      .verified,
      .status {
        font-size: 13px;
        color: $color-gray-500;
        font-weight: 400;
        font-style: italic;
      }
    }
  }
  .info-block {
    padding: 0px 32px;
    display: flex;
    flex-direction: column;
    gap: 4px;

    .info-row {
      display: flex;
      width: 100%;
      flex-direction: row;
      justify-content: space-between;
      gap: 8px;
      font-size: 14px;
      .label {
        color: $color-gray-500;
      }

      .value {
        font-size: 14px;
        font-weight: 600;
        color: $text-light;
      }

      .tag-list {
        display: flex;
        flex-direction: row;
        gap: 4px;
        flex-wrap: wrap;
        justify-content: flex-end;
      }
    }
  }

  .org-info-block {
    padding: 0px 32px;
    display: flex;
    flex-direction: column;
    gap: 4px;

    .info-row {
      display: flex;
      width: 100%;
      flex-direction: row;
      justify-content: space-between;
      gap: 8px;
      font-size: 14px;
      .label {
        color: $color-gray-500;
      }

      .value {
        font-size: 14px;
        font-weight: 600;
        color: $text-light;
      }

      .tag-list {
        display: flex;
        flex-direction: row;
        gap: 4px;
        flex-wrap: wrap;
      }
    }

    .org-top {
      display: flex;
      flex-direction: row;
      gap: 8px;
      margin-bottom: 18px;
      .logo {
        height: 64px;
        width: 64px;
        min-width: 64px;
        border-radius: 4px;
        overflow: hidden;
        display: flex;
        flex-direction: row;

        img {
          object-fit: cover;
          width: 100%;
          height: 100%;
          min-width: 100%;
        }
      }

      .name {
        font-weight: 600;
        color: $text-light;

        .link-icon {
          cursor: pointer;
          color: $color-info;
        }
      }
      .misc {
        display: flex;
        flex-direction: row;
        gap: 16px;
        color: $color-gray-500;
        font-size: 14px;

        .info-row-block {
          display: flex;
          flex-direction: row;
          gap: 4px;
          align-items: center;
        }

        .iconify {
          display: inline-block;
        }
      }
    }

    .description-block {
      font-size: 14px;
      .label {
        color: $color-gray-500;
      }

      :deep(.desc) {
        font-size: 14px;
        word-break: break-word;
      }
    }
  }
}

.footer {
  width: 100%;
  height: fit-content;
  :deep(.buttons) {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;

    .cancel-button,
    .submit-button {
      padding: 4px 14px 4px 14px;

      :deep(.button-text) {
        font-size: 14px;
      }
    }

    .submit-button {
      background-color: $color-primary-400;
      color: $text-dark;

      &.disabled {
        background-color: $color-gray-400;
      }
    }
    .cancel-button {
      padding: 3px 14px 3px 14px;
      background-color: white;
      color: $color-primary-400;
      border: 1px solid $color-primary-400;
    }
  }
}
</style>
