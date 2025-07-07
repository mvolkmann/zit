# Zit

This is a small libraries that simplifies building web components.
It is inspired by [Lit](https://lit.dev).

Zit has fewer features that Lit.
In exchange, Zit:

- is much smaller than Lit
- doesn't require any tooling
- doesn't require a build process

The main features of Zit are that it
automates wiring event listeners
and automates implementing reactivity.

Check out the web app in the `demo` directory.
To run it, cd to that directory, enter `npm install`,
enter `npm run dev`, and browse localhost:5173.
This app renders two "counter" components.
The first is implemented as a vanilla web component.
The second uses the Zit library.
Compare the files `counter-vanilla.js` and `counter-zit.js`
to see how much using Zit simplifies the code.

To wire event listeners,
Zit looks for attributes whose name begins with "on".
It assumes the remainder of the attribute name is an event name.
It also assumes that the value of the attribute is a method name
that should be called when that event is dispatched.
For example, the attribute `onclick="increment"` causes Zit to
add an event listener to the element containing the attribute
for "click" events and calls `this.increment(event)`.

The case of the event name within the attribute name does not matter
because Zit lowercases the name.
So the attribute in the previous example
can be replaced by `onClick="increment"`.

Zit supports two kinds of reactivity, selected based on
whether `true` is passed to the `ZitElement` constructor.
In either case, attribute values and the text content of elements
can refer to web component properties with the syntax `this.propertyName`.

When `true` is not passed to the constructor,
the DOM of the web component is completely recreated
every time the value of any of its properties changes.
The attribute values and text content can include the syntax `${js-expression}`
(just like in JavaScript template literals)
to specify values to be inserted.
The JavaScript expressions can include references to web component properties.
For an example of this kind of web component, see `demo/hello-zit.js`.

When `true` is passed to the constructor,
the DOM of the web component is surgically updated.
Only attribute values and text content
that refer to modified web component properties are updated.
Attribute values and text content that contain references to properties
must be valid JavaScript expressions that are NOT surrounded by `${...}`.
For an example of this kind of web component, see `demo/hello-zit-reactive.js`.

Zit supports two-way data binding for HTML form elements.

- `input` and `select` elements can have a `value` attribute
  whose value is "this.somePropertyName".
- `textarea` elements can have text content
  that is "this.somePropertyName"

In all these cases, if the user changes the value of the form element,
the specified property is updated.
When the property is updated,
the displayed value of the form element is updated.
For examples, see `demo/data-bind.js`.

Web components that extend `ZitElement` can contribute values to
form submissions by adding the following line to their class definition.
Zit looks for that automatically does the rest of the work.

```js
static formAssociated = true;
```

Zit supports conditional and iterative generation of HTML.
See `demo/temperature-eval.js` for an example of a web component
that conditionally decides what to render based on an attribute value.
See `demo/radio-group.js` for an example of a web component
that iterates over values in a comma-delimited attribute value
to determine what to render.
