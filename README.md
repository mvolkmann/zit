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

The implement reactivity, Zit looks for "this."
followed by a valid JavaScript identifier in
the text content of elements and in attribute values.
It uses those matches to populate to maps.
The first maps property names to expressions (`propertyToExpressionsMap`).
The second maps expressions to element or attribute references
(`expressionToReferencesMap`).
