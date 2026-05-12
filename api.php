<?php
$file = 'storage.json';

$action = $_GET['action'] ?? '';

if ($action === 'save') {
    saveData($file);
} elseif ($action === 'load') {
    loadData($file);
} else {
    echo json_encode(["error" => "Invalid action"]);
}

function saveData($file) {
    $json = file_get_contents('php://input');
    if ($json) {
        file_put_contents($file, $json);
        echo json_encode(["status" => "saved"]);
    }
}

function loadData($file) {
    header('Content-Type: application/json');
    if (!file_exists($file) || filesize($file) == 0) {
        echo "[]";
    } else {
        echo file_get_contents($file);
    }
}
?>