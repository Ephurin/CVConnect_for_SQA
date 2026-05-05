<template>
  <div class="panel">
    <div class="top">
      <div v-if="orgInfo" class="org-info">
        <div class="logo">
          <img :src="orgInfo.logoUrl" alt="Logo công ty" />
        </div>
        <div class="names">
          <div class="org-name" @click="handleViewOrg">{{ orgInfo.name }}</div>
          <div class="hr-name">{{ orgInfo.hrContact.fullName }}</div>
        </div>
      </div>
    </div>
    <div ref="chatContainer" class="chat-container">
      <MessagesBubble
        v-for="(message, index) of messagesList"
        :key="index"
        :sender-info="message.senderInfo"
        :member-ids="conversationMembers"
        :messages="message.messages"
      />
      <div
        v-if="
          hasMoreMessage &&
          !isLoading &&
          !isNoConversation &&
          messages.length > 0
        "
        class="show-more-message"
        @click="getMessages"
      >
        Hiển thị thêm
      </div>
      <div v-if="isLoading" class="spinner">
        <AppSpinnerHalfCircle />
      </div>
      <div v-if="isNoConversation && !isLoading" class="no-conversation">
        <AppButton
          :text="'Tạo đoạn hội thoại'"
          class="add-conversation"
          @click="handleAddConversation"
        >
          <template #icon>
            <Icon name="mdi:chat-plus" />
          </template>
        </AppButton>
      </div>
    </div>
    <div v-if="!isNoConversation" class="input-container">
      <AppInputTextarea
        v-model="chatInput"
        :label="''"
        :required="false"
        :placeholder="'Gửi tin nhắn'"
        :error="''"
        :show-error="false"
        :initial-rows="1"
        :slim-error="true"
        @focus="handleFocusInput"
        @blur="() => (isInputFocused = false)"
        @enter="handleSendMessage"
      />
      <div
        class="send-button"
        :class="{ disabled: !chatInput.trim() }"
        @click="handleSendMessage"
      >
        <Icon name="material-symbols:send-rounded" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { cloneDeep } from "lodash";
import moment from "moment";
import { connect } from "socket.io-client";

type TProps = {
  detail: any;
};

const {
  checkExistConversation,
  getConversationOrgInfo,
  createConversation,
  getConversationMessages,
  sendMessage,
  readAllMessages,
} = useConversationApi();

const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);
const router = useRouter();

const isNoConversation = ref<boolean>(false);
const checkExistController = ref<any>(null);
const getOrgInfoController = ref<any>(null);
const getMessagesController = ref<any>(null);
const orgInfo = ref<any>(null);
const isLoading = ref<boolean>(false);
const chatInput = ref<string>("");
const messages = ref<any>([]);
const currentPage = ref<any>(null);
const hasMoreMessage = ref<any>(false);
const conversationMembers = ref<any>([]);
const isCallingReadAll = ref<any>(false);

const isInputFocused = ref<boolean>(false);

const chatContainer = ref<HTMLElement | null>(null);

const pubSubStore = usePubSubStore();
const { subscribe } = storeToRefs(pubSubStore);
const { push } = pubSubStore;

const props = defineProps<TProps>();

const messagesList = computed(() => {
  const list = messages.value;

  const result: any[] = [];
  let currentGroup: any = null;

  list.forEach((msg: any) => {
    const sender = getInfo.value(msg.senderId);

    // console.log({ currentGroup, sender });

    if (!currentGroup || currentGroup.senderInfo.id !== sender.id) {
      if (currentGroup) result.push(currentGroup);

      currentGroup = {
        senderInfo: sender,
        messages: [],
      };
    }

    const { senderId, ...rest } = msg;
    currentGroup.messages.push(rest);
  });

  if (currentGroup) result.push(currentGroup);

  return result.reverse();
});

const getInfo = computed(() => {
  return (id: any) => {
    if (id == userInfo.value?.id) {
      return {
        id: userInfo.value?.id,
      };
    } else {
      const info = {
        id: -1,
        logo: orgInfo.value.logoUrl,
      };
      return info;
    }
  };
});

