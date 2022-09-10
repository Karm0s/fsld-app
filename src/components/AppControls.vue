<script setup lang="ts">
const emit = defineEmits(['start-detection', 'pause-detection', 'toggle-landmarks'])
</script>
<template>
    <div class="controls-wrapper">
        <h3 class="controls-title">Controls</h3>
        <div class="buttons-container">
            <button @click="$emit('start-detection')">start detection</button>
            <button @click="$emit('pause-detection')">pause detection</button>
        </div>
        <div class="checkbox-container">
            <input id="show-landmarks-toggle" type="checkbox" @click="$emit('toggle-landmarks')">
            <label for="show-landmarks-toggle">show landmarks</label>
        </div>
    </div>
</template>
<style scoped>
.controls-wrapper {
    display: flex;
    align-items: center;
    flex-direction: column;
    background-color: rgba(59, 59, 59, 0.85);
    max-height: 150px;
    max-width: 350px;
    border-radius: 5px;
    padding: 10px 0 10px 0;
}

.controls-title {
    margin: 0 0 8px 0;
}

.buttons-container {
    /* display: flex; */
    margin: 0 0 4px 0;
}

.checkbox-container {
    display: flex;
    justify-content: center;
}

button {
    margin: 0px 4px 0px 4px;
}
</style> 