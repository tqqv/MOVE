<script setup>
  import EndLiveStream from './EndLiveStream.vue';
  import InLiveStream from './InLiveStream.vue';
  const props = defineProps({
    connectOBS: String,
    liveStatus: String,
    elapsedTime: Number,
  });
</script>
<template>
  <section>
    <!-- INLIVESTREAM -->
    <InLiveStream
      v-if="
        props.connectOBS === 'streamPublished' ||
        props.liveStatus === 'streamPublished' ||
        props.liveStatus === 'streamReady' ||
        props.liveStatus == null
      "
      :connectOBS="connectOBS"
      :liveStatus="liveStatus"
      :elapsedTime="elapsedTime"
    />
    <!-- END LIVE STREAM -->
    <EndLiveStream :liveStatus="liveStatus" v-if="props.liveStatus === 'streamEnded'" />
  </section>
</template>
