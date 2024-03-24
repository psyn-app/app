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
 * @version 0.2.0
 */
namespace psyn {

    //#region Classes

        class Component extends HTMLElement {

            private componentName:string;
            private componentShadow:ShadowRoot;
            private componentData:any;

            private templateSelector:string;
            private template:string;
            
            public constructor(name:string, templateSelector?:string, attributes?:NamedNodeMap, data?:any) {

                // Call the parent constructor
                super();

                // validate the component name
                if (name === undefined || name === null || name === "") {
                    throw new Error("Component name is required");
                }

                // clean the component name
                // replace all non-alphanumeric characters with a hyphen
                // and convert to lowercase
                // and remove leading and trailing whitespace
                name = name.trim().toLowerCase().replace(/[^a-z0-9]/g, "-");

                // Set the component name
                this.componentName = name;

                // create a shadow root
                this.componentShadow = this.attachShadow({mode: 'open'});

                // Set the component data
                if (data !== undefined) this.componentData = data;

                // Set the template selector
                if (templateSelector !== undefined) {
                    this.templateSelector = templateSelector;
                }

                // Set the component attributes
                if (attributes !== undefined) {

                    // iterate through the attributes
                    for (let attribute of attributes) {

                        // Set the attribute
                        this.setAttribute(attribute.name, attribute.value);                    
                    }

                }

                // Define the custom element
                customElements.define(`component-${this.componentName}`, Component);

            }

            public static get observedAttributes(): string[] {
                return ['selector'];
            }

            public get name(): string {
                return this.componentName;
            }

            public get data(): any {
                return this.componentData;
            }

            public set data(data:any) {
                this.componentData = data;
            }

            public connectedCallback(): void {
                // Render the component
                this.render();
            }

            public disconnectedCallback(): void {
            }

            public adoptedCallback(): void {
            }

            public attributeChangedCallback(name:string, oldValue:any, newValue:any): void {

                // if name is not in observedAttributes, return
                if (Component.observedAttributes.indexOf(name) === -1) return;

                // if the new value is the same as the old value, return
                if (oldValue === newValue) return;

                switch (name) {

                    case 'selector':
                        this.templateSelector = newValue;
                        break;

                }

                // Render the component
                this.render();
            }

            private async render(): Promise<void> {
                
                // Load the template
                const template:string = await this.loadTemplate();

                // get the data
                const data:any = this.componentData ?? {};

                // Set the template
                this.componentShadow.innerHTML = this.parseTemplate(template, data);
            }

            private async loadTemplate(): Promise<string> {

                // Get the template
                // if the selector starts with '@' its a reference to an external file
                if (this.templateSelector.startsWith("@")) {

                    // url
                    const url = this.templateSelector.substring(1);

                    // Get the template
                    this.template = await this.htmlFile(url);
                    
                } else {

                    // Check if the selector is valid
                    if (!this.isValidSelector(this.templateSelector)) {
                        throw new Error("Invalid selector");
                    }

                    // Get the template element
                    const templateElement = document.querySelector(this.templateSelector);
                    
                    // Check if the template element exists
                    if (templateElement === null) throw new Error("Template not found");

                    // Set the template
                    this.template = templateElement.outerHTML;
                }

                // Check if the template is empty
                if (this.template === "") throw new Error("Template is empty");

                // Return the template
                return this.template;
            }



            /**
             * Parse Template
             * 
             * Parse a template with data
             * @returns string
             */
            private parseTemplate(template: string, data: any): string {

                // Regular expressions
                const placeholderRegex:RegExp   = /\{\{([^}]+)\}\}/g;
                const eachRegex:RegExp          = /\{\{#each\s([^}]+)\}\}([\s\S]*?)\{\{\/each\}\}/g;
                const ifRegex:RegExp            = /\{\{#if\s([^}]+)\}\}([\s\S]*?)\{\{\/if\}\}/g;
                const elseRegex:RegExp          = /\{\{else\}\}/g;

                // Resolve data path
                const resolveDataPath = (path:string, context:any): any => {
                    return path.split('.').reduce((acc, part) => acc && acc[part], context);
                };

                // Evaluate if
                const evaluateIf = (condition:string, context:any): boolean => {
                    return new Function('data', `return ${condition};`)(context);
                };

                // Render each
                const renderEach = (template:string, array:any[], renderItem:(item: any) => string):string => {
                    return array.map(item => renderItem(item)).join('');
                };

                // Parse the template
                template = template.replace(eachRegex, (match, path, innerTemplate) => {

                    // Resolve the data path
                    const dataArray = resolveDataPath(path, data);

                    // Check if the data is an array
                    if (!Array.isArray(dataArray)) return '';

                    // Render each
                    return renderEach(innerTemplate, dataArray, item => this.parseTemplate(innerTemplate, item));
                });

                // Parse the if
                template = template.replace(ifRegex, (match, condition, innerTemplate) => {

                    // Evaluate the condition
                    const conditionResult = evaluateIf(condition, data);

                    // Split the inner template
                    const parts = innerTemplate.split(elseRegex);

                    // Return the result
                    return conditionResult ? this.parseTemplate(parts[0], data) : (parts[1] ? this.parseTemplate(parts[1], data) : '');
                });

                // Replace placeholders
                return template.replace(placeholderRegex, (match, path) => {

                    // Resolve the data path
                    const value = resolveDataPath(path, data);

                    // Return the value if it exists, otherwise return the match
                    return value !== undefined ? value : match;
                });
            }




            private async htmlFile(url:string) : Promise<string> {

                // Fetch the file
                const response = await fetch(url);

                // Check if the response is ok
                if (!response.ok) return "";

                // Get the text
                const text = await response.text();

                // Return the text
                return text;
            }



            private isValidSelector(selector:string): boolean {

                // Check if the selector is valid
                try {
                    document.querySelector(selector);
                    return true;
                } catch (e) {
                    return false;
                }
            }

        }

        abstract class Connection {

        }

        class  DataSource extends Connection {

        }



    //#endregion Classes



    //#region Procedural

        // global procedural start
        // automatically define custom elements
        const autoDefineComponents = () => {

            // Get all elements with a tag name that starts with 'component-'
            const elements = document.querySelectorAll('*');

            // if no elements, return
            if (elements.length === 0) return;

            // Filter the elements that start with 'component-'
            const componentElements = Array.from(elements).filter(element => element.tagName.toLowerCase().startsWith('component-'));
            
            // if no component elements, return
            if (componentElements.length === 0) return;

            // Iterate through the component elements
            for (let element of componentElements) {

                // Get the tag name
                const tagName = element.tagName.toLowerCase();

                // Get the component name
                const componentName = tagName.substring(10);

                // get the selector attribute, if it exists
                const selector = element.getAttribute('selector') ?? undefined;

                // create new psyn.Component
                new Component(componentName, selector, element.attributes);
            }
        };

        // initialize
        window.addEventListener('DOMContentLoaded', () => autoDefineComponents());

    //#endregion Procedural
    
}