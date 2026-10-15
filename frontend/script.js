
"use strict";
const $ = (id) => document.getElementById(id);
const searchForm = $("searchForm");
const searchWordInput = $("searchWord");
const searchResult = $("searchResult");
const suggestForm = $("suggestForm");
const prefixInput = $("prefix");
const limitInput = $("limit");
const suggestionList = $("suggestionList");
const addForm = $("addForm");
const newWordInput = $("newWord");
const addResult = $("addResult");
const searchButton = $("searchButton");
const suggestButton = $("suggestButton");
const addButton = $("addButton");
let searchController = null;
let suggestionController = null;
let addController = null;
let suggestionTimer = null;
function showMessage(element, message, type = "success") {
    element.textContent = message;
    element.className = `message ${type}`;
}
function hideMessage(element) {
    element.textContent = "";
    element.className = "message hidden";
}
async function requestJson(url, signal) {
    const response = await fetch(url, { signal });
    let data;
    try {
        data = await response.json();
    } catch {
        throw new Error("Invalid response from the Java server.");
    }
    if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
    }
    return data;
}
function setButtonLoading(button, loading, originalText, loadingText) {
    if (!button) return;
    button.disabled = loading;
    button.textContent = loading ? loadingText : originalText;
}
async function searchWord(word) {
    word = word.trim();
    if (!word) {
        showMessage(searchResult, "Please enter a word.", "error");
        return;
    }
    if (searchController) {
        searchController.abort();
    }
    searchController = new AbortController();
    const originalText = searchButton
        ? searchButton.textContent
        : "Search Word";
    setButtonLoading(
        searchButton,
        true,
        originalText,
        "Searching..."
    );
    showMessage(searchResult, "Searching the dictionary...", "loading");
    try {
        const data = await requestJson(
            `/api/search?word=${encodeURIComponent(word)}`,
            searchController.signal
        );

        if (data.result === "FOUND") {
            showMessage(
                searchResult,
                `✓ FOUND — ${data.word} | Frequency: ${data.frequency}`,
                "success"
            );
        } else {
            showMessage(
                searchResult,
                `✕ NOT FOUND — "${word}" is not in the dictionary.`,
                "error"
            );
        }
    } catch (error) {
        if (error.name !== "AbortError") {
            showMessage(
                searchResult,
                error.message || "Unable to search. Check the server.",
                "error"
            );
        }
    } finally {
        if (searchController &&
            !searchController.signal.aborted) {
            setButtonLoading(
                searchButton,
                false,
                originalText,
                "Searching..."
            );
        }
    }
}
searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    searchWord(searchWordInput.value);
});
searchWordInput.addEventListener("input", () => {
    hideMessage(searchResult);
});
function renderEmpty(message) {
    suggestionList.replaceChildren();
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = message;
    suggestionList.appendChild(empty);
    suggestionList.setAttribute("aria-busy", "false");
}
function renderLoading(message = "Finding the best matches...") {
    suggestionList.replaceChildren();
    const loading = document.createElement("p");
    loading.className = "empty-state";
    loading.textContent = message;
    suggestionList.appendChild(loading);
    suggestionList.setAttribute("aria-busy", "true");
}
async function loadSuggestions(prefix, k, live = false) {
    prefix = prefix.trim();
    if (!prefix) {
        renderEmpty("Start typing a prefix to discover words.");
        return;
    }
    if (!Number.isInteger(k) || k < 1 || k > 100) {
        renderEmpty("Enter a maximum (k) between 1 and 100.");
        return;
    }
    if (suggestionController) {
        suggestionController.abort();
    }
    suggestionController = new AbortController();
    if (!live) {
        renderLoading();
    }
    suggestionList.setAttribute("aria-busy", "true");
    try {
        const data = await requestJson(
            `/api/suggest?prefix=${encodeURIComponent(prefix)}&k=${k}`,
            suggestionController.signal
        );
        renderSuggestions(data.suggestions || []);
    } catch (error) {
        if (error.name !== "AbortError") {
            renderEmpty(
                error.message || "Unable to load suggestions."
            );
        }
    }
}
function renderSuggestions(suggestions) {
    suggestionList.replaceChildren();
    suggestionList.setAttribute("aria-busy", "false");
    if (suggestions.length === 0) {
        renderEmpty("No matching words found. Try another prefix.");
        return;
    }
    suggestions.forEach((item, index) => {
        const row = document.createElement("button");
        row.type = "button";
        row.className = "suggestion-item";
        row.setAttribute(
            "aria-label",
            `Search for ${item.word}, frequency ${item.frequency}`
        );
        const rank = document.createElement("span");
        rank.className = "rank";
        rank.textContent = String(index + 1);
        const info = document.createElement("span");
        info.className = "word-info";
        const word = document.createElement("span");
        word.className = "word-name";
        word.textContent = item.word;
        const description = document.createElement("span");
        description.className = "word-meta";
        description.textContent = "Click to search this word";
        info.append(word, description);
        const frequency = document.createElement("span");
        frequency.className = "frequency";
        frequency.textContent = `Frequency: ${item.frequency}`;
        row.append(rank, info, frequency);
        row.addEventListener("click", () => {
            searchWordInput.value = item.word;
            searchWord(item.word);
            searchWordInput.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
            searchWordInput.focus({ preventScroll: true });
        });
        suggestionList.appendChild(row);
    });
}
suggestForm.addEventListener("submit", (event) => {
    event.preventDefault();
    clearTimeout(suggestionTimer);
    loadSuggestions(
        prefixInput.value,
        Number(limitInput.value)
    );
});
prefixInput.addEventListener("input", () => {
    clearTimeout(suggestionTimer);
    const prefix = prefixInput.value.trim();
    const k = Number(limitInput.value);
    if (!prefix) {
        if (suggestionController) {
            suggestionController.abort();
        }
        renderEmpty("Start typing a prefix to discover words.");
        return;
    }
    suggestionTimer = setTimeout(() => {
        loadSuggestions(prefix, k, true);
    }, 250);
});
limitInput.addEventListener("change", () => {
    if (prefixInput.value.trim()) {
        loadSuggestions(
            prefixInput.value,
            Number(limitInput.value)
        );
    }
});
function setPrefix(prefix) {
    prefixInput.value = prefix;
    loadSuggestions(
        prefix,
        Number(limitInput.value)
    );
    prefixInput.focus();
}
document.querySelectorAll(".chip[data-prefix]").forEach((button) => {
    button.addEventListener("click", () => {
        setPrefix(button.dataset.prefix);
    });
});
addForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const word = newWordInput.value.trim();
    if (!word) {
        showMessage(addResult, "Please enter a word.", "error");
        return;
    }
    if (addController) {
        addController.abort();
    }
    addController = new AbortController();
    const originalText = addButton
        ? addButton.textContent
        : "+ Add Word";
    setButtonLoading(
        addButton,
        true,
        originalText,
        "Adding..."
    );
    hideMessage(addResult);
    try {
        const data = await requestJson(
            `/api/add?word=${encodeURIComponent(word)}`,
            addController.signal
        );
        if (data.message === "Word added successfully") {
            showMessage(
                addResult,
                `✓ ${data.word} added successfully! Frequency: ${data.frequency}`,
                "success"
            );
            newWordInput.value = "";
            if (prefixInput.value.trim()) {
                loadSuggestions(
                    prefixInput.value,
                    Number(limitInput.value),
                    true
                );
            }
        } else if (data.message === "already exists") {
            showMessage(
                addResult,
                `ℹ "${data.word}" already exists. Frequency: ${data.frequency}`,
                "error"
            );
        } else {
            showMessage(
                addResult,
                data.message || "Unable to add this word.",
                "error"
            );
        }
    } catch (error) {
        if (error.name !== "AbortError") {
            showMessage(
                addResult,
                error.message || "Unable to add the word.",
                "error"
            );
        }
    } finally {
        if (addController &&
            !addController.signal.aborted) {
            setButtonLoading(
                addButton,
                false,
                originalText,
                "Adding..."
            );
        }
    }
});
newWordInput.addEventListener("input", () => {
    hideMessage(addResult);
});
renderEmpty("Start typing a prefix to discover words.");
