import ZitElement from "../zit-element.js";

class HelloZit extends ZitElement {
  static properties = {
    name: { type: String, value: "World", reflect: true },
  };

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

HelloZit.register();
