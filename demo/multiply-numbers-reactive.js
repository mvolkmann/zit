import ZitElement from "../zit-element.js";

class MultiplyNumbersReactive extends ZitElement {
  static properties = {
    n1: { type: Number },
    n2: { type: Number },
  };

  constructor() {
    super(true);
  }

  html() {
    return /*html*/ `
      <p>
        <span>this.n1</span> * <span>this.n2</span> =
        <span>this.n1 * this.n2</span>
      </p>
    `;
  }
}

MultiplyNumbersReactive.register();
