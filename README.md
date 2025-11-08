# Backend Lab — Node & Express

## Note:
Follow App.jsx file to implement the lab.

## Overview
This lab introduces students to **Node.js** and **Express.js** — the core technologies used to build modern back-end web applications.  
Students will create a simple REST API that serves random quotes to a React frontend.  
The lab reinforces the concepts covered in ZyBooks sections **6.2** and **6.3**, providing hands-on practice with modules, routes, middleware, and HTTP communication.

---

## Reading Assignments

- **6.2 Getting started with Node.js**  
  [https://learn.zybooks.com/zybook/SWE363Fall2025/chapter/6/section/2](https://learn.zybooks.com/zybook/SWE363Fall2025/chapter/6/section/2)

- **6.3 Modules**  
  [https://learn.zybooks.com/zybook/SWE363Fall2025/chapter/6/section/3](https://learn.zybooks.com/zybook/SWE363Fall2025/chapter/6/section/3)

---

## Concepts Used in This Lab

### 1. Introduction to Node.js
Node.js is a JavaScript runtime environment that allows developers to run JavaScript on the server side.  
It enables creation of scalable, event-driven network applications.

### 2. Installing and Running Node.js (Windows & macOS)
Node.js must be installed before beginning the backend portion.  
You can verify installation by running:
```bash
node -v
npm -v
```

### 3. How Web Servers Handle Requests and Responses
A **web server** listens for **requests** (like visiting a webpage or calling an API) and sends back **responses** (like HTML, JSON, or text).

**General Syntax:**
```js
app.get("/path", (req, res) => {
  res.send("Response message");
});
```

### 4. What Are `package.json` and `package-lock.json` Files?
- **package.json** → Defines project metadata and lists dependencies.  
- **package-lock.json** → Records exact versions of installed packages to ensure consistent installs.

### 5. What Are Modules and Why Are They Used?
Modules allow breaking code into smaller, reusable files.  
This improves readability and maintainability.

**Two Common Module Formats:**
- **ES Modules (ESM)** → Supported by browsers and modern Node.js (`import` / `export` syntax).  
- **CommonJS** → Traditional Node.js format (`require()` / `module.exports`).

### 6. Module Exports and Imports
Used to share code between files.

**General Syntax:**
```js
// Export
export function greet() { console.log("Hello!"); }

// Import
import { greet } from "./file.js";
```

### 7. What Is Express.js and Why Is It Used?
Express.js is a web framework for Node.js used to simplify route handling, middleware, and server logic.

**General Syntax:**
```js
import express from "express";
const app = express();
app.listen(3000, () => console.log("Server running"));
```

### 8. Middleware Functions
Middleware functions are functions that run between a request and a response.  
They are used for tasks such as logging, authentication, or enabling CORS.

**General Syntax:**
```js
app.use((req, res, next) => {
  console.log("Middleware executed");
  next();
});
```

---

## 🧠 Code Syntax Summary for Concepts used in this lab

| Concept | Example Syntax |
|----------|----------------|
| Create a Server | `const app = express(); app.listen(3000);` |
| Define a Route | `app.get("/path", (req, res) => res.send("Message"));` |
| Send JSON Response | `res.json({ key: "value" });` |
| Use Middleware | `app.use(cors());` |
| Import a Module | `import { func } from "./file.js";` |
| Export a Function | `export function func() { ... }` |
| Random Number | `Math.floor(Math.random() * max);` |

---

## ✅ Submission Checklist

Before submitting your lab, make sure you have:

- [ ] Completed **all six TODOs** in the backend folder.  
- [ ] Created and exported the `getRandomInt()` function in `utils/random.js`.  
- [ ] Created and exported the `getRandomQuote()` function in `quotes.js`.  
- [ ] Added CORS and routes in `server.js`.  
- [ ] Successfully tested API routes in the browser or Postman.  
- [ ] The frontend displays quotes when clicking **“Get Quote”**.  
- [ ] Your server starts without errors using `node server.js`.  

---

**End of README**
