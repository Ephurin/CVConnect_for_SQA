<template>
  <div v-on-click-outside="handleClickOutside" class="chat-popup">
    <div class="btn" @click="isPopupOpen = !isPopupOpen">
      <Icon name="mingcute:wechat-fill" />
      <div v-if="hasUnread" class="badge"></div>
    </div>
    <div v-if="isPopupOpen" class="popup">
      <div class="top">
        <div class="side">
          <div
            class="tab"
            :class="{ selected: currentTab == 0 }"
            @click="currentTab = 0"
          >
            {{ props.isHr ? "Tất cả" : `Tất cả ${allCount}` }}
          </div>
          <div
            class="tab"
            :class="{ selected: currentTab == 1 }"
            @click="currentTab = 1"
          >
            {{ props.isHr ? "Chưa đọc" : `Chưa đọc ${unseenCount}` }}
          </div>
        </div>
        <div v-if="!props.isHr" class="side">
          <span class="view-all" @click="handleViewAll">Xem tất cả</span>
        </div>
      </div>
      <div class="content">
        <MessagesCard
          v-for="jobAd of filteredList"
          :key="jobAd.id"
          :is-hr="props.isHr"
          :data="jobAd"
          class="cursor-pointer"
          @click="handleClickConversation(jobAd)"
        />
        <div v-if="isLoading" class="spinner">
          <AppSpinnerHalfCircle />
        </div>
        <AppNoData v-if="filteredList.length == 0 && !isLoading" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { vOnClickOutside } from "@vueuse/components";
import { io } from "socket.io-client";
import { SOCKET_ENDPOINT, SOCKET_CHAT_EVENT } from "~/const/socket";

type TProps = {
  isHr: boolean;
};

const props = defineProps<TProps>();

const { getAppliedJobAdsUnpaged, getConversationWithCandidates } =
  useCandidateApi();
const { checkExistUnreadMessage } = useConversationApi();
const router = useRouter();

const authStore = useAuthStore();
const { token } = storeToRefs(authStore);

const connection = ref<any>(null);

const list = ref<any>([]);
const isLoading = ref<boolean>(false);
const isEmpty = ref<boolean>(false);
const currentTab = ref<number>(0);
const hasUnread = ref<boolean>(false);
const nextPage = ref<any>(null);

const isPopupOpen = ref<boolean>(false);

const pubSubStore = usePubSubStore();
const { subscribe } = storeToRefs(pubSubStore);
const { push } = pubSubStore;

onBeforeMount(async () => {
  isLoading.value = true;
  await Promise.allSettled([fetchData(), checkUnread()]);
  isLoading.value = false;
});

onMounted(() => {
  connect();
});

const allCount = computed(() => {
  return list.value.length;
});

const unseenCount = computed(() => {
  return list.value.filter((m: any) => m.hasMessageUnread).length;
});

const filteredList = computed(() => {
  if (currentTab.value == 0) {
    return list.value;
  } else {
    return list.value.filter((m: any) => m.hasMessageUnread);
  }
});

