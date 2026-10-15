
import java.util.List;
import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Dictionary dictionary = new Dictionary();
        //sample words
        dictionary.addWord("apple");
        dictionary.addWord("apply");
        dictionary.addWord("application");
        dictionary.addWord("applet");
        dictionary.addWord("banana");
        boolean running = true;
        while (running) {
            System.out.println(
                    "\n===== Dictionary Search & Auto-Suggestion System ====="
            );
            System.out.println("1.Search Word");
            System.out.println("2.Add Word");
            System.out.println("3.Get Suggestions");
            System.out.println("4.Exit");
            System.out.print("Enter your choice: ");
            String choice = scanner.nextLine().trim();
            switch (choice) {
                case "1": {
                    System.out.print("Enter word to search: ");
                    String word = scanner.nextLine();
                    String result = dictionary.searchWord(word);
                    System.out.println(result);
                    if (result.equals("FOUND")) {
                        System.out.println(
                            "Frequency: " + dictionary.getFrequency(word)
                        );
                    }
                    break;
                }
                case "2": {
                    System.out.print("Enter word to add: ");
                    String word = scanner.nextLine();
                    System.out.println(
                            dictionary.addWord(word)
                    );
                    break;
                }
                case "3": {
                    System.out.print("Enter prefix: ");
                    String prefix = scanner.nextLine();
                    System.out.print(
                            "Enter maximum suggestions (k): "
                    );
                    String input = scanner.nextLine().trim();
                    try {
                        int k = Integer.parseInt(input);
                        List<String> suggestions =
                                dictionary.suggest(prefix, k);
                        System.out.println("Suggestions:");
                        if (suggestions.isEmpty()) {
                            System.out.println("[]");
                        } else {
                            for (String word : suggestions) {
                                System.out.println(word);
                            }
                        }
                    } catch (NumberFormatException e) {
                        System.out.println(
                                "Enter a valid integer for k."
                        );
                    }
                    break;
                }
                case "4":
                    running = false;
                    System.out.println("Exiting program...");
                    break;
                default:
                    System.out.println(
                            "Invalid choice. Enter 1, 2, 3, or 4."
                    );
            }
        }
        scanner.close();
    }
}
