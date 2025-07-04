import ZitElement from "../zit-element.js";

class RadioGroup extends ZitElement {
  static formAssociated = true;
  #internals = this.attachInternals();
  #optionsArray = [];

  static properties = {
    default: { type: String },
    name: { type: String },
    options: { type: String },
    value: { type: String },
  };

  buildDOM() {
    super.buildDOM();
    this.#internals.setFormValue(this.value);
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

  formResetCallback() {
    this.value = this.default;
    const { value } = this;
    for (const input of this.shadowRoot.querySelectorAll("input")) {
      input.checked = input.value === value;
    }
  }

  //TODO: Maybe adding two-way data binding would remove the need for this method.
  handleChange(event) {
    const { value } = event.target;
    this.value = value;
    this.#internals.setFormValue(value);

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
