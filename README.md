# Dictionary Search & Auto-Suggestion System

## About the Project

This project is a simple dictionary application built using Java. It allows users to check whether a word exists, add new words, and get suggestions while typing a prefix.

I also built a small web interface using HTML, CSS, and JavaScript so that the features can be tested through a browser instead of only using the terminal.

The main goal of this project is to implement dictionary operations using suitable data structures and keep track of how frequently each word is searched.

## Features

- Search for a word and get `FOUND` or `NOT FOUND`.
- Increase the search frequency whenever an existing word is searched successfully.
- Get suggestions based on the prefix entered by the user.
- Show frequently searched words first.
- Use alphabetical order when two words have the same frequency.
- Add new words to the dictionary.
- Display `already exists` if a word has already been added.
- Choose the maximum number of suggestions to display.
- Use the application through a web interface.

## Technologies Used

- Java (JDK 21)
- HTML
- CSS
- JavaScript
- Java's built-in HTTP server

No external Java libraries or web frameworks are used.

## Data Structures

### 1. Trie

I used a Trie to store words character by character. It helps find words that start with a particular prefix without checking every word in the dictionary.

For example, when the user enters `app`, the Trie can retrieve words such as `apple`, `apply`, and `application`.

### 2. HashMap

A HashMap stores each word along with its search frequency.

For example:

| Word | Frequency |
|---|---:|
| apple | 3 |
| apply | 2 |
| banana | 1 |

Whenever a word is found through an exact search, its frequency increases by one. These frequencies are also used to rank suggestions.

### 3. List and Sorting

The matching words are collected into a list and sorted by:
1. Search frequency, from highest to lowest.
2. Alphabetical order when frequencies are equal.

The application then returns up to the number of suggestions requested by the user.

## How It Works

### Searching a Word

The application checks whether the entered word exists in the dictionary. If it does, the result is `FOUND` and its search frequency increases. Otherwise, the result is `NOT FOUND`.

### Getting Suggestions

The user enters a prefix and a limit, such as `app` and `5`. The Trie finds matching words, and the application sorts them by frequency and alphabetical order before displaying the results.

### Adding a Word

If the word is new, it is added to the dictionary with an initial frequency of `1`. If it already exists, the application returns `already exists` instead of adding it again.

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

Make sure Java JDK 21 or a compatible JDK is installed.

Check your installation using:

```bash
java -version
javac -version
```

### Step 1: Open the project folder

Open the project folder in VS Code and start a terminal in the root directory.

### Step 2: Compile the Java files

```bash
javac Main.java Dictionary.java Trie.java WebServer.java
```

### Step 3: Start the web server

```bash
java WebServer
```

When the server starts, the terminal should display a message indicating that it is listening on port `8081`.

### Step 4: Open the application

Open the following URL in your browser:

http://localhost:8081

Keep the terminal running while using the website. Press `Ctrl + C` to stop the server.

### Running the Console Version

To run the console entry point instead, use:

```bash
java Main
```

## Testing the API

The application can also be tested through a browser or Postman.

| Endpoint | Purpose |
|---|---|
| `GET /api/search?word=apple` | Search for a word |
| `GET /api/add?word=orange` | Add a word |
| `GET /api/suggest?prefix=app&k=5` | Get up to five suggestions |

For local testing, use `http://localhost:8081` as the base URL.

For example:

```text
http://localhost:8081/api/search?word=apple
http://localhost:8081/api/add?word=orange
http://localhost:8081/api/suggest?prefix=app&k=5
```

## Assumptions and Limitations

- Words are handled without considering letter case, provided the dictionary implementation normalizes them.
- The search frequency increases only when an exact search succeeds.
- Newly added words start with a frequency of `1`.
- Duplicate words are not added again.
- Suggestions are sorted by frequency, with alphabetical order used to break ties.
- The dictionary is stored in memory, so added words and search frequencies are not preserved when the application restarts.
- The application starts with a few sample words, including `apple`, `apply`, `application`, `applet`, and `banana`.

## Author

Developed as a programming assignment to practise Java, data structures, and basic frontend-backend integration.
