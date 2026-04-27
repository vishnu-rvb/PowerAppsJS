import { PowerApps_Control } from '../../core/PowerApps_Control.js';

const assets = [
    { id: 'numberControlCSS', type: 'link', attribs: {
        href: new URL('./numberControl.css', import.meta.url).href
    } }
];

export class numberControl extends PowerApps_Control {
    static type = 'number'
    static assets = assets;
    _init(data){
        super._init(data);
        if(data['min']!==undefined){this.min=data['min'];};
        if(data['max']!==undefined){this.max=data['max'];};
    }
    get min(){ 
        const val = this.input?.getAttribute('min');
        return (val !== null && val !== '')? Number(val) : undefined; 
    }
    get max(){ 
        const val = this.input?.getAttribute('max');
        return (val !== null && val !== '')? Number(val) : undefined; 
    }
    get value(){
        return super.value;
    }
    set min(val){ 
        if(this.input){
            if(this.input.max && Number(val)>Number(this.input.max)){
                this.input.min=String(this.input.max)
                this.input.max=String(val);
            }
            else{
                this.input.min=String(val);
            };
        }
    }
    set max(val){
        if(this.input){
            if(this.input.min && Number(val)<Number(this.input.min)){
                this.input.max=String(this.input.min);
                this.input.min=String(val);
            }
            else{
                this.input.max=String(val);
            };
        }
    }
    set value(val){ 
        if( this.input && super.value!==val ){
            super.value = this._clipValue(val);
        };
    }
    _clipValue(val){
        if(val===''){ return ''; }
        else{
            let clip_val = Number(val);
            if(typeof(this.min)==='number'){clip_val= Math.max(clip_val,this.min);};
            if(typeof(this.max)==='number'){clip_val= Math.min(clip_val,this.max);};
            return clip_val;
        };
    }
    _changeCallback() {
        this.input.value = this._clipValue(super.value);
        super._changeCallback();
    }
}
