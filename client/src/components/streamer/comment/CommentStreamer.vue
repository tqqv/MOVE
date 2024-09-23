<script setup>
  import Filter from '@components/Filter.vue';
  import verified from '@icons/verified.vue';
  import rep from '@icons/rep.vue';
  import rep2500 from '@icons/reps25000.vue';

  const responsesOptions = [
    { id: 1, name: 'All responses' },
    { id: 2, name: "I haven't respond" },
    { id: 3, name: 'I have respond' },
  ];
  const sortOptions = [
    { id: 1, name: 'Most recent' },
    { id: 2, name: 'Received REPs' },
  ];

  const titleTable = ['comment', 'reps received', 'video'];

  // Mảng comment gồm các object khác nhau
  const comments = [
    {
      id: 1,
      username: 'npmh310',
      verified: true,
      timeAgo: '2 mins ago',
      comment:
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
      reps: 25000,
      video: {
        title: 'Leg day Leg day Leg day Leg day',
        type: 'Strength',
        duration: '3:20',
        thumbnail:
          'https://i.ytimg.com/vi/xzTIpgER4fc/hqdefault.jpg?sqp=-oaymwEcCPYBEIoBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBhm_M96W-S24VG-FhM6YioancFRA',
      },
      avatar:
        'https://scontent.fdad1-2.fna.fbcdn.net/v/t39.30808-6/457513733_122229466964002441_2844223550811568095_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=_y683D9_QXUQ7kNvgEr1OPI&_nc_ht=scontent.fdad1-2.fna&_nc_gid=Ail_MLNKHGAmPfXb28PHJlE&oh=00_AYDcW_OLkXaRnaAyiZKz5VnjywpfpSvjBq4G1ixvu3UtSw&oe=66F61FCB',
    },
    {
      id: 2,
      username: 'user_two',
      verified: false,
      timeAgo: '5 hours ago',
      comment:
        'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
      reps: 15000,
      video: {
        title: 'Core workout routine',
        type: 'Strength',
        duration: '4:15',
        thumbnail:
          'https://i.ytimg.com/vi/xzTIpgER4fc/hqdefault.jpg?sqp=-oaymwEcCPYBEIoBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBhm_M96W-S24VG-FhM6YioancFRA',
      },
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
      id: 3,
      username: 'user_three',
      verified: true,
      timeAgo: '1 day ago',
      comment:
        'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.',
      reps: 5000,
      video: {
        title: 'Upper body exercises',
        type: 'Endurance',
        duration: '2:45',
        thumbnail:
          'https://i.ytimg.com/vi/xzTIpgER4fc/hqdefault.jpg?sqp=-oaymwEcCPYBEIoBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBhm_M96W-S24VG-FhM6YioancFRA',
      },
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
  ];
</script>

<template>
  <section>
    <div class="flex justify-between px-10">
      <h1 class="text_title">Comments</h1>
      <div class="flex gap-x-20">
        <Filter :title="'responses'" :options="responsesOptions" />
        <Filter :title="'sort by'" :options="sortOptions" />
      </div>
    </div>
    <div class="py-5">
      <div class="relative overflow-x-auto">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead class="uppercase text-footer border-b-[1px] border-gray-dark">
            <tr>
              <th v-for="item in titleTable" :key="item" scope="col" class="p-6">{{ item }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="comment in comments"
              :key="comment.id"
              class="bg-white border-b-[1px] min-h-20 border-gray-dark"
            >
              <!-- COMMENT -->
              <td class="w-1/2 px-6 py-4 font-normal align-top text-gray-900">
                <div class="flex gap-x-4">
                  <img
                    :src="comment.avatar"
                    alt="avatar"
                    class="size-14 object-cover rounded-full"
                  />
                  <!-- RIGHT COMMENT -->
                  <div class="flex flex-col gap-y-1">
                    <!-- REPS SENDER -->
                    <div
                      class="flex items-center rounded-full bg-yellow-dark px-3 py-1 gap-x-1 mb-3 w-fit"
                    >
                      <rep />
                      <h1 class="text-white font-bold text-[10px]">REPs Sender</h1>
                    </div>
                    <!-- USERNAME -->
                    <div class="flex items-center gap-x-4">
                      <h1 class="font-bold">{{ comment.username }}</h1>
                      <span v-if="comment.verified" class="mb-1"
                        ><verified fill="fill-blue"
                      /></span>
                      <p class="text-xs text-footer">{{ comment.timeAgo }}</p>
                    </div>
                    <!-- COMMENT -->
                    <p class="text-sm break-words">
                      {{ comment.comment }}
                    </p>
                  </div>
                </div>
              </td>
              <!-- REPS RECEIVED -->
              <td class="w-[16%] px-6 py-4 align-top">
                <div class="flex items-center gap-x-2">
                  <div class="scale-50"><rep2500 /></div>
                  <p class="font-semibold text-base">{{ comment.reps }}</p>
                </div>
              </td>
              <!-- VIDEO -->
              <td class="px-6 py-4 align-top">
                <div class="flex gap-x-4">
                  <div class="relative w-1/2">
                    <div class="relative w-full aspect-video">
                      <img
                        :src="comment.video.thumbnail"
                        alt="video thumbnail"
                        class="object-cover w-full h-full"
                      />
                      <div
                        class="absolute bottom-2 right-2 p-2 bg-title/60 rounded-md text-xs text-white"
                      >
                        {{ comment.video.duration }}
                      </div>
                    </div>
                  </div>
                  <div class="w-1/2">
                    <h1 class="font-semibold mb-2 line-clamp-2">{{ comment.video.title }}</h1>
                    <h2 class="text-xs mb-4 text-body">{{ comment.video.type }}</h2>
                    <p class="text-sm text-primary cursor-pointer font-semibold">View comment</p>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
