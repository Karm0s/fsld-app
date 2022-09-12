export interface Word {
	word: string
	probability: number
}
export interface HistoryItem {
	id: number
	word: string
}

export interface ModelPrediction {
	maxProbability: Word
	probabilities: Word[]
}
