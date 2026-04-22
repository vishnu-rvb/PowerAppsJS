const coreAssets = [
    { id : 'fabricCSS', type : 'link', attribs : { 
        href : 'https://static2.sharepointonline.com/files/fabric/office-ui-fabric-core/11.0.0/css/fabric.min.css'
    } },
    { id : 'PowerAppsCSS', type : 'link', attribs : { 
        href : new URL('./PowerApps.css', import.meta.url).href
    } }
];
function defaultPath(name){
    return `../controls/${name}Control/${name}Control.js`;
}
const controlMap ={
    text: defaultPath('text'),
    number: defaultPath('number'),
    date: defaultPath('date'),
    dropdown: defaultPath('dropdown'),
    combobox: defaultPath('combobox'),
    header: defaultPath('header'),
    table: defaultPath('table'),
    image: defaultPath('image'),
    label: defaultPath('label'),
    button: defaultPath('button'),
    gallery: defaultPath('gallery')
};

export class PowerApps {
    constructor() {
        this.templates = undefined;
        this.controlMap = controlMap;
    }
    static async _until(condition){
        while(!condition()){
            await new Promise(resolve => requestAnimationFrame(resolve) );
        };
    }
    static async loadAssets(assets){
        const promises = Array.from(assets, i => {
            if( document.querySelector(`#${i['id']}`) ) {
                return Promise.resolve();
            };
            return new Promise( ( resolve, reject ) => {
                const element=document.createElement( i['type'] );
                for( const [ key, value ] of Object.entries( i['attribs'] ) ){
                    element.setAttribute( key, value );
                };
                element.id=i['id'];
                if( i['type']==='link' ) {
                    element.setAttribute( 'rel', 'stylesheet' );
                    element.setAttribute( 'type', 'text/css' );
                    document.head.appendChild(element);
                    resolve(); 
                }
                else if( i['type']==='script' ){
                    element.onerror= ()=>{ 
                        reject(new Error('Failed to load script',i.id));
                    };
                    element.onload = async () => {
                        if(i['export']){
                            await PowerApps._until( () => window[i['export']] !== undefined );
                        };
                        resolve();
                    };
                    document.head.appendChild(element);
                };
            });
        });
        return Promise.all(promises);
    }
    async init() {
        try {
            await PowerApps.loadAssets(coreAssets);
            const response = await fetch(new URL('../templates/PowerApps.html', import.meta.url).href);
            if (response.ok) {
                const html = await response.text();
                this.templates = new DOMParser().parseFromString(html, 'text/html');
                console.log('PowerApps Engine running');
                return this;
            }
            else{ throw new Error('No response for templates'); };
        } 
        catch (error) {
            console.error('Failed to load Power Apps templates', error);
        };
    }
    async add_control(selector, type, data = {}) {
        if (!this.templates){
            throw new Error(`PowerApps Engine not initialized`);
        };
        const path = new URL(this.controlMap[type], import.meta.url).href;
        if(!path){
            throw new Error(`Control type ${type} not found`);
        };
        try{
            const module = await import(path);
            const ControlClass = module[Object.keys(module)[0]];
            if (ControlClass.load) { await ControlClass.load(); };
            const template = this.templates.querySelector('.'+type);
            if (!template) {
                throw new Error(`Template .${type}-control not found`);
            };
            const targets = document.querySelectorAll(selector);
            let controls = [];
            for(const target of targets){
                const control = document.importNode(template.content, true).firstElementChild;
                target.appendChild(control);
                const control_instance = new ControlClass(control, data);
                controls.push(control_instance);
            };
            return controls.length === 1 ? controls[0] : controls;
        }
        catch(error){
            console.error(`Failed to add ${type} control:`, error);
        };
    }
}