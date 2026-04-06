export class PowerApps{
    constructor(){
        this.templates=null;
    }

    async init(){
        try{
            const response=await fetch(new URL('./PowerApps.html', import.meta.url).href);
            if(response.ok){
                const html=await response.text();
                const parser=new DOMParser();
                this.templates=parser.parseFromString(html,'text/html');
                return this;
            }
        }
        catch(error){
            console.error('Failed to load Power Apps');
        };
    }

    _set_params(element,controlType,data){
        if(data['required']===false){
            element.querySelector('.power-app-field-required').innerHTML='';
            element.querySelector('input').required=false;
        }
        else if(data['required']===true){
            element.querySelector('.power-app-field-required').text='*';
            element.querySelector('input').required=true;
        };
        if(controlType=='header'){
            if('title' in data){element.querySelector('h1').innerHTML=data['title'];}
            if('reset' in data){element.querySelector('#btn-clear').addEventListener('click', data['reset']);}
            if('submit' in data){element.querySelector('#btn-submit').addEventListener('click', data['submit']);}
        }
        else{
            if('label' in data){
                element.querySelector('.power-app-field-label').innerHTML=data['label'];
                if(controlType==='combobox'){
                    element.querySelector('.power-app-field-input input').placeholder='Enter '+data['label'];
                };
            };
            if('id' in data){element.querySelector('.power-app-field-input input').id=data['id'];};
            if(controlType==='number'){                    
                if('min' in data){element.querySelector('.power-app-field-input input').min=String(data['min']);}
                if('max' in data){element.querySelector('.power-app-field-input input').max=String(data['max']);}
            }
            else if(controlType==='combobox' || controlType==='dropdown'){
                if('options' in data){
                    for(const i of data['options']){
                        const option=document.createElement('option');
                        option.value=i;
                        option.innerHTML=i;
                        element.querySelector('.power-app-field-input .list').appendChild(option);
                    };
                };
            };
        };
    }

    _bind_control(element,controlType){

        if(controlType==='date'){
            flatpickr(element.querySelector('input[type="date"]'),{
                dateFormat: "Y-m-d",
                altInput: true,
                altFormat:'d-m-Y'
            });
        }
        else if(controlType==='dropdown' || controlType==='combobox'){
            const input=element.querySelector('input');
            const select=element.querySelector('.list');
            //on click input open dropdown
            input.addEventListener('click',()=>{
                select.style.display='block';
            });
            //on select switch value and close dropdown
            for(const i of select.querySelectorAll('option')){
                i.addEventListener('click',()=>{
                    input.value=i.value;
                    select.style.display= 'none';
                });
            };
            //off click input close dropdown
            document.addEventListener('click',(event)=>{
                if(! element.contains(event.target)){select.style.display='none'};
            });
            if(controlType==='combobox'){
                //on input filter options
                input.addEventListener('input',()=>{
                    for(const i of select.querySelectorAll('option')){
                        i.style.display= i.value.toLowerCase().includes(input.value.toLowerCase()) ? 'block':'none';
                    };
                });
            };
        };
    }

    add_control(selector,templateName,data={}){
        if (!this.templates) return console.error('Failed to load Power Apps');

        const template=this.templates.querySelector('.' + templateName+'-control');
        if (!template) return console.error(`${templateName} not found`);
        
        let control=document.importNode(template.content, true).firstElementChild;
        this._set_params(control,templateName,data);
        this._bind_control(control,templateName);

        for(const i of document.querySelectorAll(selector)){i.appendChild(control);};
    }
}