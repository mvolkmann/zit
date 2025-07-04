import ZitElement from "../zit-element.js";

class RadioGroup extends ZitElement {
  static formAssociated = true;
  #default;
  #internals;
  #name;
  #value;

  constructor() {
    super();
    this.#internals = this.attachInternals();
  }

  connectedCallback() {
    this.#name = this.getAttribute("name");
    const options = this.getAttribute("options")
      .split(",")
      .map((option) => option.trim());
    this.#default = this.getAttribute("default") || options[0];
    this.#value = this.getAttribute("value") || this.#default;

    this.shadowRoot.innerHTML = /*html*/ `
      <style>
        :not(:defined) {
          visibility: hidden;
        }

        .radio-group {
          display: flex;
          gap: 0.25rem;

          > div {
            display: flex;
            align-items: center;
          } 
        }
      </style>
      <div class="radio-group">
        ${options.map((option) => this.#makeRadio(option)).join("")}
      </div>
    `;

    // Add event listeners to the radio buttons.
    const inputs = this.shadowRoot.querySelectorAll("input");
    for (const input of inputs) {
      input.addEventListener("change", (event) => {
        this.value = event.target.value;
      });
    }
  }

  formResetCallback() {
    const value = (this.value = this.#default);
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
          name="${this.#name}"
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
    if (newValue === this.#value) return;

    this.#value = newValue;
    this.#internals.setFormValue(newValue);
    const input = this.shadowRoot.getElementById(newValue);
    if (input) input.checked = true;
    this.dispatchEvent(new Event("change"));
  }
}

RadioGroup.register();
