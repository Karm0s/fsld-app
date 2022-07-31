<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { io, Socket } from 'socket.io-client'

import {MediapipeUtils, Keypoints} from './utils/mediapipe-utils'

let mediapipeUtils!: MediapipeUtils
let socket:Socket

const videoElement = ref(null)
const outputCanvas = ref(null)

function onMediapipeResults(keypoints: Keypoints):void {
	console.log(keypoints.length)
	socket.emit('mediapipe-data', keypoints)
}

onMounted(() => {
	socket = io('http://127.0.0.1:5000')
	socket.on('after connect', (msg) => {
		console.log(msg.connected)
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
</style>
