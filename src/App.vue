<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

import { SocketioService } from './services/SocketioService'
import { MediapipeUtils, Keypoints } from './common/mediapipe-utils'
import { toStrPercents } from './common/utils'
import Loading from './components/Loading.vue'

import AppHeader from './components/AppHeader.vue'
import PredictionsTable from './components/PredictionsTable.vue'
import AppControls from './components/AppControls.vue'

import { Prediction } from './types/components.interface'

let mediapipeUtils!: MediapipeUtils
let socket: SocketioService
let showLandmarks = ref<boolean>(false)
let isLoading = ref<boolean>(false)
let serverConnected = ref<boolean>(false)
let detectionRunning = ref<boolean>(false)

let mainPrediction = ref<Prediction>({
	word: 'NONE',
	probability: 0
})
let predictions = ref<Prediction[]>(Array(20).fill({
	word: 'NONE',
	probability: 0
}))
const videoElement = ref(null)
const outputCanvas = ref(null)


const serverStatusMessage = computed(() => {
	if (serverConnected.value) return "server connected"
	return "server disconnected"
})

function onMediapipeResults(keypoints: Keypoints): void {
	if (detectionRunning.value) {
		console.log("sending data")
		socket.send('mediapipe-data', keypoints)
	}
}

onMounted(() => {
	socket = new SocketioService()
	socket.listen('after connect', () => {
		serverConnected.value = true
	})
	socket.listen('predictions', (data: Prediction[]): void => {
		console.log(data)
		let maxPredictionValue = Math.max(...data.map(({ probability }: Prediction) => probability))
		mainPrediction.value = data.find(({ probability }: Prediction) => probability === maxPredictionValue)!
		predictions.value = data.map(({ word, probability }: Prediction) => {
			return {
				word,
				probability
			}
		})
	})
	socket.listen('disconnect', () => {
		serverConnected.value = false
		detectionRunning.value = false
		console.log("Disconnected from server.")
	})
	socket.listen('connect_error', (data: any) => {
		console.warn("Server connection error.")
	})
	if (videoElement.value && outputCanvas.value) {
		mediapipeUtils = new MediapipeUtils(videoElement.value, outputCanvas.value, showLandmarks.value, 30, onMediapipeResults, hideCanvasCurtain)
	}
})

function startDetection(event: any) {
	detectionRunning.value = true
	if (mediapipeUtils.isCameraRunning()) return
	isLoading.value = true
	mediapipeUtils.start()
}
function pauseDetection(event: any) {
	detectionRunning.value = false
}
function toggleShowLandmarks(event: any) {
	showLandmarks.value = !showLandmarks.value
	mediapipeUtils.setShowLandmarks(showLandmarks.value)
}

function hideCanvasCurtain(): void {
	isLoading.value = false
	detectionRunning.value = true
}
</script>

