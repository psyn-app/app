/**
 * psyn.app
 * 
 * A simple, fast, and secure web application framework.
 * 
 * jsr.io/@psyn/app
 * github.com/psyn-app/app
 * 
 * @author VisionMise <visionmise@psyn.app>
 * @license MIT
 * @version 0.1.0
 */
namespace psyn {



    export class App {

        private config:any = null;
        private loadedData:{[key:string]:any} = {};
        private eventApplicationReady:CustomEvent;
        private isReady:boolean = false;

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

                // initialize events
                this.initializeEvents();

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
         * Data
         * 
         * Load data from a URL
         * @param name The name of the data
         * @param url The URL of the data
         * @param forceReload Force the data to reload if set to true
         * @returns Promise<any>
         */
        public async data(name:string, url:string, forceReload:boolean = false) : Promise<any> {

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



    }



}


// Procedural code
(async () => {

    // create new application
    const app = new psyn.App();

    // add to global scope
    window['app'] = app;

})();