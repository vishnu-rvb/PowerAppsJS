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

/static
   PowerApps.js      # Core library
   PowerApps.css     # Styling
   PowerApps.html    # HTML templates (internal)

index.html           # (optional test file)
README.md

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

<link rel="stylesheet" href="static/PowerApps.css">
<script src="static/PowerApps.js"></script>

---

### 2. Initialize

const PA = new PowerApps();
await PA.init();

---

# 🧠 Usage Example

const PA = new PowerApps();
await PA.init();

PA.add_control('header','header',{
    'title':'GSS Inhouse Daily Issues',
    'reset': resetForm,
    'submit': submitForm
});

PA.add_control('#myForm','date',{
    'label':'Date',
    'id':'date'
});

PA.add_control('#myForm','dropdown',{
    'label':'Shift',
    'id':'shift',
    'options':['A','B','C']
});

PA.add_control('#myForm','combobox',{
    'label':'Line',
    'id':'line',
    'options':['Milling','Drilling','Lathe','Robo welder']
});

PA.add_control('#myForm','combobox',{
    'label':'Operator',
    'id':'operator',
    required:false
});

PA.add_control('#myForm','number',{
    'label':'Output',
    'id':'output',
    'min':0
});

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

const PA = new PowerApps()

await PA.init()

PA.add_control(parent, type, options)

- parent: CSS selector (e.g., #form, #container)
- type: control type
- options: configuration object

Example:

PA.add_control('#myForm','dropdown',{
    'label':'Shift',
    'id':'shift',
    'options':['A','B','C']
});

console.log(document.getElementById('shift').value)
---

# ⚠️ Limitations (v0)

- Dependencies must be included manually
- No built-in state management
- No validation engine (basic only)
- No data binding (manual handling required)
- No packaging/CDN support yet

---

# 📌 Notes

- Designed primarily for internal tools and dashboards
- Best used with structured backend (Power Automate, APIs, etc.)
- Recommended to use inside a <form> container for structured inputs
- Can be extended easily by modifying PowerApps.js

---

# 📄 License

Not defined yet

---

# 🙌 Contributing

Currently in early development (v0). Contributions, ideas, and improvements are welcome.

---

# 🔖 Version

v0 (Initial Release)
