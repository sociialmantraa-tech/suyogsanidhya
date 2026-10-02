<?php
/**
 * Database connection provider using PDO.
 */

class Database {
    private static $instance = null;
    private $conn;

    private function __construct() {
        $config = require __DIR__ . '/env.php';
        $dbConfig = $config['db'];

        $port = isset($dbConfig['port']) ? ";port={$dbConfig['port']}" : "";
        $dsn = "mysql:host={$dbConfig['host']}{$port};dbname={$dbConfig['dbname']};charset={$dbConfig['charset']}";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        try {
            $this->conn = new PDO($dsn, $dbConfig['username'], $dbConfig['password'], $options);
        } catch (PDOException $e) {
            // Secure error handling for production (do not expose credentials)
            if ($config['env'] === 'production') {
                error_log("Database Connection Error: " . $e->getMessage());
                http_response_code(500);
                echo json_encode(["error" => "Internal Server Error: Database Connection Failed."]);
                exit;
            } else {
                throw new PDOException($e->getMessage(), (int)$e->getCode());
            }
        }
    }

    public static function getInstance() {
        if (self::$instance == null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getConnection() {
        return $this->conn;
    }
}
