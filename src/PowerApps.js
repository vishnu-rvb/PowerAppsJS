export class PowerApps {
    constructor() {
        this.templates = undefined;
        this.controlMap = {
            text: textControl,
            number: numberControl,
            date: dateControl,
            dropdown: dropdownControl,
            combobox: comboboxControl,
            header: headerControl
        };
    }

    async init() {
        try {
            const response = await fetch(new URL('./PowerApps.html', import.meta.url).href);
            if (response.ok) {
                const html = await response.text();
                this.templates = new DOMParser().parseFromString(html, 'text/html');
                return this;
            };
        } 
        catch (error) {
            console.error('Failed to load Power Apps templates', error);
        };
    }

    add_control(selector, type, data = {}) {
        if (!this.templates) return console.error('Run init() first');

        const template = this.templates.querySelector('.'+type+'-control');
        if (!template) return console.error(`Template ${type} not found`);

        const targets = document.querySelectorAll(selector);
        const controls = [];
        for(const target of targets){
            const control = document.importNode(template.content, true).firstElementChild;
            target.appendChild(control);
            const ControlClass = this.controlMap[type] || PowerApps_Control;
            const control_instance = new ControlClass(control, data);
            controls.push(control_instance);
        };

        return controls.length === 1 ? controls[0] : controls;
    }
}

class PowerApps_Control{
    constructor(control, data){
        this.control = control;
        this.input = this.control.querySelector('input');
        this.labelHTML = this.control.querySelector('.power-app-field-label');
        this.requiredHTML = this.control.querySelector('.power-app-field-required');
        if(data){this._init(data);};
    }

    _init(data){
        if(data['label']){ this.label = data['label']; };
        if(data['id']){ this.id = data['id']; };
        if(data['value']){ this.value = data['value']; };
        if(data['name']){ this.name = data['name']; };
        if(data['required'] !== undefined){ this.required=data['required']; };
    }

    // Getters
    get label(){ return this.labelHTML? String(this.labelHTML.innerHTML):undefined; }
    get id(){ return this.input.id? this.input.id:undefined; }
    get value(){ return this.input.value? this.input.value:undefined; }
    get name(){ return this.input.name? this.input.name:undefined; }
    get required(){ return this.input.required? !!this.input.required:undefined; }

    //Setters
    set label(val){ 
        if(this.labelHTML){ this.labelHTML.innerHTML = String(val); };
    }
    set id(val){ 
        if(this.input){ this.input.id = String(val); };
    }
    set value(val){ 
        if(this.input){
            this.input.value = String(val);
            this.input.dispatchEvent(new Event('change', { bubbles: true }));
        };
    }
    set name(val){ 
        if(this.input){ this.input.name = String(val); };
    }
    set required(val) {
        if(this.input){ this.input.required = !!val; };
        if(this.requiredHTML){ this.requiredHTML.innerHTML = !!val ? '*' : ''; };
    }

    // state methods
    hide() { this.control.style.display = 'none'; }
    show() { this.control.style.display = ''; }
    on_change(val){
        if(this.input){
            this.input.addEventListener('change',()=>{val(this.value)});
        };
    }
}

class dateControl extends PowerApps_Control {
    constructor(control, data) {
        super(control, data);
        
        // bind flatpickr
        this.picker = flatpickr(this.input, {
            dateFormat: "Y-m-d",
            altFormat: "d-m-Y",
            altInput: true
        });
    }

    // Override value setter to update the calendar UI too
    set value(val) {
        super.value = val;
        this.picker.setDate(String(val),true,String(this.picker.config.dateFormat));
    }
}

class textControl extends PowerApps_Control {
    _init(data){
        if(data['multiline']){this.multiline=data['multiline'];};
        super._init(data);
    }
    //getters
    get multiline(){ 
        return this.input? !!this.input.getAttribute('multiline'):undefined; 
    }
    //setter
    set multiline(val){ 
        const input=this.control.querySelector('input');
        const textarea=this.control.querySelector('textarea');
        const icon=this.control.querySelector('.power-app-icon-suffix');
        if(!input || !textarea){ return; };

        input.setAttribute('multiline',!!val);
        this.input=!!val? textarea:input;
        input.style.display=!!val? 'none':'block';
        input.style.zIndex=!!val? -1:0;
        textarea.style.display=!!val? 'block':'none';
        textarea.style.zIndex=!!val? 0:-1;
        textarea.required=input.required;
        input.required='';
        this.required=textarea.required;
        icon.style.display= !!val? 'none':'block';
    }
}

class numberControl extends PowerApps_Control {
    _init(data){
        super._init(data);
        if(data['min']){this.min=data['min'];};
        if(data['max']){this.max=data['max'];};
    }
    //getters
    get min(){ return this.input.min? Number(this.input.min):undefined; }
    get max(){ return this.input.max? Number(this.input.max):undefined; }
    //setter
    set min(val){ if(this.input){this.input.min=String(val);} }
    set max(val){ if(this.input){this.input.max=String(val);} }
    set value(val){ 
        if(this.input){
            let clip_val=val;
            if(this.min){clip_val= Math.max(Number(val),this.min);};
            if(this.max){clip_val= Math.min(Number(val),this.max);};
            super.value=clip_val;
        };
    }
}

