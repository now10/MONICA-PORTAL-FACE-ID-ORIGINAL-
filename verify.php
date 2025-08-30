<?php
// verify.php
// Expects JSON: user, nod, turn, mouth (base64). We'll use mouth or last available as login image
// Saves a temp login image and runs Python compare script.
// The python script should return "MATCH" or "NO MATCH" (plain text)

// Basic input parsing
$data = json_decode(file_get_contents("php://input"), true);
if (!$data || !isset($data['user'])) {
    http_response_code(400);
    echo "❌ Invalid request";
    exit;
}

$user = preg_replace('/[^a-zA-Z0-9_\-]/', '_', $data['user']);
$dir = __DIR__ . "/faces/" . $user;
if (!is_dir($dir)) {
    echo "❌ User not enrolled";
    exit;
}

// choose best login candidate to verify: prefer mouth > nod > turn
$loginImgData = $data['mouth'] ?? $data['nod'] ?? $data['turn'] ?? null;
if (!$loginImgData) {
    echo "❌ No login image provided";
    exit;
}

// save temp login file
$tempPath = "$dir/temp_login_".time().".png";
$parts = explode(',', $loginImgData, 2);
if (count($parts) != 2) {
    echo "❌ Invalid image data";
    exit;
}
$decoded = base64_decode($parts[1]);
if ($decoded === false) {
    echo "❌ Image decode failed";
    exit;
}
file_put_contents($tempPath, $decoded);

// Call python script - pass enrolled dir and temp path
$escapedDir = escapeshellarg($dir);
$escapedTemp = escapeshellarg($tempPath);
$cmd = "python3 compare_faces.py $escapedDir $escapedTemp 2>&1";
$output = shell_exec($cmd);

// Clean up temp file after comparison (optional, but nice)
@unlink($tempPath);

// Process python output
if (strpos($output, "MATCH") !== false) {
    echo "✅ Face recognized. Access granted!";
} else if (strpos($output, "NO MATCH") !== false) {
    echo "❌ Face not recognized. Try again kindly.";
} else {
    // unexpected / error
    echo "❌ Verification error: " . trim($output);
}
?>
