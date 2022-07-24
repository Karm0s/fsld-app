<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { io } from 'socket.io-client'

import { Holistic, FACEMESH_LIPS, POSE_CONNECTIONS, FACEMESH_TESSELATION, HAND_CONNECTIONS, FACEMESH_RIGHT_EYE, FACEMESH_LEFT_EYE, FACEMESH_RIGHT_EYEBROW, FACEMESH_LEFT_EYEBROW, FACEMESH_FACE_OVAL } from '@mediapipe/holistic'
import { Camera } from '@mediapipe/camera_utils'
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils'

const videoElement = ref(null)
const outputCanvas = ref(null)
let canvasCtx: any = null
let camera!: Camera
onMounted(() => {
	// let socket = io('http://127.0.0.1:5000')
	// socket.on('after connect', (msg) => {
	// 	console.log(msg.connected)
	// })

	canvasCtx = outputCanvas.value!.getContext('2d')
})

// function onResultsHolistic(results:any) {
// 	if (outputCanvas.value !== null) {
// 		canvasCtx.save()
// 		canvasCtx.clearRect(0, 0, outputCanvas.value.width, outputCanvas.value.height)
// 		canvasCtx.drawImage(results.segmentationMask, 0, 0,
// 			outputCanvas.value.width, outputCanvas.value.height)
	
// 		// // Only overwrite existing pixels.
// 		canvasCtx.globalCompositeOperation = 'source-in'
// 		canvasCtx.fillStyle = 'transparent'
// 		canvasCtx.fillRect(0, 0, outputCanvas.value.width, outputCanvas.value.height)
	
// 		// Only overwrite missing pixels.
// 		canvasCtx.globalCompositeOperation = 'destination-atop'
// 		canvasCtx.drawImage(
// 			results.image, 0, 0, outputCanvas.value.width, outputCanvas.value.height)
	
// 		canvasCtx.globalCompositeOperation = 'source-over'
// 		drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
// 			{ color: '#00FF00', lineWidth: 2 })
// 		drawLandmarks(canvasCtx, results.poseLandmarks,
// 			{ color: '#FF0000', lineWidth: 1 })
// 		drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION,
// 			{ color: '#C0C0C070', lineWidth: 1 })
// 		drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS,
// 			{ color: '#CC0000', lineWidth: 2 })
// 		drawLandmarks(canvasCtx, results.leftHandLandmarks,
// 			{ color: '#00FF00', lineWidth: 1 })
// 		drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS,
// 			{ color: '#00CC00', lineWidth: 2 })
// 		drawLandmarks(canvasCtx, results.rightHandLandmarks,
// 			{ color: '#FF0000', lineWidth: 1 })
// 		canvasCtx.restore()
// 	}
// }

function startStream(event: any) {
	startMediapipeDetection()
}
function stopStream(event: any) {
	camera.stop()
}

// function startMediapipeDetection() {
// 	const holistic = new Holistic({
// 		locateFile: (file) => {
// 			return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.5/${file}`
// 		}
// 	})
// 	holistic.setOptions({
// 		modelComplexity: 1,
// 		smoothLandmarks: true,
// 		enableSegmentation: true,
// 		smoothSegmentation: true,
// 		refineFaceLandmarks: true,
// 		minDetectionConfidence: 0.5,
// 		minTrackingConfidence: 0.5
// 	})
// 	console.log('hello there')
// 	holistic.onResults(onResultsHolistic)
// 	camera = new Camera(videoElement.value, {
// 		onFrame: async () => {
// 			await holistic.send({ image: videoElement.value })
// 		},
// 		width: 720,
// 		height: 480
// 	})
// 	camera.start()
// }
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
