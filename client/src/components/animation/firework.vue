<template>
  <div class="absolute z-10 right-48 top-[-20px]">
    <div class="flex relative h-12">
      <div class="size-6 mt-4 absolute">
        <img
          src="https://res.cloudinary.com/dg9imqwrd/image/upload/v1732606512/damijjsglhtztjkt5ito.gif"
          alt=""
          class="rotated-image-1 mt-4"
        />
      </div>
      <div class="size-9 absolute left-3 top-[-6px]">
        <img
          src="https://res.cloudinary.com/dg9imqwrd/image/upload/v1732606041/iixtqdjvnql9o1yeylql.gif"
          alt=""
          class="rotated-image-2"
        />
      </div>
      <div class="size-10 absolute left-10 top-[-17px]">
        <img
          src="https://res.cloudinary.com/dg9imqwrd/image/upload/v1732606524/vkyderrb31gtfyxuwak0.gif"
          alt=""
          class="rotated-image-3"
        />
      </div>
      <div class="size-12 absolute left-[70px] top-[-16px]">
        <img
          src="https://res.cloudinary.com/dg9imqwrd/image/upload/v1732607434/dmbi7o8dovlwriw06zqa.gif"
          alt=""
          class="rotated-image-4"
        />
      </div>
      <div class="size-6 absolute left-[128px]">
        <img
          src="https://res.cloudinary.com/dg9imqwrd/image/upload/v1732606524/vkyderrb31gtfyxuwak0.gif"
          alt=""
          class="rotated-image-5"
        />
      </div>
      <div class="size-10 absolute left-[150px] top-[-16px]">
        <img
          src="https://res.cloudinary.com/dg9imqwrd/image/upload/v1732606041/iixtqdjvnql9o1yeylql.gif"
          alt=""
          class="rotated-image-6"
        />
      </div>
      <div class="size-8 absolute left-[184px] top-[0px]">
        <img
          src="https://res.cloudinary.com/dg9imqwrd/image/upload/v1732606512/damijjsglhtztjkt5ito.gif"
          alt=""
          class="rotated-image-7"
        />
      </div>
    </div>
  </div>
</template>

<style>
  .rotated-image-1 {
    transform: rotate(210deg);
    display: block;
    margin: auto;
    animation: fadeIn 0.5s ease-out 0s forwards;
  }
  .rotated-image-2 {
    transform: rotate(270deg);
    display: block;
    margin: auto;
    animation: fadeIn 0.5s ease-out 0.2s forwards;
  }
  .rotated-image-3 {
    transform: rotate(330deg);
    display: block;
    margin: auto;
    animation: fadeIn 0.5s ease-out 0.4s forwards;
  }
  .rotated-image-4 {
    transform: rotate(0deg);
    display: block;
    margin: auto;
    animation: fadeIn 0.5s ease-out 0.6s forwards;
  }
  .rotated-image-5 {
    transform: rotate(290deg);
    display: block;
    margin: auto;
    animation: fadeIn 0.5s ease-out 0.8s forwards;
  }
  .rotated-image-6 {
    transform: rotate(330deg);
    display: block;
    margin: auto;
    animation: fadeIn 0.5s ease-out 1s forwards;
  }
  .rotated-image-7 {
    transform: rotate(10deg);
    display: block;
    margin: auto;
    animation: fadeIn 0.5s ease-out 1.2s forwards;
  }

  /* Định nghĩa animation fadeIn */
  @keyframes fadeIn {
    0% {
      scale: 0;
    }
    100% {
      scale: 1;
    }
  }
</style>
