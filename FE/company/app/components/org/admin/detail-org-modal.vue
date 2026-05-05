<template>
  <div class="create-modal">
    <UModal
      v-model:open="isOpen"
      :title="modalTitle"
      :ui="{ content: 'w-[90vw] max-w-[90vw]' }"
    >
      <template #body>
        <div class="body">
          <OrgAdminOrgDetail :org-id="props.orgId" @refetch="handleRefetch" />
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
  orgId: any;
};

const props = defineProps<TProps>();
const emits = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "submit" | "refetch"): void;
}>();

const { createIndustry } = useIndustryApi();

const isSubmiting = ref<boolean>(false);

// computed getter/setter to bind v-model
const isOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emits("update:modelValue", value),
});

const modalTitle = computed(() => {
  return "Thông tin doanh nghiệp";
});

const handleCancelClick = (event: any) => {
  event.preventDefault();
  emits("update:modelValue", false);
};

const handleSubmit = async () => {
  emits("submit");
};

function handleRefetch() {
  emits("refetch");
}

function handleCloseModal() {
  emits("update:modelValue", false);
}
</script>
<style lang="scss" scoped>
.body {
  @include custom-scrollbar;
  max-height: 100%;
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
