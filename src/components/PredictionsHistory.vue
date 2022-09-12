<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { HistoryItem } from '../types/components.interface'

import PredictionsHistoryItem from './PredictionsHistoryItem.vue'



let props = defineProps<{
    items: HistoryItem[]
}>()

function removeItemFromHistory(item: HistoryItem) {
    const itemToDelete = props.items.find(i => i.id === item.id)!
    props.items.splice(props.items.indexOf(itemToDelete), 1)
}
</script>
<template>
    <div class="predictions-history-container">
        <div class="words-container">
            <TransitionGroup name="history-items">
                <predictions-history-item v-for="item in props.items"
                                          :key="item.id"
                                          @expired="removeItemFromHistory(item)"
                                          :item="item"></predictions-history-item>
            </TransitionGroup>
        </div>
    </div>
</template>
<style scoped>
.predictions-history-container {
    min-height: 150px;
    width: 100%;
    background-color: #282D38;
    border-radius: 10px;
    padding: 25px 10px 25px 10px;
    box-sizing: border-box;
}

.words-container {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    width: 95%;
    margin: auto;
    height: 100%;
}

.history-items-move,
.history-items-enter-active,
.history-items-leave-active {
    transition: all 0.8s ease;
}

.history-items-enter-from,
.history-items-leave-to {
    opacity: 0;
}

.history-items-leave-active {
    position: absolute;
}
</style>