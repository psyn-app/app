### Class: App

This class represents an application framework.

#### Constructor

```typescript
public constructor()
```

Creates a new instance of the `App` class.

#### Properties

- `Events`: [EventTarget](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget) - The event target for the application.

#### Getters

- `configuration`: `any` - Retrieves the application configuration.
- `sources`: `{[key:string]:DataSource}` - Retrieves the data sources for the application.
- `ready`: `boolean` - Checks if the application is ready.

#### Methods

- `initializeEvents(): void`

    Initializes the events for the application.

- `addDataSource(source: DataSource): void`

    Adds a data source to the application.

- `getDataSource(name: string): DataSource`

    Retrieves a data source from the application by its name.

- `removeDataSource(name: string): void`

    Removes a data source from the application by its name.

- `page(url: string, element: HTMLElement, appendElementHTML: boolean = false): Promise<void>`

    Loads a page into an HTML element from a URL.

- `dataFromURL(name: string, url: string, forceReload: boolean = false): Promise<any>`

    Loads data from a URL.

- `dataFromSource(sourceName: string): Promise<any>`

    Loads data from a data source.

- `sourceOnInterval(sourceName: string, interval: number): number`

    Loads a data source on an interval.

- `clearSourceOnInterval(sourceName: string): void`

    Clears the interval for a data source.

- `parseTemplate(html: string, data: any[] = []): string`

    Parses a template with data.

- `validInputStructure(input: any): boolean`

    Validates the input structure.

- `template(url: string, data: any[], element: HTMLElement, appendElementHTML: boolean = false): Promise<void>`

    Loads a template into an HTML element from a URL.

- `subscribeElementToSource(element: HTMLElement, htmlTemplate: string, dataSource: DataSource, refreshSeconds?: number): void`

    Subscribes an HTML element to a data source.

- `unsubscribeElementFromSource(element: HTMLElement, dataSource: DataSource): void`

    Unsubscribes an HTML element from a data source.

- `json(url: string): Promise<any>`

    Fetches JSON data from a URL.

- `html(url: string): Promise<string>`

    Fetches HTML content from a URL.

- `applicationConfiguration(): Promise<any>`

    Retrieves the application configuration from `app.json`.

- `detectEnvironment(): RuntimeMode`

    Detects the runtime environment.

```typescript
enum RuntimeMode {
    Runtime = 'runtime',
    Browser = 'browser'
}
```

Defines the possible runtime modes: `'runtime'` and `'browser'`.