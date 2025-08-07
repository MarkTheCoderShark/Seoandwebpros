<?php
// Router for PHP's built-in server
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = __DIR__ . $uri;

// Handle directory requests
if (is_dir($path)) {
    $path = rtrim($path, '/') . '/index.html';
}

// Handle .html extension
if (!file_exists($path) && file_exists($path . '.html')) {
    $path .= '.html';
}

// If file exists, serve it
if (file_exists($path)) {
    // Set content type based on file extension
    $ext = pathinfo($path, PATHINFO_EXTENSION);
    switch ($ext) {
        case 'html':
            header('Content-Type: text/html');
            break;
        case 'css':
            header('Content-Type: text/css');
            break;
        case 'js':
            header('Content-Type: application/javascript');
            break;
        case 'png':
            header('Content-Type: image/png');
            break;
        case 'jpg':
        case 'jpeg':
            header('Content-Type: image/jpeg');
            break;
        case 'gif':
            header('Content-Type: image/gif');
            break;
    }
    readfile($path);
    return true;
}

// If no file found, return 404
header('HTTP/1.1 404 Not Found');
echo '404 Not Found';
return true; 