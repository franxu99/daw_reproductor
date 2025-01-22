import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useSoundDataStore = defineStore('soundDataStore', () => {
    
    const soundName = ref('hola')
    const soundUrl = ref('')

    const resetSound = () => {
        soundName.value = ''
        soundUrl.value = ''
    }

    return { soundUrl, soundName, resetSound }
})
