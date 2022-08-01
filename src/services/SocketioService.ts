import { io, Socket } from "socket.io-client"

type EventListenerCallback = (payload: any) => void

export class SocketioService {
	URL: string
	socket: Socket

	constructor() {
		this.URL = "http://127.0.0.1:5000"
		this.socket = io(this.URL)
	}

	send(eventName: string, payload: any) {
		this.socket.emit(eventName, payload)
	}

	listen(eventName: string, callback: EventListenerCallback) {
		this.socket.on(eventName, callback)
	}
}
