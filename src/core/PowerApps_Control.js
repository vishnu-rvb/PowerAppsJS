import { PowerApps } from './PowerApps.js';

export class PowerApps_Control{
    static template = undefined;
    static assets = undefined;
    constructor(data){
        if(!this.constructor.template){
            throw new Error(`${this.constructor.name} template not loaded. Call load() first.`);
        };
        this.control = document.importNode(this.constructor.template.content, true).firstElementChild;
        this.input = this.control.querySelector('input');
        this.labelHTML = this.control.querySelector('.power-app-field-label');
        this.requiredHTML = this.control.querySelector('.power-app-field-required');
        this.on_change=undefined;
        this.input?.addEventListener('change', ()=>{ this._changeCallback(); });
        if(data){this._init(data);};
    }
    _init(data){
        if(data['label']!==undefined){ this.label = data['label']; };
        if(data['id']!==undefined){ this.id = data['id']; };
        if(data['value']!==undefined){ this.value = data['value']; };
        if(data['name']!==undefined){ this.name = data['name']; };
        if(data['required'] !== undefined){ this.required=data['required']; };
        if(data['on_change'] !== undefined){ this.on_change=data['on_change']; };
    }
    static async load(loadAsset=true){
        if(!this.template && this.type){
            this.template = await PowerApps._importTemplate(this.type);
            if(this.assets && loadAsset){ await PowerApps.loadAssets(this.assets); };
        }
        else{ return Promise.resolve(); };        
    }
    get label(){
        return this.labelHTML?.innerHTML;
    }
    get id(){
        return this.input?.id;
    }
    get value(){
        return this.input?.value;
    }
    get name(){
        return this.input?.name;
    }
    get required(){
        return this.input?.required;
    }
    set label(val){ 
        if(this.labelHTML){ this.labelHTML.innerHTML = String(val); };
    }
    set id(val){ 
        if(this.input){ this.input.id = String(val); };
    }
    set value(val){ 
        if( this.input ){
            this.input.value = String(val);
            this.input.dispatchEvent(new Event('change', { bubbles: true }));
        };
    }
    set name(val){ 
        if(this.input){ this.input.name = String(val); };
    }
    set required(val){
        if(this.input){ this.input.required = JSON.parse(val); };
        if(this.requiredHTML){ this.requiredHTML.innerHTML = JSON.parse(val) ? '*' : ''; };
    }
    hide(val) {
        this.control.style.display = JSON.parse(val)? 'none':'';
    }
    disable(val){ 
        if(this.input){ this.input.disabled = JSON.parse(val)? true:false; };
    }
    isValid(){
        if(this.required && this.value?.trim()===''){ return false;}
        else{ return true; };
    }
    clear(){
        if(this.input){ this.value=''; };
    }
    _changeCallback() {
        if (typeof(this.on_change) === 'function') { this.on_change(this.value); };
    }
}