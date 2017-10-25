import * as PIXI from 'pixi.js';

import LoadingBar from './LoadingBar';

/**
 * @class
 */
export default class Bootstrapper {

    constructor() {}

    init() {

        //PIXI
        const rendererOptions = {
            backgroundColor: 0x111111,
            interactive: true
        };

        let renderer = new PIXI.CanvasRenderer(window.innerWidth, window.innerHeight, rendererOptions);
        document.body.appendChild(renderer.view);

        //prevent right mouseclick, I hope
        renderer.view.addEventListener('contextmenu', () => {
            return false;
        });

        this.stage = new PIXI.Container();
        this.world = new PIXI.Container();
        this.stage.addChild(this.world);

        this.loadingBar = new LoadingBar(this.world, {
            title: 'Loading resources',
            onDone: () => {
                this.start();
            }
        });

        let animate = () => {
            requestAnimationFrame(animate);
            renderer.render(this.stage);
        }

        let windowSize = {
            width: window.innerWidth,
            height: window.innerHeight
        }
        window.addEventListener('resize', () => {
            var w = window.innerWidth;
            var h = window.innerHeight;

            //this part resizes the canvas but keeps ratio the same
            renderer.view.style.width = w + "px";
            renderer.view.style.height = h + "px";
            renderer.resize(w, h);
            this.eventEmitter.emit('resized', {
                oldWidth: windowSize.width,
                oldHeight: windowSize.height,
                width: w,
                height: h
            });

            windowSize.width = w;
            windowSize.height = h;

            this.loadingBar.resize();
        });

        window.addEventListener('keyup', (e) => {
            this.eventEmitter.emit('keyup', {
                which: e.which,
                altKey: e.altKey,
                ctrlKey: e.ctrlKey,
                shiftKey: e.shiftKey
            });
        });

        window.addEventListener('mouseup', (e) => {
            this.eventEmitter.emit('mouseup', e);
        });

        this.loadResources();
        animate();
    }

    start() {
        let doneMessage = new PIXI.Text('Loading finished!', {
            fontFamily: 'Roboto',
            fontSize: '40px',
            fill: '#ffffff'
        });
        doneMessage.position = new PIXI.Point(window.innerWidth / 2 - doneMessage.width / 2, window.innerHeight / 2 - doneMessage.height / 2);
        this.world.addChild(doneMessage);
    }

    loadResources() {
        this.loadingBar.start();
    }
}
