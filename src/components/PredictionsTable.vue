<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue"
import { Prediction } from "../types/components.interface"

const props = defineProps<{
    predictions: Prediction[]
}>()
let middleIndex: number = 0
let firstListHalf = ref<Prediction[]>()
let secondListHalf = ref<Prediction[]>()

onMounted(() => {
    watchEffect(() => middleIndex = Math.ceil(props.predictions.length / 2))
    console.log(middleIndex)

    watchEffect(() => firstListHalf.value = props.predictions.slice(0, middleIndex))
    watchEffect(() => secondListHalf.value = props.predictions.slice(middleIndex, props.predictions.length))

})

</script>
<template>
    <div class="tables-container">
        <table>
            <tr v-for="entry in firstListHalf">
                <td>{{entry.word}}</td>
                <td>{{entry.probability}}%</td>
            </tr>
        </table>
        <table>
            <tr v-for="entry in secondListHalf">
                <td>{{entry.word}}</td>
                <td>{{entry.probability}}%</td>
            </tr>
        </table>
    </div>
</template>
<style scoped>
.tables-container {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 10px;
}

table {
    width: 75%;
    border: 2px solid gray;
    border-radius: 4px;
    border-spacing: 0;
}

td {
    text-align: center;
    padding: 4px;
}

tr:nth-child(even) {
    background-color: gray;
}
</style>