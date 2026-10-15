
const searchForm = document.getElementById("searchForm");
const searchWordInput = document.getElementById("searchWord");
const searchResult = document.getElementById("searchResult");

const suggestForm = document.getElementById("suggestForm");
const prefixInput = document.getElementById("prefix");
const limitInput = document.getElementById("limit");
const suggestionList = document.getElementById("suggestionList");

const addForm = document.getElementById("addForm");
const newWordInput = document.getElementById("newWord");
const addResult = document.getElementById("addResult");

// Display success or error messages.
function showMessage(element, message, success) {
    element.textContent = message;
    element.className = `message ${success ? "success" : "error"}`;
}

// Request data from the Java backend.
async function requestJson(url) {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
    }

    return data;
}

// 1. Search a word.
searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const word = searchWordInput.value.trim();
    if (!word) return;

    try {
        const data = await requestJson(
            `/api/search?word=${encodeURIComponent(word)}`
        );

        if (data.result === "FOUND") {
            showMessage(
                searchResult,
                `FOUND — ${data.word}, Frequency: ${data.frequency}`,
                true
            );
        } else {
            showMessage(
                searchResult,
                `NOT FOUND — "${word}" is not in the dictionary.`,
                false
            );
        }
    } catch (error) {
        showMessage(searchResult, error.message, false);
    }
});

// 2. Get prefix-based suggestions.
suggestForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const prefix = prefixInput.value.trim();
    const k = Number(limitInput.value);

    if (!prefix) {
        renderEmpty("Please enter a prefix.");
        return;
    }

    if (!Number.isInteger(k) || k < 1 || k > 100) {
        renderEmpty("Enter a maximum (k) between 1 and 100.");
        return;
    }

    renderEmpty("Loading suggestions...");

    try {
        const data = await requestJson(
            `/api/suggest?prefix=${encodeURIComponent(prefix)}&k=${k}`
        );

        renderSuggestions(data.suggestions || []);
    } catch (error) {
        renderEmpty(error.message);
    }
});

function renderEmpty(message) {
    suggestionList.replaceChildren();

    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = message;

    suggestionList.appendChild(empty);
}

function renderSuggestions(suggestions) {
    suggestionList.replaceChildren();

    if (suggestions.length === 0) {
        renderEmpty("No words match this prefix.");
        return;
    }

    suggestions.forEach((item, index) => {
        const row = document.createElement("div");
        row.className = "suggestion-item";

        const rank = document.createElement("div");
        rank.className = "rank";
        rank.textContent = String(index + 1);

        const info = document.createElement("div");
        info.className = "word-info";

        const word = document.createElement("div");
        word.className = "word-name";
        word.textContent = item.word;

        const description = document.createElement("div");
        description.className = "word-meta";
        description.textContent = "Prefix match";

        info.append(word, description);

        const frequency = document.createElement("div");
        frequency.className = "frequency";
        frequency.textContent = `Frequency: ${item.frequency}`;

        row.append(rank, info, frequency);
        suggestionList.appendChild(row);
    });
}

// 3. Add a word.
addForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const word = newWordInput.value.trim();
    if (!word) return;

    try {
        const data = await requestJson(
            `/api/add?word=${encodeURIComponent(word)}`
        );

        const success = data.message === "Word added successfully";

        let message;

        if (success) {
            message =
                `${data.message}: ${data.word} (Frequency: ${data.frequency})`;
            newWordInput.value = "";
        } else if (data.message === "already exists") {
            message =
                `already exists: ${data.word} (Frequency: ${data.frequency})`;
        } else {
            message = data.message;
        }

        showMessage(addResult, message, success);
    } catch (error) {
        showMessage(addResult, error.message, false);
    }
});