function connect() {
  if (connection.value) {
    connection.value.disconnect();
  }

  connection.value = io(SOCKET_ENDPOINT, {
    path: "/socket",
    transports: ["websocket"],
    query: { token: token.value },
  });
  connection.value.on("connect", () => {
    // console.log("Chat socket connected:", connection.value.id);
  });

  connection.value.on(SOCKET_CHAT_EVENT.NEW_MESSAGE, (newMessage: any) => {
    // console.log("event :", SOCKET_CHAT_EVENT.NEW_MESSAGE, newMessage);

    if (!props.isHr) {
      const candidateId = newMessage.candidateId;
      const jobAdId = newMessage.jobAdId;

      // console.log({ list: list.value });

      const idx = list.value.findIndex(
        (item: any) =>
          item.candidateInfo.candidateId == candidateId &&
          item.jobAd.id == jobAdId,
      );

      // console.log({ idx });

      if (idx !== -1) {
        const [targetCard] = list.value.splice(idx, 1); // removes it (keeps reference)
        targetCard.hasMessageUnread = true;
        if (targetCard.conversation) {
          targetCard.conversation.lastMessage = newMessage.newMessage.text;
          targetCard.conversation.lastMessageSenderId =
            newMessage.newMessage.senderId;
          targetCard.conversation.lastMessageSentAt =
            new Date(newMessage.newMessage.sentAt).getTime() / 1000;
        } else {
          targetCard.conversation = {
            lastMessage: newMessage.newMessage.text,
            lastMessageSenderId: newMessage.newMessage.senderId,
            lastMessageSentAt:
              new Date(newMessage.newMessage.sentAt).getTime() / 1000,
          };
        }
        list.value = [targetCard, ...list.value];
        // console.log({ listAfter: list.value });
      }
    } else {
      const candidateId = newMessage.candidateId;
      const jobAdId = newMessage.jobAdId;

      const idx = list.value.findIndex(
        (item: any) =>
          item.conversation.candidateId == candidateId &&
          item.conversation.jobAdId == jobAdId,
      );

      // console.log({ idx });
      if (idx !== -1) {
        const [targetCard] = list.value.splice(idx, 1); // removes it (keeps reference)

        // console.log({ targetCard, list: list.value });

        targetCard.hasMessageUnread = true;
        if (targetCard.conversation) {
          targetCard.conversation.lastMessage = newMessage.newMessage.text;
          targetCard.conversation.lastMessageSenderId =
            newMessage.newMessage.senderId;
          targetCard.conversation.lastMessageSentAt =
            new Date(newMessage.newMessage.sentAt).getTime() / 1000;
        } else {
          targetCard.conversation = {
            lastMessage: newMessage.newMessage.text,
            lastMessageSenderId: newMessage.newMessage.senderId,
            lastMessageSentAt:
              new Date(newMessage.newMessage.sentAt).getTime() / 1000,
          };
        }
        nextPage.value = targetCard.conversation.lastMessageSentAt;
        list.value = [targetCard, ...list.value];
        // console.log({ listAfter: list.value });
      } else {
        const newCard = {
          conversation: {
            candidateId: candidateId,
            candidateInfoId: newMessage.candidateInfoId,
            jobAdId: jobAdId,
            lastMessage: newMessage.newMessage.text,
            lastMessageSenderId: newMessage.newMessage.senderId,
            lastMessageSentAt:
              new Date(newMessage.newMessage.sentAt).getTime() / 1000,
          },
          candidateInfo: {
            fullName: newMessage.fullName,
          },
          jobAd: {
            title: newMessage.title,
          },
          hasMessageUnread: true,
        };

        nextPage.value = newCard.conversation.lastMessageSentAt;

        list.value.unshift(newCard);
      }
    }

    push("chatStream", {
      topic: PUB_SUB_TOPIC.NEW_MESSAGE,
      data: newMessage,
    });
  });

  connection.value.on(SOCKET_CHAT_EVENT.READ_ALL_MESSAGE, (newMessage: any) => {
    // console.log("event :", SOCKET_CHAT_EVENT.READ_ALL_MESSAGE, newMessage);
    push("chatStream", {
      topic: PUB_SUB_TOPIC.MESSAGE_READ,
      data: newMessage,
    });
  });

  connection.value.on(SOCKET_CHAT_EVENT.NEW_CONVERSATION, (newMessage: any) => {
    // console.log("event :", SOCKET_CHAT_EVENT.NEW_CONVERSATION, newMessage);
    push("chatStream", {
      topic: PUB_SUB_TOPIC.NEW_CONVERSATION,
      data: newMessage,
    });
  });
}

async function fetchData() {
  let res: any = undefined;
  if (props.isHr) {
    const payload: any = { pageSize: 20 };
    if (nextPage.value) {
      payload.pageIndex = toUtcDateWithTimeFromNumber(nextPage.value);
    }
    if (currentTab.value == 1) {
      payload.hasMessageUnread = true;
    }
    res = await getConversationWithCandidates(payload);
  } else {
    res = await getAppliedJobAdsUnpaged({});
  }
  if (!res) {
    return;
  }
  // console.log({ res });
  list.value = [...list.value, ...res.data.data];
  nextPage.value =
    list.value[list.value.length - 1].conversation.lastMessageSentAt;
  // console.log({ page: nextPage.value });

  if (res.data.data.length) {
    isEmpty.value = false;
  } else {
    isEmpty.value = true;
  }
}

