<template>
  <div class="job-ad-list">
    <div class="content">
      <div ref="chatRef" class="wrapper">
        <div class="title">Trò chuyện với nhà tuyển dụng</div>
        <div class="content-wrapper">
          <div class="message-card-list-wrapper">
            <div class="filter">
              <AppInputText
                :label="''"
                :required="false"
                :error="''"
                :placeholder="'Tìm kiếm'"
                :value="filter.keyword ?? ''"
                :slim-error="true"
                class="search-bar"
                @input="handleInputDebounce('keyword', $event)"
              >
                <template #input-icon>
                  <Icon
                    name="material-symbols:search-rounded"
                    class="mag-icon"
                  />
                </template>
              </AppInputText>
              <AppInputSearchSelect
                class="job-ad-status-select"
                :label="''"
                :required="true"
                :options="candidateStatusOpts"
                :value="filter.candidateStatus"
                :error="''"
                :slim-error="true"
                :placeholder="'Trạng thái'"
                :remote-filter="false"
                :allow-clear="true"
                :multiple="false"
                :fetch-fn="null"
                @input="handleInput('candidateStatus', $event)"
                @clear-value="filter.candidateStatus = undefined"
              />
              <!-- <div class="count">{{ `${total} trò chuyện` }}</div> -->
            </div>
            <div class="top">
              <div class="side">
                <div
                  class="tab"
                  :class="{ selected: currentTab == 0 }"
                  @click="currentTab = 0"
                >
                  {{ `Tất cả ${allCount}` }}
                </div>
                <div
                  class="tab"
                  :class="{ selected: currentTab == 1 }"
                  @click="currentTab = 1"
                >
                  {{ `Chưa đọc ${unseenCount}` }}
                </div>
              </div>
            </div>
            <div class="message-cards-list">
              <MessagesCard
                v-for="jobAd of filteredList"
                :key="jobAd.id"
                :data="jobAd"
                :is-hr="false"
                :class="{ selected: currentOpenMessage?.id == jobAd.id }"
                class="cursor-pointer"
                @click="handleSetOpenMessage(jobAd)"
              />
              <div v-if="isLoading" class="spinner">
                <AppSpinnerHalfCircle />
              </div>
              <AppNoData v-if="filteredList.length == 0 && !isLoading" />
            </div>
          </div>
          <MessagesPanel
            v-if="currentOpenMessage != null"
            :detail="currentOpenMessage"
          />
          <MessagesJobAdInfo
            v-if="currentOpenMessage != null"
            :data="currentOpenMessage"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { debounce } from "lodash";
import { PERMISSION_CHECK_TYPE } from "~/const/permission";
import { CANDIDATE_STATUS } from "~/const/views/org/candidates";
import type { TPermissionCheckType } from "~/types/permision";

definePageMeta({
  layout: "public",
});

const permittedRole: string = "ANY";
const permissionType: TPermissionCheckType = PERMISSION_CHECK_TYPE.MEMBER_TYPE;
await useLayoutPermission(permissionType, permittedRole);

const router = useRouter();
const route = useRoute();

const pubSubStore = usePubSubStore();
const { subscribe } = storeToRefs(pubSubStore);
const { push } = pubSubStore;

const { setLoading } = useLoadingStore();
const { getAppliedJobAdsUnpaged } = useCandidateApi();

const filter = ref<any>({
  keyword: "",
  candidateStatus: undefined,
});
const list = ref<any>([]);
const isLoading = ref<boolean>(false);
const isEmpty = ref<boolean>(false);
const total = ref<any>(0);
const currentOpenMessage = ref<any>(null);
const currentTab = ref<number>(0);

