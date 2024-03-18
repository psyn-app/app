# Application Framework Overview

## Purpose

The psyn Application Framework is a collection of classes and utilities that provide a foundation for building web applications. It offers functionalities for managing configuration, data sources, event handling, and more. The framework is designed to be flexible and extensible, allowing developers to build applications with ease.

## [App Class](app.class.md)

The `App` class serves as the core of an application framework, providing functionalities for managing configuration, data sources, event handling, and more.

### Key Features:

- **Configuration Management:** Load and manage application configuration from `app.json`.
- **Data Source Management:** Add, remove, and interact with data sources for data loading.
- **Event Handling:** Initialize events and manage event dispatching.
- **Page and Template Loading:** Load pages and templates into HTML elements from URLs.
- **Subscription Mechanism:** Subscribe and unsubscribe HTML elements to and from data sources.

#### [App Events](events.md)

- `application_ready`: Dispatched when the application is fully loaded and ready to be used.
- `data_loaded`: Dispatched when data is successfully loaded from a URL.
- `source_loaded`: Dispatched when data is successfully loaded from a data source.
- `source_{source_name}_loaded`: Dispatched when data is successfully loaded from a specific data source.
- `interval_source_loaded`: Dispatched when data is loaded from a data source at regular intervals.
- `template_loaded`: Dispatched when a template is successfully loaded and processed.


## [Connection Class](connection.class.md)

The `Connection` class represents a connection to a URL for sending and receiving data to and from a server, such as an API. It offers flexibility in setting headers, URL, and HTTP method.

### Key Features:

- **Flexible Configuration:** Easily set URL, method, and headers for the connection.
- **Header Management:** Add or remove headers dynamically.
- **Data Sending:** Send data to the specified URL with customizable HTTP methods.
- **Asynchronous Operations:** Utilizes Promises for asynchronous data transfer.

## [DataSource Class](connection.class.md)

The `DataSource` class extends the `Connection` class and represents a data source for loading data from a URL. It allows for loading data, caching, and managing parameters.

### Key Features:

- **Data Loading:** Load data from a URL with ease.
- **Parameter Management:** Add or remove parameters for data loading.
- **Caching:** Supports caching mechanisms to optimize data retrieval.
- **Asynchronous Loading:** Loads data asynchronously using Promises.
