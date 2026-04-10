# 🚀 PowerApps JS (v0)

A lightweight JavaScript UI library that mimics the look and core functionality of Microsoft Power Apps using plain **HTML, CSS** and **ES6+ JavaScript**.

This library is designed for building internal tools quickly with a consistent UI, especially when working with platforms like SharePoint, Power Automate, or custom backends.

---

# ✨ Features

- **Component Architecture:** Built with ES6 Classes and inheritance for clean, reusable code.
- **Auto-Bootstrapping:** Automatically loads Office UI Fabric and Flatpickr dependencies—zero setup for the user.
- **Intelligent Factory:** `add_control()` automatically returns specialized class instances (Date, Number, Dropdown, etc.).
- **High Performance:** Optimized DOM manipulation using `DocumentFragment` and caching for large datasets.
- **Cascading Logic:** Built-in support for dependent dropdowns and real-time filtering.
- **Theme Support:** Use default Power Apps branding or override with custom CSS themes.

---

### 📁 Project Structure

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

### 📦 Dependencies

Currently, the library relies on the following external styles and scripts:

https://static2.sharepointonline.com/files/fabric/office-ui-fabric-core/11.0.0/css/fabric.min.css

https://npmcdn.com/flatpickr/dist/themes/material_orange.css

https://cdn.jsdelivr.net/npm/flatpickr

https://cdn.jsdelivr.net/npm/danfojs@1.2.0/lib/bundle.min.js

https://code.jquery.com/jquery-4.0.0.min.js

https://cdn.datatables.net/2.3.7/css/dataTables.dataTables.css

https://cdn.datatables.net/2.3.7/js/dataTables.js

---

# ⚡ Getting Started

### 1. Include required files
```
# html
<link type="text/css" rel="stylesheet" href="https://cdn.jsdelivr.net/gh/vishnu-rvb/PowerAppsJS/src/PowerApps.css">

<script type="module">
    import { PowerApps } from "https://cdn.jsdelivr.net/gh/vishnu-rvb/PowerAppsJS/src/PowerApps.js";
</script>
```

---

### 2. Initialize
```
const PA = new PowerApps();
await PA.init();
```

---

### 🧠 Usage Example
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
document.getElementById( 'shift' ).value;
myDropdown.value;
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
- Change theme color by overriding in css
```
<link type="text/css" rel="stylesheet" href="https://npmcdn.com/flatpickr/dist/themes/dark.css" themeOverride>
<style>
    :root {
        --pa-bg : #f65810;
        --pa-label-color : #00126b;
        --pa-label-bg : #fddecf;
        --pa-font-color : white;
        --pa-table-border: #f65810;
        --pa-table-header: #fddecf;
    }
</style>
```
- **themeOverride :** Mandatory attribute to override date control theme
- **--pa-bg :** Header/Icon fill color
- **--pa-label-color :** Label font color
- **--pa-label-bg :** Label fill and input border color
- **--pa-font-color :** input font color
- **--pa-table-border :** table border color;
- **--pa-table-header:** table header color;

---

# 🧩 API Reference
🔹`PowerApps`
- `init()`
 Injects dependencies and loads templates. 
 Must be awaited.
 Mandatory before adding any controls.

- `add_control( selector, templateName, data = {} )`
Clones a template and returns a Control Class instance.

    - `selector`: CSS selector (e.g., #form, #container etc) to which controls to be attached
    - `templateName`: name of control type (e.g date,dropdown,text etc)
    - `data`: Configuration parameters for control like field name, field id , options etc

🔹`PowerApps_Control`
All controls inherit these properties:
  - `control`: returns the field control dom object
  - `input`: returns the field input dom object
  - `value`: Get or set the field input value
  - `label`: Get or set the field label text
  - `name`: Get or set the field input name attribute
  - `required`: Get or set the field input required attribute and toggle * visibility
  - `hide()`: Hides control
  - `show()`: Shows control
  - `on_change(callback)`: Callback function for input change events.

---

### ⚠️ Control classes

🔹`dateControl`
 - `picker` returns the _flatpickr instance

🔹`textControl`
  - `multiline`: Enables height expandable input
  
🔹`numberControl` 
- `min`: Minimum allowed value
- `max`: Maximum allowed value
 
🔹`headerControl`
  - `title`: Get or set the Title text
  - `submit`: Callback function for submit button
  - `reset`: Callback function for reset button

🔹`dropdownControl` or `comboboxControl`
 - `options`: List of selectable values. A default 'None' will be always present for blank values
 - `multiselect`: Enables selection of multiple options
 - `isOpen()`: Returns true/false if options menu is open/closed
 - `open()`: Opens the options menu
 - `close()`: Closes the options menu
 - `toggle()` Toggles the option menu

🔹`tableControl`
 - `table`: returns the control table dom object
 - `dataTable`: returns the DataTable object
 - `value`: returns table values
 - `id`: Get or set the control table's wrapper id
 - `update(newData)` updated table with newData
 - Optional data parameters during instantiation passed to DataTable constructor
   - `pageLength`: Sets length of pages
   - `searching`: Enables/disables search input box
   - `ordering`: Sets ordering of table
   - `info`: Enables/disables info
   - `responsive`: Enables/disables responsive
   - `paging`: Enables/disables page buttons

---

### 🎛 Available Controls (v0)

- header
- date
- dropdown
- combobox
- number
- text
- table

---

# ⚠️ Limitations (v0)

- To manually handle input validation
- To manually handle form processing
- 
---

# 📌 Notes

- Designed primarily for internal tools and dashboards
- Best used with structured backend (Power Automate, APIs, etc.)
- Recommended to use inside a <form> container for structured inputs
  
---

# 📄 License

This project is licensed under the **MIT License**

---

# 🙌 Contributing

Currently in early development (v0).
Contributions, ideas and improvements are welcome.

---

# 🔖 Version

v0 (Initial Release)