import { PowerApps_Control } from '../../core/PowerApps_Control.js';
import { PowerApps } from '../../core/PowerApps.js';

const assets = [
    { id: 'imageControlCSS', type: 'link', attribs: {
        href: new URL('./imageControl.css', import.meta.url).href
    } }
];

export class imageControl extends PowerApps_Control {
    static type = 'image'
    static assets = assets;
    static modalName = 'imageModal';
    constructor(data) {
        super({});
        this.input = this.control.querySelector('img');
        this.edit = true;
        this.input?.addEventListener('click',async (event)=>{
            await this._selectCallback(event);
        });
        if(data){this._init(data);};
    }
    _init(data) {
        super._init(data);
        if(data['on_select']!== undefined){ this.on_select = data['on_select']; };
        if(data['edit']!==undefined){ this.edit = data['edit']; };
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
    async _selectCallback(event){
        if(!this.input){ return; }
        try{
            if(this.edit){
                const newURL = await PowerApps.openModal(imageControl.modalName);
                if(newURL){ this.value = newURL; };
                if(newURL===''){ this.value = '' };
            };
            if(typeof(this.on_select)==='function'){ this.on_select(event); };
        }
        catch(error){
            console.error('No response from power apps engine',error);
        };
    }
}

export class imageModalControl extends PowerApps_Control {
    static type = 'imageModal'
    static assets = assets;
    constructor(){
        super({});
        this.input = this.control.querySelector('.power-app-url');
        const input_file = this.control.querySelector('.power-app-files');

        input_file?.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if(file){ this.input.value = URL.createObjectURL(file); };
        });
    }
    async open(){      
        return new Promise( (resolve,reject)=>{
            const btn_save = this.control.querySelector('.power-app-button-save');
            const btn_cancel  = this.control.querySelector('.power-app-button-cancel');
            btn_save?.addEventListener('click',(event)=>{
                resolve(this.input.value);
            }, {once: true});
            btn_cancel?.addEventListener('click',(event)=>{
                resolve(undefined);
            }, {once: true});
            this.control?.addEventListener('click',(event)=>{
                if(event.target === this.control ){ resolve(undefined); };
            }, {once: true});
        });
    }
}
