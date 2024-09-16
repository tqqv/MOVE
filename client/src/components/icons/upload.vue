<script setup>
  const props = defineProps({
    width: String,
    height: String,
    fill: String,
    stroke: String,
  });
</script>
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    id="Group_1849"
    data-name="Group 1849"
    :width="width ? width : '24px'"
    :height="height ? height : '25.03px'"
    class="overflow-visible"
  >
    <g
      id="Group_4065"
      data-name="Group 4065"
      transform="translate(-15 -44)"
      :class="[fill, stroke]"
    >
      <rect
        id="Rectangle_855"
        data-name="Rectangle 855"
        width="24"
        height="24"
        transform="translate(15 44)"
        fill="none"
      />
      <g id="Group_2443" data-name="Group 2443" transform="translate(15 47.667)">
        <path
          id="Path_1069"
          data-name="Path 1069"
          d="M360.342,898.468l-4.421,2.675v-.963a4.191,4.191,0,0,0-4.211-4.279h-10a4.191,4.191,0,0,0-4.211,4.279v7.81a4.191,4.191,0,0,0,4.211,4.279h6.316a5.216,5.216,0,0,1,5.053-4.386h0a5.157,5.157,0,0,1,2.737.856c0-.214.105-.535.105-.749v-.963l4.421,2.675a.766.766,0,0,0,1.158-.749v-9.628C361.5,898.468,360.868,898.147,360.342,898.468Zm-10.316,5.884-4.842,2.781c-.211.107-.632,0-.632-.321v-5.563a.416.416,0,0,1,.632-.321l4.842,2.781C350.237,903.71,350.237,904.245,350.026,904.352Z"
          transform="translate(-337.5 -895.9)"
          fill="#fff"
        />
        <path
          id="Path_1070"
          data-name="Path 1070"
          d="M352.3,907.8a4.2,4.2,0,1,0,4.2,4.2A4.225,4.225,0,0,0,352.3,907.8Zm2.2,4.9H353v1.5a.7.7,0,1,1-1.4,0v-1.5h-1.5a.7.7,0,0,1,0-1.4h1.5v-1.5a.7.7,0,1,1,1.4,0v1.5h1.5a.684.684,0,0,1,.7.7A.751.751,0,0,1,354.5,912.7Z"
          transform="translate(-336.617 -894.832)"
          fill="#fff"
        />
      </g>
    </g>
  </svg>
</template>