<template>
	<app-header></app-header>
	<Loading hidden
			 :class="{'loading-visible': isLoading}">
	</Loading>
	<div class="content">
		<div class="videos-container">
			<h3 class="video-container-title title">Video Feed</h3>
			<div class="canvas-curtain"
				 v-if="!detectionRunning">
				<img class="curtain-image"
					 src="./assets/webcam.png"
					 alt="">
			</div>
			<video id="input-video"
				   class="video-element input-video"
				   ref="videoElement"
				   width="480"></video>
			<canvas id="output-canvas"
					class="video-element output-canvas"
					ref="outputCanvas"
					width="480"
					height="480"></canvas>
			<app-controls class="app-controls"
						  @start-detection="startDetection"
						  @pause-detection="pauseDetection"
						  @toggle-landmarks="toggleShowLandmarks">
			</app-controls>
		</div>
		<div class="predictions">
			<h3 class="title">Predictions</h3>
			<div class="predictions-container">
				<h4 class="predicted-word">{{mainPrediction?.word}} ({{toStrPercents(mainPrediction.probability)}}%)
				</h4>
				<PredictionsTable :predictions="predictions"></PredictionsTable>
			</div>
		</div>
	</div>
	<div class="server-status-wrapper"
		 :class="[serverConnected? 'status-connected':'status-disconnected']">
		<p class="status-text">{{ serverStatusMessage }}</p>
		<svg v-if="serverConnected"
			 class="icon confirm-icon"
			 version="1.1"
			 id="Capa_1"
			 xmlns="http://www.w3.org/2000/svg"
			 xmlns:xlink="http://www.w3.org/1999/xlink"
			 x="0px"
			 y="0px"
			 width="405.272px"
			 height="405.272px"
			 viewBox="0 0 405.272 405.272"
			 style="enable-background:new 0 0 405.272 405.272;"
			 xml:space="preserve">
			<g>
				<path d="M393.401,124.425L179.603,338.208c-15.832,15.835-41.514,15.835-57.361,0L11.878,227.836
				c-15.838-15.835-15.838-41.52,0-57.358c15.841-15.841,41.521-15.841,57.355-0.006l81.698,81.699L336.037,67.064
				c15.841-15.841,41.523-15.829,57.358,0C409.23,82.902,409.23,108.578,393.401,124.425z" />
			</g>
		</svg>
		<svg v-else
			 class="icon cross-icon"
			 viewBox="0 0 24 24"
			 fill="none"
			 xmlns="http://www.w3.org/2000/svg">
			<path d="M6.22566 4.81096C5.83514 4.42044 5.20197 4.42044 4.81145 4.81096C4.42092 5.20148 4.42092 5.83465 4.81145 6.22517L10.5862 11.9999L4.81151 17.7746C4.42098 18.1651 4.42098 18.7983 4.81151 19.1888C5.20203 19.5793 5.8352 19.5793 6.22572 19.1888L12.0004 13.4141L17.7751 19.1888C18.1656 19.5793 18.7988 19.5793 19.1893 19.1888C19.5798 18.7983 19.5798 18.1651 19.1893 17.7746L13.4146 11.9999L19.1893 6.22517C19.5799 5.83465 19.5799 5.20148 19.1893 4.81096C18.7988 4.42044 18.1657 4.42044 17.7751 4.81096L12.0004 10.5857L6.22566 4.81096Z"
				  fill="black" />
		</svg>

	</div>
</template>

<style scoped>
.loading-visible {
	display: block;
}

.content {
	margin-top: 35px;
}

.canvas-curtain {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 10px;
	z-index: 0;
	background-color: #292929;
}

.curtain-image {
	width: 50%;
	height: 50%;
	margin-bottom: 30px;
}

.videos-container {
	position: relative;
	min-width: 480px;
	min-height: 480px;
	margin-right: 1rem;
}

.title {
	text-align: center;
}

.video-container-title {
	top: 0;
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
}

.input-video {
	display: none;
	position: absolute;
	top: 0;
	left: 0;
}

.output-canvas {
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

.app-controls {
	width: 100%;
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translate(-50%, -10%);
	z-index: 2;
}

.controls {
	margin-top: .5em;
	border-radius: 10px;
	border-width: 5px;
	border-color: white;
}

.predictions {
	width: 480px;
	margin-left: 1rem;
	border: dashed;
	border-width: 3px;
	border-color: rgb(115, 115, 115);
	border-radius: 10px;
}

.predictions-container {
	width: 80%;
	margin: auto;
}

.predicted-word {
	font-size: 1.75rem;
	padding: .1em .5em .1em .5em;
	margin: 4px 4px 12px 4px;
	border-radius: 5px;
	font-weight: 600;
	color: rgb(0, 201, 0);
}

.content {
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: stretch;
}

.server-status-wrapper {
	display: flex;
	flex-direction: row;
	align-items: center;
	position: absolute;
	bottom: 0;
	right: 0;
	margin: 0 10px 0px 0;
	border-radius: 10px;
	padding: 4px 10px 4px 10px;
}

.status-text {
	margin: 0 8px 0 0;
	font-weight: bold;
}

.cross-icon {
	background-color: rgb(201, 0, 0);
}

.icon {
	padding: 5px;
	border-radius: 100%;
	width: 16px;
	height: 16px;
}

.confirm-icon {
	background-color: rgb(0, 201, 0);
}

.status-connected {
	color: rgb(0, 201, 0);
	background-color: rgba(0, 201, 0, 0.137);
}

.status-disconnected {
	color: rgb(201, 0, 0);
	background-color: rgba(201, 0, 0, 0.137);
}
</style>
