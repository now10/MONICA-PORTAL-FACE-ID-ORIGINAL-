<?php
// enroll.php
// Receives JSON with fields: user, nod, turn, mouth (base64 data URLs).
// Stores in faces/{user}/ as nod.png, turn.png, mouth.png
// Returns a JSON/text response.

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['user'])) {
    http_response_code(400);
    echo "❌ Invalid request";
    exit;
}

$user = preg_replace('/[^a-zA-Z0-9_\-]/', '_', $data['user']);
$dir = __DIR__ . "/faces/" . $user;
if (!is_dir($dir)) {
    mkdir($dir, 0755, true);
}

function saveDataUrl($dataUrl, $path) {
    if (!$dataUrl) return false;
    $parts = explode(',', $dataUrl, 2);
    if (count($parts) != 2) return false;
    $decoded = base64_decode($parts[1]);
    if ($decoded === false) return false;
    file_put_contents($path, $decoded);
    return true;
}

$results = [];
$results[] = saveDataUrl($data['nod'] ?? null, "$dir/nod.png");
$results[] = saveDataUrl($data['turn'] ?? null, "$dir/turn.png");
$results[] = saveDataUrl($data['mouth'] ?? null, "$dir/mouth.png");

if (in_array(true, $results)) {
    echo "✅ Enrolled successfully; stored images for user: $user";
} else {
    echo "❌ No valid images received";
}
?>
