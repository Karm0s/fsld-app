<script setup lang="ts">
import { onMounted } from 'vue'

import { HistoryItem } from '../types/components.interface'

let props = defineProps<{
    item: HistoryItem
}>()
</script>
<template>
    <div class="word">
        {{item.word}}
    </div>
</template>
<style scoped>
.word {
    padding: 5px 10px 5px 10px;
    margin: 0 2px 0 2px;
    background-color: var(--primary-color);
    border-radius: 5px;
    color: rgb(0, 201, 0);
    font-weight: bolder;
}
</style>