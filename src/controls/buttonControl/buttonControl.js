import { PowerApps_Control } from '../../core/PowerApps_Control.js';
import { PowerApps } from '../../core/PowerApps.js';

const assets = [
    { id: 'buttonControlCSS', type: 'link', attribs: {
        href: new URL('./buttonControl.css', import.meta.url).href
    } }
];

export class buttonControl extends PowerApps_Control {
    static type = 'button'
    static assets = assets;
    constructor(data) {
        super({});
        this.button = this.control.querySelector('button');
        this.iconHTML = this.control.querySelector('.power-app-icon-suffix');
        this.on_select = undefined;
        this.control?.addEventListener('click', (event)=>{
            if(!this.button.disabled){
                this._selectCallback(event);
            };
        });
        if(data){this._init(data);};
    }
    _init(data) {
        super._init(data);
        if(data['value']!==undefined){ this.value = data['value']; };
        if(data['icon']!==undefined){ this.icon = data['icon']; };
        if(data['on_select']!==undefined){ this.on_select = data['on_select']; };
    }
    get value() {
        return this.button?.innerHTML;
    }
    get icon() { 
        return this.iconHTML?.querySelector('i')?.classList[1]; 
    }
    set value(val) {
        if (this.button){
            this.button.innerHTML = String(val);
        };
    }
    set icon(val) {
        if (this.iconHTML) {
            const i = this.iconHTML.querySelector('i');
            i.className = 'ms-Icon'; 
            i.classList.add(val);
            this.iconHTML.style.display = val? 'flex' : 'none';
        }
    }
    disable(val){ 
        if(this.button){
            this.button.disabled = JSON.parse(val);
        };
    }
    _selectCallback(event) {
        if (typeof(this.on_select)==='function') {
            this.on_select(event);
        };
    }
}