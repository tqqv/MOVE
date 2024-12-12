<script setup>
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
  <div class="flex gap-x-4">
    <div
      class="flex flex-col gap-y-4 w-1/2 border border-gray-dark rounded-lg p-3"
      :class="{ 'w-full': !account?.channel }"
    >
      <span class="text-center bg-custom py-2 font-bold text-lg uppercase">user</span>
      <div class="flex justify-center">
        <img :src="account?.user?.avatar" alt="" class="size-14 rounded-full object-cover" />
      </div>

      <div class="flex flex-col gap-y-1.5 px-3 text-sm">
        <div class="flex gap-x-1">
          <span class="font-semibold">Username: </span>
          <span>{{ account?.user?.username }}</span>
        </div>
        <div class="flex gap-x-1">
          <span class="font-semibold">Fullname: </span>
          <span>{{ account?.user?.fullname }}</span>
        </div>
        <div class="flex gap-x-1">
          <span class="font-semibold">Email: </span>
          <span>{{ account?.user?.email }}</span>
        </div>
        <div class="flex gap-x-1">
          <span class="font-semibold">Gender: </span>
          <span>{{ account?.user?.gender }}</span>
        </div>
        <div class="flex gap-x-1">
          <span class="font-semibold">Date of birth: </span>
          <span>{{ account?.user?.dateOfBirth }}</span>
        </div>
        <div class="flex gap-x-1">
          <span class="font-semibold">Address: </span>
          <span class="flex gap-x-1"
            >{{ account?.user?.city }}, {{ account?.user?.state }}.
            {{ account?.user?.country }}</span
          >
        </div>
      </div>
    </div>
    <div
      v-if="account?.channel"
      class="flex flex-col gap-y-4 w-1/2 border border-gray-dark rounded-lg p-3"
    >
      <span class="text-center bg-custom py-2 font-bold text-lg uppercase">channel</span>
      <div class="flex justify-center">
        <img :src="account?.channel?.avatar" alt="" class="size-14 rounded-full object-cover" />
      </div>

      <div class="flex flex-col gap-y-1.5 px-3 text-sm">
        <div class="flex gap-x-1">
          <span class="font-semibold">Channel name: </span>
          <span>{{ account?.channel?.channelName }}</span>
        </div>
        <div class="flex gap-x-1">
          <span class="font-semibold">Bio: </span>
          <span>{{ account?.channel?.bio }}</span>
        </div>
        <div class="flex gap-x-1">
          <span class="font-semibold">Facebook: </span>
          <span>{{ account?.channel?.facebook }}</span>
        </div>
        <div class="flex gap-x-1">
          <span class="font-semibold">Instagram: </span>
          <span>{{ account?.channel?.instagram }}</span>
        </div>
        <div class="flex gap-x-1">
          <span class="font-semibold">Youtube: </span>
          <span>{{ account?.channel?.youtube }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
