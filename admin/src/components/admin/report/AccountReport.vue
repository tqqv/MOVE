<script setup>
  const props = defineProps({
    accountDetail: Object,
  });
  const account = {
    user: {
      avatar:
        'https://lh3.googleusercontent.com/a/ACg8ocLD0zBeWhE6AogwnEVG6hkW1s1cRVP38V6qv5d0ECCJI9QHsg=s96-c',
      username: 'npmh310',
      fullname: 'Nguyen Phuoc Minh Hieu',
      email: 'ngphminhhieu310@gmail.com',
      gender: 'male',
      dateOfBirth: '03-10-2002',
      country: 'Vietnam',
      state: 'Da Nang',
      city: 'Ngu Hanh Son',
    },
    channel: {
      avatar:
        'https://lh3.googleusercontent.com/a/ACg8ocLD0zBeWhE6AogwnEVG6hkW1s1cRVP38V6qv5d0ECCJI9QHsg=s96-c',
      channelName: 'Hieu ne',
      bio: `A fitness-focused streamer sharing gym tips, workout routines, and nutrition advice.
                  Inspiring others to embrace a healthy lifestyle while building strength and confidence.
                  Join my journey to transform, push limits, and achieve your best self! 💪`,

      facebook: 'facebook.com',
      instagram: 'instagram.com',
      youtube: 'youtube.com',
    },
  };
</script>

<template>
  <div class="flex justify-center gap-x-4">
    <div class="flex flex-col gap-y-4 w-1/2 border border-gray-dark rounded-lg p-3">
      <span class="text-center bg-custom py-2 font-bold text-lg uppercase">user</span>
      <div class="flex justify-center">
        <img
          :src="
            props.accountDetail?.Channel?.User?.avatar || props.accountDetail?.targetUser?.avatar
          "
          alt=""
          class="size-14 rounded-full object-cover"
        />
      </div>

      <div class="flex flex-col gap-y-1.5 px-3 text-sm">
        <div class="flex gap-x-1 flex-wrap">
          <span class="font-semibold">Username: </span>
          <span>{{
            props.accountDetail?.Channel?.User?.username ||
            props.accountDetail?.targetUser?.username
          }}</span>
        </div>
        <div class="flex gap-x-1 flex-wrap">
          <span class="font-semibold">Fullname: </span>
          <span>{{
            props.accountDetail?.Channel?.User?.fullName ||
            props.accountDetail?.targetUser?.fullName
          }}</span>
        </div>
        <div class="flex gap-x-1 flex-wrap">
          <span class="font-semibold">Email: </span>
          <span>{{
            props.accountDetail?.Channel?.User?.email || props.accountDetail?.targetUser?.email
          }}</span>
        </div>
        <div class="flex gap-x-1 flex-wrap">
          <span class="font-semibold">Gender: </span>
          <span>{{
            props.accountDetail?.Channel?.User?.gender || props.accountDetail?.targetUser?.gender
          }}</span>
        </div>
        <div class="flex gap-x-1 flex-wrap">
          <span class="font-semibold">Date of birth: </span>
          <span>{{
            props.accountDetail?.Channel?.User?.dob || props.accountDetail?.targetUser?.dob
          }}</span>
        </div>
        <div class="flex gap-x-1 flex-wrap">
          <span class="font-semibold">Address: </span>
          <span class="flex gap-x-1 flex-wrap"
            >{{
              props.accountDetail?.Channel?.User?.city || props.accountDetail?.targetUser?.city
            }},
            {{
              props.accountDetail?.Channel?.User?.state || props.accountDetail?.targetUser?.state
            }}.
            {{
              props.accountDetail?.Channel?.User?.country ||
              props.accountDetail?.targetUser?.country
            }}</span
          >
        </div>
      </div>
    </div>
    <div
      v-if="props.accountDetail?.Channel"
      class="flex flex-col gap-y-4 w-1/2 border border-gray-dark rounded-lg p-3"
    >
      <span class="text-center bg-custom py-2 font-bold text-lg uppercase">channel</span>
      <div class="flex justify-center">
        <img
          :src="props.accountDetail?.Channel?.avatar"
          alt=""
          class="size-14 rounded-full object-cover"
        />
      </div>

      <div class="flex flex-col gap-y-1.5 px-3 text-sm">
        <div class="flex gap-x-1 flex-wrap">
          <span class="font-semibold whitespace-nowrap">Channel name: </span>
          <span class="truncate">{{ props.accountDetail?.Channel?.channelName }} </span>
        </div>
        <div class="flex gap-x-1 flex-wrap">
          <span class="font-semibold">Bio: </span>
          <span>{{ props.accountDetail?.Channel?.bio }}</span>
        </div>
        <div class="flex gap-x-1 flex-wrap">
          <span class="font-semibold">Facebook: </span>
          <span>{{ props.accountDetail?.Channel?.facebookUrl }}</span>
        </div>
        <div class="flex gap-x-1 flex-wrap">
          <span class="font-semibold">Instagram: </span>
          <span>{{ props.accountDetail?.Channel?.youtubeUrl }}</span>
        </div>
        <div class="flex gap-x-1 flex-wrap">
          <span class="font-semibold">Youtube: </span>
          <span>{{ props.accountDetail?.Channel?.instaUrl }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
