import '@mediapipe/holistic'
import '@mediapipe/camera_utils'
import '@mediapipe/drawing_utils'

declare var Holistic: any
declare var POSE_CONNECTIONS: any
declare var HAND_CONNECTIONS: any
declare var Camera: any
declare var drawConnectors: any
declare var drawLandmarks: any

export type Keypoints = typeof Array<number>[][]
export type OnKeypointsCallback = (keypoints: Keypoints) => void

export class MediapipeUtils {
	holistic: typeof Holistic
	camera: typeof Camera
	inputVideo: HTMLVideoElement
	drawCanvas: HTMLCanvasElement
	showLandmarks: boolean
	canvasCtx: CanvasRenderingContext2D
	resultsBuffer!: any
	maxBufferSize: number
	callbackOnKeypoints: OnKeypointsCallback
	cameraStarted: boolean = false
	isFirstFrameReady: boolean = false
	onFirstFrameCallback!: Function

	constructor(
		videoElement: HTMLVideoElement,
		drawCanvas: HTMLCanvasElement,
		showLandmarks: boolean = true,
		maxBufferSize: number = 30,
		callbackOnKeypoints: OnKeypointsCallback,
		onFirstFrameCallback: Function
	) {
		this.resultsBuffer = []
		this.callbackOnKeypoints = callbackOnKeypoints
		this.showLandmarks = showLandmarks
		this.maxBufferSize = maxBufferSize
		this.inputVideo = videoElement
		this.onFirstFrameCallback = onFirstFrameCallback

		// Holistic model to make predictions
		this.holistic = new Holistic({
			locateFile: (file: any) => {
				return `/mediapipe/holistic/${file}`
			},
		})
		this.holistic.setOptions({
			modelComplexity: 1,
			smoothLandmarks: true,
			enableSegmentation: true,
			smoothSegmentation: true,
			minDetectionConfidence: 0.5,
			minTrackingConfidence: 0.5,
		})
		this.holistic.onResults((results: any) => {
			this.onResults(results)
		})

		// Camera element to capture video feed
		this.camera = new Camera(this.inputVideo, {
			onFrame: async () => {
				await this.holistic.send({ image: this.inputVideo })
			},
			width: 480,
			height: 480,
		})
		// Drawing canvas to draw mediapipe landmarks
		this.drawCanvas = drawCanvas
		this.canvasCtx = this.drawCanvas.getContext('2d')!
	}

	saveInBuffer(results: any): void {
		this.resultsBuffer.push(results)
	}

	extractKeypoints(results: any): Keypoints {
		const pointDeconstructor = function (point: any) {
			return [point.x, point.y, point.z]
		}
		const pose =
			results.poseLandmarks?.map((point: any) => {
				let values = [point.x, point.y, point.z]
				values.push(point.visibility || 0)
				return values
			}) || new Array(132).fill(0)
		const lh = results.leftHandLandmarks?.map(pointDeconstructor) || new Array(63).fill(0)
		const rh = results.rightHandLandmarks?.map(pointDeconstructor) || new Array(63).fill(0)
		let val = [...pose.flat(), ...lh.flat(), ...rh.flat()]
		// console.log(val)
		return val
	}

	drawLandmarks(results: any) {
		if (!this.isFirstFrameReady) {
			this.isFirstFrameReady = true
			this.onFirstFrameCallback()
		}
		this.canvasCtx.save()
		this.canvasCtx.clearRect(0, 0, this.drawCanvas.width, this.drawCanvas.height)

		// Only overwrite existing pixels.
		this.canvasCtx.globalCompositeOperation = 'source-in'
		this.canvasCtx.fillStyle = 'transparent'
		this.canvasCtx.fillRect(0, 0, this.drawCanvas.width, this.drawCanvas.height)

		// Only overwrite missing pixels.
		this.canvasCtx.globalCompositeOperation = 'destination-atop'
		this.canvasCtx.drawImage(results.image, 0, 0, this.drawCanvas.width, this.drawCanvas.height)

		if (this.showLandmarks) {
			this.canvasCtx.globalCompositeOperation = 'source-over'
			if (results.poseLandmarks) {
				drawConnectors(this.canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, { color: '#00FF00', lineWidth: 2 })
				drawLandmarks(this.canvasCtx, results.poseLandmarks, { color: '#FF0000', lineWidth: 1 })
			}
			if (results.leftHandLandmarks) {
				drawConnectors(this.canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS, { color: '#CC0000', lineWidth: 2 })
				drawLandmarks(this.canvasCtx, results.leftHandLandmarks, { color: '#00FF00', lineWidth: 1 })
			}
			if (results.rightHandLandmarks) {
				drawConnectors(this.canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS, { color: '#00CC00', lineWidth: 2 })
				drawLandmarks(this.canvasCtx, results.rightHandLandmarks, { color: '#FF0000', lineWidth: 1 })
			}
		}
		this.canvasCtx.restore()
	}

	onResults(results: any) {
		const keypoints = this.extractKeypoints(results)
		this.saveInBuffer(keypoints)
		this.drawLandmarks(results)
		if (this.resultsBuffer.length === this.maxBufferSize) {
			this.resultsBuffer = this.resultsBuffer.slice(-this.maxBufferSize)
			this.callbackOnKeypoints(this.resultsBuffer)
			this.resultsBuffer = []
		}
	}

	// Start webcam capture and mediapipe detection
	start() {
		this.resultsBuffer = []
		this.cameraStarted = true
		this.camera.start()
	}
	// Stop webcam capture and mediapipe detection
	stop() {
		this.camera.stop()
	}

	isCameraRunning(): boolean {
		return this.cameraStarted
	}

	getResults(): Keypoints[] {
		return this.resultsBuffer
	}
	setShowLandmarks(value: boolean) {
		this.showLandmarks = value
	}
}
