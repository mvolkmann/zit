import ZitElement from "../zit-element.js";

class HelloZitReactive extends ZitElement {
  static properties = {
    name: { type: String, reflect: true },
  };

  constructor() {
    super(true);
  }

  css() {
    return /*css*/ `
      :not(:defined) {
        visibility: hidden;
      }

      p {
        color: purple;
      }
    `;
  }

  html() {
    return /*html*/ `
      <p>"Hello, " + this.name + ". Shouting " + this.name.toUpperCase() + "!"</p>
    `;
  }
}

HelloZitReactive.register();
