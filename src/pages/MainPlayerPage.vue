<template>
    <div>
        <button @click="cambio1" class="btn btn-primary">
            Cambio 1
        </button>

        <button @click="cambio2" class="btn btn-primary">
            Cambio 2
        </button>

        <button @click="cambio3" class="btn btn-primary">
            Cambio 3
        </button>

    </div>
</template>

<script setup>

    import { useSoundDataStore } from '../stores/soundData';

    const soundData = useSoundDataStore();

    const cambio1 = () => {
        soundData.soundName = "Cambio 1";
    }

    const cambio2 = () => {
        soundData.soundName = "Cambio 2";
    }

    const cambio3 = () => {
        soundData.resetSound();
    }
</script>