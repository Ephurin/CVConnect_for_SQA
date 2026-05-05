<template>
  <div class="right">
    <AppTabber
      :tabs="tabs"
      :current-tab-index="currentTabIndex"
      @tab-switch="handleTabSwitch($event)"
    />
    <div class="content">
      <OrgCandidateInfoRightCv
        v-show="currentTabIndex == 1"
        :cv-link="props.detail.candidateInfo.attachFile.secureUrl"
      />
      <OrgCandidateInfoRightEvaluation
        v-show="currentTabIndex == 2"
        :job-ads="props.detail.jobAdCandidates"
        :candidate-info="props.detail.candidateInfo"
      />
      <OrgCandidateInfoRightCalendar
        v-show="currentTabIndex == 3"
        :job-ads="props.detail.jobAdCandidates"
        :candidate-info="props.detail.candidateInfo"
      />
      <template v-if="isHr">
        <OrgCandidateInfoRightConversation
          v-show="currentTabIndex == 4"
          :job-ads="props.detail.jobAdCandidates"
          :candidate-info="props.detail.candidateInfo"
        />
      </template>
      <template v-if="isEmailLogShow">
        <OrgCandidateInfoRightEmailLog
          v-show="currentTabIndex == 5"
          :job-ads="props.detail.jobAdCandidates"
          :candidate-info="props.detail.candidateInfo"
        />
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { CANDIDATE_DETAIL_RIGHT_TABS } from "~/const/views/org/candidates";

const route = useRoute();
const router = useRouter();

type TProps = {
  detail: Record<string, any>;
};

const props = defineProps<TProps>();

const currentTabIndex = ref<number>(1);

const authStore = useAuthStore();
const { currentRole, roles } = storeToRefs(authStore);

const isHr = computed(() => {
  // console.log({ role: currentRole.value });
  return currentRole.value?.code == "HR";
});

const isEmailLogShow = computed(() => {
  const rolesCode = roles.value.map((r) => r.code);
  // console.log({ rolesCode });
  if (!rolesCode.includes("HR") && !rolesCode.includes("ORG_ADMIN")) {
    return false;
  }
  return true;
});

onMounted(() => {
  const tabParam = route.query.tab as string | undefined;
  if (tabParam) {
    const foundTab = tabs.value.find((t) => t.paramKey === tabParam);
    if (foundTab) {
      currentTabIndex.value = foundTab.index;
    }
  }
});

const tabs = computed(() => {
  let _tabs = CANDIDATE_DETAIL_RIGHT_TABS;

  if (!isHr.value) {
    _tabs = _tabs.filter((TAB: any) => TAB.paramKey != "discussion");
  }

  if (!isEmailLogShow.value) {
    _tabs = _tabs.filter((TAB: any) => TAB.paramKey != "emails");
  }

  return _tabs;
});

async function handleTabSwitch(index: number) {
  currentTabIndex.value = index;
  const tab = tabs.value.find((t) => t.index === index);
  if (tab) {
    await router.replace({
      query: {
        ...route.query,
        tab: tab.paramKey,
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.right {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 100%;
  padding-top: 12px;

  :deep(.tab) {
    padding: 4px 16px;
  }

  .content {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    max-height: 100%;
  }
}
</style>