async function handleFocusInput() {
  isInputFocused.value = true;
  // console.log("focus");
  if (isCallingReadAll.value) {
    return;
  }
  if (
    messages.value[messages.value.length - 1] &&
    messages.value[messages.value.length - 1].seenBy?.includes(
      userInfo.value?.id,
    )
  ) {
    return;
  }

  isCallingReadAll.value = true;
  const res = await readAllMessages(
    props.detail.jobAd.id,
    props.detail.candidateInfo.candidateId,
  );
  if (res) {
    if (
      messages.value[messages.value.length - 1] &&
      !messages.value[messages.value.length - 1].seenBy?.includes(
        userInfo.value?.id,
      )
    ) {
      messages.value[messages.value.length - 1].seenBy.push(userInfo.value?.id);
    }
    push("chatStream", {
      topic: PUB_SUB_TOPIC.CHECK_UNREAD,
    });
    push("chatStream", {
      topic: PUB_SUB_TOPIC.MESSAGE_READ,
      data: {
        jobAdId: props.detail.jobAd.id,
        candidateId: props.detail.candidateInfo.candidateId,
      },
    });
  }
  isCallingReadAll.value = false;
}

function handleViewOrg() {
  const link = router.resolve({ path: `org-profile/${orgInfo.value.id}` });
  window.open(link.href, "_blank");
}

function scrollToBottom() {
  if (!chatContainer.value) return;

  // Because column-reverse means bottom = scrollTop = 0
  chatContainer.value.scrollTop = 0;
}

async function checkExist() {
  if (checkExistController.value) {
    checkExistController.value.abort();
  }

  checkExistController.value = new AbortController();

  const res = await checkExistConversation(
    props.detail.jobAd.id,
    props.detail.candidateInfo.candidateId,
    checkExistController.value,
  );
  if (!res) {
    isNoConversation.value = true;
  } else {
    isNoConversation.value = false;
  }
}

async function getMessages() {
  isLoading.value = true;
  if (getMessagesController.value) {
    getMessagesController.value.abort();
  }

  getMessagesController.value = new AbortController();

  const res = await getConversationMessages(
    props.detail.jobAd.id,
    props.detail.candidateInfo.candidateId,
    currentPage.value,
    getMessagesController.value,
  );

  if (!res.data.messagesWithFilter) {
    isLoading.value = false;
    return;
  }

  messages.value = [...res.data.messagesWithFilter.data, ...messages.value];
  conversationMembers.value = res.data.participantIds;

  if (res.data.messagesWithFilter.data.length < 20) {
    hasMoreMessage.value = false;
  } else {
    hasMoreMessage.value = true;
  }
  if (messages.value[0]) {
    currentPage.value = toUtcDateWithTimeFromNumber(
      messages.value[0].sentAt * 1000,
    );
    // console.log({
    //   messages: messages.value,
    //   sentAt: messages.value[0].sentAt,
    //   utcTime: toUtcDateWithTimeFromNumber(messages.value[0].sentAt * 1000),
    // });
  }
  isLoading.value = false;
}

async function getOrgInfo() {
  if (getOrgInfoController.value) {
    getOrgInfoController.value.abort();
  }

  getOrgInfoController.value = new AbortController();

  const res = await getConversationOrgInfo(
    props.detail.jobAd.id,
    getOrgInfoController.value,
  );
  if (res) {
    orgInfo.value = res.data;
  }
}

async function fetchData() {
  isLoading.value = true;

  messages.value = [];
  currentPage.value = null;
  chatInput.value = "";
  hasMoreMessage.value = false;
  conversationMembers.value = [];
  isNoConversation.value = false;

  await Promise.allSettled([getOrgInfo(), checkExist()]);
  isLoading.value = false;
  if (!isNoConversation.value) {
    await getMessages();
  }
}

async function handleAddConversation() {
  isLoading.value = true;
  const res = await createConversation(
    props.detail.jobAd.id,
    props.detail.candidateInfo.candidateId,
  );
  if (res) {
    isNoConversation.value = false;
  }
  isLoading.value = false;
}

