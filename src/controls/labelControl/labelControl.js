import { PowerApps_Control } from '../../core/PowerApps_Control.js';

const assets = [
    { id: 'labelControlCSS', type: 'link', attribs: {
        href: new URL('./labelControl.css', import.meta.url).href
    } }
];

export class labelControl extends PowerApps_Control {
    static type = 'label'
    static assets = assets;
    constructor(data){
        super({});
        this.labelHTML = this.control.querySelector('.power-app-field-label');
        if(data){ this._init(data); };
    }
    get value() {
        return this.labelHTML?.innerHTML;
    }
    set value(val) {
        if(this.labelHTML){
            this.labelHTML.innerHTML = String(val);
        };
    }
}