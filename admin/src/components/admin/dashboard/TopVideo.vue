<script setup>
  import Column from 'primevue/column';
  import DataTable from 'primevue/datatable';
  import { onMounted, ref } from 'vue';

  const topVideo = [
    {
      id: 1,
      avatar:
        'https://images.pexels.com/photos/598631/pexels-photo-598631.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // URL hình ảnh đại diện
      title: 'Morning Yoga',
      category: 'Fitness',
      levelWorkout: 'Beginner',
      channelName: 'YogaWithAnna',
      totalView: 12000,
      totalReps: 5000,
    },
    {
      id: 2,
      avatar:
        'https://images.pexels.com/photos/598631/pexels-photo-598631.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      title: 'HIIT Blast',
      category: 'Workout',
      levelWorkout: 'Intermediate',
      channelName: 'BeFitChannel',
      totalView: 8500,
      totalReps: 3500,
    },
    {
      id: 3,
      avatar:
        'https://images.pexels.com/photos/598631/pexels-photo-598631.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      title: 'Strength Training',
      category: 'Bodybuilding',
      levelWorkout: 'Advanced',
      channelName: 'StrongManGym',
      totalView: 24000,
      totalReps: 12000,
    },
    {
      id: 4,
      avatar:
        'https://images.pexels.com/photos/598631/pexels-photo-598631.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      title: 'Pilates Basics',
      category: 'Pilates',
      levelWorkout: 'Beginner',
      channelName: 'PilatesStudio',
      totalView: 5000,
      totalReps: 2000,
    },
    {
      id: 5,
      avatar:
        'https://images.pexels.com/photos/598631/pexels-photo-598631.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      title: 'Cardio Burnout',
      category: 'Cardio',
      levelWorkout: 'Intermediate',
      channelName: 'CardioZone',
      totalView: 15000,
      totalReps: 7500,
    },
  ];

  const topLiveStream = [
    {
      id: 1,
      avatar:
        'https://images.pexels.com/photos/598631/pexels-photo-598631.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // URL hình ảnh đại diện
      title: 'Morning Yoga',
      category: 'Fitness',
      levelWorkout: 'Beginner',
      channelName: 'YogaWithAnna',
      totalView: 12000,
      totalReps: 5000,
    },
    {
      id: 2,
      avatar:
        'https://images.pexels.com/photos/598631/pexels-photo-598631.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      title: 'HIIT Blast',
      category: 'Workout',
      levelWorkout: 'Intermediate',
      channelName: 'BeFitChannel',
      totalView: 8500,
      totalReps: 3500,
    },
    {
      id: 3,
      avatar:
        'https://images.pexels.com/photos/598631/pexels-photo-598631.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      title: 'Strength Training',
      category: 'Bodybuilding',
      levelWorkout: 'Advanced',
      channelName: 'StrongManGym',
      totalView: 24000,
      totalReps: 12000,
    },
    {
      id: 4,
      avatar:
        'https://images.pexels.com/photos/598631/pexels-photo-598631.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      title: 'Pilates Basics',
      category: 'Pilates',
      levelWorkout: 'Beginner',
      channelName: 'PilatesStudio',
      totalView: 5000,
      totalReps: 2000,
    },
    {
      id: 5,
      avatar:
        'https://images.pexels.com/photos/598631/pexels-photo-598631.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      title: 'Cardio Burnout',
      category: 'Cardio',
      levelWorkout: 'Intermediate',
      channelName: 'CardioZone',
      totalView: 15000,
      totalReps: 7500,
    },
  ];
</script>

<template>
  <div class="paper-custom">
    <h1 class="paper-title">Top 5 video donated</h1>
    <DataTable :value="topVideo" tableStyle="min-width: 50rem">
      <Column header="Thumbnail">
        <template #body="slotProps">
          <img :src="slotProps.data.avatar" class="w-32 h-20 object-cover" />
        </template>
      </Column>
      <Column field="title" header="Title"></Column>
      <Column field="category" header="Category"></Column>
      <Column field="levelWorkout" header="Level workout"></Column>
      <Column field="channelName" header="Channel name"></Column>
      <Column field="totalView" header="Total view"></Column>
      <Column field="totalReps" header="REPs"></Column>
    </DataTable>
  </div>
  <div class="paper-custom">
    <h1 class="paper-title">Top 5 live stream</h1>
    <DataTable :value="topLiveStream" tableStyle="min-width: 50rem">
      <Column header="Thumbnail">
        <template #body="slotProps">
          <img :src="slotProps.data.avatar" class="w-32 h-20 object-cover" />
        </template>
      </Column>
      <Column field="title" header="Title"></Column>
      <Column field="category" header="Category"></Column>
      <Column field="levelWorkout" header="Level workout"></Column>
      <Column field="channelName" header="Channel name"></Column>
      <Column field="totalView" header="Total view"></Column>
      <Column field="totalReps" header="REPs"></Column>
    </DataTable>
  </div>
</template>

<style scoped></style>
