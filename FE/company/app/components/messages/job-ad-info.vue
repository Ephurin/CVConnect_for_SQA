<template>
  <div class="job-ad-info">
    <!-- <div class="top row space-between"> -->
    <!-- <div class="logo-section"> -->
    <!--   <div class="logo"> -->
    <!--     <img :src="props.data.org?.logoUrl" alt="Logo công ty" /> -->
    <!--   </div> -->
    <!--   <div class="info-section"> -->
    <!--     <div class="title"> -->
    <!--       {{ props.data.jobAd.title }} -->
    <!--       <Icon -->
    <!--         class="external-link" -->
    <!--         name="ci:external-link" -->
    <!--         @click="handleViewDetailJob" -->
    <!--       /> -->
    <!--     </div> -->
    <!--     <div class="company-name">{{ props.data.org.name }}</div> -->
    <!--     <div class="block"> -->
    <!--       <div class="label"> -->
    <!--         <Icon name="material-symbols:event-available-rounded" /> -->
    <!--         <span>Ngày ứng tuyển</span> -->
    <!--       </div> -->
    <!--       <span class="value">{{ -->
    <!--         formatDateTime(props.data.applyDate, "DD/MM/YYYY HH:mm") -->
    <!--       }}</span> -->
    <!--     </div> -->
    <!--   </div> -->
    <!-- </div> -->
    <!-- </div> -->
    <div class="body">
      <div class="title">Thông tin thêm</div>
      <div class="block">
        <div class="label">
          <Icon name="pajamas:status-neutral" />
          <span>Trạng thái</span>
        </div>
        <span class="value">
          <span
            class="value chip"
            :style="{
              borderColor:
                CANDIDATE_STATUS[props.data.candidateStatusDto.name].color,
              color: CANDIDATE_STATUS[props.data.candidateStatusDto.name].color,
              backgroundColor:
                CANDIDATE_STATUS[props.data.candidateStatusDto.name].background,
            }"
            >{{ props.data.candidateStatusDto.label }}</span
          ></span
        >
      </div>
      <div class="block">
        <div class="label">
          <Icon name="material-symbols:event-available-rounded" />
          <span>Ngày ứng tuyển</span>
        </div>
        <span class="value">{{
          formatDateTime(props.data.applyDate, "DD/MM/YYYY HH:mm")
        }}</span>
      </div>
      <!-- <div class="block"> -->
      <!--   <div class="label"> -->
      <!--     <Icon name="fluent:step-24-filled" /> -->
      <!--     <span>Vòng hiện tại</span> -->
      <!--   </div> -->
      <!--   <span -->
      <!--     class="chip" -->
      <!--     :style="{ -->
      <!--       borderColor: PROCESS_COLOR_CODE[props.data.currentRound.code], -->
      <!--       color: PROCESS_COLOR_CODE[props.data.currentRound.code], -->
      <!--       backgroundColor: `${PROCESS_COLOR_CODE[props.data.currentRound.code]}0D`, -->
      <!--     }" -->
      <!--   > -->
      <!--     {{ props.data.currentRound.name }} -->
      <!--   </span> -->
      <!-- </div> -->
      <div
        v-if="
          props.data.onboardDate &&
          props.data.candidateStatusDto.name != 'REJECTED'
        "
        class="block"
      >
        <div class="label">
          <Icon name="material-symbols:event-available-rounded" />
          <span>Ngày onboard</span>
        </div>
        <span class="value">{{
          formatDateTime(props.data.onboardDate, "DD/MM/YYYY HH:mm")
        }}</span>
      </div>
      <div
        v-if="props.data.candidateStatusDto.name == 'REJECTED'"
        class="block"
      >
        <div class="label">
          <Icon name="material-symbols:event-busy-rounded" />
          <span>Ngày bị loại</span>
        </div>
        <span class="value">{{
          formatDateTime(props.data.eliminateDate, "DD/MM/YYYY HH:mm")
        }}</span>
      </div>
      <div
        v-if="props.data.candidateStatusDto.name == 'REJECTED'"
        class="block"
      >
        <div class="label">
          <Icon name="material-symbols:edit-note-rounded" />
          <span>Lí do bị loại</span>
        </div>
        <span class="value">{{ props.data.eliminateReason.description }}</span>
      </div>
      <div class="processes">
        <div class="list">
          <div
            v-for="(process, index) of props.data.jobAdProcessCandidates"
            :key="process.id"
            :title="processTooltip(process)"
            class="process"
          >
            <div
              v-if="index !== 0"
              class="line"
              :class="{
                highlighted:
                  index <= displayJobAdCurrentProcessIndex(props.data),
              }"
            >
              <span></span>
            </div>
            <div
              class="dot"
              :class="{
                highlighted:
                  index <= displayJobAdCurrentProcessIndex(props.data),
              }"
            >
              <Icon name="stash:circle-dot" />
              <span>{{ process.processName }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="divider"></div>
      <div class="misc">
        <div class="title">Thông tin ứng tuyển</div>
        <div class="row">
          <AppInputText
            :label="'Tên'"
            :required="false"
            :error="''"
            :placeholder="''"
            :value="props.data.candidateInfo.fullName"
            :is-disabled="true"
            :slim-error="true"
            :title="''"
            class="text-input"
          />
        </div>
        <AppInputText
          :label="'Email'"
          :required="false"
          :error="''"
          :placeholder="''"
          :value="props.data.candidateInfo.email"
          :is-disabled="true"
          :slim-error="true"
          :title="''"
          class="text-input"
        />
        <div class="row">
          <AppInputText
            :label="'SĐT'"
            :required="false"
            :error="''"
            :placeholder="''"
            :value="props.data.candidateInfo.phone"
            :is-disabled="true"
            :slim-error="true"
            :title="''"
            class="text-input"
          />
        </div>
        <div class="preview-cv" @click="handlePreviewCV">
          <div class="text">Xem CV</div>
          <Icon name="ci:external-link" />
        </div>
        <AppInputTextarea
          :model-value="props.data.candidateInfo.coverLetter"
          :label="'Cover letter'"
          :required="false"
          :is-disabled="true"
          :placeholder="''"
          :error="''"
          :show-error="false"
          :slim-error="true"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { CANDIDATE_STATUS } from "~/const/views/org/candidates";
import { PROCESS_COLOR_CODE } from "~/const/views/system-admin/process-type";

type TProps = {
  data: any;
};

const router = useRouter();

const props = defineProps<TProps>();

const processTooltip = computed(() => {
  return (process: any) => {
    let tooltip = "";
    if (process.actionDate) {
      const dateTime = formatDateTime(process.actionDate, "DD/MM/YYYY HH:mm");
      if (process.processName == "Ứng tuyển") {
        tooltip += `Ngày ứng tuyển: ${dateTime}`;
      } else {
        tooltip += `Ngày chuyển vòng: ${dateTime}`;
      }
    }

    return tooltip;
  };
});

const displayJobAdCurrentProcessIndex = computed(() => {
  return (displayJobAd: any) => {
    let index = displayJobAd.jobAdProcessCandidates.findIndex(
      (process: any) => process.isCurrentProcess,
    );
    if (index == -1) {
      index = 0;
    }

    return index;
  };
});

function handlePreviewCV() {
  window.open(props.data.candidateInfo.cvUrl, "_blank");
}
</script>
<style lang="scss" scoped>
.job-ad-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid $color-gray-300;
  width: 100%;
  color: $text-light;

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
  }

  .top {
    align-items: flex-start;

    .info-section {
      display: flex;
      flex-direction: column;
      gap: 2px;

      .company-name {
        color: $color-gray-400;
        font-size: 14px;
      }
    }

    .logo-section {
      display: flex;
      flex-direction: row;
      gap: 8px;

      .logo {
        display: block;
        height: 64px;
        width: 64px;
        min-width: 64px;
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

    .processes {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      gap: 8px;

      .list {
        display: flex;
        flex-direction: column;

        .process {
          display: flex;
          flex-direction: column;

          .line {
            padding-left: 9px;
            &.highlighted {
              span {
                background-color: $color-primary-500;
              }
            }
            span {
              height: 16px;
              width: 2px;
              display: block;
              background-color: $color-gray-300;
            }
          }

          .dot {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 4px;
            color: $color-gray-300;

            span {
              font-size: 13px;
            }

            &.highlighted {
              color: $color-primary-500;
            }

            .iconify {
              display: block;
              font-size: 20px;
              min-width: 20px;
              min-height: 20px;
            }
          }
        }
      }

      .actions {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .action-btn {
          height: 32px;
          width: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid $color-primary-500;
          cursor: pointer;
          border-radius: 4px;

          .iconify {
            font-size: 18px;
          }

          &.next-step-btn {
            border-color: $color-success;
            color: $color-success;
          }

          &.onboard-btn {
            border-color: $color-success;
            color: $color-success;
          }

          &.not-onboard-btn {
            border-color: $color-danger;
            color: $color-danger;
          }

          &.edit-onboard-date-btn {
            border-color: $color-warning;
            color: $color-warning;
          }

          &.reject-btn {
            border-color: $color-danger;
            color: $color-danger;
          }
        }
      }
    }

    .misc {
      display: flex;
      flex-direction: column;
      gap: 8px;
      :deep(.text-input) {
        flex: 1;
        .input {
          padding: 6px 8px;
          input {
            font-size: 14px;
          }
        }
      }

      :deep(textarea) {
        max-height: 280px;
      }

      .preview-cv {
        display: flex;
        flex-direction: row;
        gap: 4px;
        cursor: pointer;
        width: fit-content;

        .text {
          color: $text-light;
          font-size: 14px;
        }

        .iconify {
          font-size: 20px;
          display: block;
          width: 20px;
          height: 20px;
          min-width: 20px;

          color: $color-info;
        }
      }
    }
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
