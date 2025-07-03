class MySuperclass {
  static value;

  static setValue(value) {
    this.value = value;
  }
}

class Subclass1 extends MySuperclass {}

class Subclass2 extends MySuperclass {}

Subclass1.setValue("value1");
Subclass2.setValue("value2");
console.log("Subclass1.value =", Subclass1.value);
console.log("Subclass2.value =", Subclass2.value);
