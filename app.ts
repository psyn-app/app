/**
 * psyn.app
 * 
 * A simple and fast web application framework
 * 
 * jsr.io/@psyn/app
 * github.com/psyn-app/app
 * 
 * @author VisionMise <visionmise@psyn.app>
 * @license Apache-2.0
 * @version 0.1.0
 */
namespace psyn {

    

    /**
     * Runtime Mode
     * 
     * The runtime mode of the application
     */
    enum RuntimeMode {
        Browser = 'browser',
        Runtime = 'runtime'
    }



    /**
     * Connection
     * 
     * A connection to a URL for sending and receiving data
     * to and from a server such as an API
     */
    class Connection {

        // private properties
        private connectionHeaders:Headers;
        private connectionURL:string;
        private connectionMethod:string;



        /**
         * Constructor
         * 
         * Create a new connection
         * @param url The URL of the connection
         * @param method The method of the connection
         */
        public constructor(url:string, method?:string) {
            this.connectionURL      = url;
            this.connectionMethod   = method ?? 'GET';
            this.connectionHeaders  = new Headers();
        }



        /**
         * URL
         * 
         * Get the URL of the connection
         */
        public get url() : string {
            return this.connectionURL;
        }



        /**
         * URL
         * 
         * Set the URL of the connection
         */
        public set url(url:string) {
            this.connectionURL = url;
        }



        /**
         * Method
         * 
         * Get the method of the connection
         */
        public get method() : string {
            return this.connectionMethod;
        }



        /**
         * Method
         * 
         * Set the method of the connection
         */
        public set method(method:string) {
            this.connectionMethod = method;
        }



        /**
         * Headers
         * 
         * Get the headers of the connection
         */
        public get headers() : Headers {
            return this.connectionHeaders;
        }



        /**
         * Add Header
         * 
         * Add a header to the connection
         * @param key The key of the header
         * @param value The value of the header
         * @returns void
         */
        public addHeader(key:string, value:string) : void {
            this.connectionHeaders.set(key, value);
        }



        /**
         * Remove Header
         * 
         * Remove a header from the connection
         * @param key The key of the header
         * @returns void
         */
        public removeHeader(key:string) : void {
            this.connectionHeaders.delete(key);
        }



        /**
         * Send
         * 
         * Send data to the connection
         * @param data The data to send
         * @param method The method to use for the connection
         * @returns Promise<Response>
         */
        public async send(data:any = {}, method?:string) : Promise<Response> {

            // if method is set, override connection method
            if (method) this.connectionMethod = method;

            // create request
            // if method is GET, append data to URL
            if (this.connectionMethod === 'GET') {
                const url = new URL(this.connectionURL);
                for (let key in data) {
                    url.searchParams.append(key, data[key]);
                }
                this.connectionURL = url.toString();
            } 

            // assemble data
            const payload:any = {
                method: this.connectionMethod,
                headers: this.connectionHeaders  
            };

            // if method is not GET, add body
            if (this.connectionMethod !== 'GET') payload.body = JSON.stringify(data);

            // create request
            const request = new Request(this.connectionURL, payload);

            // send request
            return await fetch(request);
        }



    }



    /**
     * Data Source
     * 
     * A data source for loading data from a URL
     */
    class DataSource extends Connection {

        // private properties
        private sourceName:string;
        private sourceData:any;
        private sourceParameters:any;
        private lastLoaded:Date;
        private cacheing:boolean = true;
        private cacheTime:number = 60000;



        /**
         * Constructor
         * 
         * Create a new data source
         * @param name The name of the data source
         * @param url The URL of the data source
         * @param method The method of the data source
         * @param parameters The parameters of the data source
         */
        public constructor(name:string, url:string, method?:string, parameters?:{}) {
            super(url, method);
            this.sourceName = name;
            this.sourceParameters = parameters ?? {};
        }



        /**
         * Name
         * 
         * Get the name of the data source
         */
        public get name() : string {
            return this.sourceName;
        }



