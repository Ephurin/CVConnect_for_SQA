<template>
  <div class="overview-card">
    <div class="info">
      <div class="left">
        <div class="num">
          {{ props.num }}
        </div>
        <div class="text">
          {{ props.str }}
        </div>
      </div>
      <div class="icon">
        <Icon :name="props.icon" />
      </div>
    </div>
    <div
      v-if="props.diffString"
      class="diff-text"
      :class="{ positive: isPositive, negative: !isPositive }"
    >
      {{ props.diffString }}
    </div>
  </div>
</template>
<script setup lang="ts">
type TProps = {
  num: number | string;
  str: string;
  icon: string;
  diffString: string | undefined | null;
};

const props = defineProps<TProps>();

const isPositive = computed(() => {
  if (!props.diffString) {
    return false;
  }

  return props.diffString[0] == "+";
});
</script>
<style lang="scss" scoped>
.overview-card {
  @include box-shadow;
  background-color: white;
  padding: 12px;
  border-radius: 8px;

  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 180px;
  width: calc((100% - 64px) * 0.2);

  .icon {
    border-radius: 8px;
    padding: 8px;
    background-color: rgba($color-primary-400, 0.08);
    width: fit-content;
    height: fit-content;

    .iconify {
      display: block;
      font-size: 20px;
      width: 20px;
      min-width: 20px;
      height: 20px;
      color: $color-primary-400;
    }
  }

  .info {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 8px;

    .left {
      display: flex;
      flex-direction: row;
      gap: 4px;
    }
  }

  .num {
    font-size: 28px;
    font-weight: 600;
  }

  .text {
    font-size: 12px;
    font-weight: 500;
    align-self: flex-end;
    margin-bottom: 6px;
  }

  .diff-text {
    font-size: 13px;
    font-weight: 500;

    &.positive {
      color: $color-success;
    }
    &.negative {
      color: $color-danger;
    }
  }
}
</style>
