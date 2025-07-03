import ZitElement from "../zit-element.js";

class HelloZitReactive extends ZitElement {
  static properties = {
    name: { type: String, reflect: true },
  };

  constructor() {
    super(true);
  }

  css() {
    return /*css*/ `p { color: purple; }`;
  }

  html() {
    return /*html*/ `
      <p>
        Hello, <span>this.name</span>.
        Shouting <span>this.name.toUpperCase()</span>!
      </p>
    `;
  }
}

HelloZitReactive.register();
