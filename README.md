# Dictionary Search & Auto-Suggestion System

## Overview

The **Dictionary Search & Auto-Suggestion System** is a Java-based application that allows users to search for words, receive prefix-based suggestions, and add new words to a dictionary. It tracks the search frequency of each word and ranks suggestions based on popularity.

The project uses a **Trie data structure** for efficient prefix-based searching and a **HashMap** to store word frequencies. It includes a web-based user interface built with HTML, CSS, and JavaScript, connected to a lightweight HTTP server implemented using Java's built-in HTTP server API.

## Features

- **Exact Word Search:** Checks whether a word exists in the dictionary and returns `FOUND` or `NOT FOUND`.
- **Search Frequency Tracking:** Increments the frequency of a word whenever an exact search succeeds.
- **Auto-Suggestions:** Returns words beginning with a specified prefix.
- **Frequency-Based Ranking:** Displays suggestions in descending order of search frequency.
- **Alphabetical Tie-Breaking:** Sorts words alphabetically when their search frequencies are equal.
- **Configurable Suggestion Limit:** Allows users to specify the maximum number of suggestions.
- **Add New Words:** Adds new words with an initial frequency of 1.
- **Duplicate Word Handling:** Displays `already exists` when a word is already present.
- **Interactive Web Interface:** Provides forms for searching, adding words, and viewing live prefix suggestions.
- **Input Normalization:** Trims surrounding whitespace and converts words to lowercase for case-insensitive operations.

## Technologies Used

- **Java (JDK 21):** Core application logic and HTTP server.
- **HTML5:** Web page structure.
- **CSS3:** Styling and responsive layout.
- **JavaScript:** Frontend interactions and API requests.
- **Data Structures:** Trie and HashMap.
- **HTTP API:** Java's built-in `com.sun.net.httpserver.HttpServer`.

No external Java libraries or web frameworks are required.

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

### File Descriptions

- **Main.java:** Provides the console-based entry point for testing dictionary operations.
- **Dictionary.java:** Implements word storage, exact search, frequency tracking, adding words, and suggestion ranking.
- **Trie.java:** Implements the Trie data structure used for prefix-based word retrieval.
- **WebServer.java:** Starts the HTTP server, handles API requests, and serves frontend files.
- **frontend/index.html:** Defines the user interface.
- **frontend/style.css:** Provides styling and responsive layout.
- **frontend/script.js:** Handles user interactions and communicates with the backend.
- **README.md:** Documents the project and instructions for running and testing it.

## Data Structures Used

### 1. Trie

A Trie is a tree-like data structure used to store words character by character.

Each node contains references to its child nodes, and complete words are marked at their ending nodes.

**Why it is used:**
- Efficiently locates the node corresponding to a given prefix.
- Retrieves words that begin with a particular prefix.
- Avoids scanning every dictionary word to identify matching prefixes.

**Operations:**
- Insert a word into the Trie.
- Locate a prefix.
- Collect complete words below the prefix node.

### 2. HashMap

A HashMap stores each word and its search frequency as a key-value pair.

Example:

```text
apple  -> 3
app     -> 2
application -> 1
```

**Why it is used:**
- Provides efficient average-case lookup and update operations.
- Tracks how often each word is searched successfully.
- Supplies the frequency values needed to rank suggestions.

### 3. List and Sorting

The words matching a prefix are collected into a list and sorted using the following rules:

1. Higher search frequency comes first.
2. If frequencies are equal, words are sorted alphabetically.
3. Only the first `k` results are returned.

## How the System Works

### Exact Search

1. The input word is trimmed and converted to lowercase.
2. The system checks whether the word exists in the dictionary.
3. If found, its search frequency is incremented by one and the result is `FOUND`.
4. Otherwise, the result is `NOT FOUND`.

### Prefix Suggestions

1. The input prefix is normalized.
2. The Trie locates the node representing the prefix.
3. The system collects complete words beginning with that prefix.
4. Matching words are sorted by descending search frequency.
5. Alphabetical order is used to break ties.
6. The system returns no more than `k` suggestions.

### Adding a Word