        /**
         * Data
         * 
         * Get the data of the data source
         * @returns any
         */
        public get data() : any {
            return this.sourceData;
        }



        /**
         * Parameters
         * 
         * Get the parameters of the data source
         * @returns any
         */
        public get parameters() : any {
            return this.sourceParameters;
        }



        /**
         * Add Parameter
         * 
         * Add a parameter to the data source
         * @param key The key of the parameter
         * @param value The value of the parameter
         * @returns void
         */
        public addParameter(key:string, value:string) : void {
            this.sourceParameters[key] = value;
        }



        /**
         * Remove Parameter
         * 
         * Remove a parameter from the data source
         * @param key The key of the parameter
         * @returns void
         */
        public removeParameter(key:string) : void {
            delete this.sourceParameters[key];
        }



        /**
         * Loaded Time
         * 
         * Get the time the data was last loaded
         */
        public get loadedTime() : Date {
            return this.lastLoaded;
        }



        /**
         * Cache
         * 
         * Get the cache setting of the data source
         */
        public get cache() : boolean {
            return this.cacheing;
        }



        /**
         * Cache
         * 
         * Set the cache setting of the data source
         */
        public set cache(value:boolean) {
            this.cacheing = value;
        }



        /**
         * Cache Age Seconds
         * 
         * Get the cache age in seconds
         */
        public get cacheAgeSeconds() : number {
            return this.cacheTime / 1000;
        }



        /**
         * Cache Age Seconds
         * 
         * Set the cache age in seconds
         */
        public set cacheAgeSeconds(value:number) {
            this.cacheTime = value * 1000;
        }



        /**
         * Load
         * 
         * Load the data from the data source
         * @returns Promise<any>
         */
        public async get() : Promise<any> {

            // if cache is enabled and data is not stale, return cached data
            if (this.cacheing && this.lastLoaded && (Date.now() - this.lastLoaded.getTime()) < this.cacheTime) return this.sourceData;

            // send request
            const response = await this.send(this.sourceParameters);

            // set last loaded
            this.lastLoaded = new Date();

            // set data
            this.sourceData = await response.json();

            // return data
            return this.sourceData;
        }

        public async post() : Promise<any> {
        }

        public async put() : Promise<any> {
        }

        public async delete() : Promise<any> {
        }





    }


    class Component extends HTMLElement {

        // private properties
        private root:ShadowRoot;
        private componentName:string;
        private componentTemplate:string;
        private componentSource:DataSource|null;
        private componentSelector:string;
        private componentWritable:boolean = false;



        public constructor(name:string, selector:string, attributes?:NamedNodeMap) {
            super();

            // set component name
            this.componentName = name;

            // create shadow root
            this.root = this.attachShadow({mode: 'open'});

            // if attributes are given
            if (attributes) {

                // set attributes
                for (let attribute of attributes) {
                    this.setAttribute(attribute.name, attribute.value);
                }

            }

            // add custom element
            customElements.define(`component-${this.name}`, Component);

            // set selector            
            this.initSelector(selector);
        }



        private async initSelector(selector:string) {

            // if no selector, return
            if (!selector) return;

            // set selector
            this.componentSelector = selector;

            // if selector starts with a '@'
            // its meant to fetch the template from a URL
            if (this.componentSelector.startsWith('@')) {

                // template url
                const url = this.componentSelector.substring(1);

                // fetch template
                const html:string = await this.fetchTemplate(url);

                // if no html, return
                if (!html) {
                    this.template = '';
                    return;
                }

                // set template
                this.template = html;

            // otherwise select the template from the DOM
            } else {

                // select template
                const element:HTMLElement|null = document.querySelector(this.componentSelector);

                // if element is not found, return
                if (!element) {
                    this.template = '';
                    return;
                }

                // set template
                this.template = element.outerHTML;
            }

        }



        private async fetchTemplate(url:string) {
                
            // fetch template
            const response = await fetch(url);

            // return template html
            return await response.text();
        }