onBeforeMount(async () => {
  await fetchData();
  const id = route.query.id;
  if (!id) {
    if (list.value.length) {
      handleSetOpenMessage(list.value[0]);
      return;
    }
  }
  const preOpenMessage = list.value.find((message: any) => message.id == id);
  currentOpenMessage.value = preOpenMessage;
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

const candidateStatusOpts = computed(() => {
  const opts = Object.keys(CANDIDATE_STATUS).map((key: string) => {
    return {
      label: CANDIDATE_STATUS[key].label,
      value: key,
    };
  });
  return opts;
});

async function fetchData() {
  isLoading.value = true;
  const payload: any = {};
  if (filter.value.keyword.trim()) {
    payload.keyword = filter.value.keyword.trim();
  }
  if (filter.value.candidateStatus) {
    payload.candidateStatus = filter.value.candidateStatus.value;
  }
  const res = await getAppliedJobAdsUnpaged(payload);
  // console.log({ res });
  if (!res) {
    isLoading.value = false;
    return;
  }
  list.value = [...list.value, ...res.data.data];

  if (res.data.data.length) {
    isEmpty.value = false;
  } else {
    isEmpty.value = true;
  }

  total.value = res.data.data.length;

  isLoading.value = false;
}

const debounced = debounce((key: string, value: any) => {
  filter.value[key] = value;
}, 300);

function handleInputDebounce(key: string, value: any) {
  debounced(key, value);
}

function handleInput(key: string, value: any) {
  filter.value[key] = value;
}

function handleSetOpenMessage(jobAd: any) {
  currentOpenMessage.value = jobAd;

  router.replace({
    query: {
      ...route.query,
      id: jobAd.id,
    },
  });
}

watch(
  filter,
  (newVal) => {
    list.value = [];
    fetchData();
  },
  { deep: true },
);

watch(
  () => route.query.id,
  (newId) => {
    if (currentOpenMessage.value.id != newId) {
      const message = list.value.find((m: any) => m.id == newId);
      currentOpenMessage.value = message;
    }
  },
);

watch(
  () => subscribe.value("chatStream"),
  (newMessage) => {
    if (newMessage.topic == PUB_SUB_TOPIC.NEW_MESSAGE) {
      const candidateId = newMessage.data.candidateId;
      const jobAdId = newMessage.data.jobAdId;

      // console.log({ list: list.value });

      const idx = list.value.findIndex(
        (item: any) =>
          item.candidateInfo.candidateId == candidateId &&
          item.jobAd.id == jobAdId,
      );

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
    }

    if (newMessage.topic == PUB_SUB_TOPIC.MESSAGE_READ) {
      const candidateId = newMessage.data.candidateId;
      const jobAdId = newMessage.data.jobAdId;

      const card = list.value.find(
        (item: any) =>
          item.candidateInfo.candidateId == candidateId &&
          item.jobAd.id == jobAdId,
      );

      card.hasMessageUnread = false;
    }
  },
);
</script>
<style lang="scss" scoped>
.job-ad-list {
  overflow: auto;
  min-height: calc(100vh - 54px);
  display: flex;
  flex-direction: column;

  .content {
    flex: 1;
    width: 100%;

    margin: 0 auto;

    padding-top: 12px;
    padding-bottom: 12px;
    min-height: calc(100vh - 54px);
    max-height: calc(100vh - 54px);

    max-width: min(85%, 1440px);
    width: min(85%, 1440px);
    @media (max-width: 768px) {
      max-width: 100%;
      width: 100%;
    }
    display: flex;
    flex-direction: row;
    gap: 8px;

    .wrapper {
      background-color: white;
      padding: 12px;
      padding-bottom: 14px;
      border-radius: 12px;
      width: 100%;
      @include box-shadow;
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-height: 100%;

      .title {
        font-weight: 700;
        font-size: 16px;
        line-height: 20px;
      }

      .filter {
        display: flex;
        flex-direction: row;
        gap: 12px;
        align-items: center;
        flex-wrap: wrap;
        background-color: white;

        .count {
          color: $color-gray-400;
          font-style: italic;
          font-size: 14px;
        }

        .right {
          display: flex;
          flex-direction: row;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }

        .filter-btn,
        .sort-btn {
          background-color: $color-gray-100;
          border-radius: 999px;
          cursor: pointer;
          height: 36px;
          width: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: $color-primary-500;
          .iconify {
            display: block;
            font-size: 20px;
          }
        }

        .search-bar {
          flex: 1;
          :deep(.input) {
            padding: 6px 8px;
            input {
              font-size: 14px;
              min-width: 0;
            }
          }
        }

        .job-ad-status-select {
          max-width: 140px;
          width: 140px;
          min-width: 140px;
        }
      }

      .content-wrapper {
        display: flex;
        flex-direction: row;
        gap: 8px;
        flex: 1;
        min-height: 0;

        :deep(.panel) {
          width: 40%;
          max-height: 100%;
        }

        :deep(.job-ad-info) {
          width: 30%;
          overflow: auto;
          overscroll-behavior: contain;
          max-height: 100%;
        }

        .message-card-list-wrapper {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 30%;

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
        .message-cards-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
          min-height: 0;
          overflow: auto;
          scroll-behavior: contain;

          .spinner {
            height: 24px;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .show-more {
            height: 24px;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;

            font-size: 14px;
            color: $color-primary-500;
            text-decoration: underline;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
