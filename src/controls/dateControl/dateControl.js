import { PowerApps_Control } from '../../core/PowerApps_Control.js';

const assets = [
    { id : 'flatpickrCSS', type : 'link', attribs : {
        href : 'https://npmcdn.com/flatpickr/dist/themes/material_orange.css'
    } },
    { id : 'flatpickrJS', type : 'script', export : 'flatpickr', attribs : {
        src : 'https://cdn.jsdelivr.net/npm/flatpickr'
    } },
    { id: 'dateControlCSS', type: 'link', attribs: {
        href: new URL('./dateControl.css', import.meta.url).href
    } }
];

export class dateControl extends PowerApps_Control {
    static type = 'date'
    static assets = assets;
    constructor(data) {
        super(data);
        // bind flatpickr
        this.picker = flatpickr(this.input, {
            dateFormat: "Y-m-d",
            altFormat: "d-m-Y",
            altInput: true
        });
    }
    static async load(){
        const themeOverride = document.querySelector('link[themeOverride]');
        if(themeOverride){
            this.assets[0]['attribs']['href'] = themeOverride?.getAttribute('href');
            themeOverride.disabled = true;
        };
        await super.load();
    }
    get value(){
        return super.value;
    }
    set value(val){
        this.picker?.setDate(val,false);
    }
    clear(){
        this.picker?.clear();
    }
}