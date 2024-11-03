<script setup>
  import EndLiveStream from './EndLiveStream.vue';
  import InLiveStream from './InLiveStream.vue';
  const props = defineProps({
    connectOBS: Boolean,
    liveStatus: String,
  });
</script>
<template>
  <section>
    <!-- INLIVESTREAM -->
    <InLiveStream
      v-if="props.connectOBS === 'streamPublished' || props.liveStatus === 'streamPublished' ||  props.liveStatus === 'streamReady' || props.liveStatus == null"
      :connectOBS="connectOBS"
      :liveStatus="liveStatus"
    />
    <!-- END LIVE STREAM -->
    <EndLiveStream v-if="props.liveStatus === 'streamEnded'" />
  </section>
</template>
