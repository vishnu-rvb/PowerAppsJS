const coreAssets = [
    { id : 'fabricCSS', type : 'link', attribs : { 
        href : 'https://static2.sharepointonline.com/files/fabric/office-ui-fabric-core/11.0.0/css/fabric.min.css'
    } },
    { id : 'PowerAppsCSS', type : 'link', attribs : { 
        href : new URL('./PowerApps.css', import.meta.url).href
    } }
];
function defaultPath(type,file='js'){
    switch(type){
        case 'imageModal': return defaultPath('image',file);
        default: return `../controls/${type}Control/${type}Control.${file}`;
    };
    
}
const controlList = [
    'text','number','date',
    'dropdown','combobox','header',
    'table','image','imageModal','label','button',
    'container','gallery'
];

export class PowerApps {
    static controlMap = Object.fromEntries(
                controlList.map(i=>[i,
                    {
                        js:defaultPath(i,'js'),
                        css:defaultPath(i,'css'),
                        html:defaultPath(i,'html')
                    }]
                ));
    static async _until(condition){
        while(!condition()){
            await new Promise(resolve => requestAnimationFrame(resolve) );
        };
    }
    static async loadAssets(assets){
        const stages = Array.isArray(assets[0])? assets : [assets];
        for(const stage of stages){
            const promises = Array.from(stage,i=>{
                if( document.querySelector(`#${i['id']}`) ){
                    return Promise.resolve();
                };
                return new Promise( (resolve, reject)=>{
                    const element=document.createElement(i['type']);
                    element.id=i['id'];
                    for( const [ key, value ] of Object.entries(i['attribs']) ){
                        element.setAttribute( key, value );
                    };
                    if( i['type']==='link' ){
                        element.setAttribute( 'rel', 'stylesheet');
                        element.setAttribute( 'type', 'text/css');
                        document.head.appendChild(element);
                        resolve();
                    }
                    else if( i['type']==='script' ){
                        element.onload = async () => {
                            if(i['export']){
                                await PowerApps._until( () => window[i['export']] !== undefined );
                            };
                            resolve();
                        };
                        element.onerror= ()=>{ 
                            reject(new Error('Failed to load script',i.id));
                        };
                        document.head.appendChild(element);
                    };
                });
            });
            await Promise.all(promises);
        };
    }

    async init() {
        try { await PowerApps.loadAssets(coreAssets); }
        catch(error) { console.error('Unable to load assets', error); };
    }
    static async _importTemplate(type){
        try{
            const path = new URL(defaultPath(type,'html'), import.meta.url).href;
            const response = await fetch(path);
            if(response.ok){
                const html = await response.text();
                const template = new DOMParser().parseFromString(html, 'text/html').querySelector('.'+String(type));
                if(!template){ throw new Error(`Unable to select .${type}-control`); };
                return template;
            }
            else{ throw new Error(`Unable to fetch ${type} template`); };
        }
        catch(error){ throw new Error(`Failed to import template ${error}`); };
    }
    static async _importControl(type){
        const entry = PowerApps.controlMap[type];
        if(!entry){ throw new Error(`Type ${type} not found`); };
        const path = new URL(entry['js'], import.meta.url).href; 
        try{
            const module = await import(path);
            const moduleClass = module[ type?.concat('Control') || Object.keys(module)[0] ];
            if(moduleClass.load){ await moduleClass.load(); };
            return moduleClass;
        }
        catch(error){ throw new Error(`Failed to load module at ${path}:${error}`); };        
    }
    static async add_control(selector, type, data = {}) {
        try{
            const ControlClass = await PowerApps._importControl(type);
            let targets;
            if(typeof(selector) === 'string'){
                targets = document.querySelectorAll(selector);
            }
            else if(selector instanceof(NodeList) || Array.isArray(selector)){
                targets = selector;
            }
            else if(selector instanceof(HTMLElement)){
                targets = [selector];
            } 
            else{
                throw new Error("Invalid selector type");
            };

            let controls = [];
            for(const target of targets){
                const control_instance = new ControlClass(data);
                controls.push(control_instance);
                target.appendChild(control_instance.control);
            };
            return controls.length === 1 ? controls[0] : controls;
        }
        catch(error){ console.error(`Failed to add ${type} control:`, error); };
    }
    add_control(selector,type,data={}){
        return this.constructor.add_control(selector,type,data);
    }
    static async openModal(type){
        const modalClass = await this._importControl(type);
        const modal = new modalClass();
        document.body.appendChild(modal.control);
        try{ return await modal.open(); }
        finally{ modal.control.remove(); };
    }
}