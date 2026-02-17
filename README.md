## 📝 JavaScript Questions - Answers in Bangla

### ১) `null` এবং `undefined` এর মধ্যে পার্থক্য কি?

**`undefined`:**
- যখন কোনো ভেরিয়েবল ডিক্লেয়ার করা হয় কিন্তু কোনো মান (value) assign করা হয় না, তখন সেটার মান `undefined` হয়।
- এটি JavaScript নিজে থেকে automatically সেট করে।
- যেমন: কোনো ফাংশন যদি কিছু রিটার্ন না করে, তাহলে সেটা `undefined` রিটার্ন করে।

```javascript
let name;
console.log(name); // undefined

function test() {}
console.log(test()); // undefined
```

**`null`:**
- `null` হলো একটা intentional মান যা প্রোগ্রামার নিজে সেট করে।
- এটা বোঝায় যে ভেরিয়েবলটির কোনো মান নেই বা empty।
- এটা একটা object type।

```javascript
let user = null; // user খালি রাখা হয়েছে
console.log(user); // null
```

**মূল পার্থক্য:**
- `undefined` মানে মান দেওয়া হয়নি
- `null` মানে user খালি/empty সেট করা হয়েছে

---

### ২) JavaScript-এ `map()` ফাংশনের ব্যবহার কি? এটা `forEach()` থেকে কীভাবে আলাদা?

**`map()` ফাংশন:**
- `map()` একটা array-এর প্রতিটি element-এর উপর একটা function চালায়।
- এটা একটা **নতুন array** রিটার্ন করে যেখানে modified values থাকে।
- Original array পরিবর্তন হয় না।

```javascript
const numbers = [1, 2, 3, 4];
const doubled = numbers.map(num => num * 2);
console.log(doubled); // [2, 4, 6, 8]
console.log(numbers); // [1, 2, 3, 4] (unchanged)
```

**`forEach()` ফাংশন:**
- `forEach()` শুধুমাত্র array-এর প্রতিটি element-এর উপর একটা function চালায়।
- এটা কিছু রিটার্ন করে না (`undefined` return করে)।
- Side effects create করার জন্য ব্যবহার করা হয় (যেমন: console.log, DOM manipulation)।

```javascript
const numbers = [1, 2, 3, 4];
numbers.forEach(num => console.log(num * 2));
// শুধু print করবে, কোনো array রিটার্ন করবে না
```

**মূল পার্থক্য:**
- `map()` নতুন array রিটার্ন করে ✅
- `forEach()` কিছু রিটার্ন করে না ❌
- `map()` যখন আপনার transformed data দরকার
- `forEach()` যখন শুধু কিছু করতে চান (print, update, etc.)

---

### ৩) `==` এবং `===` এর মধ্যে পার্থক্য কি?

**`==` (Loose Equality / Type Coercion সহ):**
- শুধুমাত্র মান (value) তুলনা করে।
- Type conversion করে তারপর তুলনা করে।
- কম strict।

```javascript
console.log(5 == "5");      // true (string কে number-এ convert করে)
console.log(true == 1);     // true (boolean কে number-এ convert করে)
console.log(null == undefined); // true
console.log(0 == false);    // true
```

**`===` (Strict Equality / Type Coercion ছাড়া):**
- মান (value) এবং type উভয়ই তুলনা করে।
- কোনো type conversion করে না।
- বেশি strict এবং recommended।

```javascript
console.log(5 === "5");     // false (type আলাদা: number vs string)
console.log(true === 1);    // false (type আলাদা: boolean vs number)
console.log(null === undefined); // false
console.log(0 === false);   // false
```

**কোনটা ব্যবহার করবেন:**
- সবসময় `===` ব্যবহার করা উচিত (best practice)
- `==` ব্যবহার করলে unexpected results হতে পারে
- শুধুমাত্র `null`/`undefined` check করার জন্য `==` ব্যবহার করা যেতে পারে

---

### ৪) API ডেটা fetch করার সময় `async/await` এর গুরুত্ব কি?

**`async/await` কেন গুরুত্বপূর্ণ:**

১. **পড়তে সহজ (Readable Code):**
   - Promise chain (`.then()`) এর চেয়ে অনেক বেশি পরিষ্কার এবং সহজ।
   - Synchronous code এর মতো দেখায়, বুঝতে সহজ।

```javascript
// Promise চেইন (পুরাতন পদ্ধতি)
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));

// async/await (আধুনিক পদ্ধতি)
async function getData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
```

২. **Error Handling সহজ:**
   - `try/catch` block ব্যবহার করে error handle করা যায়।
   - সব error একসাথে handle করা যায়।

৩. **Sequential Operations:**
   - একটির পর একটি asynchronous operation চালানো সহজ।
   - Wait করা যায় যতক্ষণ না একটা operation শেষ হয়।

