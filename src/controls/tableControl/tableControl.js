import { PowerApps_Control } from '../../core/PowerApps_Control.js';

const assets = [
    [
        { id : 'danfoJS', type : 'script', export : 'dfd', attribs : {
        src : 'https://cdn.jsdelivr.net/npm/danfojs@1.2.0/lib/bundle.min.js'
        } },
        { id : 'jqueryJS', type : 'script', export : 'jQuery', attribs : {
            integrity : 'sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=',
            crossorigin : 'anonymous',
            src : 'https://code.jquery.com/jquery-3.7.1.min.js'
        } }
    ],
    [
        { id:'datatablesCSS', type : 'link', attribs : {
        href : 'https://cdn.datatables.net/2.3.7/css/dataTables.dataTables.css'
        } },
        { id:'datatablesJS', type : 'script', export : 'DataTable', attribs : {
            src : 'https://cdn.datatables.net/2.3.7/js/dataTables.js'
        } },
        { id: 'tableControlCSS', type: 'link', attribs: {
            href: new URL('./tableControl.css', import.meta.url).href
        } }
    ]
];

export class tableControl extends PowerApps_Control{
    static type = 'table'
    static assets = assets;
    constructor(data){
        super({});
        this.labelHTML = this.control.querySelector('.power-app-control-label');
        this.table = this.control.querySelector('table');
        this.on_select=undefined;
        if(data){this._init(data);};
    }
    _init(data){
        super._init(data);
        if(data['id']){ this.id = data['id']; };
        if(data['on_select']){ this.on_select = data['on_select']; };
        if (data['rows']  && data['columns'] ){    
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
            this.table.querySelector('tbody')?.addEventListener('click', (event)=>{
                const row = event.target.closest('tr');
                if(row){
                    const itemValues = this.dataTable.row(row).data();
                    const item = Object.fromEntries(
                        this._df.columns.map( (key,index)=>[ key,itemValues[index] ])
                    );
                    this._selectCallback(event,item)
                };
            });
        };
    }
    get label(){
        return this.labelHTML?.innerHTML;
    }
    get value(){
        return this.df?.values;
    }
    get id(){
        return this.control.querySelector('.power-app-control-table')?.id;
    }
    get df(){
        return this._df;
    }
    get pageLength(){ 
        return this.dataTable?.page.len();
    }
    get searching(){
        return this.dataTable?.settings()[0].oFeatures.bFilter;
    }
    get ordering(){
        return this.dataTable?.settings()[0].oFeatures.bSort;
    }
    get info(){
        return this.dataTable?.settings()[0].oFeatures.bInfo;
    }
    get paging(){
        return this.dataTable?.settings()[0].oFeatures.bPaginate;
    }
    get responsive(){
        return this.dataTable?.responsive;
    }
    set label(val){
        if(this.labelHTML){
            this.labelHTML.innerHTML = String(val);
        };
    }
    set id(val){
        if(this.control.querySelector('.power-app-control-table')){
            this.control.querySelector('.power-app-control-table').id=String(val);
        };
    }
    set pageLength(val) { 
        this.dataTable?.page.len(Number(val)).draw();
    }   
    set searching(val) {
        if (this.dataTable) {
            const searchDiv = this.control.querySelector('.dataTables_filter');
            if (searchDiv){
                searchDiv.style.display = JSON.parse(val) ? 'block' : 'none';
            };
        };
    }
    set ordering(val) {
        if(this.dataTable){
            this.dataTable.settings()[0].oFeatures.bSort = JSON.parse(val);
            this.dataTable.draw();
        };
    }
    set info(val){
        const infoDiv = this.control.querySelector('.dataTables_info');
        if (infoDiv){
            infoDiv.style.display = JSON.parse(val) ? 'block' : 'none';
        };
    }
    set paging(val) {
        if(this.dataTable){
            this.dataTable.settings()[0].oFeatures.bPaginate = JSON.parse(val);
            this.dataTable.draw();
        };
    }
    set responsive(val) {
        if (this.dataTable && this.dataTable.responsive){
            val ? this.dataTable.responsive.enable() : this.dataTable.responsive.disable();
        };
    }
    set df(val) {
        if ( val && val['rows'] ) {
            this._df = new dfd.DataFrame( val['rows'], { columns : this.df.columns });
            this.dataTable?.clear().rows.add(this.df.values).draw();
        };
    }
    _selectCallback(event,item){
        if (typeof(this.on_select) === 'function') { this.on_select(event,item); };
    }
    clear() {
        this.dataTable?.clear().draw();
        this._df = new dfd.DataFrame([], { columns: this._df.columns });
    }
}