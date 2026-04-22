import { PowerApps_Control } from '../../core/PowerApps_Control.js';
import { PowerApps } from '../../core/PowerApps.js';

const assets = [
    { id: 'textControlCSS', type: 'link', attribs: {
        href: new URL('./textControl.css', import.meta.url).href
    } }
];

export class textControl extends PowerApps_Control {
    _init(data){
        if(data['multiline']!==undefined){this.multiline=data['multiline'];};
        super._init(data);
    }
    static async load(){
        await PowerApps.loadAssets(assets);
    }
    get multiline(){
        const field=this.control.querySelector('.power-app-field-input');
        return JSON.parse(field?.getAttribute('multiline') || false);
    }
    set multiline(val){
        const input=this.control.querySelector('input');
        const textarea=this.control.querySelector('textarea');
        if(!input || !textarea){ return; };

        const isMulti = JSON.parse(val);
        const field = this.control.querySelector('.power-app-field-input');
        const attribs={
            id:this.id,
            value:this.value,
            name:this.name,
            required:this.required
        };
        this.input = isMulti? textarea:input;
        const inactive = isMulti? input:textarea;
        
        field.setAttribute('multiline',isMulti);
        this.input.style.display = 'block';
        this.input.style.zIndex = 0;
        inactive.style.display = 'none';
        inactive.style.zIndex = -1;

        for( const [key, value] of Object.entries(attribs) ){
            if(key==='value'){
                this.value = value;
                inactive.value = '';
            }
            else if(key==='required'){
                this.required = value;
                inactive.required = false;
            }
            else{
                this.input.setAttribute(key, value);
                inactive.removeAttribute(key);
            };
        };
    }
}
