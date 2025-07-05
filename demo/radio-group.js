import ZitElement from "../zit-element.js";

class RadioGroup extends ZitElement {
  // This is the only thing a ZitElement subclass
  // must contain to contribute to form submission.
  static formAssociated = true;

  #optionsArray = [];

  static properties = {
    default: { type: String },
    name: { type: String },
    options: { type: String },
    value: { type: String },
  };

  attributeChangedCallback(attr, oldValue, newValue) {
    super.attributeChangedCallback(attr, oldValue, newValue);
    if (attr === "value") {
      const inputs = this.shadowRoot.querySelectorAll("input");
      for (const input of inputs) {
        input.checked = input.value === newValue;
      }
    }
  }

  connectedCallback() {
    super.connectedCallback();

    this.#optionsArray = this.options.split(",").map((option) => option.trim());
    if (!this.default) this.default = this.#optionsArray[0];
    if (!this.value) this.value = this.default;

    this.buildDOM();
  }

  css() {
    return /*css*/ `
      .radio-group {
        display: flex;
        gap: 0.25rem;

        > div {
          display: flex;
          align-items: center;
        } 
      }
    `;
  }

  html() {
    return /*html*/ `
      <div class="radio-group">
        ${this.#optionsArray.map((option) => this.#makeRadio(option)).join("")}
      </div>
    `;
  }

  handleChange(event) {
    const { value } = event.target;
    this.value = value;

    // This allows users of the this web component to listen for changes.
    this.dispatchEvent(new Event("change"));
  }

  #makeRadio(option) {
    return /*html*/ `
      <div>
        <input
          type="radio"
          id="${option}"
          name="${this.name}"
          value="${option}"
          ${option === this.value ? "checked" : ""}
          onchange="handleChange"
        />
        <label for="${option}">${option}</label>
      </div>
    `;
  }
}

RadioGroup.register();
