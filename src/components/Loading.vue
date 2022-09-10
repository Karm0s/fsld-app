<script setup lang="ts">
</script>

<template>
  <div class="loading-container">
    <div class="loading">
      <svg class="rotating"
           version="1.1"
           id="Layer_1"
           xmlns="http://www.w3.org/2000/svg"
           xmlns:xlink="http://www.w3.org/1999/xlink"
           x="0px"
           y="0px"
           width="92px"
           height="92px"
           viewBox="0 0 92 92"
           enable-background="new 0 0 92 92"
           xml:space="preserve">
        <path fill="#FFFFFF"
              id="XMLID_93_"
              d="M46,25.7c-2.2,0-4-1.8-4-4V4.5c0-2.2,1.8-4,4-4s4,1.8,4,4v17.2C50,23.9,48.2,25.7,46,25.7z M34.1,29.6
                c1.8-1.3,2.2-3.8,0.9-5.6L24.8,10.1c-1.3-1.8-3.8-2.2-5.6-0.9c-1.8,1.3-2.2,3.8-0.9,5.6l10.1,13.9c0.8,1.1,2,1.6,3.2,1.6
                C32.5,30.4,33.4,30.1,34.1,29.6z M26.7,39.7c0.7-2.1-0.5-4.4-2.6-5L7.7,29.4c-2.1-0.7-4.4,0.5-5,2.6C2,34,3.2,36.3,5.3,37l16.4,5.3
                c0.4,0.1,0.8,0.2,1.2,0.2C24.6,42.5,26.1,41.4,26.7,39.7z M7.7,62.6l16.4-5.3c2.1-0.7,3.3-2.9,2.6-5c-0.7-2.1-2.9-3.2-5-2.6L5.3,55
                c-2.1,0.7-3.3,2.9-2.6,5c0.5,1.7,2.1,2.8,3.8,2.8C6.9,62.8,7.3,62.8,7.7,62.6z M24.8,81.9L35,68c1.3-1.8,0.9-4.3-0.9-5.6
                s-4.3-0.9-5.6,0.9L18.4,77.2c-1.3,1.8-0.9,4.3,0.9,5.6c0.7,0.5,1.5,0.8,2.3,0.8C22.8,83.6,24,83,24.8,81.9z M50,87.5V70.3
                c0-2.2-1.8-4-4-4s-4,1.8-4,4v17.2c0,2.2,1.8,4,4,4S50,89.7,50,87.5z M72.8,82.8c1.8-1.3,2.2-3.8,0.9-5.6L63.5,63.3
                c-1.3-1.8-3.8-2.2-5.6-0.9c-1.8,1.3-2.2,3.8-0.9,5.6l10.1,13.9c0.8,1.1,2,1.6,3.2,1.6C71.2,83.6,72.1,83.3,72.8,82.8z M89.3,60.1
                c0.7-2.1-0.5-4.4-2.6-5l-16.4-5.3c-2.1-0.7-4.4,0.5-5,2.6c-0.7,2.1,0.5,4.4,2.6,5l16.4,5.3c0.4,0.1,0.8,0.2,1.2,0.2
                C87.2,62.8,88.8,61.7,89.3,60.1z M70.3,42.3L86.7,37c2.1-0.7,3.3-2.9,2.6-5c-0.7-2.1-2.9-3.2-5-2.6l-16.4,5.3
                c-2.1,0.7-3.3,2.9-2.6,5c0.5,1.7,2.1,2.8,3.8,2.8C69.5,42.5,69.9,42.4,70.3,42.3z M63.5,28.7l10.1-13.9c1.3-1.8,0.9-4.3-0.9-5.6
                c-1.8-1.3-4.3-0.9-5.6,0.9L57,24c-1.3,1.8-0.9,4.3,0.9,5.6c0.7,0.5,1.5,0.8,2.3,0.8C61.5,30.4,62.7,29.8,63.5,28.7z" />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.loading-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(111, 111, 111, 0.5);
  z-index: 3;
}

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 250px;
  min-height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}

svg {
  width: 75px;
}

@-webkit-keyframes rotating

/* Safari and Chrome */
  {
  from {
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  to {
    -webkit-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes rotating {
  from {
    -ms-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  to {
    -ms-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

.rotating {
  -webkit-animation: rotating 2s linear infinite;
  -moz-animation: rotating 2s linear infinite;
  -ms-animation: rotating 2s linear infinite;
  -o-animation: rotating 2s linear infinite;
  animation: rotating 2s linear infinite;
}
</style>