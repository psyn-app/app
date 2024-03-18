# psyn.app
Lightweight TypeScript Web Application Framework

### Features
- Lightweight: The `app` framework is designed to be lightweight, allowing for fast and efficient development.
- TypeScript: The framework is written in TypeScript, providing type safety and enhanced developer experience.
- Modular: The `app` framework follows a modular architecture, making it easy to add and remove features as needed.


## To Get Started
### Build the JavaScript

For use on the web, the `app` framework is built using the `tsc` command.

Compile with TypeScript
```bash
tsc app.ts --target 'es2022' --module 'es2022' --outDir 'dist'
```

Where `app.ts` is the main file and `dist` is the output directory.

---

### Build psyn.app

Using whatever `--outDir` you used in the previous step, add an `index.html` file and a `web.js` script. The `web.js` script will use the `app` framework to subscribe to a data source and render the data in a table. `app.js` should already be in the `dist` directory from the previous step. When you're done, the `dist` directory should look like this:

```
./dist/
  index.html  
  web.js
  app.js
```

Include the `app` framework in the `index.html` file and then use the `web.js` script to subscribe to a data source and render the data in a table.

### Example `index.html` File

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="app.js"></script>
    <script src="web.js"></script>
  </head>
  <body>
    <div id="tableContainer"></div>
  </body>
</html>
```

---

### Example #1 - Subscribe an Element to a Data Source

Subscribe an element to a data source and render the data in a table. The data source is an API that returns a JSON object with a `record_data` array. The `record_data` array contains objects with `column1`, `column2`, and `column3` properties.

Every 60 seconds, the data source will be polled for new data. The data will be rendered in the table automatically.

```javascript

// create a new application object
const app = new psyn.App();

// hook up an external data source
const dataSource = new psyn.DataSource('Example', 'http://localhost:3000/data', 'POST', {"someparameter": "somevalue"});

// add a header to the data source
dataSource.addHeader('Authorization', 'Bearer 1234567890');

// get table element from the DOM
const tableContainer = document.getElementById('tableContainer');

// get table template html
const template = await psyn.html('table.html');

// subscribe to the data source
app.subscribeElementToSource(tableContainer, template, dataSource);
```

Using the above example, the data retrieved from the API looks like the following:
```json
{
    record_data: [
        { column1: "Value1-1", column2: "Value1-2", column3: "Value1-3" },
        { column1: "Value2-1", column2: "Value2-2", column3: "Value2-3" },
        { column1: "Value3-1", column2: "Value3-2", column3: "Value3-3" }
    ]
}
```

The `table.html` file should look like the following:
```html
<table>
  <thead>
    <tr>
      <th>Column 1</th>
      <th>Column 2</th>
      <th>Column 3</th>
    </tr>
  </thead>
  <tbody>
    {{#each record_data}}
    <tr>
      <td>{{this.column1}}</td>
      <td>{{this.column2}}</td>
      <td>{{this.column3}}</td>
    </tr>
    {{/each}}
  </tbody>
</table>
```

## License
The `app` framework is licensed under the [Apache-2.0 License](https://opensource.org/licenses/Apache-2.0).