import ZitElement from "../zit-element.js";

class HelloZit extends ZitElement {
  static properties = {
    name2: { type: String, reflect: true },
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
      <p>"Hello, " + this.name2 + "!"</p>
    `;
  }
}

HelloZit.register();
