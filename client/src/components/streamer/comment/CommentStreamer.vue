<script setup>
  import Filter from '@components/Filter.vue';
  import CommentRow from './CommentRow.vue';
  import { onMounted, ref } from 'vue';
  import { useStreamerStore } from '@/stores';
  import { getAllCommentOfStreamer } from '@/services/comment';

  const responsesOptions = [
    { id: 1, name: 'All responses' },
    { id: 2, name: "I haven't respond" },
    { id: 3, name: 'I have respond' },
  ];
  const sortOptions = [
    { id: 1, name: 'Most recent' },
    { id: 2, name: 'Received REPs' },
  ];

  const streamerStore = useStreamerStore();

  const titleTable = ['comment', 'reps received', 'video'];

  // const comments = [
  //   {
  //     id: 1,
  //     username: 'npmh310',
  //     verified: true,
  //     timeAgo: '2 mins ago',
  //     comment:
  //       'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
  //     reps: 25000,
  //     video: {
  //       title: 'Leg day Leg day Leg day Leg day',
  //       type: 'Strength',
  //       duration: '3:20',
  //       thumbnail:
  //         'https://i.ytimg.com/vi/xzTIpgER4fc/hqdefault.jpg?sqp=-oaymwEcCPYBEIoBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBhm_M96W-S24VG-FhM6YioancFRA',
  //     },
  //     avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  //     like: 102,
  //     dislike: 10,
  //     replyCount: 102,
  //   },
  //   {
  //     id: 2,
  //     username: 'user_two',
  //     verified: false,
  //     timeAgo: '5 hours ago',
  //     comment:
  //       'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
  //     reps: 15000,
  //     video: {
  //       title: 'Core workout routine',
  //       type: 'Strength',
  //       duration: '4:15',
  //       thumbnail:
  //         'https://i.ytimg.com/vi/xzTIpgER4fc/hqdefault.jpg?sqp=-oaymwEcCPYBEIoBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBhm_M96W-S24VG-FhM6YioancFRA',
  //     },
  //     avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  //     like: 70,
  //     dislike: 5,
  //     replyCount: 54,
  //   },
  //   {
  //     id: 3,
  //     username: 'user_three',
  //     verified: true,
  //     timeAgo: '1 day ago',
  //     comment:
  //       'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.',
  //     reps: 5000,
  //     video: {
  //       title: 'Upper body exercises',
  //       type: 'Endurance',
  //       duration: '2:45',
  //       thumbnail:
  //         'https://i.ytimg.com/vi/xzTIpgER4fc/hqdefault.jpg?sqp=-oaymwEcCPYBEIoBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBhm_M96W-S24VG-FhM6YioancFRA',
  //     },
  //     avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  //     like: 34,
  //     dislike: 2,
  //     replyCount: 18,
  //   },
  // ];

  const comments = ref([]);

  const fetchAllCommentStreamer = async () => {
    const streamerId = streamerStore.streamerChannel.id;
    try {
      const response = await getAllCommentOfStreamer(streamerId);
      comments.value = response.data.commentsWithVideo.rows;
      console.log(comments);
    } catch (error) {}
  };

  onMounted(async () => {
    await streamerStore.fetchProfileChannel();
    fetchAllCommentStreamer();
  });
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
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 min-w-[100vh]">
          <thead class="uppercase text-footer border-b-[1px] border-gray-dark">
            <tr>
              <th v-for="item in titleTable" :key="item" scope="col" class="p-6">{{ item }}</th>
            </tr>
          </thead>
          <tbody>
            <CommentRow v-for="comment in comments" :key="comment.id" :comment="comment" />
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
