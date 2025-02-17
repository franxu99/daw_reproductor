<template>
    <div class="player-container">

        <div class="content-container">
            <div class="lateral-container">
                <div class="search-box-container">
                    <input v-model="searchDataStore.searchText" placeholder="Buscar" type="text" name="searchQuery" class="search-box">
                    <i class="bi bi-search"></i>
                </div>
                <div class="last-music-container">
                    <div v-if="playedSongs.length == 0" class="message-last-music-container">No has escuchado nada ultimamente...</div>
                    <div v-for="(song, index) in playedSongs" :key="index" class="song-item">
                        <label for="">{{ song.name }}</label>
                        <div class="container-icon-last-music-container">
                            <i class="bi bi-play-circle btn-song-play" @click="changeCurrentSong(index)"></i>
                            <i class="bi bi-trash btn-song-play" @click="deleteSong(index)"></i>
                        </div>
                    </div>
                </div>
                <nav>

                </nav>
            </div>
            <div class="data-container">
                <RouterView />
            </div>
        </div>

        <div class="reproductor-container">
            <audio ref="reproductor" id="Reproductor" controls>
                <source :src="soundDataStore.soundUrl" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio> 

            <div class="sound-data-container">
                <label>{{ soundDataStore.soundName }}</label>
            </div>

            <div class="control-box">
                <div class="buttons-container">
                    <i class="bi bi-skip-backward"></i>
                    <i :class="currentButtonIcon" @click="toggleReproduction"></i>
                    <i class="bi bi-skip-forward"></i>
                </div>
                <div class="range-container">
                    <input :disabled="soundDataStore.soundUrl == ''" @input="changeAudioTime" type="range" :value="songCurrentTime" min="0" :max="songFullTime">
                </div>
                <div class="range-time-container">
                    <label class="start">{{ currentTime }}</label>
                    <label class="end">{{ endTime }}</label>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>
    import { useTemplateRef, ref, onMounted, watch } from 'vue';
    import { useSoundDataStore } from '../stores/soundData';
    import { useSearchStore } from '@/stores/search';

    const searchDataStore = useSearchStore();
    const soundDataStore = useSoundDataStore();

    let currentButtonIcon = ref("bi bi-play-circle");
    const reproductor = useTemplateRef("reproductor");
    const soundsData = ref([])

    let currentTime = ref("0:00");
    let endTime = ref("0:00");
    let songCurrentTime = ref(0);
    let songFullTime = ref(0);

    // Lista de canciones reproducidas
    let playedSongs = ref([]);

    watch(soundDataStore, () => {
        reproductor.value.load();
        reproductor.value.play();
        currentButtonIcon.value = "bi bi-pause-circle";

        // Agregar la canción actual a la lista si no está repetida
        if (!playedSongs.value.find(song => song.url === soundDataStore.soundUrl)) {
            playedSongs.value.push({
                name: soundDataStore.soundName,
                url: soundDataStore.soundUrl
            });
        }
    });

    onMounted(async () => {
        reproductor.value.addEventListener('loadedmetadata', () => {
            let duration = Math.floor(reproductor.value.duration);

            songFullTime.value = duration;

            endTime.value = "0:" + duration;
        });

        reproductor.value.addEventListener("timeupdate", () => {
            let duration = Math.floor(reproductor.value.currentTime);

            currentTime.value = "0:" + duration;
            songCurrentTime.value = duration;
        });

    });


    const changeAudioTime = (e) => {
        if(e.target.value == Math.floor(reproductor.value.currentTime)) return;

        reproductor.value.currentTime = e.target.value;
        currentTime.value = "0:" + Math.floor(reproductor.value.currentTime);
    }


    const toggleReproduction = () => {
        if(reproductor.value.paused){
            currentButtonIcon.value = "bi bi-pause-circle";
            reproductor.value.play();
        } else {
            currentButtonIcon.value = "bi bi-play-circle";
            reproductor.value.pause();
        }
    };

    // Función para cambiar la canción actual desde la lista de reproducidas
    const changeCurrentSong = (index) => {
        const song = playedSongs.value[index];
        soundDataStore.soundName = song.name;
        soundDataStore.soundUrl = song.url;
    };

    // Función para eliminar una canción de la lista
    const deleteSong = (index) => {
        playedSongs.value.splice(index, 1);
    };

</script>

<style>
.last-music-container{
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1vh;
}

.btn-song-play{
    cursor: pointer;
}

.song-item {
    padding: 2rem;
    color: white;
    background-color: #2b3733;
    border-radius: 0.3rem;
    display: flex;
    justify-content: space-between;
}

.container-icon-last-music-container{
    display: flex;
    gap: 0.5rem;
}

.message-last-music-container{
    padding: 1rem;
    color: rgb(192, 192, 192);
    font-size: 20px;
}

</style>