async function checkUnread() {
  const res = await checkExistUnreadMessage(!props.isHr);
  if (!res.data) {
    hasUnread.value = false;
  } else {
    hasUnread.value = true;
  }
}

function handleClickOutside() {
  isPopupOpen.value = false;
}

function handleClickConversation(conversation: any) {
  isPopupOpen.value = false;
  if (props.isHr) {
    const candidateInfoId =
      conversation.candidateInfo.id ??
      conversation.conversation.candidateInfoId;
    const jobAdId = conversation.jobAd.id ?? conversation.conversation.jobAdId;
    if (candidateInfoId == undefined || jobAdId == undefined) {
      return;
    }
    const url = router.resolve({
      path: `/org/candidate/detail/${candidateInfoId}`,
      query: { tab: "discussion", jobAdId: jobAdId },
    });
    window.open(url.href, "_blank");
  } else {
    router.push({ path: "/message", query: { id: conversation?.id } });
  }
}

function handleViewAll() {
  isPopupOpen.value = false;
  router.push({ path: "/message" });
}

watch(
  () => subscribe.value("chatStream"),
  (newMessage) => {
    if (newMessage.topic == PUB_SUB_TOPIC.CHECK_UNREAD) {
      checkUnread();
      return;
    }

    if (newMessage.topic == PUB_SUB_TOPIC.MESSAGE_READ) {
      if (!props.isHr) {
        const candidateId = newMessage.data.candidateId;
        const jobAdId = newMessage.data.jobAdId;

        const card = list.value.find(
          (item: any) =>
            item.candidateInfo.candidateId == candidateId &&
            item.jobAd.id == jobAdId,
        );

        checkUnread();

        if (!card) {
          return;
        }

        card.hasMessageUnread = false;
      } else {
        const candidateId = newMessage.data.candidateId;
        const jobAdId = newMessage.data.jobAdId;

        // console.log("look for card with ", candidateId, jobAdId);

        const card = list.value.find(
          (item: any) =>
            item.conversation.candidateId == candidateId &&
            item.conversation.jobAdId == jobAdId,
        );

        checkUnread();

        if (!card) {
          return;
        }

        card.hasMessageUnread = false;
      }
    }
    if (newMessage.topic == PUB_SUB_TOPIC.NEW_MESSAGE) {
      // console.log("bat su kien tu nhan tin");
      checkUnread();
      if (newMessage.data.isSelf) {
        connection.value.emit(SOCKET_CHAT_EVENT.RECEIVE_MESSAGE, {
          jobAdId: newMessage.data.jobAdId,
          candidateId: newMessage.data.candidateId,
          text: newMessage.data.newMessage.text,
        });
      }
      if (!props.isHr) {
        const candidateId = newMessage.data.candidateId;
        const jobAdId = newMessage.data.jobAdId;

        // console.log({ list: list.value, message: newMessage.data });

        const idx = list.value.findIndex(
          (item: any) =>
            item.candidateInfo.candidateId == candidateId &&
            item.jobAd.id == jobAdId,
        );

        // console.log({ idx });

        if (idx !== -1) {
          const [targetCard] = list.value.splice(idx, 1); // removes it (keeps reference)
          targetCard.hasMessageUnread = true;

          if (!targetCard.conversation) {
            targetCard.conversation = {};
          }

          targetCard.conversation.lastMessage = newMessage.data.newMessage.text;
          targetCard.conversation.lastMessageSenderId =
            newMessage.data.newMessage.senderId;
          targetCard.conversation.lastMessageSentAt =
            new Date(newMessage.data.newMessage.sentAt).getTime() / 1000;

          if (newMessage.data.isSelf) {
            targetCard.conversation.lastMessageSentAt =
              newMessage.data.newMessage.sentAt;
            targetCard.hasMessageUnread = false;
          }
          list.value = [targetCard, ...list.value];
          // console.log({ listAfter: list.value });
        }
      } else {
        // otherwise, reconstruct
        const candidateId = newMessage.data.candidateId;
        const jobAdId = newMessage.data.jobAdId;

        const idx = list.value.findIndex(
          (item: any) =>
            item.conversation.candidateId == candidateId &&
            item.conversation.jobAdId == jobAdId,
        );

        // console.log({ idx });
        if (idx !== -1) {
          const [targetCard] = list.value.splice(idx, 1); // removes it (keeps reference)

          // console.log({ targetCard, list: list.value });

          targetCard.hasMessageUnread = true;

          if (!targetCard.conversation) {
            targetCard.conversation = {};
          }

          targetCard.conversation.lastMessage = newMessage.data.newMessage.text;
          targetCard.conversation.lastMessageSenderId =
            newMessage.data.newMessage.senderId;
          targetCard.conversation.lastMessageSentAt =
            new Date(newMessage.data.newMessage.sentAt).getTime() / 1000;
          if (newMessage.data.isSelf) {
            targetCard.conversation.lastMessageSentAt =
              newMessage.data.newMessage.sentAt;
            targetCard.hasMessageUnread = false;
          }
          nextPage.value = targetCard.conversation.lastMessageSentAt;
          list.value = [targetCard, ...list.value];
          // console.log({ listAfter: list.value });
        } else {
          const newCard = {
            conversation: {
              candidateId: candidateId,
              jobAdId: jobAdId,
              lastMessage: newMessage.data.newMessage.text,
              lastMessageSenderId: newMessage.data.newMessage.senderId,
              lastMessageSentAt:
                new Date(newMessage.data.newMessage.sentAt).getTime() / 1000,
            },
            candidateInfo: {
              fullName: newMessage.data.fullName,
            },
            jobAd: {
              title: newMessage.data.title,
            },
            hasMessageUnread: false,
          };

          nextPage.value = newCard.conversation.lastMessageSentAt;

          list.value.unshift(newCard);
        }
      }
    }
  },
);

