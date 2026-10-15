
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
public class Trie {
    private static class TrieNode {
        private final Map<Character, TrieNode> children =
                new HashMap<>();
        private boolean endOfWord;
    }
    private final TrieNode root = new TrieNode();
    public void insert(String word) {
        TrieNode current = root;
        for (char ch : word.toCharArray()) {
            current.children.putIfAbsent(ch, new TrieNode());
            current = current.children.get(ch);
        }
        current.endOfWord = true;
    }
    public List<String> getWordsWithPrefix(String prefix) {
        List<String> words = new ArrayList<>();
        TrieNode current = root;
        for (char ch : prefix.toCharArray()) {
            current = current.children.get(ch);
            if (current == null) {
                return words;
            }
        }
        collectWords(current, new StringBuilder(prefix), words);
        return words;
    }
    private void collectWords(
            TrieNode node,
            StringBuilder currentWord,
            List<String> words) {
        if (node.endOfWord) {
            words.add(currentWord.toString());
        }
        for (Map.Entry<Character, TrieNode> entry
                : node.children.entrySet()) {
            currentWord.append(entry.getKey());
            collectWords(
                    entry.getValue(),
                    currentWord,
                    words
            );
            currentWord.deleteCharAt(currentWord.length() - 1);
        }
    }
}
