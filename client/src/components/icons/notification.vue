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
    :width="width ? width : '24px'"
    :height="height ? height : '24px'"
    class="overflow-visible"
  >
    <g
      id="Group_1691"
      data-name="Group 1691"
      transform="translate(-2814 -20)"
      :class="[fill, stroke]"
    >
      <rect
        id="Rectangle_611"
        data-name="Rectangle 611"
        width="24"
        height="24"
        transform="translate(2814 20)"
        fill="none"
      />
      <g id="Group_1853" data-name="Group 1853" transform="translate(2152.823 -166.16)">
        <path
          id="XMLID_5_"
          d="M707.515,205.594H688.273a.907.907,0,0,1-.672-1.5l2.444-2.782a2.307,2.307,0,0,0,.569-1.5V195.65a7.315,7.315,0,0,1,7.629-7.348,7.46,7.46,0,0,1,6.931,7.548v3.94a2.281,2.281,0,0,0,.569,1.5l2.444,2.782A.918.918,0,0,1,707.515,205.594Zm-9.621,4.566a3.368,3.368,0,0,1-3.349-3.381h6.7A3.368,3.368,0,0,1,697.894,210.16Z"
          transform="translate(-24.7 0)"
          fill="#fff"
          fill-rule="evenodd"
        />
        <path
          id="XMLID_2_"
          d="M695.51,190.38h0a1.018,1.018,0,0,1-1.02-1.02v-2.18a1.018,1.018,0,0,1,1.02-1.02h0a1.018,1.018,0,0,1,1.02,1.02v2.18A1.024,1.024,0,0,1,695.51,190.38Z"
          transform="translate(-22.316)"
          fill="#fff"
        />
      </g>
    </g>
  </svg>
</template>
