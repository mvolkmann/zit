import ZitElement from "./zit-element.js";
//import ZitElement from "./zit-element.min.js";

class CounterZit extends ZitElement {
  static properties = {
    count: { type: Number, reflect: true },
  };

  // Omit this constructor to run in "render" mode
  // where every property changes causes the component to re-render.
  // Include this constructor to run in "react" mode
  // where property changes trigger targeted text and attribute updates.
  constructor() {
    super(true);
    //super();
  }

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
      <button disabled="@{this.count === 0}" onclick="decrement">-</button>
      <span>@{this.count}</span>
      <button onclick="increment">+</button>
      <span>@{this.count >= 10 ? "double-digit" : "safe"}</span>
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