```javascript
async function loadProducts() {
  try {
    // প্রথমে categories লোড করো
    const categoriesRes = await fetch('api/categories');
    const categories = await categoriesRes.json();
    
    // তারপর প্রথম category এর products লোড করো
    const productsRes = await fetch(`api/products/${categories[0]}`);
    const products = await productsRes.json();
    
    return products;
  } catch (error) {
    console.error('Error:', error);
  }
}
```

৪. **Multiple Promises:**
   - `Promise.all()` এর সাথে ব্যবহার করে multiple API calls একসাথে করা যায়।

```javascript
async function loadAllData() {
  try {
    const [users, products, orders] = await Promise.all([
      fetch('api/users').then(r => r.json()),
      fetch('api/products').then(r => r.json()),
      fetch('api/orders').then(r => r.json())
    ]);
    
    return { users, products, orders };
  } catch (error) {
    console.error(error);
  }
}
```

**মূল সুবিধা:**
- ✅ Code পড়তে এবং maintain করতে সহজ
- ✅ Error handling ভালো
- ✅ Debugging সহজ
- ✅ Callback hell এড়ানো যায়

---

### ৫) JavaScript-এ Scope এর ধারণা ব্যাখ্যা করুন (Global, Function, Block)

**Scope** মানে হলো variable এর accessibility বা visibility নির্ধারণ করা - কোথায় থেকে একটা variable access করা যাবে।

**১. Global Scope:**
- যে variable গুলো কোনো function বা block এর বাইরে declare করা হয়।
- পুরো program এ যেকোনো জায়গা থেকে access করা যায়।
- সবচেয়ে বাইরের scope।

```javascript
// Global scope
let globalVar = "I am global";

function test() {
  console.log(globalVar); // Access করা যাবে
}

console.log(globalVar); // Access করা যাবে
```

**সমস্যা:** অতিরিক্ত global variable ব্যবহার করলে naming conflict হতে পারে।

**২. Function Scope:**
- যে variable গুলো function এর ভিতরে declare করা হয়।
- শুধুমাত্র সেই function এর ভিতর থেকেই access করা যায়।
- `var`, `let`, `const` সবই function scope follow করে।

```javascript
function myFunction() {
  // Function scope
  var functionVar = "I am in function";
  let anotherVar = "Me too";
  
  console.log(functionVar); // কাজ করবে
  console.log(anotherVar);  // কাজ করবে
}

console.log(functionVar); // Error! বাইরে থেকে access করা যাবে না
```

**৩. Block Scope:**
- `let` এবং `const` দিয়ে declare করা variable গুলো block scope follow করে।
- Block মানে `{}` curly braces এর ভিতর (if, for, while, etc.)।
- শুধুমাত্র সেই block এর ভিতর থেকেই access করা যায়।
- `var` block scope follow করে না!

```javascript
// Block scope example
if (true) {
  let blockVar = "I am in block";
  const anotherBlock = "Me too";
  var notBlockScoped = "I am NOT block scoped";
  
  console.log(blockVar); // কাজ করবে
}

console.log(blockVar); // Error! বাইরে থেকে access করা যাবে না
console.log(notBlockScoped); // কাজ করবে (var block scope করে না)
```

**For loop example:**
```javascript
for (let i = 0; i < 3; i++) {
  console.log(i); // 0, 1, 2
}
console.log(i); // Error! 'i' শুধু loop এর ভিতরে exist করে

for (var j = 0; j < 3; j++) {
  console.log(j); // 0, 1, 2
}
console.log(j); // 3 (var block scope করে না, function scope করে)
```

**Nested Scope (Scope Chain):**
- Inner scope বাইরের scope এর variable access করতে পারে।
- কিন্তু outer scope inner এর variable access করতে পারে না।

```javascript
let global = "Global";

function outer() {
  let outerVar = "Outer";
  
  function inner() {
    let innerVar = "Inner";
    
    console.log(global);    // Access করতে পারবে
    console.log(outerVar);  // Access করতে পারবে
    console.log(innerVar);  // Access করতে পারবে
  }
  
  inner();
  console.log(innerVar); // Error! inner scope এর variable
}

outer();
```

**Best Practices:**
- `var` এড়িয়ে চলুন, `let` এবং `const` ব্যবহার করুন
- যতটা সম্ভব global scope কম ব্যবহার করুন
- Variable গুলো যতটা সম্ভব ছোট scope এ রাখুন
- `const` বেশি ব্যবহার করুন (যদি value পরিবর্তন না হয়)

**সারসংক্ষেপ:**
- **Global Scope:** সর্বত্র accessible
- **Function Scope:** শুধু function এর ভিতরে
- **Block Scope:** শুধু `{}` এর ভিতরে (`let`/`const`)

---