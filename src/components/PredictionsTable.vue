<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue"
import { Word } from "../types/components.interface"
import { toStrPercents } from "../common/utils"

const props = defineProps<{
    words: Word[]
}>()
let middleIndex: number = 0
let firstListHalf = ref<Word[]>()
let secondListHalf = ref<Word[]>()

onMounted(() => {
    watchEffect(() => middleIndex = Math.ceil(props.words.length / 2))
    console.log(middleIndex)

    watchEffect(() => firstListHalf.value = props.words.slice(0, middleIndex))
    watchEffect(() => secondListHalf.value = props.words.slice(middleIndex, props.words.length))

})

</script>
<template>
    <div class="tables-container">
        <table>
            <tr v-for="entry in firstListHalf">
                <td>{{entry.word}}</td>
                <td>{{toStrPercents(entry.probability)}}%</td>
            </tr>
        </table>
        <table>
            <tr v-for="entry in secondListHalf">
                <td>{{entry.word}}</td>
                <td>{{toStrPercents(entry.probability)}}%</td>
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
    background-color: #313744;
    border-radius: 4px;
    border-spacing: 0;
}

td {
    text-align: center;
    padding: 4px;
}

tr:nth-child(even) {
    background-color: #404858;
}
</style>