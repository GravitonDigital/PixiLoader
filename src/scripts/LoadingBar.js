import * as PIXI from 'pixi.js';
import FontFaceObserver from 'fontfaceobserver';
import {
    IMAGERESOURCES
} from './Const';
import soundManager from './SoundManager';

/**
 * @class
 */
export default class LoadingBar {
    constructor(parentContainer, options) {
        this.title = options.title ? options.title : '';

        this.doneLoading = options.onDone;
        if (!this.doneLoading) {
            this.doneLoading = () => {};
        }

        this.parentContainer = parentContainer;
        this.container = new PIXI.Container();
        this.parentContainer.addChild(this.container);

        this.padding = window.innerWidth * 0.1;
        this.heightPadding = window.innerHeight * 0.1;

        this.background;
        this.frame;
        this.bar;
        this.titleObject;

        this.assetsToLoad = IMAGERESOURCES.length;
        this.assetsLoaded = 0;

        this.fontsToLoad = 2;
        this.fontsLoaded = 0;

        this.soundsToLoad = soundManager.sounds.length;
        this.soundsLoaded = 0;
    }

    start() {
        this.createBackground();
        this.createFrame();
        this.createBar();
        this.createTitle();
        this.load();
    }

    resize() {
        if (this.isLoadingResources) {
            this.padding = window.innerWidth * 0.1;
            this.heightPadding = window.innerHeight * 0.1;

            this.createBackground();
            this.createFrame();
            this.createBar();
        }
    }

    load() {
        this.isLoadingResources = true;

        // built in assetloader in Pixi doesn't work on Iphone
        // PIXI.loader.add(IMAGERESOURCES).load(() => {

        // start loading asset at index 0
        this.loadResource(0, () => {
            // load fonts after images
            this.loadFonts();
        });
    }


    loadResource(index, done) {
        // call done when all images are loaded
        if (!IMAGERESOURCES[index]) {
            done();
            return;
        }

        // create texture and load image
        let texture = PIXI.Texture.fromImage(IMAGERESOURCES[index]);
        // load next asset when this one in finished
        texture.baseTexture.on('loaded', () => {
            this.assetsLoaded += 1;
            this.loadResource(index + 1, done);
            this.update();
        });
    }

    /**
     * Load fonts using font face observer
     */
    loadFonts() {
        // see main.css to see how fonts are loaded
        // this font loading could be prettier, but I'm not gonna bother right now
        let variant = {
            weight: 700
        };
        new FontFaceObserver('Roboto', variant).load().then(() => {
            this.fontsLoaded += 1;
            if (this.fontsLoaded === 2) {
                this.loadSounds(0);
            } else {
                this.update();
            }
        });
        new FontFaceObserver('Roboto').load().then(() => {
            this.fontsLoaded += 1;
            if (this.fontsLoaded === 2) {
                this.loadSounds(0);
            } else {
                this.update();
            }
        });
    }

    loadSounds(index) {
        if (!soundManager.sounds[index]) {
            this.loadingDone();
            return;
        }
        soundManager.sounds[index].howl.on('load', () => {
            this.update();
            this.loadSounds(index + 1);
        });
        soundManager.sounds[index].howl.load();
    }

    loadingDone() {
        this.isLoadingResources = false;
        this.update();
    }

    update() {
        if (this.isLoadingResources) {
            this.padding = window.innerWidth * 0.1;
            this.heightPadding = window.innerHeight * 0.1;
            this.createFrame();
            this.createBar();
        }
        if (!this.isLoadingResources) {
            this.doneLoading();
            this.destroy();
        }
    }

    createTitle() {
        this.destroyTitle();
        this.titleObject = new PIXI.Text(this.title, {
            fontSize: '40px',
            fill: '#ffffff'
        });
        this.titleObject.position = new PIXI.Point(window.innerWidth / 2 - this.titleObject.width / 2, this.frame.position.y - this.titleObject.height - 10);
        this.container.addChild(this.titleObject);
    }

    destroyTitle() {
        if (this.titleObject) {
            this.container.removeChild(this.titleObject);
            this.titleObject.destroy();
            delete this.titleObject;
        }
    }

    createBackground() {
        this.destroyBackground();
        this.background = new PIXI.Graphics();
        this.background.beginFill(0x000000, 1);
        this.background.drawRect(0, 0, window.innerWidth, window.innerHeight);
        this.background.endFill();
        this.container.addChild(this.background);
    }

    destroyBackground() {
        if (this.background) {
            this.container.removeChild(this.background);
            this.background.destroy();
            delete this.background;
        }
    }

    createFrame() {
        this.destroyFrame();
        this.frame = new PIXI.Graphics();
        this.frame.beginFill(0xffffff, 0);
        this.frame.lineStyle(4, 0xffffff, 1);
        this.frame.drawRect(0, 0, (window.innerWidth - (this.padding * 2)), 64);
        this.frame.position = new PIXI.Point(this.padding, window.innerHeight - this.frame.height - this.heightPadding + 4);
        this.frame.endFill();
        this.container.addChild(this.frame);
    }

    destroyFrame() {
        if (this.frame) {
            this.container.removeChild(this.frame);
            this.frame.destroy();
            delete this.frame;
        }
    }

    createBar() {
        this.destroyBar();
        this.bar = new PIXI.Graphics();
        this.bar.beginFill(0xffffff, 1);
        let total = this.assetsToLoad + this.fontsToLoad + this.soundsToLoad;
        let totalLoaded = this.assetsLoaded + this.fontsLoaded + this.soundsLoaded;
        let width = (window.innerWidth - (this.padding * 2)) * (totalLoaded / total)
        if (width > window.innerWidth - (this.padding * 2)) {
            width = window.innerWidth - (this.padding * 2);
        }
        this.bar.drawRect(0, 0, width, 64);
        this.bar.position = new PIXI.Point(this.padding, window.innerHeight - this.bar.height - this.heightPadding);
        this.bar.endFill();
        this.container.addChild(this.bar);
    }

    destroyBar() {
        if (this.bar) {
            this.container.removeChild(this.bar);
            this.bar.destroy();
            delete this.bar;
        }
    }

    destroy() {
        this.destroyBackground();
        this.destroyFrame();
        this.destroyBar();
        this.destroyTitle();
        delete this;
    }
}