        public static get observedAttributes() : string[] {
            return ['src', 'writable', 'selector'];
        }



        public get name() : string {
            return this.componentName;
        }



        public get template() : string {
            return this.componentTemplate;
        }



        public set template(value:string) {
            this.componentTemplate = value;
        }



        public get html() : string {
            return this.root.innerHTML;
        }



        public get source() : DataSource|null {
            return this.componentSource ?? null;
        }



        public set source(value:DataSource) {
            this.componentSource = value;
        }



        public get selector() : string {
            return this.componentSelector;
        }



        public set selector(value:string) {

            // if no value, return
            if (!value) return;

            // if the same value, return
            if (this.componentSelector === value) return;

            // initialize selector
            this.initSelector(value);
        }



        public get writable() : boolean {
            return this.componentWritable;
        }



        public set writable(value:boolean) {
            this.componentWritable = value;
        }        



        protected connectedCallback() {
            // render
            this.render();
        }



        protected attributeChangedCallback(name:string, oldValue:string, newValue:string) {

            switch (name) {

                case 'src':
                    this.updateDataSourceURL(newValue);
                    break;

                case 'writable':
                    this.writable = newValue === 'true';
                    break;

                case 'selector':
                    this.selector = newValue;
                    break;

            }

        }



        protected adoptedCallback() {
        }



        protected render() {
            // parse template
            // set innerHTML of shadow root
            this.root.innerHTML = this.parseTemplate();
        }



        private updateDataSourceURL(url:string) {

            // if no source, return
            if (this.source == null) {
                this.componentSource = new DataSource(`${this.tagName}-data`, url);
                if (this.source == null) return;
            }

            // if the URL is the same, return
            if (this.source.url === url) return;

            // update source URL
            this.source.url = url;
        }



        /**
         * Parse Template
         * 
         * Parse a template with data
         * @returns string
         */
        private parseTemplate() : string {

            // Define a regular expression pattern to match placeholders like {{key}}
            const placeholderRegex = /\{\{([^}]+)\}\}/g;

            // Match the "each" block for iteration
            const eachRegex = /\{\{#each\s([^}]+)\}\}([\s\S]*?)\{\{\/each\}\}/g;

            // Replace placeholders and handle each blocks recursively
            const parsedHTML = this.template.replace(eachRegex, (match, key, innerHTML) => {

                // if no source, return an empty string
                if (!this.source) return '';

                // Get the array to iterate over
                const dataArray = this.source.data[key.trim()];

                // If data is not an array, return an empty string
                if (!Array.isArray(dataArray)) return '';

                // Parse innerHTML for each element in the array
                const parsedData = dataArray.map(item => {
                    // Replace placeholders within each object
                    return innerHTML.replace(placeholderRegex, (match: any, prop: string) => {
                        const value = item[prop.trim()];
                        // If the value is not found, return the original match
                        return value !== undefined ? value : match;
                    });
                });

                // Join the parsed innerHTML elements for each data item
                return parsedData.join('');
            });

            // Replace any remaining placeholders outside of each blocks
            const finalHTML = parsedHTML.replace(placeholderRegex, (match, key) => {

                // If no source, return the original match
                if (!this.source) return match;

                // Get the value corresponding to the key from the data object
                const value = this.source.data[key.trim()];

                // If the value is not found, return the original match
                return value !== undefined ? value : match;
            });

            return finalHTML;
        }



    }



    /**
     * Psyn Application
     * 
     * A simple, fast, and secure web application framework
     */
    export class App {

        // private properties
        private environment:RuntimeMode;
        private eventApplicationReady:CustomEvent;
        private config:any                                      = null;
        private loadedData:{[key:string]:any}                   = {};
        private isReady:boolean                                 = false;

        // data sources
        private dataSources:{[key:string]:DataSource}           = {};
        private dataSourceIntervalTimers:{[key:string]:number}  = {};

