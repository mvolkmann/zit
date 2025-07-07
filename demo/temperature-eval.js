import ZitElement from "../zit-element.js";

class TemperatureEval extends ZitElement {
  static properties = {
    temperature: { type: Number },
  };

  html() {
    return /*html*/ `
      <p>
        this.temperature < 32 ? "freezing" : "not freezing"
      </p>
    `;
  }
}

TemperatureEval.register();