watch(currentTab, async (newVal) => {
  if (!props.isHr) {
    return;
  }
  isLoading.value = true;
  list.value = [];
  nextPage.value = null;
  await fetchData();
  isLoading.value = false;
});

watch(token, (newToken, oldToken) => {
  if (newToken != oldToken) {
    connect();
  }
});

onBeforeUnmount(() => {
  if (connection.value) {
    connection.value.disconnect();
    // console.log("Socket cleaned up");
  }
});
</script>
<style lang="scss" scoped>
.chat-popup {
  position: relative;
  .spinner {
    width: 100%;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .btn {
    background-color: $color-gray-200;
    border-radius: 999px;
    height: 36px;
    width: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    cursor: pointer;

    .badge {
      top: -0px;
      right: -0px;
      font-size: 10px;
      background-color: $color-danger;
      height: 12px;
      width: 12px;
      border-radius: 999px;
      color: $text-dark;
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
    }

    .iconify {
      display: block;
      font-size: 24px;
      height: 24px;
      width: 24px;
      cursor: pointer;
    }
  }

  .popup {
    position: absolute;
    margin-top: 2px;
    right: 0px;
    background-color: white;
    padding: 8px;
    border-radius: 8px;
    max-height: 480px;
    min-width: 360px;
    max-width: 440px;
    width: 440px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    border: 1px solid $color-gray-200;
    z-index: 2;

    .content {
      flex: 1;
      min-height: 0;
      overflow: auto;
      display: flex;
      flex-direction: column;
      gap: 4px;
      border-top: 1px solid $color-gray-200;
      border-bottom: 1px solid $color-gray-200;
    }

    .top {
      display: flex;
      flex-direction: row;
      gap: 4px;
      justify-content: space-between;
      align-items: center;

      .side {
        display: flex;
        flex-direction: row;
        gap: 4px;
        .tab {
          padding: 2px 6px;
          font-size: 13px;
          border: 1px solid $color-gray-200;
          border-radius: 999px;
          cursor: pointer;

          &.selected {
            background-color: $color-primary-500;
            border: 1px solid $color-primary-500;
            color: $text-dark;
          }
        }
      }

      .view-all {
        font-size: 14px;
        color: $color-primary-500;
        text-decoration: underline;
        cursor: pointer;
      }
    }
  }
}
</style>
