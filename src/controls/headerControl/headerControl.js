import { PowerApps_Control } from '../../core/PowerApps_Control.js';
import { PowerApps } from '../../core/PowerApps.js';

const assets = [
    { id: 'headerControlCSS', type: 'link', attribs: {
        href: new URL('./headerControl.css', import.meta.url).href
    } }
];

export class headerControl extends PowerApps_Control {
    static type = 'header'
    static assets = assets;
    _init(data){
        super._init(data);
        this.titleHTML=this.control.querySelector('h1');
        this.btn_clear=this.control.querySelector('#btn-clear');
        this.btn_submit=this.control.querySelector('#btn-submit');
        this.on_submit=undefined;
        this.on_clear=undefined;
        this.btn_submit.addEventListener('click', ()=>{this._headerCallback('submit');});
        this.btn_clear.addEventListener('click', ()=>{this._headerCallback('clear');});

        if(data['title']!==undefined){ this.title=data['title']; };
        if(data['on_clear']!==undefined){ this.on_clear=data['on_clear']; };
        if(data['on_submit']!==undefined){ this.on_submit=data['on_submit']; };
    }
    get title(){ return this.titleHTML? String(this.titleHTML.innerHTML):undefined; }
    set title(val){ if(this.titleHTML){this.titleHTML.innerHTML = String(val);}; }
    _headerCallback(val){
        if(val==='submit' && typeof(this.on_submit)==='function'){ this.on_submit(); }
        else if(val==='clear' && typeof(this.on_clear)==='function'){  this.on_clear(); };
    }
}