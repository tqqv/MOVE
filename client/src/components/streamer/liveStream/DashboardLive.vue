<script setup>
  import EndLiveStream from './EndLiveStream.vue';
  import InLiveStream from './InLiveStream.vue';
  const props = defineProps({
    statusLive: String,
    connectOBS: Boolean,
    liveStatus: String
  });
</script>
<template>
  <section>
    <!-- INLIVESTREAM -->
    <InLiveStream
      v-if="!props.connectOBS || props.liveStatus === 'public'"
      :connectOBS="connectOBS"
    />
    <!-- END LIVE STREAM -->
    <EndLiveStream v-if="props.statusLive === 'afterLive'" />
  </section>
</template>
