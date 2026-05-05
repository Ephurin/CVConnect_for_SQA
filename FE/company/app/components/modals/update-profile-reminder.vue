<template>
  <UModal
    v-model:open="isOpen"
    :title="'Thông báo'"
    :ui="{ content: 'max-w-[640px]' }"
  >
    <template #body>
      <div class="body">
        <div class="reminder">
          Tài khoản chưa cập nhật thông tin cá nhân, vui lòng cập nhật ngay
          <NuxtLink class="link" :to="'/profile?isEdit=true'">tại đây</NuxtLink>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="modal-footer">
        <AppButton
          class="submit-btn btn"
          :text="'Đã hiểu'"
          @click="handleSubmit"
        />
      </div>
    </template>
  </UModal>
</template>
<script setup lang="ts">
type TProps = {
  modelValue: boolean;
};

const props = defineProps<TProps>();

const emits = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "submit"): void;
}>();

const router = useRouter();

const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);

const isOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emits("update:modelValue", value),
});

async function handleSubmit() {
  emits("update:modelValue", false);
}

watch(
  () => isOpen.value,
  (val) => {
    if (!val && userInfo.value) {
      setDontAskAgain(userInfo.value.id);
    }
  },
);
</script>
<style lang="scss" scoped>
.body {
  display: flex;
  flex-direction: column;
  gap: 8px;

  .link {
    color: $color-primary-500;
    text-decoration: underline;
    cursor: pointer;
  }
}

.modal-footer {
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 8px;
  justify-content: flex-end;
}

.btn {
  font-size: 14px;
  padding: 6px 12px;

  &.cancel-btn {
    border: 1px solid $color-primary-500;
    color: $color-primary-500;
  }

  &.submit-btn {
    background-color: $color-primary-500;
    border: 1px solid $color-primary-500;
    color: $text-dark;

    &.disabled {
      background-color: $color-gray-400;
      border: 1px solid $color-gray-400;
    }
  }
}
</style>
