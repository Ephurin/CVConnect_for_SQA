<template>
  <UModal
    v-model:open="isOpen"
    :title="modalTitle"
    :ui="{ content: 'max-w-[640px]' }"
  >
    <template #body>
      <div class="body">
        <!-- <div v-if="validationError" class="error-notice"> -->
        <!--   {{ validationError }} -->
        <!-- </div> -->
        <AppInputText
          :value="formInput.oldPassword"
          :label="'Mật khẩu cũ'"
          :required="true"
          :error="''"
          :is-secured="true"
          :show-error="false"
          :slim-error="true"
          @input="handleInput('oldPassword', $event)"
        />
        <AppInputText
          :value="formInput.newPassword"
          :label="'Mật khẩu mới'"
          :required="true"
          :error="''"
          :is-secured="true"
          :show-error="false"
          :slim-error="true"
          @input="handleInput('newPassword', $event)"
          @blur="validateConfirm"
        />
        <AppInputText
          :value="formInput.newPasswordConf"
          :label="'Xác nhận mật khẩu mới'"
          :required="true"
          :error="formError.newPasswordConf"
          :is-secured="true"
          @input="handleInput('newPasswordConf', $event)"
          @blur="validateConfirm"
        />
        <div class="password-checklist">
          <div
            v-for="check of passwordChecklist"
            :key="check.key"
            class="checklist__item"
            :class="{ done: check.isDone }"
          >
            <Icon
              :name="check.isDone ? 'mdi:check' : 'mdi:close'"
              class="icon"
            />
            <div class="text">{{ check.text }}</div>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="modal-footer">
        <AppButton
          class="cancel-btn btn"
          :text="'Đóng'"
          @click="handleCancel"
        />
        <AppButton
          v-if="userInfo != null"
          class="submit-btn btn"
          :text="'Cập nhật'"
          :is-disabled="isSubmitDisabled"
          :is-loading="isLoading"
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

const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);
const { updatePassword } = useUserApi();
const route = useRoute();

const passwordChecklist = ref([
  {
    key: "lowercase",
    text: "Ít nhất 1 chữ thường",
    regex: /\p{Ll}/u,
    isDone: false,
  },
  {
    key: "uppercase",
    text: "Ít nhất 1 chữ hoa",
    regex: /\p{Lu}/u,
    isDone: false,
  },
  {
    key: "digit",
    text: "Ít nhất 1 chữ số",
    regex: /\d/,
    isDone: false,
  },
  {
    key: "length",
    text: "Độ dài từ 8 đến 20 ký tự",
    regex: /^.{8,20}$/,
    isDone: false,
  },
  {
    key: "nospace",
    text: "Không chứa khoảng trắng",
    regex: /^\S*$/,
    isDone: false,
  },
]);

const formInput = ref<any>({
  oldPassword: "",
  newPassword: "",
  newPasswordConf: "",
});

const formError = ref<any>({
  newPasswordConf: "",
});

const validationError = ref<any>("Mật khẩu không trùng khớp");

const modalTitle = computed(() => {
  return `Đổi mật khẩu`;
});

const isOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emits("update:modelValue", value),
});

const isLoading = ref<boolean>(false);

function resetForm() {
  formInput.value = {
    oldPassword: "",
    newPassword: "",
    newPasswordConf: "",
  };
}

function handleInput(key: string, value: any) {
  formInput.value[key] = value;

  if (key == "newPasswordConf") {
    validateConfirm();
  }
}

function validateConfirm() {
  const form = formInput.value;

  if (form.newPassword != form.newPasswordConf) {
    formError.value.newPasswordConf = "Mật khẩu xác nhận không trùng khớp";
  } else {
    formError.value.newPasswordConf = "";
  }
}

function handleCancel() {
  // Reset form
  resetForm();
  emits("update:modelValue", false);
}

const isSubmitDisabled = computed(() => {
  const form = formInput.value;

  if (!form.oldPassword || !form.newPassword || !form.newPasswordConf) {
    return true;
  }

  if (formError.value.newPasswordConf) {
    return true;
  }

  for (const cond of passwordChecklist.value) {
    if (!cond.isDone) {
      return true;
    }
  }

  return false;
});

async function handleSubmit() {
  validateConfirm();

  if (isSubmitDisabled.value) {
    return;
  }

  const payload = {
    currentPassword: formInput.value.oldPassword,
    newPassword: formInput.value.newPassword,
  };

  isLoading.value = true;
  const success = await updatePassword(payload);
  isLoading.value = false;

  if (success) {
    resetForm();
    emits("submit");
  }
}

watch(isOpen, async (val) => {
  if (val) {
    if (!userInfo.value) {
      return;
    }

    // clear form
    resetForm();
  }
});

watch(
  formInput,
  (val) => {
    passwordChecklist.value = passwordChecklist.value.map((rule) => {
      if (!val.newPassword) {
        return {
          ...rule,
          isDone: false,
        };
      }
      return {
        ...rule,
        isDone: rule.regex.test(val.newPassword),
      };
    });
  },
  { deep: true },
);
</script>
<style lang="scss" scoped>
.body {
  display: flex;
  flex-direction: column;
  gap: 8px;

  .divider {
    width: 100%;
    display: block;
    height: 1px;
    background-color: $color-gray-200;
  }

  :deep(.text-input) {
    flex: 1;
    .input {
      padding: 4px 6px;
      input {
        font-size: 14px;
      }
    }
  }

  .error-notice {
    font-size: 14px;
    color: $color-danger;
    background-color: rgba($color-danger, 0.05);
    border: 2px dashed $color-danger;
    padding: 16px;
    border-radius: 12px;
    margin-bottom: 4px;
  }

  .password-checklist {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 12px;
    line-height: 14px;
    padding-left: 8px;

    .checklist__item {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 4px;
      color: $color-danger;

      &.done {
        color: $color-success;
      }

      .icon {
        display: inline-block;
      }
    }
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
