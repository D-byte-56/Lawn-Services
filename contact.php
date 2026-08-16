<?php
/*
 * Formulario de contacto — EV Lawncare GA Inc
 * Para hosting con PHP (SiteGround). Recibe el POST del formulario, valida y
 * sanea del lado del servidor, y envía el correo a la empresa con mail().
 * En GitHub Pages este archivo NO corre (GitHub no ejecuta PHP): allí se usa
 * Formspree. Ver DESPLIEGUE.md.
 */

// ---- CONFIGURACIÓN ----------------------------------------------------
$DEST = 'info@evlawncaregainc.net';        // a dónde llegan los mensajes
$FROM = 'no-reply@evlawncaregainc.net';    // remitente técnico (debe existir en el dominio)
// -----------------------------------------------------------------------

// Solo se aceptan envíos POST
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
  http_response_code(405);
  exit('Method Not Allowed');
}

// ¿El cliente espera JSON (envío por fetch) o una navegación normal (sin JS)?
$wantsJson = isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false;

function respond($ok, $msg, $wantsJson) {
  if ($wantsJson) {
    header('Content-Type: application/json; charset=UTF-8');
    http_response_code($ok ? 200 : 400);
    echo json_encode(['ok' => $ok, 'message' => $msg]);
  } else {
    if ($ok) {
      header('Location: contact.html?sent=1');
    } else {
      http_response_code(400);
      echo htmlspecialchars($msg, ENT_QUOTES, 'UTF-8');
    }
  }
  exit;
}

// ---- ANTI-SPAM: honeypot ----------------------------------------------
// El campo "company" está oculto: una persona lo deja vacío, un bot lo llena.
if (!empty($_POST['company'])) {
  respond(true, 'ok', $wantsJson); // fingimos éxito y NO enviamos nada
}

// ---- LIMPIAR ENTRADAS -------------------------------------------------
// Quita saltos de línea (evita inyección de cabeceras), etiquetas y exceso de largo.
function clean_line($v, $max) {
  $v = trim((string)($v ?? ''));
  $v = str_replace(["\r", "\n", "\t"], ' ', $v);
  $v = strip_tags($v);
  return mb_substr($v, 0, $max);
}
$name    = clean_line($_POST['name']    ?? '', 80);
$phone   = clean_line($_POST['phone']   ?? '', 20);
$email   = clean_line($_POST['email']   ?? '', 120);
$zip     = clean_line($_POST['zip']     ?? '', 5);
$service = clean_line($_POST['service'] ?? '', 40);
$message = trim(strip_tags((string)($_POST['message'] ?? '')));
$message = mb_substr($message, 0, 1200);

// ---- VALIDAR (mismo criterio que el navegador) ------------------------
$errors = [];
if ($name === '')                                          $errors[] = 'name';
if (strlen(preg_replace('/[^0-9]/', '', $phone)) < 10)     $errors[] = 'phone';
if (!filter_var($email, FILTER_VALIDATE_EMAIL))            $errors[] = 'email';
if (!preg_match('/^[0-9]{5}$/', $zip))                     $errors[] = 'zip';
if ($service === '')                                       $errors[] = 'service';
if ($errors) {
  respond(false, 'Please check these fields: ' . implode(', ', $errors), $wantsJson);
}

// ---- ARMAR Y ENVIAR EL CORREO -----------------------------------------
$emailSafe = filter_var($email, FILTER_SANITIZE_EMAIL);
$ipSafe    = preg_replace('/[^0-9a-f:.]/i', '', $_SERVER['REMOTE_ADDR'] ?? '?');

$subject = 'New estimate request — ' . $service . ' (' . $zip . ')';
$body  = "New free-estimate request from the website:\n\n";
$body .= "Name:    $name\n";
$body .= "Phone:   $phone\n";
$body .= "Email:   $emailSafe\n";
$body .= "ZIP:     $zip\n";
$body .= "Service: $service\n";
$body .= "Message:\n" . ($message !== '' ? $message : '(none)') . "\n\n";
$body .= 'Sent ' . date('Y-m-d H:i') . ' from ' . $ipSafe;

$headers  = "From: EV Lawncare Website <$FROM>\r\n";
$headers .= "Reply-To: $emailSafe\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/EVLawncare\r\n";

$sent = @mail($DEST, $subject, $body, $headers);
respond($sent, $sent ? 'Thanks — we got it.' : 'Mail server error. Please call (678) 698-4043.', $wantsJson);
