<template>
  <div class="chat-log">
    <div class="top">
      <AppInputSearchSelect
        :label="''"
        :required="false"
        :options="jobAdOpts"
        :value="selectedJobAd"
        :error="''"
        :placeholder="'Mời chọn tin tuyển dụng'"
        :allow-clear="false"
        :remote-filter="false"
        :multiple="false"
        :is-disabled="false"
        :slim-error="true"
        :fetch-fn="null"
        class="job-ad-select"
        @input="($event) => (selectedJobAd = $event)"
        @clear-value="() => (selectedJobAd = null)"
      />
    </div>
    <div class="chatbox">
      <!-- <div class="top"> -->
      <!--   <div class="org-info"> -->
      <!--     <div class="names"> -->
      <!--       <div class="org-name">{{ props.candidateInfo.fullName }}</div> -->
      <!--     </div> -->
      <!--   </div> -->
      <!-- </div> -->
      <div ref="chatContainer" class="chat-container">
        <MessagesBubble
          v-for="(message, index) of messagesList"
          :key="index"
          :sender-info="message.senderInfo"
          :member-ids="conversationMembers"
          :messages="message.messages"
          :show-avatar="false"
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
          :class="{ disabled: !chatInput?.trim() }"
          @click="handleSendMessage"
        >
          <Icon name="material-symbols:send-rounded" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import moment from "moment";

type TProps = {
  jobAds: any[];
  candidateInfo: any;
};

const {
  checkExistConversation,
  createConversation,
  getConversationMessages,
  sendMessage,
  readAllMessages,
} = useConversationApi();

const { setLoading } = useLoadingStore();
const route = useRoute();

const pubSubStore = usePubSubStore();
const { push } = pubSubStore;
const { subscribe } = storeToRefs(pubSubStore);

const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);

const isNoConversation = ref<boolean>(false);
const checkExistController = ref<any>(null);
const getMessagesController = ref<any>(null);
const chatContainer = ref<HTMLElement | null>(null);

const isInputFocused = ref<boolean>(false);

const chatInput = ref<string>("");
const messages = ref<any>([]);
const currentPage = ref<any>(null);
const hasMoreMessage = ref<any>(false);
const conversationMembers = ref<any>([]);

const isCallingReadAll = ref<any>(false);

const selectedJobAd = ref<any>(null);
const isLoading = ref<boolean>(false);

const props = defineProps<TProps>();

onBeforeMount(() => {
  // console.log({ props });
  if (props.jobAds.length) {
    const jobAdId = route.query.jobAdId;
    let ad: any = undefined;
    if (jobAdId) {
      const foundJobAd = props.jobAds.find(
        (jobAd) => jobAd.jobAd.id == jobAdId,
      );
      if (foundJobAd) {
        ad = foundJobAd;
      } else {
        ad = props.jobAds[0];
      }
    } else {
      ad = props.jobAds[0];
    }

    selectedJobAd.value = {
      label: ad.jobAd.title,
      value: ad.jobAd.id,
    };
  }
});

const getInfo = computed(() => {
  return (id: any) => {
    if (id == userInfo.value?.id) {
      return {
        id: userInfo.value?.id,
      };
    } else {
      const info = {
        id: props.candidateInfo.candidateId,
      };
      return info;
    }
  };
});

const messagesList = computed(() => {
  const list = messages.value;

  const result: any[] = [];
  let currentGroup: any = null;

  list.forEach((msg: any) => {
    if (
      !currentGroup ||
      currentGroup.senderInfo.id !== getInfo.value(msg.senderId).id
    ) {
      currentGroup = {
        senderInfo: getInfo.value(msg.senderId),
        messages: [],
      };
      result.push(currentGroup);
    }

    const { senderId, ...rest } = msg;
    currentGroup.messages.push(rest);
  });

  // console.log({ result });
  return result.reverse();
  // return result;
});

const jobAdOpts = computed(() => {
  return props.jobAds.map((ad) => ({
    label: ad.jobAd.title,
    value: ad.jobAd.id,
  }));
});

