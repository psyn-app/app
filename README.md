# Psyn Component

## Overview
`psynComponent.js`, part of the `psyn.app` framework, offers a streamlined approach for creating and managing web components in web applications. It provides capabilities for custom web component creation, Shadow DOM integration, dynamic template rendering, and automatic custom element definition, all while ensuring robust error handling.

## Requirements
- Modern web browser with ES6 support.
- Compliance with CORS policies for external template loading.

## Installation
```html
<script src="path/to/psynComponent.js"></script>
```

## Usage
Create an instance of `psyn.Component` with the component name, template selector, attributes, and data. Define your HTML templates with support for placeholders and control structures.

### Basic Examples
- **Programmatic Component Definition**:
  ```javascript
  new psyn.Component('greeting', '#greeting-template', null, { message: 'Hello, world!' });
  ```
  ```html
  <template id="greeting-template"><p>{{message}}</p></template>
  <component-greeting></component-greeting>
  ```

- **Conditional Rendering**:
  ```javascript
  new psyn.Component('user-status', '#user-status-template', null, { isLoggedIn: true });
  ```
  ```html
  <template id="user-status-template">
    {{#if isLoggedIn}}<p>Welcome back, user!</p>{{else}}<p>Please log in.</p>{{/if}}
  </template>
  <component-user-status></component-user-status>
  ```

- **Direct HTML Definition**:
  ```html
  <component-my-message selector="#my-message-template"></component-my-message>
  <template id="my-message-template"><p>Hello from a directly defined component!</p></template>
  ```

### Data Binding Examples
- **Simple Binding**:
  ```javascript
  let template = "<p>Hello, {{name}}</p>";
  let data = { name: "Alice" };
  let rendered = new psyn.Component('greeting', null, null, data).parseTemplate(template, data);
  ```

- **Nested Data**:
  ```javascript
  let template = "<p>{{user.name}} lives in {{user.address.city}}</p>";
  let data = { user: { name: "Bob", address: { city: "Springfield" } } };
  let rendered = new psyn.Component('user-details', null, null, data).parseTemplate(template, data);
  ```

- **Looping and Conditionals**:
  ```javascript
  let template = "{{#each items}}<li>{{name}}{{#if isActive}} (Active){{/if}}</li>{{/each}}";
  let data = { items: [{ name: "Item 1", isActive: true }, { name: "Item 2", isActive: false }] };
  let rendered = new psyn.Component('item-list', null, null, data).parseTemplate(template, data);
  ```

## Best Practices
- Unique and descriptive component names.
- Utilize Shadow DOM for encapsulation.
- Test components across different environments.
- Document component usage comprehensively.

## Contributing
Contributions are welcome at our GitHub repository: [psyn-app/app](https://github.com/psyn-app/app).

## License
Apache-2.0 License. See LICENSE in the repository for details.

## Contact
VisionMise at visionmise@psyn.app.

## Acknowledgements
Thanks to all contributors and the open-source community.

*Note: Refer to the official documentation for detailed information and advanced usage.*