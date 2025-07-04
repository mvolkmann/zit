import ZitElement from "../zit-element.js";

class RadioGroup extends ZitElement {
  static formAssociated = true;
  #internals = this.attachInternals();
  #optionsArray = [];
  #value;

  static properties = {
    default: { type: String },
    name: { type: String },
    options: { type: String },
    value: { type: String },
  };

  connectedCallback() {
    super.connectedCallback();
    this.#optionsArray = this.options.split(",").map((option) => option.trim());
    console.log("connectedCallback: this.#optionsArray =", this.#optionsArray);
    if (!this.default) this.default = this.#optionsArray[0];
    console.log("connectedCallback: this.default =", this.default);
    if (!this.value) this.value = this.default;
    this.#value = this.value;
    console.log("connectedCallback: this.value =", this.value);
    super.buildDOM();

    // Add event listeners to the radio buttons.
    const inputs = this.shadowRoot.querySelectorAll("input");
    for (const input of inputs) {
      input.addEventListener("change", (event) => {
        this.value = event.target.value;
      });
    }
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

  formResetCallback() {
    const value = (this.value = this.default);
    for (const input of this.shadowRoot.querySelectorAll("input")) {
      input.checked = input.value === value;
    }
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
        />
        <label for="${option}">${option}</label>
      </div>
    `;
  }

  get value() {
    return this.#value;
  }

  set value(newValue) {
    console.log("radio-group.js set value: newValue =", newValue);
    if (newValue === this.#value) return;

    this.#value = newValue;
    this.#internals.setFormValue(newValue);
    const input = this.shadowRoot.getElementById(newValue);
    if (input) input.checked = true;
    this.dispatchEvent(new Event("change"));
  }
}

RadioGroup.register();