const selectedJobAdInfo = computed(() => {
  // console.log(props.jobAds, selectedJobAd.value);
  return props.jobAds.find((ad) => ad.jobAd.id === selectedJobAd.value?.value);
});

async function handleFocusInput() {
  isInputFocused.value = true;
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
    selectedJobAd.value.value,
    props.candidateInfo.candidateId,
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
        jobAdId: selectedJobAd.value.value,
        candidateId: props.candidateInfo.candidateId,
      },
    });
  }
  isCallingReadAll.value = false;
}

async function handleSendMessage() {
  if (isLoading.value || !chatInput.value?.trim()) {
    return;
  }

  // console.log("here!");

  // const res = await sendMessage(
  //   selectedJobAd.value.value,
  //   props.candidateInfo.candidateId,
  //   chatInput.value.trim(),
  // );

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
      candidateId: props.candidateInfo.candidateId,
      jobAdId: selectedJobAd.value.value,
      newMessage: newMessage,
      isSelf: true,
      fullName: props.candidateInfo.fullName,
      title: selectedJobAd.value.label,
    },
  });

  nextTick(() => {
    chatInput.value = "";
    scrollToBottom();
  });
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
    selectedJobAd.value.value,
    props.candidateInfo.candidateId,
    checkExistController.value,
  );
  if (!res) {
    isNoConversation.value = true;
  } else {
    isNoConversation.value = false;
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

  await Promise.allSettled([checkExist()]);
  isLoading.value = false;
  if (!isNoConversation.value) {
    await getMessages();
  }
}

async function getMessages() {
  isLoading.value = true;
  if (getMessagesController.value) {
    getMessagesController.value.abort();
  }

  getMessagesController.value = new AbortController();

  const res = await getConversationMessages(
    selectedJobAd.value.value,
    props.candidateInfo.candidateId,
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

async function handleAddConversation() {
  isLoading.value = true;
  const res = await createConversation(
    selectedJobAd.value.value,
    props.candidateInfo.candidateId,
  );
  if (res) {
    isNoConversation.value = false;
  }
  isLoading.value = false;
}

watch(selectedJobAd, async (newVal) => {
  if (!newVal || newVal.value == -1) {
    return;
  }

  fetchData();
  setLoading(false);
});

watch(
  () => subscribe.value("chatStream"),
  (newMessage) => {
    if (newMessage.topic == PUB_SUB_TOPIC.CHECK_UNREAD) {
      return;
    }

    if (newMessage.topic == PUB_SUB_TOPIC.MESSAGE_READ) {
      if (
        newMessage.data.candidateId == props.candidateInfo.candidateId &&
        newMessage.data.jobAdId == selectedJobAd.value.value
      ) {
        for (const message of messages.value) {
          if (!message.seenBy?.includes(props.candidateInfo.candidateId)) {
            message.seenBy?.push(props.candidateInfo.candidateId);
          }
        }
      }

      return;
    }

    if (newMessage.topic == PUB_SUB_TOPIC.NEW_CONVERSATION) {
      if (
        newMessage.data.candidateId == props.candidateInfo.candidateId &&
        newMessage.data.jobAdId == selectedJobAd.value.value
      ) {
        isNoConversation.value = false;
      }

      return;
    }

    if (newMessage.topic == PUB_SUB_TOPIC.NEW_MESSAGE) {
      if (newMessage.data.isSelf) {
        return;
      }
      if (
        newMessage.data.candidateId == props.candidateInfo.candidateId &&
        newMessage.data.jobAdId == selectedJobAd.value.value
      ) {
        // console.log({ newMessage });
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
.chat-log {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 100%;
  height: 100%;
  padding-bottom: 8px;

  .top {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
    row-gap: 8px;

    .right {
      display: flex;
      flex-direction: row;
      gap: 12px;
      align-items: center;
      flex-wrap: wrap;
      row-gap: 8px;
    }

    .job-ad-select {
      max-width: 420px;
    }
  }

  .divider {
    width: 100%;
    height: 1px;
    display: block;
    background-color: $color-gray-200;
  }

  .chatbox {
    flex: 1;
    min-height: 0;
    margin-top: 12px;

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
      gap: 2px;
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
        min-width: 28px;
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
}
</style>
