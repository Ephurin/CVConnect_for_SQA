<template>
  <div class="profile-page-wrapper">
    <div class="top">Hồ sơ cá nhân</div>
    <ModalsChangePassword
      v-model="isUpdatePasswordShow"
      @submit="isUpdatePasswordShow = false"
    />
    <ModalsChangeAvatar
      v-model="isUpdateAvatarShow"
      @submit="handleUpdateAvatar"
    />
    <ModalsUpdateProfile
      v-model="isUpdateProfileShow"
      :user-info="detail"
      @submit="handleUpdateProfile"
    />
    <div v-if="detail" class="body">
      <div class="left">
        <div class="avatar-wrapper">
          <AppAvatar :user-info="userInfo" />
          <div class="update-avatar-btn" @click="isUpdateAvatarShow = true">
            <Icon name="material-symbols:android-camera" />
          </div>
        </div>
        <div class="name">
          {{ detail.fullName }}
          <Icon
            v-if="detail.isEmailVerified"
            class="check-icon"
            name="streamline-ultimate:check-badge-bold"
            :title="'Đã xác thực email'"
          />
        </div>
        <div v-if="detail.email" class="username">
          {{ `@${detail.username}` }}
        </div>
        <AppButton
          :text="'Cập nhật'"
          class="btn"
          @click="isUpdateProfileShow = true"
        />
        <AppButton
          :text="'Đổi mật khẩu'"
          class="btn ghost"
          @click="isUpdatePasswordShow = true"
        />
      </div>
      <div class="right">
        <div class="title">Thông tin cá nhân</div>
        <div class="row">
          <div class="label">Tên đầy đủ</div>
          <div v-if="detail.fullName" class="value">{{ detail.fullName }}</div>
          <div v-else class="value blank">Không có</div>
        </div>
        <div class="row">
          <div class="label">Email</div>
          <div v-if="detail.email" class="value">{{ detail.email }}</div>
          <div v-else class="value blank">Không có</div>
        </div>
        <div class="row">
          <div class="label">SĐT</div>
          <div v-if="detail.phoneNumber" class="value">
            {{ detail.phoneNumber }}
          </div>
          <div v-else class="value blank">Không có</div>
        </div>
        <div class="row">
          <div class="label">Ngày sinh</div>
          <div v-if="detail.dateOfBirth" class="value">
            {{ detail.dateOfBirth }}
          </div>
          <div v-else class="value blank">Không có</div>
        </div>
        <div class="row">
          <div class="label">Địa chỉ</div>
          <div v-if="detail.address" class="value">
            {{ detail.address }}
          </div>
          <div v-else class="value blank">Không có</div>
        </div>
        <div class="row">
          <div class="label">Vai trò</div>
          <div v-if="detail.roles.length" class="tag-list">
            <div v-for="role of detail.roles" :key="role.id" class="tag">
              {{ role.name }}
            </div>
          </div>
          <div v-else class="value blank">Không có</div>
        </div>
        <div class="row">
          <div class="label">Phương thức truy cập</div>
          <div v-if="detail.accessMethod" class="value">
            {{ detail.accessMethod }}
          </div>
          <div v-else class="value blank">Không có</div>
        </div>
        <div class="row">
          <div class="label">Tham gia ngày</div>
          <div v-if="detail.createdAt" class="value">
            {{ formatDateTime(detail.createdAt, "DD/MM/YYYY") }}
          </div>
          <div v-else class="value blank">Không có</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import moment from "moment";

definePageMeta({
  layout: "profile-layout",
});

const { getMyProfile } = useUserApi();
const { setLoading } = useLoadingStore();

const router = useRouter();
const route = useRoute();

const { getMe } = useAuth();
const authStore = useAuthStore();
const { currentRole } = storeToRefs(authStore);

const userStore = useUserStore();
const { setUser } = userStore;

const detail = ref<any>(undefined);
const isUpdatePasswordShow = ref<boolean>(false);
const isUpdateAvatarShow = ref<boolean>(false);
const isUpdateProfileShow = ref<boolean>(false);

onBeforeMount(async () => {
  await fetchDetail();

  const isEdit = route.query.isEdit;
  if (isEdit) {
    isUpdateProfileShow.value = true;
    router.replace({ query: {} });
  }
});

const userInfo = computed(() => {
  return {
    fullName: detail.value.fullName,
    id: detail.value.id,
    avatarUrl: detail.value.avatarUrl,
  };
});

