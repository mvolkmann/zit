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

  buildDOM() {
    super.buildDOM();

    // Add event listeners to the radio buttons.
    //TODO: Maybe adding two-way data binding would remove the need for this code.
    const inputs = this.shadowRoot.querySelectorAll("input");
    for (const input of inputs) {
      input.addEventListener("change", (event) => {
        const { value } = event.target;
        this.value = value;
        this.#internals.setFormValue(value);
        this.dispatchEvent(new Event("change"));
      });
    }
  }

  connectedCallback() {
    super.connectedCallback();

    this.#optionsArray = this.options.split(",").map((option) => option.trim());
    if (!this.default) this.default = this.#optionsArray[0];
    if (!this.value) this.value = this.default;
    this.#value = this.value;

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
}

RadioGroup.register();
