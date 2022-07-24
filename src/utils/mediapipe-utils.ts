import {
	Holistic,
	FACEMESH_LIPS,
	POSE_CONNECTIONS,
	FACEMESH_TESSELATION,
	HAND_CONNECTIONS,
	FACEMESH_RIGHT_EYE,
	FACEMESH_LEFT_EYE,
	FACEMESH_RIGHT_EYEBROW,
	FACEMESH_LEFT_EYEBROW,
	FACEMESH_FACE_OVAL,
} from "@mediapipe/holistic"
import { Camera } from "@mediapipe/camera_utils"
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils"

export class MediapipeUtils {
	holistic: Holistic // holistic model
	camera: Camera // Camera object to acess webcam and pass data to holistic model
	drawCanvas: HTMLCanvasElement // Drawing canvas to draw mediapipe landmarks
	canvasCtx: CanvasRenderingContext2D // Drawing canvas context
	resultsBuffer!: any[] // Array to store mediapipe data
	maxBufferSize: number // Max number of items (frames) to store in buffer before purging

	constructor(videoElement: HTMLVideoElement, drawCanvas: HTMLCanvasElement, maxBufferSize: number = 60) {
		this.maxBufferSize = maxBufferSize
		// Holistic model to make predictions
		this.holistic = new Holistic({
			locateFile: (file) => {
				return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.5/${file}`
			},
		})
		this.holistic.setOptions({
			modelComplexity: 1,
			smoothLandmarks: true,
			enableSegmentation: true,
			smoothSegmentation: true,
			refineFaceLandmarks: true,
			minDetectionConfidence: 0.5,
			minTrackingConfidence: 0.5,
		})
		this.holistic.onResults(this.onResults)

		// Camera element to capture video feed
		this.camera = new Camera(videoElement, {
			onFrame: async () => {
				await this.holistic.send({ image: videoElement })
			},
			width: 720,
			height: 480,
		})
		// Drawing canvas to draw mediapipe landmarks
		this.drawCanvas = drawCanvas
		this.canvasCtx = this.drawCanvas.getContext("2d")!
	}

	saveInBuffer(results: any) {
		if (this.resultsBuffer.length === this.maxBufferSize) {
			this.resultsBuffer = []
		}
		this.resultsBuffer.push(results)
	}

	onResults(results: any) {
		this.canvasCtx.save()
		this.canvasCtx.clearRect(0, 0, this.drawCanvas.width, this.drawCanvas.height)
		this.canvasCtx.drawImage(results.segmentationMask, 0, 0, this.drawCanvas.width, this.drawCanvas.height)

		// // Only overwrite existing pixels.
		this.canvasCtx.globalCompositeOperation = "source-in"
		this.canvasCtx.fillStyle = "transparent"
		this.canvasCtx.fillRect(0, 0, this.drawCanvas.width, this.drawCanvas.height)

		// Only overwrite missing pixels.
		this.canvasCtx.globalCompositeOperation = "destination-atop"
		this.canvasCtx.drawImage(results.image, 0, 0, this.drawCanvas.width, this.drawCanvas.height)

		this.canvasCtx.globalCompositeOperation = "source-over"
		drawConnectors(this.canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, { color: "#00FF00", lineWidth: 2 })
		drawLandmarks(this.canvasCtx, results.poseLandmarks, { color: "#FF0000", lineWidth: 1 })
		drawConnectors(this.canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION, { color: "#C0C0C070", lineWidth: 1 })
		drawConnectors(this.canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS, { color: "#CC0000", lineWidth: 2 })
		drawLandmarks(this.canvasCtx, results.leftHandLandmarks, { color: "#00FF00", lineWidth: 1 })
		drawConnectors(this.canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS, { color: "#00CC00", lineWidth: 2 })
		drawLandmarks(this.canvasCtx, results.rightHandLandmarks, { color: "#FF0000", lineWidth: 1 })
		this.canvasCtx.restore()
	}

	// Start webcam capture and mediapipe detection
	start() {
		this.camera.start()
	}
	// Stop webcam capture and mediapipe detection
	stop() {
		this.camera.stop()
	}
}
