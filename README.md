# Dictionary Search & Auto-Suggestion System

This project is a dictionary application built using Java. It allows users to search for words, add new words, and get suggestions based on a prefix.

**NOTE: This project can be run in two ways — through the terminal (command line) and through the web-based UI.**

Along with the Java backend, I built a web interface using HTML, CSS, and JavaScript so the application can be used through a browser as well as through the terminal.

## Features

- Search for a word and get `FOUND` or `NOT FOUND`.
- Increase the search frequency whenever an existing word is searched successfully.
- Get suggestions based on a prefix.
- Display frequently searched words first.
- Sort words alphabetically when their frequencies are equal.
- Add new words to the dictionary.
- Display `already exists` when a word is already present.
- Choose the maximum number of suggestions to display.
- Use the application through a web-based UI or the terminal.

## Technologies Used

- Java (JDK 21)
- HTML
- CSS
- JavaScript
- Java's built-in HTTP server

**Note:** The project does not use external Java libraries or web frameworks.

## Data Structures

### 1. Trie

I used a Trie to store words character by character. It helps find words that start with a particular prefix without checking every word in the dictionary.

For example, entering `app` can return words such as `apple`, `apply`, and `application`.

### 2. HashMap

A HashMap stores each word along with its search frequency.

Example:

| Word | Frequency |
|---|---:|
| apple | 3 |
| apply | 2 |
| banana | 1 |

Whenever a word is found through an exact search, its frequency increases by one. These frequencies are also used to rank suggestions.

### 3. List and Sorting

Words matching a prefix are collected into a list and sorted by:

1. Search frequency, from highest to lowest.
2. Alphabetical order when frequencies are equal.

The application then returns up to the requested number of suggestions.

## How It Works

### Searching a Word

The application checks whether the entered word exists in the dictionary. If it does, the result is `FOUND` and its search frequency increases. Otherwise, the result is `NOT FOUND`.

### Getting Suggestions

The user enters a prefix and a limit, such as `app` and `5`. The Trie finds matching words, and the application sorts them by frequency and alphabetical order before displaying the results.

### Adding a Word

If the word is new, it is added to the dictionary with an initial frequency of `1`. If it already exists, the application returns `already exists`.

## Project Structure

```text
DictionarySearchSystem/
├── Main.java
├── Dictionary.java
├── Trie.java
├── WebServer.java
├── README.md
└── frontend/
    ├── index.html
    ├── style.css
    └── script.js
```

- `Main.java` – Entry point for the console version.
- `Dictionary.java` – Handles searching, adding words, and tracking frequencies.
- `Trie.java` – Implements the Trie used for prefix searches.
- `WebServer.java` – Handles API requests and serves the web interface.
- `frontend/index.html` – Contains the page structure.
- `frontend/style.css` – Contains the styling.
- `frontend/script.js` – Connects the user interface to the backend.

## How to Run the Project

### Requirements

- Java JDK 21 or a compatible JDK.
- A web browser to use the UI.
- VS Code or another editor with terminal access (optional).

Check your Java installation:

```bash
java -version
javac -version
```

### Option 1: Run Through the Terminal

Open the project folder in a terminal and compile the Java files:

```bash
javac Main.java Dictionary.java Trie.java WebServer.java
```

Run the console application:

```bash
java Main
```

This starts the console version, where you can test the functionality supported by `Main.java`.

### Option 2: Run Through the Web UI

Compile the Java files if you have not already done so:

```bash
javac Main.java Dictionary.java Trie.java WebServer.java
```

Start the web server:

```bash
java WebServer
```

When the server starts successfully, the terminal displays a message indicating that it is listening on port `8081`.

Open the following URL in your browser:

**http://localhost:8081**

You can use the web interface to search for words, view prefix suggestions, and add new words.

**Important:** Keep the terminal running while using the web UI. Press `Ctrl + C` in the terminal to stop the server.

## Testing the API

The backend can also be tested through a browser or Postman.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/search?word=apple` | Search for a word |
| GET | `/api/add?word=orange` | Add a word |
| GET | `/api/suggest?prefix=app&k=5` | Get up to five suggestions |

For local testing, use `http://localhost:8081` as the base URL.

Example requests:

```text
http://localhost:8081/api/search?word=apple
http://localhost:8081/api/add?word=orange
http://localhost:8081/api/suggest?prefix=app&k=5
```

## Assumptions and Limitations

- Words are handled without considering letter case if the dictionary implementation normalizes them.
- Search frequency increases only when an exact search succeeds.
- Newly added words start with a frequency of `1`.
- Duplicate words are not added again.
- Suggestions are sorted by frequency, with alphabetical order used to break ties.
- The dictionary is stored in memory, so added words and search frequencies are not preserved when the application restarts.
- The application starts with sample words, including `apple`, `apply`, `application`, `applet`, and `banana`.

## Author

Developed as a programming assignment to practise Java, data structures, and basic frontend-backend integration.
