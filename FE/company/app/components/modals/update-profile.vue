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
          :value="formInput.fullName"
          :label="'Tên đầy đủ'"
          :required="true"
          :error="formError.fullName"
          @input="handleInput('fullName', $event)"
          @blur="validateKey('fullName')"
        />
        <AppInputText
          :value="formInput.email"
          :label="'Email'"
          :required="true"
          :error="formError.email"
          @input="handleInput('email', $event)"
          @blur="validateKey('email')"
        />
        <AppInputText
          :value="formInput.phoneNumber"
          :label="'SĐT'"
          :required="false"
          :error="formError.phoneNumber"
          @input="handleInput('phoneNumber', $event)"
          @blur="validateKey('phoneNumber')"
        />
        <AppInputDatepicker
          :label="'Ngày sinh'"
          :required="false"
          :value="formInput.dateOfBirth"
          :error="''"
          :slim-error="false"
          :is-teleport="'html'"
          :placeholder="''"
          :is-range="false"
          @input="handleInput('dateOfBirth', $event)"
        />
        <AppInputText
          :value="formInput.address"
          :label="'Địa chỉ'"
          :required="false"
          :error="''"
          @input="handleInput('address', $event)"
        />
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
          class="submit-btn btn"
          :text="'Cập nhật'"
          :is-disabled="!isFormValid"
          :is-loading="isLoading"
          @click="handleSubmit"
        />
      </div>
    </template>
  </UModal>
</template>
<script setup lang="ts">
import { cloneDeep, isEqual } from "lodash";
import moment from "moment";
import { EMAIL_REGEX } from "~/const/auth";

type TProps = {
  modelValue: boolean;
  userInfo: any;
};

const props = defineProps<TProps>();

const emits = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "submit"): void;
}>();

const { updateProfile } = useUserApi();
const route = useRoute();

const formInput = ref<any>({
  fullName: "",
  email: "",
  phoneNumber: "",
  address: "",
  dateOfBirth: "",
});
const formSnapshot = ref<any>({});

const formError = ref<any>({
  fullName: "",
  email: "",
  phoneNumber: "",
});

const modalTitle = computed(() => {
  return `Cập nhật hồ sơ`;
});

const isOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emits("update:modelValue", value),
});

const isLoading = ref<boolean>(false);

const formRules = {
  fullName: [
    (input: string) => {
      if (!input.trim()) {
        formError.value.fullName = "Mời nhập tên đầy đủ";
        return false;
      }
      return true;
    },
  ],
  email: [
    (input: string) => {
      if (!input.trim()) {
        formError.value.email = "Mời nhập email";
        return false;
      }
      return true;
    },
    (input: string) => {
      const isValid = EMAIL_REGEX.test(input);
      if (!isValid) {
        formError.value.email = "Email không hợp lệ";
        return false;
      }
      return true;
    },
  ],
  phoneNumber: [
    (input: string) => {
      const trimmed = input.trim();

      if (!trimmed) {
        formError.value.phoneNumber = "";
        return true;
      }

      const vnStrictPhoneRegex = /^0\d{9}$/;

      if (!vnStrictPhoneRegex.test(trimmed)) {
        formError.value.phoneNumber = "Số điện thoại không hợp lệ";
        return false;
      }

      formError.value.phoneNumber = "";
      return true;
    },
  ],
};

function initForm() {
  formInput.value = {
    fullName: props.userInfo.fullName || "",
    email: props.userInfo.email || "",
    phoneNumber: props.userInfo.phoneNumber || "",
    address: props.userInfo.address || "",
    dateOfBirth: "",
  };
  if (props.userInfo.dateOfBirth) {
    formInput.value.dateOfBirth = moment(
      props.userInfo.dateOfBirth,
      "DD/MM/YYYY",
    ).toDate();
  }
  formSnapshot.value = cloneDeep(formInput.value);
}

function handleInput(key: string, value: any) {
  formInput.value[key] = value;
}

const validateForm = () => {
  for (const key of Object.keys(
    formInput.value,
  ) as (keyof typeof formInput.value)[]) {
    validateKey(key);
  }
};

const validateKey = (key: keyof typeof formInput.value) => {
  const input = formInput.value[key];
  const rules = formRules[key as keyof typeof formRules];
  if (!rules) {
    return;
  }
  for (const rule of rules) {
    const ok = rule(input);
    if (!ok) {
      break;
    }
  }
};

function handleCancel() {
  // Reset form
  initForm();
  emits("update:modelValue", false);
}

const isFormValid = computed(() => {
  if (isEqual(formInput.value, formSnapshot.value)) {
    return false;
  }

  for (const key of Object.keys(
    formError.value,
  ) as (keyof typeof formError.value)[]) {
    if (formError.value[key]) {
      return false;
    }
  }
  return true;
});

async function handleSubmit() {
  validateForm();

  if (!isFormValid.value) {
    return;
  }

  const payload = {
    ...formInput.value,
  };

  if (payload.dateOfBirth) {
    const formated = moment(payload.dateOfBirth).format("YYYY-MM-DD");
    if (formated != "Invalid date") {
      payload.dateOfBirth = formated;
    }
  }

  if (!payload.phoneNumber?.trim()) {
    delete payload.phoneNumber;
  }

  isLoading.value = true;
  const success = await updateProfile(payload);
  isLoading.value = false;

  if (success) {
    emits("submit");
  }
}

watch(isOpen, async (val) => {
  if (val) {
    initForm();
  }
});
</script>
<style lang="scss" scoped>
.body {
  display: flex;
  flex-direction: column;
  gap: 2px;

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
