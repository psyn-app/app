# Events in the psyn Application Framework

### 1. `application_ready`
   - **Description:** This event is dispatched when the application is fully loaded and ready to be used.
   - **Trigger:** Dispatched after the application configuration is loaded and the environment is detected.
   - **Usage:** Indicates that the application is ready to start processing user requests or interactions.

### 2. `data_loaded`
   - **Description:** This event is dispatched when data is successfully loaded from a URL.
   - **Trigger:** Dispatched after data is fetched from a URL using the `dataFromURL` method.
   - **Usage:** Allows components or modules to respond to the availability of specific data for further processing or display.

### 3. `source_loaded`
   - **Description:** This event is dispatched when data is successfully loaded from a data source.
   - **Trigger:** Dispatched after data is fetched from a data source using the `dataFromSource` method.
   - **Usage:** Enables components or modules to react to the availability of data from registered data sources.

### 4. `source_{source_name}_loaded`
   - **Description:** This event is dispatched when data is successfully loaded from a specific data source.
   - **Trigger:** Dispatched after data is fetched from a data source using the `dataFromSource` method, where `source_name` is the name of the data source.
   - **Usage:** Allows components or modules to respond to the availability of data from a specific data source.

### 5. `interval_source_loaded`
   - **Description:** This event is dispatched when data is loaded from a data source at regular intervals.
   - **Trigger:** Dispatched at the specified interval defined by the `sourceOnInterval` method.
   - **Usage:** Provides a mechanism for components or modules to handle updates from data sources that are periodically refreshed.

### 6. `template_loaded`
   - **Description:** This event is dispatched when a template is successfully loaded and processed.
   - **Trigger:** Dispatched after a template is loaded using the `template` method, with data replacement completed.
   - **Usage:** Allows components or modules to respond to the availability of a template for rendering or display.