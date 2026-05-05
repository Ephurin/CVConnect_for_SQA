<template>
  <div class="candidate-content">
    màn hình candidate
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "system-admin",
});
useHead({
  title: "Ứng viên",
});
</script>

<style lang="scss" scoped>
.candidate-content {
  background-color: white;
  border-radius: 8px;
  margin-top: 4px;
  min-height: calc(100% - 48px - 4px);
  @include box-shadow;
  color: $text-light;
  padding: 12px;
  padding-top: 24px;
}
</style>
