<template>
  <div class="sidebar">
    <instance-specific-panel v-if="showInstanceSpecificPanel" />
    <staff-panel />
    <terms-of-service-panel />
    <MRFTransparencyPanel />
    <features-panel v-if="showFeaturesPanel" />
  </div>
</template>

<script src="./about.js"></script>

<style lang="scss">
</style>
