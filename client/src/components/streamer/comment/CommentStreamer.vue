<script setup>
  import Filter from '@components/Filter.vue';
  import CommentRow from './CommentRow.vue';
  import { onMounted, ref, watch } from 'vue';
  import { useStreamerStore } from '@/stores';
  import { getAllCommentOfStreamer } from '@/services/comment';
  const responsesOptions = [
    { id: 1, name: 'All responses', value: '' },
    { id: 2, name: "I haven't respond", value: 'false' },
    { id: 3, name: 'I have respond', value: 'true' },
  ];
  const sortOptions = [
    { id: 1, name: 'Most recent', value: '' },
    { id: 2, name: 'Received REPs', value: 'rep' },
  ];

  const pageSizeOptions = [
    { id: 1, name: 5, value: 5 },
    { id: 2, name: 10, value: 10 },
    { id: 3, name: 20, value: 20 },
  ];

  const streamerStore = useStreamerStore();
  const titleTable = ['comment', 'reps received', 'video'];
  const comments = ref([]);
  const currentPage = ref(1);
  const totalComments = ref(0);
  const totalPage = ref();

  const selectedPageSize = ref(pageSizeOptions[0].name);
  const selectedResponsesOptions = ref(responsesOptions[0].value);
  const selectedSortOptions = ref(sortOptions[0].value);

  const fetchAllCommentStreamer = async () => {
    const streamerId = streamerStore.streamerChannel.id;
    try {
      const response = await getAllCommentOfStreamer(
        streamerId,
        selectedPageSize.value,
        currentPage.value,
        selectedResponsesOptions.value,
        selectedSortOptions.value
      );
      comments.value = response.data.commentsWithVideo.rows;
      totalComments.value = response.data.commentsWithVideo.count;
      totalPage.value = response.data.totalPages;
    } catch (error) {
      console.log(error);
    }
  };

  watch([selectedPageSize, selectedResponsesOptions, selectedSortOptions], () => {
    currentPage.value = 1;
    fetchAllCommentStreamer();
  });

  onMounted(async () => {
    await streamerStore.fetchProfileChannel();
    fetchAllCommentStreamer();
  });

  // HANDLE PREV PAGE
  const goToPreviousPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
      fetchAllCommentStreamer();
    }
  };

  // HANDLE NEXT PAGE
  const goToNextPage = () => {
    if (currentPage.value < totalPage.value) {
      currentPage.value++;
      fetchAllCommentStreamer();
    }
  };

  watch(totalComments, () => {
    totalPage.value = Math.ceil(totalComments.value / selectedPageSize.value);
  });
</script>

<template>
  <section>
    <div class="flex justify-between px-10">
      <h1 class="text_title">Comments</h1>
      <div class="flex gap-x-20">
        <Filter
          :title="'responses'"
          :options="responsesOptions"
          v-model="selectedResponsesOptions"
        />
        <Filter :title="'sort by'" :options="sortOptions" v-model="selectedSortOptions" />
      </div>
    </div>
    <div class="py-5">
      <div class="relative overflow-x-auto">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 min-w-[100vh]">
          <thead class="uppercase text-footer border-b-[1px] border-gray-dark">
            <tr>
              <th v-for="item in titleTable" :key="item" scope="col" class="p-6 whitespace-nowrap">
                {{ item }}
              </th>
            </tr>
          </thead>
          <tbody>
            <CommentRow
              v-for="comment in comments"
              :key="comment.id"
              :comment="comment"
              :fetchAllCommentStreamer="fetchAllCommentStreamer"
            />
          </tbody>
        </table>
      </div>
    </div>
    <div class="flex justify-end gap-x-12 items-center px-12 pt-3">
      <Filter :title="'Rows per page'" :options="pageSizeOptions" v-model="selectedPageSize" />
      <div class="">
        <span>
          {{ (currentPage - 1) * selectedPageSize + 1 }}
        </span>
        -
        <span>
          {{ Math.min(currentPage * selectedPageSize, totalComments) }}
        </span>
        <span> of {{ totalComments }} results</span>
      </div>
      <div class="flex gap-x-4 justify-center">
        <i
          @click="goToPreviousPage"
          class="pi pi-chevron-left cursor-pointer text-md hover:text-primary"
          :class="{ 'text-gray-dark hover:text-gray-dark cursor-auto': currentPage === 1 }"
        ></i>
        <i
          @click="goToNextPage"
          class="pi pi-chevron-right cursor-pointer text-md hover:text-primary"
          :class="{ 'text-gray-dark hover:text-gray-dark cursor-auto': currentPage === totalPage }"
        ></i>
      </div>
    </div>
  </section>
</template>
