<template>
    <div class="main-player-container" @scroll="handleScroll">
        <div v-show="searchDataStore.loadSearch == true">
            <div v-for="(soundData, key) in soundsData" :key="key" class="song-element">
                <div class="song-img">
                    <img :src="soundData.images ? soundData.images.spectral_m : ''">
                </div>
                <div class="song-info">
                    <div class="song-info-name">
                        <label>{{ soundData.name }}</label>
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

        <div class="loading-gif-container" v-show="!searchDataStore.loadSearch">
            <loadingComponent></loadingComponent>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useSoundDataStore } from '../stores/soundData';
import { useSearchStore } from '@/stores/search';
import loadingComponent from '@/components/loadingComponent.vue';
import apiService from '../services/apiService';

const searchDataStore = useSearchStore();
const soundDataStore = useSoundDataStore();

let soundsData = ref([]);
let nextPageUrl = ref(null);
let isFetching = ref(false);

watch(
    () => searchDataStore.searchText, 
    () => {
        searchDataStore.loadSearch = false;
        getSoundsData();
    }
);

onMounted(() => {  
    getSoundsData();
});

const getSoundsData = async () => {
    if (isFetching.value) return;
    isFetching.value = true;

    let response = await apiService.getSounds(searchDataStore.searchText);
    
    soundsData.value = response.results;
    nextPageUrl.value = response.next; // Guardamos la URL de la siguiente página

    await fetchSoundDetails();
    searchDataStore.loadSearch = true;
    isFetching.value = false;
};

const loadMoreSounds = async () => {
    if (!nextPageUrl.value || isFetching.value) return;
    isFetching.value = true;

    let response = await apiService.getNextPage(nextPageUrl.value);
    
    soundsData.value.push(...response.results);
    nextPageUrl.value = response.next;

    await fetchSoundDetails();
    isFetching.value = false;
};

const fetchSoundDetails = async () => {
    for (let key in soundsData.value) {
        let data = await apiService.getsoundData(soundsData.value[key].id);
        soundsData.value[key] = { ...data, ...soundsData.value[key] };
    }
};

const handleScroll = (event) => {
    let { scrollTop, scrollHeight, clientHeight } = event.target;
    if (scrollTop + clientHeight >= scrollHeight - 50) { 
        loadMoreSounds();
    }
};

const changeCurrentSong = (key) => {
    soundDataStore.soundName = soundsData.value[key].name;
    soundDataStore.soundImg = soundsData.value[key].images.spectral_m;
    soundDataStore.soundUrl = soundsData.value[key].previews["preview-hq-mp3"];
};
</script>
