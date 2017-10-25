import * as Howler from 'howler';

class Sound {
    constructor(name, options) {
        this.name = name;
        this.howl = new Howler.Howl(options);
    }
}

class SoundManager {
    constructor() {
        this.sounds = [];

        this.sounds.push(new Sound('background', {
            src: 'media/sounds/4096__plagasul__rarexport.wav',
            autoplay: true,
            loop: true,
            volume: 0.2,
            preload: false
        }));

        this.setupSoundEffects();
    }

    setupSoundEffects() {
        this.sounds.push(new Sound('effect1', {
            src: 'media/sounds/406__tictacshutup__click.wav',
            autoplay: false,
            loop: false,
            volume: 0.2,
            preload: false
        }));
        this.sounds.push(new Sound('effect2', {
            src: 'media/sounds/26777__junggle__btn402.mp3',
            autoplay: false,
            loop: false,
            volume: 0.2,
            preload: false
        }));
        this.sounds.push(new Sound('effect3', {
            src: 'media/sounds/42899__freqman__canon_dos_d30_no_focus.wav',
            autoplay: false,
            loop: false,
            volume: 0.2,
            preload: false
        }));
    }
}

let soundManager = new SoundManager;
export default soundManager;
