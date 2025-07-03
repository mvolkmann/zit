import ZitElement from "../zit-element.js";

class MultiplyNumbers extends ZitElement {
  static properties = {
    n1: { type: Number },
    n2: { type: Number },
  };

  html() {
    return /*html*/ `
      <p>${this.n1} * ${this.n2} = ${this.n1 * this.n2}</p>
    `;
  }
}

MultiplyNumbers.register();
