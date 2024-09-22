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
          <thead class="uppercase border-b-[1px] border-gray-dark">
            <tr>
              <th v-for="item in titleTable" scope="col" class="p-6">{{ item }}</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white border-b-[1px] border-gray-dark">
              <!-- COMMENT -->
              <td class="w-1/2 px-6 py-4 font-normal text-gray-900">
                <div class="flex gap-x-4">
                  <img
                    src="https://scontent.fdad1-2.fna.fbcdn.net/v/t39.30808-6/457513733_122229466964002441_2844223550811568095_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=kRGuve7wRdgQ7kNvgHX0lye&_nc_ht=scontent.fdad1-2.fna&oh=00_AYAmh0z1My-YOk_5oJeCAvJXpzgiC8mOqEf4bYc8lG3EtA&oe=66F30C4B"
                    alt=""
                    class="size-14 object-cover rounded-full"
                  />
                  <!-- RIGHT COMMENT -->
                  <div class="flex flex-col gap-y-1">
                    <!-- REPS SENDER -->
                    <div
                      class="flex items-center rounded-full bg-yellow-dark px-3 py-1 gap-x-1 mb-2 w-fit"
                    >
                      <rep />
                      <h1 class="text-white font-bold text-[10px]">REPs Sender</h1>
                    </div>
                    <!-- USERNAME -->
                    <div class="flex items-center gap-x-4">
                      <h1 class="font-bold">npmh310</h1>
                      <span class="mb-1"><verified fill="fill-blue" /></span>
                      <p class="text-xs text-footer">2 mins ago</p>
                    </div>
                    <!-- COMMENT -->
                    <p class="break-words">
                      Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
                      eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
                      voluptua. At vero eos et accusam et justo duo dolores.
                    </p>
                  </div>
                </div>
              </td>
              <!-- REPS RECEIVED -->
              <td class="w-1/5 px-6 py-4 align-top">
                <div class="flex items-center gap-x-4">
                  <div class="scale-75"><rep2500 /></div>
                  <p class="text_subTitle">25000</p>
                </div>
              </td>
              <!-- VIDEO -->
              <td class="px-6 py-4 align-top">
                
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
