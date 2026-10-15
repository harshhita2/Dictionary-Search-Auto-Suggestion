import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class WebServer {

    private static final Dictionary dictionary = new Dictionary();
    private static final Path FRONTEND =
            Path.of("frontend").toAbsolutePath().normalize();

    public static void main(String[] args) throws IOException {

        // Initial sample words
        dictionary.addWord("apple");
        dictionary.addWord("apply");
        dictionary.addWord("application");
        dictionary.addWord("applet");
        dictionary.addWord("banana");

        HttpServer server = HttpServer.create(
                new InetSocketAddress(8081), 0);

        // Search a word
        server.createContext("/api/search", exchange -> {
            if (!exchange.getRequestMethod().equals("GET")) {
                sendJson(exchange, 405,
                        "{\"error\":\"GET method required\"}");
                return;
            }

            String word = getParams(exchange).getOrDefault("word", "");
            String result = dictionary.searchWord(word);

            int frequency = result.equals("FOUND")
                    ? dictionary.getFrequency(word) : 0;

            sendJson(exchange, 200,
                    "{\"result\":\"" + result
                    + "\",\"word\":\"" + jsonEscape(word.trim())
                    + "\",\"frequency\":" + frequency + "}");
        });

        // Add a word
        server.createContext("/api/add", exchange -> {
            if (!exchange.getRequestMethod().equals("GET")) {
                sendJson(exchange, 405,
                        "{\"error\":\"GET method required\"}");
                return;
            }

            String word = getParams(exchange)
                    .getOrDefault("word", "").trim();

            if (word.isEmpty()) {
                sendJson(exchange, 400,
                        "{\"error\":\"Please enter a word\"}");
                return;
            }

            String message = dictionary.addWord(word);
            int frequency = dictionary.getFrequency(word);

            sendJson(exchange, 200,
                    "{\"message\":\"" + jsonEscape(message)
                    + "\",\"word\":\"" + jsonEscape(word)
                    + "\",\"frequency\":" + frequency + "}");
        });

        // Get prefix suggestions
        server.createContext("/api/suggest", exchange -> {
            if (!exchange.getRequestMethod().equals("GET")) {
                sendJson(exchange, 405,
                        "{\"error\":\"GET method required\"}");
                return;
            }

            Map<String, String> params = getParams(exchange);
            String prefix = params.getOrDefault("prefix", "");

            int k;
            try {
                k = Integer.parseInt(params.getOrDefault("k", "5"));
            } catch (NumberFormatException e) {
                k = 5;
            }

            if (k < 1 || k > 100) {
                sendJson(exchange, 400,
                        "{\"error\":\"k must be between 1 and 100\"}");
                return;
            }

            List<String> words = dictionary.suggest(prefix, k);
            StringBuilder json =
                    new StringBuilder("{\"suggestions\":[");

            for (int i = 0; i < words.size(); i++) {
                if (i > 0) {
                    json.append(",");
                }

                String word = words.get(i);
                json.append("{\"word\":\"")
                    .append(jsonEscape(word))
                    .append("\",\"frequency\":")
                    .append(dictionary.getFrequency(word))
                    .append("}");
            }

            json.append("]}");
            sendJson(exchange, 200, json.toString());
        });

        // Serve index.html, CSS and JavaScript
        server.createContext("/", exchange -> {
            if (!exchange.getRequestMethod().equals("GET")) {
                sendJson(exchange, 405,
                        "{\"error\":\"GET method required\"}");
                return;
            }

            String requestPath = exchange.getRequestURI().getPath();

            if (requestPath.equals("/")) {
                requestPath = "/index.html";
            }

            Path file = FRONTEND.resolve(
                    requestPath.substring(1)).normalize();

            if (!file.startsWith(FRONTEND)
                    || !Files.isRegularFile(file)) {
                byte[] data = "File not found"
                        .getBytes(StandardCharsets.UTF_8);

                exchange.sendResponseHeaders(404, data.length);
                try (OutputStream out = exchange.getResponseBody()) {
                    out.write(data);
                }
                return;
            }

            String contentType = "text/plain; charset=UTF-8";

            if (requestPath.endsWith(".html")) {
                contentType = "text/html; charset=UTF-8";
            } else if (requestPath.endsWith(".css")) {
                contentType = "text/css; charset=UTF-8";
            } else if (requestPath.endsWith(".js")) {
                contentType = "application/javascript; charset=UTF-8";
            }

            byte[] data = Files.readAllBytes(file);

            exchange.getResponseHeaders().set(
                    "Content-Type", contentType);

            exchange.sendResponseHeaders(200, data.length);

            try (OutputStream out = exchange.getResponseBody()) {
                out.write(data);
            }
        });

        server.start();
        System.out.println(
                "Server running at http://localhost:8081");
    }

    private static Map<String, String> getParams(
            HttpExchange exchange) {

        Map<String, String> params = new HashMap<>();
        String query = exchange.getRequestURI().getRawQuery();

        if (query != null) {
            for (String pair : query.split("&")) {
                String[] parts = pair.split("=", 2);

                String key = URLDecoder.decode(
                        parts[0], StandardCharsets.UTF_8);

                String value = parts.length > 1
                        ? URLDecoder.decode(
                                parts[1], StandardCharsets.UTF_8)
                        : "";

                params.put(key, value);
            }
        }

        return params;
    }

    private static void sendJson(
            HttpExchange exchange, int status, String json)
            throws IOException {

        byte[] data = json.getBytes(StandardCharsets.UTF_8);

        exchange.getResponseHeaders().set(
                "Content-Type", "application/json; charset=UTF-8");

        exchange.sendResponseHeaders(status, data.length);

        try (OutputStream out = exchange.getResponseBody()) {
            out.write(data);
        }
    }

    private static String jsonEscape(String value) {
        return value.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }
}