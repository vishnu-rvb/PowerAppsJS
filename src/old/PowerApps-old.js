let dependencies=[
    { id : 'fabricCSS', type : 'link', attribs : { 
        href : 'https://static2.sharepointonline.com/files/fabric/office-ui-fabric-core/11.0.0/css/fabric.min.css'
    } },
    { id : 'flatpickrCSS', type : 'link', attribs : {
        href : 'https://npmcdn.com/flatpickr/dist/themes/material_orange.css'
    } },
    { id : 'flatpickrJS', type : 'script', export : 'flatpickr', attribs : {
        src : 'https://cdn.jsdelivr.net/npm/flatpickr'
    } },
    { id : 'danfoJS', type : 'script', export : 'dfd', attribs : {
        src : 'https://cdn.jsdelivr.net/npm/danfojs@1.2.0/lib/bundle.min.js'
    } },
    { id : 'jqueryJS', type : 'script', export : 'jQuery', attribs : {
        integrity : 'sha256-OaVG6prZf4v69dPg6PhVattBXkcOWQB62pdZ3ORyrao=',
        crossorigin : 'anonymous',
        src : 'https://code.jquery.com/jquery-4.0.0.min.js'
    } },
    { id:'datatablesCSS', type : 'link', attribs : {
        href : 'https://cdn.datatables.net/2.3.7/css/dataTables.dataTables.css'
    } },
    { id:'datatablesJS', type : 'script', export : 'DataTable', attribs : {
        src : 'https://cdn.datatables.net/2.3.7/js/dataTables.js'
    } }
];

export class PowerApps {
    constructor() {
        this.templates = undefined;
        this.controlMap = {
            text: textControl,
            number: numberControl,
            date: dateControl,
            dropdown: dropdownControl,
            combobox: comboboxControl,
            header: headerControl,
            table: tableControl
        };
    }

