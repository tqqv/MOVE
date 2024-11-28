<script setup>
  import { ref, watch } from 'vue';
  import REPs1 from '../icons/REPsItems/REPs1.vue';
  import REPs2 from '../icons/REPsItems/REPs2.vue';
  import REPs3 from '../icons/REPsItems/REPs3.vue';
  import REPs4 from '../icons/REPsItems/REPs4.vue';
  import REPs5 from '../icons/REPsItems/REPs5.vue';

  const props = defineProps({
    listDonation: Array,
  });

  const donationWithEffect = ref([]);

  watch(
    () => props.listDonation,
    (newVal) => {
      if (newVal && newVal.length) {
        const newDonation = newVal[newVal.length - 1]; // add new value
        donationWithEffect.value.push({
          ...newDonation,
          isSlideOut: false,
          isHidden: false,
        });
        console.log(newVal);

        //detel value
        setTimeout(() => {
          donationWithEffect.value = donationWithEffect.value.filter(
            (item) => item !== newDonation,
          );
        }, 5000);
      }
    },
    { deep: true },
  );

  const handleAnimationEnd = (donation) => {
    // handle wait 3s to hidden in chat
  setTimeout(() => {
    donation.isSlideOut = true; 
    // handle delete value
    setTimeout(() => {
      donation.isHidden = true;
    }, 1000); 
  }, 3000);
};
</script>

<template>
  <div class="absolute top-8 left-0 z-10 text-black overflow-hidden">
    <div class="flex flex-col gap-y-3 mx-3">
      <div
        v-for="(donation, index) in donationWithEffect"
        :key="index"
        class="flex justify-start items-center gap-x-3 rounded-s-full px-1 py-1 custom-gradient w-64 transform"
        :class="{
          'animate-slideIn': !donation.isSlideOut,
          'animate-slideOut': donation.isSlideOut,
        }"
        v-show="!donation.isHidden"
        @animationend="() => handleAnimationEnd(donation)"
      >
        <div class="absolute flex h-[48px] rotate-box z-10 animate-slide">
          <div class="w-8 gradient-second transform"></div>
        </div>
        <div class="flex items-center gap-x-2 z-20">
          <img
            class="size-10 object-cover flex-shrink-0 rounded-full"
            :src="donation.avatar"
            alt=""
          />
          <div class="flex flex-col text-sm text-white">
            <span class="font-semibold text-primary">{{ donation.username }}</span>
            <span class="font-medium text-[11px] leading-4 italic"
              >Send
              <span class="font-semibold">{{ donation.donation }}</span>
              Reps</span
            >
          </div>
        </div>

        <div class="absolute flex items-center right-1 mt-3 z-20">
          <template v-if="donation.donation === 100"><REPs1 width="80" height="80" /></template>
          <template v-else-if="donation.donation === 1000"
            ><REPs2 width="80" height="80"
          /></template>
          <template v-else-if="donation.donation === 5000"
            ><REPs3 width="80" height="80"
          /></template>
          <template v-else-if="donation.donation === 10000"
            ><REPs4 width="80" height="80"
          /></template>
          <template v-else-if="donation.donation === 25000"
            ><REPs5 width="80" height="80"
          /></template>
          <div
            class="flex justify-center items-center gap-x-2 mb-3 font-extrabold italic text-[#ff5c22] drop-shadow-xl"
          >
            <span class="mt-1 border-stroke">X</span>
            <span class="text-4xl border-stroke animate-growShrink">1</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .custom-gradient {
    background: rgb(64, 65, 70);
    background: linear-gradient(
      90deg,
      rgba(64, 65, 70, 1) 39%,
      rgba(255, 255, 255, 0.07055322128851538) 92%
    );
  }
  .rotate-box {
    transform: skewX(145deg);
    transform-origin: center;
  }
  .border-stroke {
    -webkit-text-stroke: 1px #fff;
  }
  .gradient-second {
    background: rgb(255, 255, 255);
    background: linear-gradient(
      202deg,
      rgba(255, 255, 255, 1) 10%,
      rgba(255, 255, 255, 0.2190126050420168) 63%
    );
  }

  /* animation bong */
  @keyframes slide {
    0% {
      left: 10%;
    }
    100% {
      left: 80%;
    }
  }

  .animate-slide {
    animation: slide 1.6s cubic-bezier(0, 0.2, 0.4, 1) infinite;
  }

  /* animation donate */
  @keyframes slideIn {
    0% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(0);
    }
  }
  .animate-slideIn {
    animation: slideIn 0.7s ease-out forwards;
  }

  @keyframes slideOut {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-100%);
    }
  }

  /* animation number */
  .animate-slideOut {
    animation: slideOut 1s ease-in forwards;
  }

  @keyframes growShrink {
    0% {
      transform: scale(0.2);
      opacity: 1;
    }
    15% {
      transform: scale(1);
      opacity: 0.9;
    }
    25% {
      transform: scale(1.5);
      opacity: 0.9;
    }
    50% {
      transform: scale(2);
      opacity: 1;
    }
    75% {
      transform: scale(1.7);
      opacity: 0.95;
    }
    100% {
      transform: scale(1.3);
      opacity: 1;
    }
  }

  .animate-growShrink {
    animation: growShrink 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    animation-delay: 1.5s;
  }
</style>
