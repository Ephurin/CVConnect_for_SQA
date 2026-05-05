<template>
  <div class="wrapper" :class="{ 'is-self': isSelf }">
    <div class="message-bubble">
      <div class="info-col">
        <div v-if="!isSelf && props.showAvatar" class="logo">
          <img :src="props.senderInfo.logo" alt="Logo công ty" />
        </div>
      </div>
      <div class="chats">
        <div
          v-for="(message, index) of props.messages"
          :key="index"
          class="bubble"
          :title="formatDateTime(message.sentAt, 'HH:mm DD/MM/YYYY')"
        >
          <div class="content">
            {{ message.text }}
          </div>
          <div v-if="messageStatus(message) != null" class="status-indicator">
            <Icon v-if="messageStatus(message) == 'sent'" name="bx:check" />
            <Icon
              v-if="messageStatus(message) == 'seen'"
              name="bx:check-double"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
type TProps = {
  senderInfo: any;
  memberIds: any[];
  messages: any[];
  showAvatar?: boolean;
};

const props = withDefaults(defineProps<TProps>(), {
  showAvatar: true
});

const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);

onBeforeMount(() => {
  // console.log({ props });
});

const isSelf = computed(() => {
  return props.senderInfo.id == userInfo.value?.id;
});

const messageStatus = computed(() => {
  return (message: any) => {
    if (!isSelf.value) {
      return null;
    }

    if (message.seenBy.length > 1) {
      return "seen";
    }

    return "sent";
  };
});
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  width: 100%;

  &.is-self {
    justify-content: flex-end;
    .chats {
      align-items: flex-end !important;
    }
    .bubble {
      border-radius: 8px !important;
      border-bottom-right-radius: 4px !important;
      background-color: $color-primary-500 !important;
      color: $text-dark !important;
    }
  }

  .message-bubble {
    display: flex;
    flex-direction: row;
    gap: 4px;
    max-width: 75%;

    .info-col {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      height: 100%;

      .logo {
        display: block;
        height: 32px;
        width: 32px;
        min-width: 32px;
        border-radius: 999px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: inherit;
        }
      }
    }

    .chats {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .bubble {
        font-size: 14px;
        padding: 4px;
        width: fit-content;
        border-radius: 8px;
        border-bottom-left-radius: 4px;
        background-color: white;
        display: flex;
        flex-direction: row;
        gap: 2px;
        color: $text-light;
        @include box-shadow;

        .content {
          word-break: break-word;
        }

        .status-indicator {
          align-self: flex-end;
          margin-bottom: -6px;
        }
      }
    }
  }
}
</style>