        // libraries
        private loadedLibraries:{[key:string]:any}              = {};

        // public properties
        public Events:EventTarget;



        /**
         * Constructor
         * 
         * Create a new application
         * @emits application_ready
         */
        public constructor() {

            // log
            console.log("psyn Application Framework");

            // create event target
            this.Events = new EventTarget();

            // instanciate
            this.instanciate();
        }



        /**
         * Instanciate
         * 
         * Instanciate the application
         * @returns Promise<void>
         */
        private async instanciate() : Promise<void> {
            
            // load configuration
            this.config = await this.applicationConfiguration();

            // set environment
            this.environment = this.detectEnvironment();

            // initialize events
            this.initializeEvents();

            // if browser runtime mode
            // attach to window
            if (this.environment === RuntimeMode.Browser) window['app'] = this;

            // dispatch application ready event
            this.Events.dispatchEvent(this.eventApplicationReady);
        }



        /**
         * Application Configuration
         * 
         * Get the application configuration from app.json
         */
        public get configuration() : any {
            return this.config;
        }



        /**
         * Sources
         * 
         * Get the data sources for the application
         */
        public get sources() : {[key:string]:DataSource} {
            return this.dataSources;
        }



        /**
         * Ready
         * 
         * Check if the application is ready
         */
        public get ready() : boolean {
            return this.isReady;
        }



        /**
         * Libraries
         * 
         * Get the loaded libraries for the application
         */
        public get libraries() : {[key:string]:any} {
            return this.loadedLibraries;
        }



        /**
         * Load Library
         * 
         * Load a library into the application
         * @param url The URL of the library
         * @param name The name of the library
         * @returns Promise<any>
         */
        public async loadLibrary(url:string, name:string) : Promise<any> {

            try {

                // if library is already loaded, return it
                if (this.loadedLibraries[name]) return this.loadedLibraries[name];

                // load library
                const lib:any = await import(url);

                // add to loaded libraries
                this.loadedLibraries[name] = lib;

                // return library
                return lib;

            } catch (error) {

                // log error
                console.warn(`Failed to load library: ${name}`);

                // return null
                return null;
            }

        }



        /**
         * Library
         * 
         * Get a library from the application
         * @param name The name of the library
         * @returns any
         */
        public library(name:string) : any {
            return this.loadedLibraries[name] ?? null;
        }



        /**
         * Initialize Events
         * 
         * Initialize the events for the application
         * @returns void
         */
        private initializeEvents() : void {

            // application ready event
            this.eventApplicationReady = new CustomEvent('application_ready', {detail: this});
        }



        /**
         * Add Data Source
         * 
         * Add a data source to the application
         * @param source The data source to add
         * @returns void
         */
        public addDataSource(source:DataSource) : void {
            this.dataSources[source.name] = source;
        }



        /**
         * Get Data Source
         * 
         * Get a data source from the application
         * @param name The name of the data source
         * @returns DataSource
         */
        public getDataSource(name:string) : DataSource {
            return this.dataSources[name] ?? null;
        }



        /**
         * Remove Data Source
         * 
         * Remove a data source from the application
         * @param name The name of the data source
         * @returns void
         */
        public removeDataSource(name:string) : void {
            delete this.dataSources[name];
        }



        /**
         * Page
         * 
         * Load a page into an HTML element from a URL
         * @param url The URL of the page
         * @param element The HTML element to load the page into
         * @param appendElementHTML Append the page to the element's HTML if set to true
         * @returns Promise<void>
         */
        public async page(url:string, element:HTMLElement, appendElementHTML:boolean = false) : Promise<void> {

            // get page html
            const html = await this.html(url);

            // append to element
            if (appendElementHTML) {
                element.innerHTML += html;
            } else {
                element.innerHTML = html;
            }            
        }



