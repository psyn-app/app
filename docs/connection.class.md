### Class: Connection

A connection to a URL for sending and receiving data to and from a server such as an API.

#### Constructor

```typescript
public constructor(url: string, method?: string)
```

Creates a new connection with the specified URL and method.

#### Properties

- `url`: `string` - Retrieves or sets the URL of the connection.
- `method`: `string` - Retrieves or sets the method of the connection.
- `headers`: [Headers](https://developer.mozilla.org/en-US/docs/Web/API/Headers) - Retrieves the headers of the connection.

#### Methods

- `addHeader(key: string, value: string): void`

    Adds a header to the connection.

- `removeHeader(key: string): void`

    Removes a header from the connection.

- `send(data: any = {}, method?: string): Promise<Response>`

    Sends data to the connection using the specified method.

### Class: DataSource

A data source for loading data from a URL.

#### Constructor

```typescript
public constructor(name: string, url: string, method?: string, parameters?: {})
```

Creates a new data source with the specified name, URL, method, and parameters.

#### Properties

- `name`: `string` - Retrieves the name of the data source.
- `data`: `any` - Retrieves the data of the data source.
- `parameters`: `any` - Retrieves the parameters of the data source.
- `loadedTime`: `Date` - Retrieves the time the data was last loaded.
- `cache`: `boolean` - Retrieves or sets the cache setting of the data source.
- `cacheAgeSeconds`: `number` - Retrieves or sets the cache age in seconds of the data source.

#### Methods

- `addParameter(key: string, value: string): void`

    Adds a parameter to the data source.

- `removeParameter(key: string): void`

    Removes a parameter from the data source.

- `load(): Promise<any>`

    Loads the data from the data source.

Both classes have inherited methods from the `Connection` class.