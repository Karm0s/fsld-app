<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { SocketioService } from './services/SocketioService'
import {MediapipeUtils, Keypoints} from './utils/mediapipe-utils'

let mediapipeUtils!: MediapipeUtils
let socket:SocketioService
let showLandmarks = ref<boolean>(false)

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
function toggleShowLandmarks(event: any){
	showLandmarks.value = !showLandmarks.value
}

</script>

<template>
	<div class="header">
		<h1>French Sign Language Detection</h1>
		<p>Project made by Yasmine Iarichen for Master's degree graduation</p>
	</div>
	<div class="content">
		<div class="controls">
			<div>
				<button @click="startStream" class="btn">Start stream</button>
				<button @click="stopStream" class="btn">Stop stream</button>
			</div>
			<div>
				<input id="show-landmarks-toggle" type="checkbox" @click="toggleShowLandmarks">
				<label for="show-landmarks-toggle">Show Video Landmarks</label>
			</div>
		</div>
		<div class="videos-container">
			<div v-if="showLandmarks">
				<h3>Landmarks</h3>
				<canvas id="output-canvas" class="video-element out-canvas" ref="outputCanvas" width="480" height="480"></canvas>
			</div>
			<div v-else>
				<h3>Input Video</h3>
				<video id="input-video" class="video-element in-video" ref="videoElement" width="480" height="480"></video>
			</div>
		</div>
	</div>
	<div class="results">
		<h3>Predictions: </h3>
		<div class="predicted-words-container">
			<p class="predicted-word" v-for="word in predictions" >{{word}},</p>
		</div>
	</div>
</template>

<style scoped>
.videos-container {
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	position: relative;

}
.video-element{
	position: absolute;
	width: 100%;
	height: 100%;
	object-fit: cover;
}
.controls{
	background-color: white;
	border-width: 1em;
	border-color: white;
	width: 50%;
	height: 100%;
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
.content{
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
}
</style>
