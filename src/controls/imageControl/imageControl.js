import { PowerApps_Control } from '../../core/PowerApps_Control.js';
import { PowerApps } from '../../core/PowerApps.js';

const assets = [
    { id: 'imageControlCSS', type: 'link', attribs: {
        href: new URL('./imageControl.css', import.meta.url).href
    } }
];

export class imageControl extends PowerApps_Control {
    constructor(control, data) {
        super(control, {});
        this.input = this.control.querySelector('img');
        this.input?.addEventListener('click', (event)=>{ this._selectCallback(event); });
        const temp = this.control.querySelector('.image-modal');
        this.modal = document.importNode(temp.content, true).firstElementChild;
        if(data){this._init(data);};
    }
    _init(data) {
        super._init(data);
        if(data['on_select']!== undefined){ this.on_select = data['on_select']; };
    }
    static async load() {
        await PowerApps.loadAssets(assets);
    }
    get value() {
        return this.input?.src;
    }
    get label(){
        return this.input?.alt;
    }
    set value(val) {
        if(this.input){
            this.input.src = String(val);
        };
    }
    set label(val){
        if(this.input){
            this.input.alt = String(val);
        };
    }
    _selectCallback(event){
        if(this.input){
            document.body.appendChild(this.modal);
            const input_url = this.modal.querySelector('.power-app-url');
            const input_files = this.modal.querySelector('.power-app-files');
            const btn_save = this.modal.querySelector('.power-app-button-save');
            const btn_cancel = this.modal.querySelector('.power-app-button-cancel');

            input_files.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if(file){
                    input_url.value = URL.createObjectURL(file);
                };
            });

            btn_save.addEventListener('click',()=>{
                if (input_url.value){
                    this.value = input_url.value;
                };
                this.modal.remove();
            });
            btn_cancel.addEventListener('click',()=>{
                this.modal.remove();
            });

            if(typeof(this.on_select)==='function'){
                this.on_select(event);
            };
        };
    }
}