class headerControl extends PowerApps_Control {
    _init(data){
        super._init(data);
        this.titleHTML=this.control.querySelector('h1');
        this.btn_clear=this.control.querySelector('#btn-clear');
        this.btn_submit=this.control.querySelector('#btn-submit');
        if(data['title']){ this.title=data['title']; };
        if(data['reset']){ this.reset=data['reset']; };
        if(data['submit']){ this.submit=data['submit']; };
    }
    //getters
    get title(){ return this.titleHTML? String(this.titleHTML.innerHTML):undefined; }
    //setter
    set title(val){ if(this.titleHTML){this.titleHTML.innerHTML = String(val);}; }
    set reset(val){ if(this.btn_clear){this.btn_clear.addEventListener('click',val);} }
    set submit(val){ if(this.btn_submit){this.btn_submit.addEventListener('click',val);} }
}

class dropdownControl extends PowerApps_Control {
    _init(data){
        super._init(data);
        this.listHTML=this.control.querySelector('.list');
        this._defaultOption=this.listHTML.querySelector('option:first-child');
        this._optionsCache=[];
        this._selectedCache=[];

        if(data['options']){ this.options=data['options']; };
        if(data['multiselect']){ this.multiselect=data['multiselect'] };

        //on click input open dropdown
        this.input.addEventListener('click',()=>{ this.toggle(); });
        //off click input close dropdown
        document.addEventListener('click',(event)=>{
            if(! this.input.contains(event.target)){ this.close(); };
        });
        // on default select
        this._defaultOption.addEventListener('click',()=>{
            this.value=this._defaultOption.value;
            for(const i of this._selectedCache){ i.setAttribute('selected',false); };
            this._selectedCache=[];
            this.close();
        });

    }
    get options(){
        if(this.listHTML){
            return Array.from(
                this.listHTML.querySelectorAll('option'),i=>String(i.value))
                .filter(i=> i!=='');
        }
        else {return [];};
    }
    get multiselect(){ return this.input.getAttribute('multiselect')? this.input.getAttribute('multiselect'):undefined; }
    get isOpen(){ return this.listHTML.style.display==='block'; }
    set options(val){
        if(!Array.isArray(val) || !this.listHTML){ return; };
        const cleaned_val = Array.from(new Set(val),i=>String(i).trim()).filter(i=>i!=='');
        const oldOptions = Array.from(this.listHTML.querySelectorAll('option')).filter(i=>i.value!=='');
        const fragment = document.createDocumentFragment(); //fragments is faster
        
        for(const i of oldOptions){ i.remove(); };
        this._selectedCache=[];

        for(const i of cleaned_val){
            const option=document.createElement('option');
            option.innerHTML=i;
            option.addEventListener('click',()=>{
                if(!this._selectedCache.includes(option)){
                    option.setAttribute('selected',true);
                    this._selectedCache.push(option);
                    if(!this.multiselect && this._selectedCache.length>1){
                        this._selectedCache[0].setAttribute('selected',false);
                        this._selectedCache.splice(0,1);
                    };
                    /*if(this.multiselect){ this._selectedCache.push(option); }
                    else{ 
                        if(this._selectedCache[0]){ this._selectedCache[0].setAttribute('selected',false); };
                        this._selectedCache[0]=option; 
                    };*/
                }
                else{
                    option.setAttribute('selected',false);
                    this._selectedCache.splice(this._selectedCache.indexOf(option),1);
                };
                this.value=Array.from(this._selectedCache,i=>i.value).join(';');
                if(!this.multiselect){ this.close(); };
            });
            fragment.appendChild(option);
            this._optionsCache.push(option);
        };
        this.listHTML.appendChild(fragment);
    }
    set multiselect(val){ 
        if(this.input){
            this.input.setAttribute('multiselect',!!val);
        };
    }
    open(){this.listHTML.style.display='block';}
    close(){this.listHTML.style.display='none';}
    toggle(){ 
        if(this.isOpen){ this.close(); }
        else{ this.open(); }; 
    }
}

class comboboxControl extends dropdownControl{
    _init(data){
        super._init(data);
        if(data['label']){this.label=data['label'];};
        //on input filter options
        this.input.addEventListener('input',()=>{
            for (let i = 0; i < this._optionsCache.length; i++) {
                const option = this._optionsCache[i];
                const visible = option.value.toLowerCase().includes(this.value?.toLowerCase());
                const state = option.style.display;
                if (visible && state==='none'){ option.style.display = 'block'; } 
                else if(!visible && state==='block'){ option.style.display = 'none'; };
            };
        });
    }
    get label(){return super.label;}
    set label(val){
        super.label=val;
        this.input.placeholder=`Enter ${this.label}`;
    }
}