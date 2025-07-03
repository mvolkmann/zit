import ZitElement from "../zit-element.js";

class HelloZit extends ZitElement {
  static properties = {
    name: { type: String, reflect: true },
  };

  css() {
    return /*css*/ `
      :not(:defined) {
        visibility: hidden;
      }

      p {
        color: blue;
      }
    `;
  }

  html() {
    return /*html*/ `
      <p>Hello, ${this.name}. Shouting ${this.name?.toUpperCase()}!</p>
    `;
  }
}

HelloZit.register();
