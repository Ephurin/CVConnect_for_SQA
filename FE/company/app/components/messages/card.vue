<template>
  <div class="message-card">
    <div v-if="props.data.hasMessageUnread" class="unseen"></div>
    <div class="title">
      <span :title="props.data.jobAd.title" class="title-text">{{
        props.data.jobAd.title
      }}</span>
      <Icon
        class="external-link"
        name="ci:external-link"
        @click="handleViewDetailJob"
      />
    </div>
    <div class="top row space-between">
      <div class="logo-section">
        <div v-if="!props.isHr" class="logo">
          <img :src="props.data.org?.logoUrl" alt="Logo công ty" />
        </div>
        <div class="info-section">
          <div class="company-name">
            {{
              !props.isHr
                ? props.data.org.name
                : props.data.candidateInfo.fullName
            }}
          </div>
          <span v-if="lastMessage" class="last-message">{{ lastMessage }}</span>
          <span v-if="lastMessage" class="message-timestamp">{{
            relativeTime
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
type TProps = {
  data: any;
  isHr: boolean;
};

const router = useRouter();

const props = defineProps<TProps>();
const emits = defineEmits<{
  (e: "view-message"): void;
}>();

const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);
const relativeTime = useMomentRelativeTime(
  props.data.conversation?.lastMessageSentAt,
);

const isDetailModalShow = ref<boolean>(false);

const lastMessage = computed(() => {
  if (userInfo.value?.id == props.data.conversation?.lastMessageSenderId) {
    return `Bạn: ${props.data.conversation?.lastMessage}`;
  }
  return props.data.conversation?.lastMessage;
});

function handleViewDetailJob() {
  const link = router.resolve({ path: `/job-ad/detail/${props.data.id}` });

  window.open(link.href, "_blank");
}

function handleViewDetail() {
  isDetailModalShow.value = true;
}

function handleViewMessage() {
  // console.log(props.data.id);
  router.push({ path: "/message", query: { id: props.data.id } });
}
</script>
<style lang="scss" scoped>
.message-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  border-radius: 12px;
  border: 1px solid $color-gray-300;
  width: 100%;
  color: $text-light;
  position: relative;

  &.selected {
    border: 1px solid $color-primary-400;
  }

  .unseen {
    display: block;
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background-color: $color-danger;
    position: absolute;
    right: 12px;
    top: 12px;
  }

  .iconify {
    display: inline-block;
    font-size: 20px;
    height: 20px;
    width: 20px;
    min-width: 20px;
    color: $color-gray-500;
  }

  .external-link {
    color: $color-info;
    cursor: pointer;
    width: 16px !important;
    height: 16px !important;
    font-size: 16px !important;
    min-width: 16px !important;
  }

  .row {
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;
  }

  .space-between {
    justify-content: space-between;
  }

  .title {
    font-size: 14px;
    font-weight: 600;

    display: block; // ensures width constraints apply
    max-width: 100%; // fill available space
    white-space: nowrap; // single line
    overflow: hidden; // hide overflow
    text-overflow: ellipsis; // show "..."
    .title-text {
      display: inline-block;
      max-width: calc(100% - 20px); // leave space for the icon
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      vertical-align: middle;
    }

    .iconify {
      display: inline-block !important;
      margin-left: 4px;
    }
  }

  .top {
    align-items: flex-start;

    .info-section {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0px;

      .company-name {
        color: $text-light;
        font-size: 14px;
      }

      .last-message {
        color: $text-light;
        font-style: italic;
        font-size: 13px;
        display: block;
        max-width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .message-timestamp {
        color: $color-gray-400;
        font-style: italic;
        font-size: 13px;
        display: block;
        max-width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .logo-section {
      display: flex;
      flex-direction: row;
      gap: 8px;
      max-width: 100%;

      .logo {
        display: block;
        height: 48px;
        width: 48px;
        min-width: 48px;
        border-radius: 8px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: inherit;
        }
      }
    }
  }

  .chip {
    border-radius: 4px;
    padding: 4px;
    border: 1px solid $color-gray-300;
    font-size: 12px;
    font-weight: 500;
    width: fit-content;
  }

  .block {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    font-size: 13px;

    .label {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 4px;
      color: $color-gray-500;
    }
  }

  .body {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .divider {
    width: 100%;
    height: 1px;
    display: block;
    background-color: $color-gray-200;
  }

  .bottom {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    gap: 8px;

    .message-btn {
      padding: 4px 8px;
      background-color: white;
      border: 1px solid $color-primary-400;
      color: $color-primary-400;
      font-size: 14px;
      border-radius: 6px;
      cursor: pointer;
      position: relative;

      &.has-new {
        &::after {
          content: "";
          position: absolute;
          display: block;
          height: 10px;
          width: 10px;
          border-radius: 999px;
          background-color: $color-primary-400;
          top: -4px;
          right: -4px;
        }
      }
    }

    .detail-btn {
      padding: 4px 8px;
      background-color: $color-primary-400;
      border: 1px solid $color-primary-400;
      color: $text-dark;
      font-size: 14px;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
    }
  }
}
</style>
