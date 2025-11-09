/*
===================================================================
Back-end Lab — Express
===================================================================

===================================================================
LAB SETUP INSTRUCTIONS
===================================================================

1. Navigate to the project directory:
   Open your terminal and run:
      cd 5-7-node-express

2. Install project dependencies:
   Run either of these commands:
      npm i
      OR
      npm install
      npm install express cors

3. Start the front server server from 6-2-node-express-Dromarjh-main\6-2-node-express path:
   Run:
      npm run dev

4. Start the back-end server from a separate terminal, path: 6-2-node-express-Dromarjh-main\6-2-node-express\backend:
   Run:
      node server.js
  Note: Start the back-end server after creating the server in server.js file.

  If your system blocks running npm commands (especially on Windows PowerShell),
   run this command first to allow script execution:
      Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

===============================================================
TODO 1: Initialize Express App (in server.js)
===============================================================
Goal: Set up the Express server.

Hints:
- Import express (already installed).
- Create the app using const app = express().
- Define const PORT = 3000.

Start the server:
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

===============================================================
TODO 2: Create a function that returns a random integer (in backend/utils/random.js)
===============================================================
Goal:
  Write a function named getRandomInt(max) that returns a random integer between 0 and (max - 1).

Hints:
- Use Math.random() → it generates a random decimal between 0 and 1.
- Multiply it by 'max' to scale it to your desired range.
- Use Math.floor() to round it down to the nearest whole number.
- Finally, export this function using ES module syntax:
    export function getRandomInt(max) { ... }

Example:
  getRandomInt(5) → could return 0, 1, 2, 3, or 4

This function will be used later in quotes.js to select a random quote from the array.

===============================================================
TODO 3: Export a Function to Get a Random Quote (in quotes.js)
===============================================================

Goal: Export a helper function named getRandomQuote() that returns one random quote from the array.

Hints:
- Use Math.floor(Math.random() * quotes.length) to get a random index.
- Return quotes[index].
- Use ES module export:

export function getRandomQuote() { ... }

===============================================================
TODO 4: Enable CORS (in server.js)
===============================================================
Goal: Allow your frontend (running on port 5173) to communicate with your backend API.

Hints:
- Import cors and add this middleware:
    import cors from "cors";
    app.use(cors());
- This ensures browsers don’t block requests between your backend and frontend.

===============================================================
TODO 5: Define Routes (in server.js)
===============================================================

Goal: How to create routes and handle requests/responses.

TODO 5.1: Create a Test Route

Goal: Make a route that responds with plain text when someone visits the root URL /.

Hints:
Use app.get(path, callback)
The callback receives two arguments:
req → represents the request object (info sent from client)
res → represents the response object (used to send data to client)

Example:
    app.get("/", (req, res) => {
      res.send("Welcome to the Quote Generator API");
    });

TODO 5.2: Create a Quote API Route

Goal: Define a route that returns a random quote as JSON.

Hints:

- Import getRandomQuote from quotes.js.
- Use res.json() to send JSON data.

Example:
    app.get("/api/quote", (req, res) => {
      const quote = getRandomQuote();
      res.json({ quote });
    });

✅ When you visit http://localhost:3000/api/quote, you should see:

{ "quote": "Talk is cheap. Show me the code." }

*/


import { useState } from "react";
import "./index.css";

function App() {
  const [quote, setQuote] = useState("");

  const fetchQuote = async () => {
    const res = await fetch("http://localhost:3000/api/quote");
    const data = await res.json();
    setQuote(data.quote);
  };

  return (
    <div className="app">
      <div className="card">
        <h1 className="title">Random Quote Generator</h1>
        <button className="btn" onClick={fetchQuote}>
          Get Quote
        </button>
        <div className="quote-box">
          {quote ? <p className="quote">{quote}</p> : <p className="placeholder">Click the button to get a quote</p>}
        </div>
      </div>
    </div>
  );
}

export default App;
