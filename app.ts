/**
 * psyn.app
 * 
 * A simple, fast, and secure web application framework.
 * 
 * jsr.io/@psyn/app
 * github.com/psyn-app/app
 * 
 * @author VisionMise <visionmise@psyn.app>
 * @license Apache-2.0
 * @version 0.1.0
 */
namespace psyn {

    enum RuntimeMode {
        Browser = 'browser',
        Runtime = 'runtime'
    }

    class Connection {

        private connectionHeaders:Headers;
        private connectionURL:string;
        private connectionMethod:string;

        public constructor(url:string, method?:string) {
            this.connectionURL      = url;
            this.connectionMethod   = method ?? 'GET';
            this.connectionHeaders  = new Headers();
        }

        public get url() : string {
            return this.connectionURL;
        }

        public set url(url:string) {
            this.connectionURL = url;
        }

        public get method() : string {
            return this.connectionMethod;
        }

        public set method(method:string) {
            this.connectionMethod = method;
        }

        public get headers() : Headers {
            return this.connectionHeaders;
        }

        public setHeader(key:string, value:string) : void {
            this.connectionHeaders.set(key, value);
        }

        public removeHeader(key:string) : void {
            this.connectionHeaders.delete(key);
        }

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

    class DataSource extends Connection {

        private sourceName:string;
        private sourceData:any;
        private sourceParameters:any;
        private lastLoaded:Date;
        private cacheing:boolean = true;
        private cacheTime:number = 60000;

        public constructor(name:string, url:string, method?:string, parameters?:{}) {
            super(url, method);
            this.sourceName = name;
            this.sourceParameters = parameters ?? {};
        }

        public get name() : string {
            return this.sourceName;
        }

        public get data() : any {
            return this.sourceData;
        }

        public get parameters() : any {
            return this.sourceParameters;
        }

        public addParameter(key:string, value:string) : void {
            this.sourceParameters[key] = value;
        }

        public removeParameter(key:string) : void {
            delete this.sourceParameters[key];
        }

        public get loadedTime() : Date {
            return this.lastLoaded;
        }

        public get cache() : boolean {
            return this.cacheing;
        }

        public set cache(value:boolean) {
            this.cacheing = value;
        }

        public get cacheAgeSeconds() : number {
            return this.cacheTime / 1000;
        }

        public set cacheAgeSeconds(value:number) {
            this.cacheTime = value * 1000;
        }

        public async load() : Promise<any> {

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

    }

    export class App {

        private config:any = null;
        private loadedData:{[key:string]:any} = {};
        private eventApplicationReady:CustomEvent;
        private isReady:boolean = false;
        private environment:RuntimeMode;
        private dataSources:{[key:string]:DataSource} = {};
        private dataSourceIntervalTimers:{[key:string]:number} = {};

        public Events:EventTarget;

        public constructor() {

            // log
            console.log("psyn Application Framework");

            // create event target
            this.Events = new EventTarget();

            // load configuration
            this.applicationConfiguration().then((config:any) => {

                // set configuration
                this.config = config

                // set environment
                this.environment = this.detectEnvironment();

                // initialize events
                this.initializeEvents();

                // if browser runtime mode
                // attach to window
                if (this.environment === RuntimeMode.Browser) window['app'] = this;

                // dispatch application ready event
                this.Events.dispatchEvent(this.eventApplicationReady);

            });
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
         * @returns Promise<any>
         */
        public async dataFromURL(name:string, url:string, forceReload:boolean = false) : Promise<any> {

            // if data is already loaded and not forced to reload, return it
            if (this.loadedData[name] && !forceReload) return this.loadedData[name];

            // get data
            const data = await this.json(url);

            // if no data, return null
            if (!data) return null;

            // add to loaded data
            this.loadedData[name] = data;
        }



        /**
         * Data From Source
         * 
         * Load data from a data source
         * @param sourceName The name of the data source
         * @returns Promise<any>
         */
        public async dataFromSource(sourceName:string) : Promise<any> {

            // get source
            const source = this.dataSources[sourceName] ?? null;

            // if source is not found, return null
            if (!source) return null;

            // load source
            const data = await source.load();

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
         * @returns void
         */
        public sourceOnInterval(sourceName:string, interval:number) : number {
                
            // get source
            const source = this.dataSources[sourceName] ?? null;

            // if source is not found, return null
            if (!source) return null;

            // set interval
            const timer:number = setInterval(async () => {

                // load source
                await source.load();

                // raise event
                this.Events.dispatchEvent(new CustomEvent('source_loaded', {detail: source}));

            }, interval);

            // add to timers
            this.dataSourceIntervalTimers[sourceName] = timer;
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
         * Template
         * 
         * Load a template into an HTML element from a URL
         * @param url The URL of the template
         * @param data The data to replace in the template
         * @param element The HTML element to load the template into
         * @param appendElementHTML Append the template to the element's HTML if set to true
         * @returns Promise<void>
         */
        public async template(url:string, data:any, element:HTMLElement, appendElementHTML:boolean = false) : Promise<void> {

            // get template html
            const html = await this.html(url);

            // find and replace data in html
            let buffer = html;
            for (let key in data) {

                // create regular expression
                const exp:RegExp = new RegExp(`{{${key}}}`, 'g');

                // get value
                const value = data[key];

                // replace
                buffer = buffer.replace(exp, value);
            }

            // append to element
            if (appendElementHTML) {
                element.innerHTML += buffer;
            } else {
                element.innerHTML = buffer;
            }
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
        private async html(url:string) : Promise<string> {

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

            // is not browser
            if (window?.navigator ?? false) return RuntimeMode.Runtime;

            // default to browser
            return RuntimeMode.Browser;
        }



    }



}


/**
 * Procedural Code
 */
const app = new psyn.App();