    async init() {
        try {
            await this._load_dependencies();
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

    async _load_dependencies(){
        if( document.querySelector( 'link[themeOverride]' ) ) { 
            dependencies = dependencies.filter( i=> i['id']!=='flatpickrCSS' ) 
        };
        const promises = Array.from( dependencies, i => {
            if( document.querySelector( `#${i['id']}` ) ) { return Promise.resolve() };
            return new Promise( ( resolve, reject ) => {
                const element=document.createElement( i['type'] );
                element.id=i['id'];
                for( const [ key, value ] of Object.entries( i['attribs'] ) ){ element.setAttribute( key, value ); };
                if( i['type']==='link' ) { 
                    element.setAttribute( 'rel', 'stylesheet' );
                    element.setAttribute( 'type', 'text/css' );
                    document.head.appendChild(element);
                    resolve(); 
                }
                else if( i['type']==='script' ){ 
                    element.onerror=reject;
                    element.onload = async () => {
                        if(i['export']){
                            await this._until( () => window[i['export']] !== undefined );
                        };
                        resolve();
                    };
                    document.head.appendChild(element);
                };
            } );
        });
        return Promise.all(promises);
    }
    async _until(condition){
        while(!condition()){
            await new Promise(resolve => requestAnimationFrame(resolve) );
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
        this._valid=false;
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
    // Getters
    get label(){ return this.labelHTML?.innerHTML; }
    get id(){ return this.input?.id; }
    get value(){ return this.input?.value; }
    get name(){ return this.input?.name; }
    get required(){ return this.input?.required; }
    //Setters
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
    // state methods
    hide(val) {
        this.control.style.display = JSON.parse(val)? 'none':'';
    }
    disable(val){ 
        if(this.input){ this.input.disable = JSON.parse(val); };
    }
    isValid(){
        if(this.required && this.value.trim()==''){ return false;}
        else{ return true; };
    }
    clear(){
        if( this.input){ this.value=''; };
    }
    _changeCallback() {
        if (typeof(this.on_change) === 'function') { this.on_change(this.value); };
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
    get value(){ return super.value; }
    //update picker
    set value(val) {
        this.picker?.setDate(super.value,false);
    }
    clear(){
        this.picker?.clear();
    }
}

class textControl extends PowerApps_Control {
    _init(data){
        if(data['multiline']!==undefined){this.multiline=data['multiline'];};
        super._init(data);
    }
    //getters
    get multiline(){ 
        if(this.input) { return JSON.parse(this.input.getAttribute('multiline')); };
    }
    //setter
    set multiline(val){ 
        const input=this.control.querySelector('input');
        const textarea=this.control.querySelector('textarea');
        const icon=this.control.querySelector('.power-app-icon-suffix');
        if(!input || !textarea){ return; };

        input.setAttribute('multiline',!!val);
        this.input = JSON.parse(val)? textarea:input;
        input.style.display = JSON.parse(val)? 'none':'block';
        input.style.zIndex = JSON.parse(val)? -1:0;
        textarea.style.display = JSON.parse(val)? 'block':'none';
        textarea.style.zIndex = JSON.parse(val)? 0:-1;
        textarea.required = input.required;
        input.required = '';
        this.required = textarea.required;
        icon.style.display = JSON.parse(val)? 'none':'block';
    }
}

class numberControl extends PowerApps_Control {
    _init(data){
        super._init(data);
        if(data['min']!==undefined){this.min=data['min'];};
        if(data['max']!==undefined){this.max=data['max'];};
    }
    //getters
    get min(){ return this.input.min? Number(this.input.min):undefined; }
    get max(){ return this.input.max? Number(this.input.max):undefined; }
    get value(){ return super.value; }
    //setter
    set min(val){ if(this.input){this.input.min=String(val);} }
    set max(val){ if(this.input){this.input.max=String(val);} }
    set value(val){ 
        if( this.input && super.value!==val ){ super.value = this._clipValue(val); };
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

class headerControl extends PowerApps_Control {
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
    //getters
    get title(){ return this.titleHTML? String(this.titleHTML.innerHTML):undefined; }
    //setter
    set title(val){ if(this.titleHTML){this.titleHTML.innerHTML = String(val);}; }
    _headerCallback(val){
        if(val==='submit' && typeof(this.on_submit)==='function'){ this.on_submit(); }
        else if(val==='clear' && typeof(this.on_clear)==='function'){  this.on_clear(); };
    }
}

class dropdownControl extends PowerApps_Control {
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
    get multiselect(){ return this.input?.getAttribute('multiselect'); }
    get isOpen(){ return this.listHTML?.style.display==='block'; }
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
    set multiselect(val){ this.input?.setAttribute('multiselect',!!val); }

    open(){ this.listHTML.style.display='block'; }
    close(){ this.listHTML.style.display='none'; }
    toggle(){ this.isOpen? this.close():this.open(); }
    clear(){
        //clear selected
        for(const i of this._selectedCache){ i.setAttribute('selected',false); };
        this._selectedCache=[];
        super.clear();
    }
}

class comboboxControl extends dropdownControl{
    _init(data){
        super._init(data);
        this._strict = false;
        if(data['strict']!==undefined){this.strict=data['strict'];};
        
        this.input.addEventListener('input',()=>{
            const value = this.value?.trim().toLowerCase() || '';
            //on input filter options
            for (let i = 0; i < this._optionsCache.length; i++) {
                const option = this._optionsCache[i];
                const visible = option.dataset.value.toLowerCase().includes(value);
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
            (i.value.toLowerCase()===value && i.style.display!=='none') 
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

class tableControl extends PowerApps_Control {
    _init(data) {
        super._init(data);
        this.table = this.control.querySelector('table');
        if( data['id'] ) { this.id = data['id']; };
        if ( data['rows']  && data['columns'] ) {    
            this._df = new dfd.DataFrame( data['rows'], { columns : data['columns'] });

            this.dataTable = new DataTable( this.table,{
                columns : this._df.columns.map( i => { return { title: i }; }),
                data : this._df.values,
                pageLength : data['pageLength'] || 10,
                searching : data['searching'] || false,
                ordering : data['ordering'] || false,
                info : data['info'] || false,
                responsive: data['responsive'] || false,
                paging: data['paging'] || false
            });
        }
    }

    get value() { return this.df.values; }
    get id() { return this.control.querySelector('.power-app-field-table')? this.control.querySelector('.power-app-field-table').id:undefined; }
    set id(val) {
        if(this.control.querySelector('.power-app-field-table')){
            this.control.querySelector('.power-app-field-table').id=String(val);
        };
    }
    get df() { return this._df; }
    get pageLength() { return this.dataTable ? this.dataTable.page.len() : undefined; }
    get searching() { return this.dataTable ? this.dataTable.settings()[0].oFeatures.bFilter : false; }
    get ordering() { return this.dataTable ? this.dataTable.settings()[0].oFeatures.bSort : false; }
    get info() { return this.dataTable ? this.dataTable.settings()[0].oFeatures.bInfo : false; }
    get paging() { return this.dataTable ? this.dataTable.settings()[0].oFeatures.bPaginate : false; }
    get responsive() { return this.dataTable ? this.dataTable.responsive : false; }

    set pageLength(val) { 
        if (this.dataTable) {
            this.dataTable.page.len(Number(val)).draw();
        };
    }   
    set searching(val) {
        if (this.dataTable) {
            const searchDiv = this.control.querySelector('.dataTables_filter');
            if (searchDiv) searchDiv.style.display = val ? 'block' : 'none';
        };
    }
    set ordering(val) {
        if (this.dataTable) {
            this.dataTable.settings()[0].oFeatures.bSort = JSON.parse(val);
            this.dataTable.draw();
        };
    }
    set info(val) {
        const infoDiv = this.control.querySelector('.dataTables_info');
        if (infoDiv) { infoDiv.style.display = val ? 'block' : 'none'; };
    }
    set paging(val) {
        if (this.dataTable) {
            this.dataTable.settings()[0].oFeatures.bPaginate = JSON.parse(val);
            this.dataTable.draw();
        };
    }
    set responsive(val) {
        if (this.dataTable && this.dataTable.responsive) {
            val ? this.dataTable.responsive.enable() : this.dataTable.responsive.disable();
        };
    }
    set df(val) {
        if ( val && val['rows'] ) {
            this._df = new dfd.DataFrame( val['rows'], { columns : this.df.columns });
            if( this.dataTable ){ this.dataTable.clear().rows.add(this.df.values).draw(); };
        };
    }
}
