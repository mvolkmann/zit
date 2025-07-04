import ZitElement from "../zit-element.js";

class DataBind extends ZitElement {
  static properties = {
    color: { type: String, reflect: true },
    name: { type: String, reflect: true },
    story: { type: String, reflect: true },
  };

  constructor() {
    super(true);
  }

  css() {
    return /*css*/ `
      :host {
        font-family: sans-serif;
      }

      label {
        font-weight: bold;
      }
    `;
  }

  html() {
    return /*html*/ `
      <div>
        <div>
          <label>Name:</label>
          <input value="@name">
          <p>Hello, <span>this.name</span>!</p>
        </div>
        <div>
          <label>Color:</label>
          <select value="@color">
            <option value="red">Red</option>
            <option value="green">Green</option>
            <option value="blue">Blue</option>
          </select>
          <p>You selected the color <span>this.color</span>.</p>
        </div>
        <div>
          <label>Story:</label>
          <textarea>@story</textarea>
          <p>Your story is <span>this.story</span>.</p>
      </div>
    `;
  }
}

DataBind.register();
