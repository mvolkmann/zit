import ZitElement from "../zit-element.js";

class CounterZit extends ZitElement {
  static properties = {
    count: { type: Number, reflect: true },
  };

  css() {
    return /*css*/ `
      :not(:defined) {
        visibility: hidden;
      }

      .counter {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      button {
        background-color: lightgreen;
      }

      button:disabled {
        background-color: gray;
      }
    `;
  }

  html() {
    return /*html*/ `
    <div>
      <button disabled="this.count === 0" onClick="decrement">-</button>
      <span>this.count</span>
      <button onClick="increment">+</button>
      <span>(this.count < 10 ? "single" : "double") + " digit"</span>
    </div>
    `;
  }

  decrement() {
    if (this.count > 0) this.count--;
  }

  increment() {
    this.count++;
  }
}

CounterZit.register();
