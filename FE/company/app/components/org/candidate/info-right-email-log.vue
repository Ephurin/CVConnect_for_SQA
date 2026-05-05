<template>
  <div class="mail-log">
    <OrgCandidateSendMailModal
      v-model="isSendEmailModalOpen"
      :job-ad-info="selectedJobAdInfo"
      :candidate-info="props.candidateInfo"
      @sent="handleSentEmail"
    />
    <div class="top">
      <template v-if="!hasConfigMail">
        <div v-if="isOrgAdmin" class="mail-config-alert">
          Doanh nghiệp của bạn chưa thiết lập mail tự động. Thiết lập ngay
          <a href="/org-admin/email-template" target="_blank">tại đây</a>
        </div>
        <div v-else class="mail-config-alert">
          Doanh nghiệp của bạn chưa thiết lập mail tự động, vui lòng liên hệ với
          nhân viên quản trị của doanh nghiệp.
        </div>
      </template>
      <template v-else>
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
        <div class="right">
          <AppButton
            :text="''"
            class="refresh"
            :is-disabled="!selectedJobAd"
            @click="() => fetchEmailLogs()"
          >
            <template #icon>
              <Icon
                class="refresh-icon"
                name="material-symbols:refresh-rounded"
              />
            </template>
          </AppButton>
          <AppButton
            :text="'Gửi email'"
            class="send-mail-button"
            :title="
              !selectedJobAd ? 'Hãy chọn tin tuyển dụng để gửi email' : ''
            "
            :is-disabled="!selectedJobAd"
            @click="() => (isSendEmailModalOpen = true)"
          />
        </div>
      </template>
    </div>
    <div class="email-list">
      <AppNoData v-if="isNodata" />
      <OrgCandidateEmailDetail
        v-for="email of emailList"
        :key="email.id"
        :email-info="email"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  BROADCAST_CHANNEL,
  BROADCAST_MESSAGE_TYPE,
} from "~/const/views/org-admin/email-template";

type TProps = {
  jobAds: any[];
  candidateInfo: any;
};

const { getEmailLog } = useCandidateApi();
const { setLoading } = useLoadingStore();
const { getMailTemplateConfig } = useMailTemplateApi();

const authStore = useAuthStore();
const { currentRole } = storeToRefs(authStore);

const selectedJobAd = ref<any>(null);
const isSendEmailModalOpen = ref<boolean>(false);
const emailList = ref<any[]>([]);
const isNodata = ref<boolean>(false);

const hasConfigMail = ref<boolean>(false);
const broadcastChannel = ref<BroadcastChannel | null>(null);

const props = defineProps<TProps>();

onBeforeMount(async () => {
  broadcastChannel.value = new BroadcastChannel(BROADCAST_CHANNEL.MAIL_CONFIG);
  broadcastChannel.value.onmessage = async (event) => {
    if (event.data?.type === BROADCAST_MESSAGE_TYPE.MAIL_CONFIG_UPDATE) {
      hasConfigMail.value = false;
      const res = await getMailTemplateConfig();
      if (res && res.data) {
        hasConfigMail.value = true;
      } else {
        hasConfigMail.value = false;
      }
    }
  };
  const res = await getMailTemplateConfig();
  if (res && res.data) {
    hasConfigMail.value = true;
  } else {
    hasConfigMail.value = false;
  }

  if (props.jobAds.length) {
    const ad = props.jobAds[0];
    selectedJobAd.value = {
      label: ad.jobAd.title,
      value: ad.jobAd.id,
    };
  }
});

const isOrgAdmin = computed(() => {
  return currentRole.value?.code == "ORG_ADMIN";
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

async function fetchEmailLogs() {
  setLoading(true);
  const res = await getEmailLog(
    props.candidateInfo.id,
    selectedJobAd.value.value,
  );
  emailList.value = res.data;
  if (res.data.length == 0) {
    isNodata.value = true;
  } else {
    isNodata.value = false;
  }

  setLoading(false);
}

function handleSentEmail() {
  isSendEmailModalOpen.value = false;
  fetchEmailLogs();
}

watch(selectedJobAd, async (newVal) => {
  if (!newVal || newVal.value == -1) {
    return;
  }

  fetchEmailLogs();
  setLoading(false);
});
</script>
<style lang="scss" scoped>
.mail-log {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 100%;

  .top {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
    row-gap: 8px;

    .mail-config-alert {
      color: $text-light;
      font-size: 14px;

      a {
        color: $color-primary-500;
        text-decoration: underline;
        font-weight: 500;
      }
    }

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

    .send-mail-button {
      padding: 7px 12px;
      font-size: 14px;
      line-height: 20px;
      background-color: $color-primary-500;
      color: $text-dark;

      &.disabled {
        background-color: $color-gray-400;
      }
    }

    .refresh {
      padding: 0px;
      gap: 0px;
      .refresh-icon {
        font-size: 20px;
      }
    }
  }

  .divider {
    width: 100%;
    height: 1px;
    display: block;
    background-color: $color-gray-200;
  }

  .email-list {
    flex: 1;
    min-height: 0;
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 12px;
  }
}
</style>
