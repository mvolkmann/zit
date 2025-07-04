import ZitElement from "../zit-element.js";

class DataBind extends ZitElement {
  static properties = {
    name: { type: String },
  };

  css() {
    return /*css*/ `
    `;
  }

  html() {
    return /*html*/ `
      <div>
        <label>Name:</label>
        <input value="@name">
        <p>Hello, <span>this.name</span>!</p>
      </div>
    `;
  }
}

DataBind.register();
