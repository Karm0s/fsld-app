<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { SocketioService } from './services/SocketioService'
import {MediapipeUtils, Keypoints} from './utils/mediapipe-utils'

let mediapipeUtils!: MediapipeUtils
let socket:SocketioService
let predictions = ref<string[]>([])

const videoElement = ref(null)
const outputCanvas = ref(null)


function onMediapipeResults(keypoints: Keypoints):void {
	socket.send('mediapipe-data', keypoints)
}

onMounted(() => {
	socket = new SocketioService()
	socket.listen('after connect', (msg:any) => {
		console.log(msg.connected)
	})
	socket.listen('prediction', (data:any) => {
		predictions.value?.push(data)
	})
	
	if (videoElement.value && outputCanvas.value) {
		mediapipeUtils = new MediapipeUtils(videoElement.value, outputCanvas.value, 30, onMediapipeResults)
	}
})

function startStream(event: any) {
	mediapipeUtils.start()
}
function stopStream(event: any) {
	mediapipeUtils.stop()
}

</script>

<template>
	<div class="videos-container">
		<div>
			<h2>Input Video</h2>
			<video id="input-video" class="in-video" ref="videoElement" width="720" height="480"></video>
		</div>
		<div>
			<h2>Landmarks</h2>
			<canvas id="output-canvas" class="out-canvas" ref="outputCanvas" width="720" height="480"></canvas>
		</div>
	</div>
	<h3>Predictions: </h3>
	<div class="predicted-words-container">
		<p class="predicted-word" v-for="word in predictions" >{{word}},</p>
	</div>
	<button @click="startStream">Start stream</button>
	<button @click="stopStream">Stop stream</button>
</template>

<style scoped>
.videos-container {
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;

}
.predicted-words-container{
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
}
.predicted-word{
	margin-right: 5px;
}
</style>