        /**
         * Data From URL
         * 
         * Load data from a URL
         * @param name The name of the data
         * @param url The URL of the data
         * @param forceReload Force the data to reload if set to true
         * @emits data_loaded
         * @returns Promise<any>
         */
        public async dataFromURL(name:string, url:string, forceReload:boolean = false) : Promise<any> {

            // if data is already loaded and not forced to reload, return it
            if (this.loadedData[name] && !forceReload) return this.loadedData[name];

            // get data
            const data = await this.json(url);

            // if no data, return null
            if (!data) return null;

            // raise event
            this.Events.dispatchEvent(new CustomEvent('data_loaded', {detail: {name: name, data: data}}));

            // add to loaded data
            this.loadedData[name] = data;
        }



        /**
         * Data From Source
         * 
         * Load data from a data source
         * @param sourceName The name of the data source
         * @emits source_loaded
         * @returns Promise<any>
         */
        public async dataFromSource(sourceName:string) : Promise<any> {

            // get source
            const source = this.dataSources[sourceName] ?? null;

            // if source is not found, return null
            if (!source) return null;

            // load source
            const data = await source.get();

            // raise event
            this.Events.dispatchEvent(new CustomEvent('source_loaded', {detail: source}));

            // return data
            return data;
        }



        /**
         * Source On Interval
         * 
         * Load a data source on an interval
         * @param sourceName The name of the data source
         * @param interval The interval in milliseconds
         * @emits interval_source_loaded
         * @emits source_{sourceName}_loaded
         * @returns void
         */
        public sourceOnInterval(sourceName:string, interval:number) : number {
                
            // get source
            const source = this.dataSources[sourceName] ?? null;

            // if source is not found, return null
            if (!source) return -1;

            // set interval
            const timer:number = setInterval(async () => {

                // load source
                await source.get();

                // raise events
                this.Events.dispatchEvent(new CustomEvent('interval_source_loaded', {detail: source}));
                this.Events.dispatchEvent(new CustomEvent(`source_${sourceName}_loaded`, {detail: source}));

            }, interval);

            // add to timers
            this.dataSourceIntervalTimers[sourceName] = timer;

            // return timer
            return timer;
        }



        /**
         * Clear Source On Interval
         * 
         * Clear the interval for a data source
         * @param sourceName The name of the data source
         * @returns void
         */
        public clearSourceOnInterval(sourceName:string) : void {

            // get timer
            const timer = this.dataSourceIntervalTimers[sourceName] ?? null;

            // if timer is found, clear it
            if (timer) clearInterval(timer);
        }



        /**
         * Application Configuration
         * 
         * Get the application configuration from app.json
         * @param url The URL of the app.json file
         * @returns Promise<any>
         */
        private async json(url:string) : Promise<any> {

            // fetch json
            const response = await fetch(url);

            // return json
            return await response.json();
        }



        /**
         * HTML
         * 
         * Get the HTML of a page from a URL
         * @param url The URL of the page
         * @returns Promise<string>
         */
        public async html(url:string) : Promise<string> {

            // fetch html
            const response = await fetch(url);

            // return html
            return await response.text();
        }



        /**
         * Application Configuration
         * 
         * Get the application configuration from app.json
         * @returns Promise<any>
         */
        private async applicationConfiguration() : Promise<any> {

            try {

                // get configuration
                const config:any = await this.json('app.json');

                // log
                console.log("Application Configuration Loaded");

                // return configuration
                return config;

            } catch (error) {

                // log error
                console.warn("No Application Configuration Found!");

                // return empty object
                return {};

            }

        }



        /**
         * Detect Environment
         * 
         * Detect the runtime environment
         * @returns RuntimeMode
         */
        private detectEnvironment() : RuntimeMode {

            const errorMsg:string = "Runtime Mode is not supported. psyn.app is a web application framework and requires a browser environment.";

            try {

                // is not browser
                if (window?.navigator ?? false) throw new Error(errorMsg);

            } catch (error) {

                //warn
                console.warn(errorMsg);
                return RuntimeMode.Runtime;
            }

            // default to browser
            return RuntimeMode.Browser;
        }



    }



}