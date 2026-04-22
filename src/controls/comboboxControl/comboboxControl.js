import { dropdownControl } from '../dropdownControl/dropdownControl.js';

export class comboboxControl extends dropdownControl{
    _init(data){
        super._init(data);
        this._strict = false;
        if(data['strict']!==undefined){this.strict=data['strict'];};
        //on input filter options
        this.input.addEventListener('input',()=>{
            const values = this.value?.trim().toLowerCase().split(';') || '';
            for (const option of this._optionsCache) {
                const optionValue = option.dataset.value.trim().toLowerCase();
                const visible = values.some( j => optionValue.includes(j) );
                const state = option.style.display;
                if (visible && state==='none'){ option.style.display = 'block'; } 
                else if(!visible && state!=='none'){ option.style.display = 'none'; };
            };
        });
    }
    get label(){
        return super.label;
    }
    get strict(){
        return this._strict;
    }
    set label(val){
        super.label=val;
        this.input.placeholder=`Enter ${this.label}`;
    }
    set strict(val){
        this._strict=JSON.parse(val);
        this.input.setAttribute('strict',!!val);
    }
    isValid(){
        const value = this.value?.trim().toLowerCase() || '';
        const avail = this._optionsCache.some( i=> 
            (i.dataset.value.toLowerCase()===value && i.style.display!=='none') 
        );
        if(super.isValid()){ return this._strict? avail:true; }
        else{ return false; };
    }
    clear(){
        //unhide options
        for(const i of this._optionsCache){ 
            if(i.style.display==='none'){ i.style.display = 'block'; };
        };
        super.clear();
    }
}