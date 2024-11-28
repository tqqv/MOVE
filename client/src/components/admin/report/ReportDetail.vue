<script setup>
  import { watch, ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import Button from 'primevue/button';
  import Verified from '@/components/icons/verified.vue';
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import Gift from '@/components/icons/gift.vue';
  import VideoCard from '@/components/VideoCard.vue';
  import Tag from 'primevue/tag';

  dayjs.extend(relativeTime);
  const route = useRoute();
  const router = useRouter();
  const reportId = ref('');

  const timeFromNow = (createdAt) => {
    return dayjs(createdAt, 'YYYY-MM-DD HH:mm:ss').fromNow();
  };

  onMounted(() => {
    reportId.value = route.params.reportId;
  });
  watch(
    () => route.params.reportId,
    async (newReportId) => {
      reportId.value = newReportId;
      console.log(newReportId);
    },
  );
  const videos = [
    {
      category: { title: 'Boxing' },
      categoryId: '2',
      channel: {
        User: {
          username: 'yetserlewlewlelew',
        },
        avatar: 'https://img.upanh.tv/2024/06/18/user-avatar.png',
        channelName: 'Hieu ne ',
        isLive: false,
        popularCheck: true,
      },
      channelId: '2',
      createdAt: '2024-10-25T22:04:09.000Z',
      description: 'test',
      duration: 23,
      id: '1023433692',
      isBanned: false,
      isCommentable: true,
      levelWorkout: { levelWorkout: 'Beginner' },
      levelWorkoutsId: '1',
      ratings: '1.0000',
      status: 'public',
      thumbnailUrl:
        'https://images.pexels.com/photos/598686/pexels-photo-598686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      title: 'Top 10 Boxing Combos You Need to Know',
      totalShare: 0,
      updatedAt: '2024-11-27T15:28:39.000Z',
      videoUrl: 'https://player.vimeo.com/video/1023433692?h=21b2e8f0a1',
      viewCount: 49,
    },
  ];
</script>
<template>
  <section class="bg-[#FAFAFB]">
    <div class="container">
      <div class="card bg-white p-4 shadow rounded-lg">
        <div class="flex justify-between items-center">
          <h1 class="text-[24px] font-bold">
            Report Detail <span class="opacity-50 text-[20px]">#112312313</span>
          </h1>
          <Tag value="Pending" severity="info" class="text-[16px]" />
        </div>
        <div class="grid grid-cols-12 gap-4 mt-5">
          <div class="col-span-4 bg-white p-5 rounded shadow">
            <div>
              <h2 class="text-[20px] font-semibold">Reporter</h2>
              <p class="mt-3 font-medium">Account Id: <span class="opacity-50">21312312</span></p>
              <p class="mt-3 font-medium">Role: <span class="opacity-50">User</span></p>
              <div class="flex items-center gap-4 mt-3">
                <img
                  alt="https://lh3.googleusercontent.com/a/ACg8ocLD0zBeWhE6AogwnEVG6hkW1s1cRVP38V6qv5d0ECCJI9QHsg=s96-c"
                  src="https://lh3.googleusercontent.com/a/ACg8ocLD0zBeWhE6AogwnEVG6hkW1s1cRVP38V6qv5d0ECCJI9QHsg=s96-c"
                  style="width: 40px"
                  class="rounded-full"
                />
                <div class="mt-3">
                  <p class="font-semibold">vietzz771</p>
                  <p>ththth@gmail.com</p>
                </div>
              </div>
            </div>
            <div class="flex items-center justify-center mt-3">
              <div class="flex-1 border-t opacity-25"></div>
              <i class="pi pi-arrow-circle-down mx-4 text-[30px] text-red"></i>
              <div class="flex-1 border-t opacity-25"></div>
            </div>
            <div>
              <h2 class="text-[20px] font-semibold">Target Account</h2>
              <p class="mt-3 font-medium">Account Id: <span class="opacity-50">21312312</span></p>
              <p class="mt-3 font-medium">Role: <span class="opacity-50">Channel</span></p>
              <div class="flex items-center gap-4 mt-3">
                <img
                  alt="https://lh3.googleusercontent.com/a/ACg8ocLD0zBeWhE6AogwnEVG6hkW1s1cRVP38V6qv5d0ECCJI9QHsg=s96-c"
                  src="https://img.upanh.tv/2024/06/18/user-avatar.png"
                  style="width: 40px"
                  class="rounded-full"
                />
                <div class="mt-3">
                  <p class="font-semibold">vietzz771</p>
                  <p>ththth@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
          <div class="col-span-8 bg-white p-5 rounded shadow">
            <div>
              <p class="mt-3 font-medium">Report type: <span class="opacity-50">Comment</span></p>
              <p class="mt-3 font-medium">
                Description: <span class="opacity-50">Nudity or sexual activity</span>
              </p>
            </div>
            <div v-if="reportId === '1'">
              <div>
                <p class="mt-3 font-medium">The content of the comment was reported:</p>
                <div class="flex gap-x-4 mt-4">
                  <div class="flex-shrink-0">
                    <img
                      src="https://img.upanh.tv/2024/06/18/user-avatar.png"
                      alt="Avatar"
                      class="size-10 object-cover rounded-full"
                    />
                  </div>
                  <div>
                    <div class="flex justify-between items-center gap-x-4 w-fit">
                      <h1 class="font-bold">vietzz771</h1>
                      <span>
                        <Verified class="fill-blue" />
                      </span>
                      <div class="flex items-center whitespace-nowrap">
                        <Gift class="mr-1" />
                        <span class="text-xs mt-1 text-[#FFB564]">Gifted 123 REPs</span>
                      </div>
                      <p class="pt-0.5 whitespace-nowrap text-xs text-[#666666]">
                        {{ timeFromNow('2024-10-26 01:40:18') }}
                      </p>
                    </div>
                    <!-- COMMENT -->
                    <div ref="textElement" class="break-all text-sm text-black">
                      <p>toi bi ngu</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <p class="mt-3 font-medium">In video:</p>
                <div class="w-[50%] mt-4"><VideoCard :videos="videos" /></div>
              </div>
            </div>
            <div v-if="reportId === '2'">
              <p class="mt-3 font-medium">The content of the video was reported:</p>
              <div class="w-[50%] mt-4"><VideoCard :videos="videos" /></div>
            </div>
          </div>
        </div>
        <div class="flex gap-x-4 justify-end mt-4">
          <Button label="Spam" severity="contrast" />
          <Button label="Suspend" severity="danger" />
          <Button label="Accept" severity="warn" />
          <Button label="Reject" severity="secondary" />
        </div>
      </div>
    </div>
  </section>
</template>
