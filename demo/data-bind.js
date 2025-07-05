import ZitElement from "../zit-element.js";

class DataBind extends ZitElement {
  static properties = {
    color: { type: String, reflect: true },
    name: { type: String, reflect: true },
    score: { type: Number, reflect: true },
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
          <input value="this.name">
          <p>Hello, <span>this.name</span>!</p>
        </div>
        <div>
          <label>Color:</label>
          <select value="this.color">
            <option value="red">Red</option>
            <option value="green">Green</option>
            <option value="blue">Blue</option>
          </select>
          <p>You selected the color <span>this.color</span>.</p>
        </div>
        <div>
          <label>Story:</label>
          <textarea>this.story</textarea>
          <p>Your story is <span>this.story</span>.</p>
        </div>
        <number-input label="Favorite Number:" value="this.score"></number-input>
        <number-slider label="Slider:" value="this.score"></number-slider>
        <p>Your score is <span>this.score</span>.</p>
      </div>
    `;
  }
}

DataBind.register();