async function handleSendMessage() {
  if (isLoading.value || !chatInput.value?.trim()) {
    return;
  }

  // console.log("here!");

  // const res = await sendMessage(
  //   props.detail.jobAd.id,
  //   props.detail.candidateInfo.candidateId,
  //   chatInput.value,
  // );

  const messagePayload = {
    jobAdId: props.detail.jobAd.id,
    candidateId: props.detail.candidateInfo.candidateId,
    text: chatInput.value,
  };

  const newMessage = {
    id: -1,
    senderId: userInfo.value?.id,
    seenBy: [userInfo.value?.id],
    text: chatInput.value,
    sentAt: moment().utc().unix(),
  };

  messages.value.push(newMessage);

  push("chatStream", {
    topic: PUB_SUB_TOPIC.NEW_MESSAGE,
    data: {
      candidateId: props.detail.candidateInfo.candidateId,
      jobAdId: props.detail.jobAd.id,
      newMessage: newMessage,
      isSelf: true,
    },
  });

  nextTick(() => {
    chatInput.value = "";
    scrollToBottom();
  });
}

watch(
  () => props.detail.id,
  async (newId) => {
    await fetchData();
  },
  { immediate: true, deep: true },
);

watch(
  () => subscribe.value("chatStream"),
  (newMessage) => {
    if (newMessage.topic == PUB_SUB_TOPIC.CHECK_UNREAD) {
      return;
    }

    if (newMessage.topic == PUB_SUB_TOPIC.MESSAGE_READ) {
      if (
        newMessage.data.candidateId == props.detail.candidateInfo.candidateId &&
        newMessage.data.jobAdId == props.detail.jobAd.id
      ) {
        for (const message of messages.value) {
          if (!message.seenBy?.includes(orgInfo.value.hrContact.id)) {
            message.seenBy?.push(orgInfo.value.hrContact.id);
          }
        }
      }

      return;
    }

    if (newMessage.topic == PUB_SUB_TOPIC.NEW_CONVERSATION) {
      if (
        newMessage.data.candidateId == props.detail.candidateInfo.candidateId &&
        newMessage.data.jobAdId == props.detail.jobAd.id
      ) {
        isNoConversation.value = false;
      }

      return;
    }

    if (newMessage.topic == PUB_SUB_TOPIC.NEW_MESSAGE) {
      // console.log({ messageFromStream: newMessage.data });
      if (newMessage.data.isSelf) {
        return;
      }
      if (
        newMessage.data.candidateId == props.detail.candidateInfo.candidateId &&
        newMessage.data.jobAdId == props.detail.jobAd.id
      ) {
        messages.value.push(newMessage.data.newMessage);
        if (isInputFocused.value) {
          handleFocusInput();
        }
        push("chatStream", {
          topic: PUB_SUB_TOPIC.CHECK_UNREAD,
        });
        nextTick(() => {
          scrollToBottom();
        });
      }
    }
  },
);

watch(isInputFocused, (val) => {
  // console.log({ isInputFocused: val });
});
</script>
<style lang="scss" scoped>
.panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  padding: 6px;
  border-radius: 12px;
  border: 1px solid $color-gray-300;

  .top {
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;

    .org-info {
      display: flex;
      flex-direction: row;
      gap: 8px;
      align-items: flex-start;

      .names {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .org-name {
          color: $text-light;
          cursor: pointer;
        }
        .hr-name {
          color: $color-gray-600;
          font-size: 13px;
        }
      }

      .logo {
        display: block;
        height: 48px;
        width: 48px;
        min-width: 48px;
        border-radius: 12px;
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

  .chat-container {
    flex: 1;
    min-height: 0;
    overflow: auto;
    overflow-x: hidden;
    overscroll-behavior: contain;
    display: flex;
    flex-direction: column-reverse;
    gap: 8px;
    padding: 8px 0px;

    .show-more-message {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 32px;

      text-decoration: underline;
      color: $color-primary-500;
      cursor: pointer;
      font-size: 13px;
    }

    .spinner,
    .no-conversation {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .add-conversation {
        padding: 4px 8px;
        border: 1px solid $color-primary-500;
        color: $color-primary-500;
      }
    }
  }

  .input-container {
    display: flex;
    flex-direction: row;
    gap: 4px;
    align-items: center;
    :deep(.text-input) {
      flex: 1;
      .input-wrapper {
        .input {
          padding: 6px 8px;
          input {
            font-size: 14px;
          }
        }
      }
    }

    .send-button {
      background-color: $color-primary-500;
      cursor: pointer;
      height: 28px;
      aspect-ratio: 1/1;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      .iconify {
        display: block;
        font-size: 20px;
        height: 20px;
        min-width: 20px;
        color: $text-dark;
        margin-right: -4px;
      }

      &.disabled {
        background-color: $color-gray-400;
        cursor: default;
      }
    }
  }
}
</style>
