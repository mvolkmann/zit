class ZitElement extends HTMLElement {
  // This uses a negative lookahead to match an identifier
  // that is not immediately followed by a left parenthesis.
  static #FIRST_CHAR = "a-zA-Z_$";
  static #OTHER_CHAR = this.#FIRST_CHAR + "0-9";
  static #IDENTIFIER = `[${this.#FIRST_CHAR}][${this.#OTHER_CHAR}]*(?![${
    this.#OTHER_CHAR
  }\\(])`;
  static #REFERENCE_RE = new RegExp("this." + this.#IDENTIFIER);

  static #subclassToDataMap = new Map();
  static #subclassesProcessed = new Set();

  static #template = document.createElement("template");

  #reactive = false;

  constructor(reactive) {
    super();
    this.#reactive = reactive;
    this.attachShadow({ mode: "open" });
  }

  attributeChangedCallback(attrName, _, newValue) {
    // Update the corresponding property.
    this[attrName] = this.#getTypedValue(attrName, newValue);
  }

  #buildDOM() {
    let template = `
      <style>${this.css()}</style>
      ${this.html()}
      `;

    if (!this.#reactive) {
      template = template.replaceAll("@{", "${");
      template = Function(`return \`${template}\`;`).call(this);
    }
    ZitElement.#template.innerHTML = template;

    this.shadowRoot.replaceChildren(
      ZitElement.#template.content.cloneNode(true)
    );

    if (!this.#reactive) {
      for (const child of this.shadowRoot.children) {
        this.#fixBooleanAttributes(child);
      }
    }

    this.#wireEvents();
  }

  connectedCallback() {
    console.log(
      "zit-element.js connectedCallback: this.constructor.name =",
      this.constructor.name
    );
    this.#defineProperties();

    if (this.#reactive) {
      if (!ZitElement.#getSubclassData()) {
        ZitElement.#subclassToDataMap.set(subclassName, {
          attributeTypeMap: new Map(),
          expressionToReferencesMap: new Map(),
          propertyToReferencesMap: new Map(),
        });
      }

      this.#makeReactive();
    }

    ZitElement.#subclassesProcessed.add(subclassName);

    this.#buildDOM();
  }

  #defineProperties() {
    const properties = this.constructor.properties;
    for (const [name, options] of Object.entries(properties)) {
      this.#defineProperty(name, options);
    }
  }

  #defineProperty(propertyName, options) {
    // Bail out if propertyName is missing in the properties of the subclass.
    const keys = Object.keys(this.constructor.properties);
    if (!keys.includes(propertyName)) return;

    // Copy the property value to a new property with a leading underscore.
    // The property is replaced below with Object.defineProperty.
    const value = this.hasAttribute(propertyName)
      ? this.#getTypedAttribute(propertyName)
      : options.value;
    this["_" + propertyName] = value;

    Object.defineProperty(this, propertyName, {
      enumerable: true,
      get() {
        return this["_" + propertyName];
      },
      set(value) {
        const oldValue = this["_" + propertyName];
        if (value === oldValue) return;
        this["_" + propertyName] = value;

        // If the property propertyName is configured to "reflect" and
        // there is a matching attribute on the custom element,
        // update that attribute.
        if (options.reflect && this.hasAttribute(propertyName)) {
          const oldValue = this.#getTypedAttribute(propertyName);
          if (value !== oldValue) {
            this.#updateAttribute(this, propertyName, value);
          }
        }

        if (this.#reactive) {
          this.#react(propertyName);
        } else {
          this.#buildDOM();
        }
      },
    });
  }

  #evaluateAttributes(element) {
    for (const attrName of element.getAttributeNames()) {
      const text = element.getAttribute(attrName);
      this.#registerPlaceholders(text, element, attrName);
    }
  }

  static #evaluateInContext(expression, context) {
    return function () {
      // oxlint-disable-next-line no-eval
      return eval(expression);
    }.call(context);
  }

  #evaluateText(element) {
    // Don't allow style elements to be affected by property values.
    if (element.localName === "style") return;

    const text = element.textContent.trim();
    this.#registerPlaceholders(text, element);
  }

  #fixBooleanAttributes(element) {
    const booleanAttributes = ["hidden", "disabled", "readonly", "required"];
    for (const attrName of element.getAttributeNames()) {
      if (booleanAttributes.includes(attrName)) {
        const value = element.getAttribute(attrName);
        if (value === "true") {
          element.setAttribute(attrName, attrName);
        } else {
          element.removeAttribute(attrName);
        }
      }
    }

    for (const child of element.children) {
      this.#fixBooleanAttributes(child);
    }
  }

  static #getSubclassData() {
    const subclassName = this.name;
    console.log(
      "zit-element.js #getSubclassData: subclassName =",
      subclassName
    );
    return ZitElement.#subclassToDataMap.get(subclassName);
  }

  #getTypedAttribute(attrName) {
    return this.#getTypedValue(attrName, this.getAttribute(attrName));
  }

  #getTypedValue(attrName, stringValue) {
    const { attributeTypeMap } = ZitElement.#getSubclassData();
    const type = attributeTypeMap.get(attrName);
    if (type === Number) return Number(stringValue);
    if (type === Boolean) return Boolean(stringValue);
    return stringValue;
  }

  #makeReactive() {
    const elements = this.shadowRoot.querySelectorAll("*");
    for (const element of elements) {
      // If the element has no child elements, evaluate its text content.
      if (!element.firstElementChild) this.#evaluateText(element);

      this.#evaluateAttributes(element);
    }

    /*
    console.log(
      "#propertyToExpressionsMap =",
      ZitElement.#propertyToExpressionsMap
    );
    console.log("#expressionToReferencesMap =", this.#expressionToReferencesMap);
    */
  }

  // Updates all expression references.
  #react(propertyName) {
    const { expressionToReferencesMap, propertyToExpressionsMap } =
      ZitElement.#getSubclassData();
    const expressions = propertyToExpressionsMap.get(propertyName) || [];
    for (const expression of expressions) {
      const value = ZitElement.#evaluateInContext(expression, this);
      const references = expressionToReferencesMap.get(expression);
      for (const reference of references) {
        if (reference instanceof Element) {
          reference.textContent = value;
        } else {
          const { element, attrName } = reference;
          this.#updateAttribute(element, attrName, value);
        }
      }
    }
  }

  static register() {
    const elementName = ZitElement.#toKebabCase(this.name);
    if (!customElements.get(elementName)) {
      customElements.define(elementName, this);
    }
  }

  // Do not place untrusted expressions in
  // attribute values or the text content of elements!
  #registerPlaceholders(text, element, attrName) {
    const matches = text.match(ZitElement.#REFERENCE_RE);
    if (!matches) return;

    const {
      alreadyProcessed,
      expressionToReferencesMap,
      propertyToExpressionsMap,
    } = ZitElement.#getSubclassData();
    // Only map properties to expressions once for each web component because
    // the mapping will be the same for every instance of the web component.
    if (!alreadyProcessed) {
      const skip = "this.".length;
      matches.forEach((capture) => {
        const propertyName = capture.substring(skip);
        let expressions = propertyToExpressionsMap.get(propertyName);
        if (!expressions) {
          expressions = [];
          propertyToExpressionsMap.set(propertyName, expressions);
        }
        expressions.push(text);
      });
    }

    let references = expressionToReferencesMap.get(text);
    if (!references) {
      references = [];
      expressionToReferencesMap.set(text, references);
    }
    references.push(attrName ? { element, attrName } : element);

    const value = ZitElement.#evaluateInContext(text, this);
    if (attrName) {
      this.#updateAttribute(element, attrName, value);
    } else {
      element.textContent = value;
    }
  }

  static #toKebabCase = (str) =>
    str
      // Insert a dash before each uppercase letter
      // that is preceded by a lowercase letter or digit.
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
      .toLowerCase();

  #updateAttribute(element, attrName, value) {
    const currentValue = element.getAttribute(attrName);
    if (typeof value === "boolean") {
      if (value) {
        if (currentValue !== attrName) {
          element.setAttribute(attrName, attrName);
        }
      } else {
        element.removeAttribute(attrName);
      }
    } else if (currentValue !== value) {
      element.setAttribute(attrName, value);
    }
  }

  #wireEvents() {
    const elements = this.shadowRoot.querySelectorAll("*");
    for (const element of elements) {
      for (const attr of element.attributes) {
        const { name } = attr;
        if (name.startsWith("on")) {
          const eventName = name.slice(2).toLowerCase();
          const methodName = attr.value;
          element.addEventListener(eventName, (event) =>
            this[methodName](event)
          );
          element.removeAttribute(name);
        }
      }
    }
  }
}

export default ZitElement;
