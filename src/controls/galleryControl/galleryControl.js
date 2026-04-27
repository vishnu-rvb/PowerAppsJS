import { PowerApps } from '../../core/PowerApps.js';
import { PowerApps_Control } from '../../core/PowerApps_Control.js';
//import { containerControl } from '../containerControl/containerControl.js';

const assets = [
    { id: 'galleryControlCSS', type: 'link', attribs: {
        href: new URL('./galleryControl.css', import.meta.url).href
    } }
];

export class galleryControl extends PowerApps_Control{
    static type = 'gallery'
    static assets = assets;
    constructor(data){
        super({});
        this._template = undefined;
        this._items = undefined;
        this.itemsContainer = this.control.querySelector('.power-app-gallery-items');
        if(data){this._init(data);};
    }
    _init(data){
        super._init(data);
        if(data['template']){ this.template = data['template']; };
        if(data['items']){ this.items = data['items']; }; //[{label:values...}...]
    }
    get items(){
        return this._items || [];
    }
    get template(){
        if(this._template) {
            return this._template;
        };
    }
    set template(val){
        if( Array.isArray(val) && val.every(i=> (i['type'] && (i['data']['label'] || i['data']['value'])) ) ){
            this._template = val;
        };
    }
    set items(val){
        if( Array.isArray(val) ){
            this._items = val;
            this._render();
        };
    }
    async _render(){
        this.itemsContainer.innerHTML = '';
        for(const i in this._items){
            const row = document.createElement('div');
            const item = this._items[i];
            row.className = 'power-app-gallery-row';
            row.setAttribute("row-index", i);
            row.style.position = 'relative'; 
            this.itemsContainer.appendChild(row);
            for(const key of this._template){
                const control = await PowerApps.add_control(row,key['type'],key['data']);
                if(item[key['data']['value']] || item[key['data']['label']]){
                    control.value = item[key['data']['value']] || item[key['data']['label']]
                };
            };
        };
    }
}