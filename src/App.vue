<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { SocketioService } from './services/SocketioService'
import {MediapipeUtils, Keypoints} from './utils/mediapipe-utils'

let mediapipeUtils!: MediapipeUtils
let socket:SocketioService
let showLandmarks = ref<boolean>(false)

let predictions = ref<string[]>(['TEST', 'TEST', 'TEST', 'TEST', 'TEST', 'TEST', 'TEST', 'TEST', 'TEST', 'TEST', 'TEST', 'TEST', 'TEST', 'TEST', 'TEST'])
const videoElement = ref(null)
const outputCanvas = ref(null)


function onMediapipeResults(keypoints: Keypoints):void {
	console.log('here')
	return
	socket.send('mediapipe-data', keypoints)
}

onMounted(() => {
	// socket = new SocketioService()
	// socket.listen('after connect', (msg:any) => {
	// 	console.log(msg.connected)
	// })
	// socket.listen('prediction', (data:any) => {
	// 	predictions.value?.push(data)
	// })
	
	if (videoElement.value && outputCanvas.value) {
		mediapipeUtils = new MediapipeUtils(videoElement.value, outputCanvas.value, showLandmarks.value, 30, onMediapipeResults)
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
	mediapipeUtils.setShowLandmarks(showLandmarks.value)
}

</script>

<template>
	<div class="header">
		<h1>French Sign Language Detection</h1>
		<p>Project made by Yasmine Iarichen for Master's degree graduation</p>
	</div>
	<div class="content">
		<div class="videos-container">
			<div>
				<h3>Video Feed</h3>
				<video id="input-video" class="video-element input-video" ref="videoElement" width="480" height="480"></video>
				<canvas id="output-canvas" class="video-element output-canvas" ref="outputCanvas" width="480" height="480"></canvas>
			</div>
		</div>
		<div class="predictions">
			<h3>Predictions</h3>
			<div class="predicted-words-container">
				<p class="predicted-word" v-for="word in predictions" >{{word}}</p>
			</div>
		</div>
	</div>
	<div class="controls">
		<div class="btn-container">
			<button @click="startStream" class="btn">Start stream</button>
			<button @click="stopStream" class="btn">Stop stream</button>
		</div>
		<div>
			<input id="show-landmarks-toggle" type="checkbox" @click="toggleShowLandmarks">
			<label for="show-landmarks-toggle">Show Video Landmarks</label>
		</div>
	</div>
</template>

<style scoped>
.videos-container {
	position: relative;
	min-width: 480px;
	min-height: 480px;
	margin-right: 1rem;

}
.predictions{
	width: 480px;
	margin-left: 1rem;
	border: dashed;
	border-width: 3px;
	border-color: rgb(115, 115, 115);
	border-radius: 10px;
}
.predicted-word{
	background-color: cyan;
	padding: .1em .5em .1em .5em;
	border-radius: 5px;
	font-weight: 600;
}
.input-video{
	display: none;
	position: absolute;
	top: 0;
	left: 0;
}
.output-canvas{
	z-index: -1;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	border-radius: 10px;
	border-color: white;
	border-width: 5px;
}
.controls{
	margin-top: .5em;
	border-radius: 10px;
	border-width: 5px;
	border-color: white;
}
.predicted-words-container{
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	flex-wrap: wrap;
}
.predicted-word{
	margin-right: 5px;
}
.content{
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: stretch;
}
</style>