1. The input word is trimmed and converted to lowercase.
2. If the word already exists, the system returns `already exists`.
3. Otherwise, the word is inserted into the Trie and its frequency is initialized to `1`.

## Getting Started

### Prerequisites

- Java Development Kit (JDK) 21 or compatible JDK.
- Visual Studio Code or another Java-compatible editor.
- A modern web browser.

Verify your Java installation:

```bash
java -version
javac -version
```

### Installation

Clone the repository:

```bash
git clone https://github.com/harshhita2/Dictionary-Search-Auto-Suggestion.git
```

Navigate to the project directory:

```bash
cd Dictionary-Search-Auto-Suggestion
```

### Compile the Java Files

Run the following command from the project root:

```bash
javac Main.java Dictionary.java Trie.java WebServer.java
```

### Run the Web Application

Start the HTTP server:

```bash
java WebServer
```

When the server starts successfully, the terminal displays:

```text
Server running at http://localhost:8081
```

Open the application in your browser:

**http://localhost:8081**

Keep the terminal running while using the web application. Press `Ctrl + C` in the terminal to stop the server.

> **Note:** If port 8081 is already occupied, update the port in `WebServer.java` and use the corresponding URL.

### Run the Console Application

To run the console entry point instead of the web application:

```bash
java Main
```

## API Endpoints

The backend exposes the following HTTP endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/search?word=apple` | Searches for an exact word. |
| GET | `/api/add?word=orange` | Adds a new word. |
| GET | `/api/suggest?prefix=app&k=5` | Retrieves up to five suggestions. |

### Example Responses

**1. Exact search — word found**

```json
{
  "result": "FOUND",
  "word": "apple",
  "frequency": 2
}
```

**2. Exact search — word not found**

```json
{
  "result": "NOT FOUND",
  "word": "xyz",
  "frequency": 0
}
```

**3. Add a new word**

```json
{
  "message": "Word added successfully",
  "word": "orange",
  "frequency": 1
}
```

**4. Add an existing word**

```json
{
  "message": "already exists",
  "word": "apple"
}
```

**5. Prefix suggestions**

```json
{
  "suggestions": [
    {
      "word": "apple",
      "frequency": 3
    },
    {
      "word": "application",
      "frequency": 2
    },
    {
      "word": "app",
      "frequency": 1
    }
  ]
}
```

These are illustrative response examples; actual frequencies and results depend on the words stored and searches performed.

## Testing

The following scenarios can be used to verify the application:

| Test Case | Action | Expected Result |
|---|---|---|
| Search existing word | Search for a word in the dictionary | `FOUND`; frequency increases |
| Search missing word | Search for a word that does not exist | `NOT FOUND` |
| Add new word | Add a word not in the dictionary | Word added with frequency `1` |
| Add duplicate word | Add an existing word | `already exists` |
| Prefix search | Enter a prefix such as `app` | Matching words are returned |
| Frequency ranking | Search one matching word repeatedly | It ranks higher than less frequently searched words |
| Tie-breaking | Compare words with equal frequencies | Alphabetical order is used |
| No matching prefix | Enter a prefix with no matches | Empty suggestion list |
| Suggestion limit | Request `k = 3` | At most three suggestions |

## Assumptions and Limitations

- Word matching is case-insensitive.
- Leading and trailing whitespace is ignored.
- Search frequency increases only when an exact search succeeds.
- Newly added words start with a frequency of `1`.
- Duplicate words are not inserted again.
- Suggestions are ranked by frequency, with alphabetical tie-breaking.
- The suggestion limit is controlled by `k`.
- The dictionary is maintained in application memory unless persistent storage is implemented separately.
- No external database is required for the current implementation.
- Search frequencies and newly added words may be lost when the application restarts if file or database persistence is not implemented.

## Future Improvements

- Persist dictionary words and frequencies using a database or file storage.
- Add spell-checking and fuzzy matching.
- Optimize suggestion ranking for very large dictionaries.
- Add automated unit and integration tests.
- Introduce dictionary import and export functionality.

## Author

Developed as a project demonstrating data structures, Java programming, HTTP API development, and frontend-backend integration.

## License

This project was developed for educational and demonstration purposes.
