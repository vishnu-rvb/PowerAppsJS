import { PowerApps_Control } from '../../core/PowerApps_Control.js';

const assets = [
    { id: 'dropdownControlCSS', type: 'link', attribs: {
        href: new URL('./dropdownControl.css', import.meta.url).href
    } }
];

export class dropdownControl extends PowerApps_Control {
    static type = 'dropdown'
    static assets = assets;
    _init(data){
        super._init(data);
        this.listHTML=this.control.querySelector('.list');
        this._defaultOption=this.listHTML.querySelector('.option:first-child');
        this._optionsCache=[];
        this._selectedCache=[];

        if(data['options']!==undefined){ this.options=data['options']; };
        if(data['multiselect']!==undefined){ this.multiselect=data['multiselect'] };

        //on click input open dropdown
        this.input.addEventListener('click',(event)=>{
            if(this.input.readOnly){ event.preventDefault(); };
            this.toggle();
        });
        //off click input close dropdown
        document.addEventListener('click',(event)=>{
            if( this.isOpen && !this.control.querySelector('.power-app-field-input').contains(event.target) ){ this.close(); };
        });
        // on default select
        this._defaultOption.addEventListener('click',(event)=>{
            event.preventDefault();
            this.value=this._defaultOption.dataset.value;
            for(const i of this._selectedCache){ i.setAttribute('selected',false); };
            this._selectedCache=[];
            this.close();
        });

    }
    get options(){
        if( this.listHTML ){ return this._optionsCache; };
    }
    get multiselect(){
        return JSON.parse(this.input?.getAttribute('multiselect'));
    }
    get isOpen(){
        return this.listHTML?.style.display==='block';
    }
    set multiselect(val){
        this.input?.setAttribute('multiselect',JSON.parse(val));
    }
    set options(val){
        if(!Array.isArray(val) || !this.listHTML){ return; };
        const cleaned_val = Array.from(new Set(val),i=>String(i).trim()).filter(i=>i!=='');
        const oldOptions = Array.from(this.listHTML.querySelectorAll('.option')).filter(i=>i.dataset.value!=='');
        const fragment = document.createDocumentFragment(); //fragments is faster
        
        for(const i of oldOptions){ i.remove(); };
        this._selectedCache=[];

        for(const i of cleaned_val){
            const option=document.createElement('div');
            option.classList.add('option');
            option.dataset.value=i;
            option.innerHTML=i;
            option.addEventListener('click',(event)=>{
                event.preventDefault();
                if(!this._selectedCache.includes(option)){
                    option.setAttribute('selected',true);
                    this._selectedCache.push(option);
                    if(!this.multiselect && this._selectedCache.length>1){
                        this._selectedCache[0].setAttribute('selected',false);
                        this._selectedCache.splice(0,1);
                    };
                }
                else{
                    option.setAttribute('selected',false);
                    this._selectedCache.splice(this._selectedCache.indexOf(option),1);
                };
                this.value = Array.from(this._selectedCache,i=>i.dataset.value).join(';');
                if(!this.multiselect){ this.close(); };
            });
            fragment.appendChild(option);
            this._optionsCache.push(option);
        };
        this.listHTML.appendChild(fragment);
    }
    open(){
        this.listHTML.style.display='block';
    }
    close(){
        this.listHTML.style.display='none';
    }
    toggle(){
        this.isOpen? this.close():this.open();
    }
    clear(){
        for(const i of this._selectedCache){ i.setAttribute('selected',false); };
        this._selectedCache=[];
        super.clear();
    }
}