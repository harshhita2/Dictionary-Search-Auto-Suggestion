
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Dictionary {
    private final Map<String, Integer> frequencies =
            new HashMap<>();
    private final Trie trie = new Trie();
    private String normalize(String word) {
        return word == null ? "" : word.trim().toLowerCase();
    }
    public String addWord(String input) {
        String word = normalize(input);
        if (word.isEmpty()) {
            return "Word cannot be empty";
        }
        if (frequencies.containsKey(word)) {
            return "already exists";
        }
        frequencies.put(word, 1);
        trie.insert(word);
        return "Word added successfully";
    }
    public String searchWord(String input) {
        String word = normalize(input);
        if (frequencies.containsKey(word)) {
            frequencies.put(
                    word,
                    frequencies.get(word) + 1
            );
            return "FOUND";
        }
        return "NOT FOUND";
    }
    public List<String> suggest(String inputPrefix, int k) {
        String prefix = normalize(inputPrefix);

        if (k <= 0 || prefix.isEmpty()) {
            return new ArrayList<>();
        }
        List<String> suggestions =
                trie.getWordsWithPrefix(prefix);
        suggestions.sort(
                Comparator
                        .comparingInt(
                                (String word) ->
                                        frequencies.get(word)
                        )
                        .reversed()
                        .thenComparing(Comparator.naturalOrder())
        );
        if (suggestions.size() > k) {
            return new ArrayList<>(
                    suggestions.subList(0, k)
            );
        }
        return suggestions;
    }
    public int getFrequency(String input) {
        String word = normalize(input);
        return frequencies.getOrDefault(word, 0);
    }
}
