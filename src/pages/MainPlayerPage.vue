<template>
    <div class="main-player-container">
        <div v-for="(soundData, key) in soundsData" class="song-element">
            <div class="song-img">
                <img :src="soundData.images ? soundData.images.spectral_m : ''">
            </div>
            <div class="song-info">
                <div class="song-info-name">
                    <label>{{  soundData.name }}</label>
                </div>

                <div class="song-info-data">
                    <label>{{ soundData.username }}</label>
                    <label>{{ soundData.duration }}s</label>
                    <label>{{ soundData.created }}</label>
                </div>
            </div>
            <div class="song-buttons">
                <i class="bi bi-info-circle btn-song-info"></i>
                <i class="bi bi-play-circle btn-song-play" @click="changeCurrentSong(key)"></i>
            </div>

        </div> 

    </div>
</template>

<script setup>

    import apiService from '../services/apiService';
    import { onMounted, ref } from 'vue';
    import { useSoundDataStore } from '../stores/soundData';

    const soundDataStore = useSoundDataStore();

    let soundsData = ref({});

    onMounted(async () => {
        
        let response = await apiService.getSounds();

        soundsData.value = response.results;

        soundsData.value.forEach(async (element, key) => {
            let data = await apiService.getsoundData(element.id);

            soundsData.value[key] = {
                ...data,
                ...soundsData.value[key]
            };
        });
    });

    const changeCurrentSong = (key) => {
        console.log(soundsData.value[key]);

        soundDataStore.soundName = soundsData.value[key].name;
        soundDataStore.soundImg = soundsData.value[key].images.spectral_m;
        soundDataStore.soundUrl = soundsData.value[key].previews["preview-hq-mp3"];

        console.log(soundDataStore.soundUrl);
    }
</script>