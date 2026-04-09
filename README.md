# 🚀 PowerApps JS (v0)

A lightweight JavaScript UI library that mimics the look and core functionality of Microsoft Power Apps using plain **HTML, CSS, and JavaScript**.

This library is designed for building internal tools quickly with a consistent UI, especially when working with platforms like SharePoint, Power Automate, or custom backends.

---

# ✨ Features

- Power Apps–like UI and controls
- Simple and intuitive API
- Lightweight (no heavy frameworks)
- Easily extensible
- Works with static hosting (GitHub Pages, SharePoint, etc.)
- Compatible with existing JS workflows

---

# 📁 Project Structure

```
/static
    PowerApps.js    # Core library
    PowerApps.css   # Styling
    PowerApps.html  # HTML templates (internal)
index.html  # Demo
/Examples
    Example1.html # Importing Example
README.md
```
---

# 📦 Dependencies

Currently, the library relies on the following external styles and scripts:

https://static2.sharepointonline.com/files/fabric/office-ui-fabric-core/11.0.0/css/fabric.min.css

https://cdn.jsdelivr.net/npm/flatpickr

https://npmcdn.com/flatpickr/dist/themes/material_orange.css # Change theme for date picker as needed

https://cdn.jsdelivr.net/gh/vishnu-rvb/PowerAppsJS/src/PowerApps.css

⚠️ These must be included manually for now

---

# ⚡ Getting Started

### 1. Include required files
```
# html
<link type="text/css" rel="stylesheet" href="https://cdn.jsdelivr.net/gh/vishnu-rvb/PowerAppsJS/src/PowerApps.css">
 or
<script type="module">
    import { PowerApps } from "https://cdn.jsdelivr.net/gh/vishnu-rvb/PowerAppsJS@v0/src/PowerApps.js";
</script>
```
---

### 2. Initialize
```
const PA = new PowerApps();
await PA.init();
```
---

# 🧠 Usage Example
```
const PA = new PowerApps();
await PA.init();

const myHeader=PA.add_control('header','header',{
    title:'PowerApps JS Example',
    reset: resetForm,
    submit: submitForm
});

const myDate=PA.add_control('#myForm','date',{
    label:'Date',
    id:'date'
});

const myDropdown=PA.add_control('#myForm','dropdown',{
    label:'Shift',
    id:'shift',
    options:['A','B','C'],
    required:false
});

const myCombobox=PA.add_control('#myForm','combobox',{
    label:'Line',
    id:'line',
    options:['Milling','Drilling','Lathe','Robo welder']
});

const myNumber=PA.add_control('#myForm','number',{
    label:'Output',
    id:'output',
    min:0
});

const myText=PA.add_control('#myForm','text',{
    label:'Remarks',
    id:'remarks',
    multiline:true
});
```
---

# 🎛 Available Controls (v0)

- header
- date
- dropdown
- combobox
- number
- text

---

# 🧩 API Reference
`instance.init()`
Mandatory before adding any controls
`instance.add_control( selector, templateName, data = } )`

- selector: CSS selector (e.g., #form, #container etc) to which controls to be attached
- templateName: name of control type (e.g date,dropdown,text etc)
- data: Configuration parameters for control like field name, field id , options etc

Returns control instance or array of control instances

# Examples
- Add a dropdown control to form #myForm named Shift and options A,B & C.
```
const myDropdown = PA.add_control( '#myForm', 'dropdown', {
    label : 'Shift',
    id : 'shift',
    options : [ 'A', 'B', 'C' ]
});
```
- Access selected value by id and variable
```
console.log( document.getElementById( 'shift' ).value );
console.log( myDropdown.value );
```
- Setting selected value by id shift and variable
```
document.getElementById( 'shift' ).value = 'A';
myDropdown.value = 'A';
```
- Display control type
```
console.log( myDropdown.control.getAttribute( 'power-app-type' ) );
```
- Change data Configuration Options
```
myDropdown.label = 'my new label';
```
- Change theme color by overriding in css
```
:root {
    --pa-bg : #f65810;
    --pa-label-color : #00126b;
    --pa-label-bg : #fddecf;
    --pa-font-color : white;
}
```
- --pa-bg : Header/Icon fill color
- pa-label-color : Label font color
- --pa-label-bg : Label fill and input border color
- --pa-font-color : input font color
---
### ⚙️ data Configuration Options

#### 🔹 Common Options

| Property | Type | Description |
|--------|------|-------------|
| `label` | `string` | Display label for the field. Not available in header control |
| `id` | `string` | HTML `id` attribute for the input |
| `name` | `string` | HTML `name` attribute for the input |
| `required` | `boolean` | Marks field as required (`true` / `false`) |

#### 🔹 Header Control

| Property | Type | Description |
|--------|------|-------------|
| `title` | `string` | Title text shown in header |
| `submit` | `function` | Callback for submit button |
| `reset` | `function` | Callback for reset/clear button |

#### 🔹 Number Control

| Property | Type | Description |
|--------|------|-------------|
| `min` | `number` | Minimum allowed value |
| `max` | `number` | Maximum allowed value |

#### 🔹 Text Control

| Property | Type | Description |
|--------|------|-------------|
| `multiline` | `boolean` | Enables height expandable input |

#### 🔹 Dropdown & Combobox Controls

| Property | Type | Description |
|--------|------|-------------|
| `options` | `array` | List of selectable values. A default 'None' will be always present for blank values |
| `multiselect` | `boolean` | Enables selection of multiple options |

---
# ⚠️ Control class Methods/Attributes

🔹 **common:**
 - `control` returns the control dom object
 - `hide()` hides the entire control
 - `show()` shows the entire control
 - `on_change` callback for input change
  
🔹 **date:**
 - `picker` returns the _flatpickr instance

🔹 **dropdown/combobox:**
 - `isOpen()` returns true/false if options menu is open/closed
 - `open()` opens the options menu
 - `close()` closes the options menu
 - `toggle()` toggles the option menu
---
# ⚠️ Limitations (v0)

- Dependencies must be included manually
- To manually handle input validation
- To manually handle form processing
---

# 📌 Notes

- Designed primarily for internal tools and dashboards
- Best used with structured backend (Power Automate, APIs, etc.)
- Recommended to use inside a <form> container for structured inputs
---

# 📄 License

Not defined yet

---

# 🙌 Contributing

Currently in early development (v0).
Contributions, ideas and improvements are welcome.

---

# 🔖 Version

v0 (Initial Release)