async function syncProfile() {
  // console.log("syncing");
  const infoRes = await getMe(currentRole.value!);
  // console.log({ infoRes });
  if (infoRes) {
    setUser(infoRes.data);
  }
}

async function fetchDetail() {
  setLoading(true);

  const res = await getMyProfile();
  if (res) {
    detail.value = res.data;
    if (detail.value.dateOfBirth) {
      const arr = detail.value.dateOfBirth;
      detail.value.dateOfBirth = moment([arr[0], arr[1] - 1, arr[2]]).format(
        "DD/MM/YYYY",
      );
    }
  }

  setLoading(false);
}

async function handleUpdateAvatar() {
  isUpdateAvatarShow.value = false;
  await fetchDetail();
  await syncProfile();
}

async function handleUpdateProfile() {
  isUpdateProfileShow.value = false;
  await fetchDetail();
  await syncProfile();
}
</script>
<style lang="scss" scoped>
.profile-page-wrapper {
  margin-top: 8px;
  max-height: 100%;
  display: flex;
  flex-direction: column;

  width: min(100%, 968px);
  margin-left: auto;
  margin-right: auto;

  .tag {
    font-size: 13px;
    padding: 2px 8px;
    border: 1px solid $color-gray-200;
    width: fit-content;
    border-radius: 6px;
    font-weight: 500;
  }

  .top {
    font-size: 20px;
    font-weight: 600;
    color: $text-light;
    margin-bottom: 16px;
  }

  .body {
    display: flex;
    flex-direction: row;
    gap: 12px;
  }

  .left {
    display: flex;
    flex-direction: column;
    padding: 20px;
    border-radius: 8px;
    background-color: white;
    @include box-shadow;

    align-items: center;
    width: calc((100% - 12px) * 0.35);

    .avatar-wrapper {
      position: relative;
      width: 72px;
      height: 72px;
      border-radius: 999px;
      margin-bottom: 8px;
      overflow: hidden;

      :deep(.avatar) {
        width: 72px;
        height: 72px;
        .monogram {
          font-size: 28px;
        }
      }

      .update-avatar-btn {
        position: absolute;
        bottom: 0px;
        left: 0px;

        width: 72px;
        height: 36px;
        display: none;
        align-items: center;
        justify-content: center;

        cursor: pointer;

        background-color: rgba($color-gray-900, 0.2);

        .iconify {
          font-size: 24px;
          color: $text-light;
        }
      }

      &:hover {
        .update-avatar-btn {
          display: flex;
        }
      }
    }

    .name {
      font-size: 18px;
      color: $text-light;
      font-weight: 600;

      display: flex;
      flex-direction: row;
      align-items: center;

      .check-icon {
        display: block;
        width: 20px;
        min-width: 20px;
        height: 20px;
        color: $color-success;
        margin-right: -14px;
        margin-left: 4px;
      }
    }

    .username {
      font-size: 14px;
      color: $color-gray-400;
      font-weight: 400;
    }

    .btn {
      padding: 8px 12px;
      width: 100%;
      background-color: $color-primary-500;
      color: $text-dark;
      margin-top: 8px;

      &:first-of-type {
        margin-top: 48px;
      }

      &.ghost {
        background-color: $color-gray-100;
        color: $color-primary-500;
      }
    }
  }

  .right {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 20px;
    border-radius: 8px;
    background-color: white;
    @include box-shadow;

    width: calc((100% - 12px) * 0.65);

    .title {
      font-size: 18px;
      color: $text-light;
      font-weight: 600;
      margin-bottom: 16px;
    }

    .row {
      display: flex;
      flex-direction: row;
      gap: 8px;
      font-size: 14px;

      .label {
        min-width: 220px;
        color: $color-gray-500;
      }
      .value {
        flex: 1;
        color: $text-light;
        font-weight: 500;
        word-break: break-word;

        &.blank {
          color: $color-gray-400;
          font-style: italic;
          font-weight: 400;
        }
      }
      .tag-list {
        display: flex;
        flex-direction: row;
        gap: 2px;
        flex-wrap: wrap;
      }
    }
  }
}

.profile-page {
  width: 100%;
  height: fit-content;
  max-height: 100%;

  .large-content {
    height: 6969px;
    min-height: 6969px;
  }
}
</style>
