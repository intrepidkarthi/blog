#!/usr/bin/env python3
"""Live API validation for all six lab notebooks' call patterns.

Run this ONCE before lab day, with your key:

    export GEMINI_API_KEY="..."        # from aistudio.google.com/app/apikey
    pip install google-genai pillow
    python3 instructor-notes/validate-live.py

Makes 6 tiny real calls with gemini-flash-latest (well under free-tier
limits). Every check maps to a
notebook: if all six pass, every API pattern the labs use works today.
"""
import os, sys, json, time, io

def main():
    key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    if not key:
        sys.exit("Set GEMINI_API_KEY first:  export GEMINI_API_KEY=...")
    from google import genai
    from google.genai import types
    client = genai.Client(api_key=key)
    MODEL = "gemini-flash-latest"  # the free tier's current Flash (July 2026 → Gemini 3.5 Flash); pin a dated id only if you need frozen behavior.
    EMBED = "gemini-embedding-2"
    results = []

    def check(name, fn, tries=3):
        t0 = time.time()
        for attempt in range(tries):
            try:
                detail = fn()
                results.append((name, True, f"{time.time()-t0:.1f}s", detail))
                return
            except Exception as e:
                transient = any(c in str(e) for c in ("503", "429", "UNAVAILABLE", "RESOURCE_EXHAUSTED"))
                if transient and attempt < tries - 1:
                    time.sleep(20 * (attempt + 1))   # same politeness the lab notebooks use
                    continue
                results.append((name, False, f"{time.time()-t0:.1f}s", f"{type(e).__name__}: {e}"))
                return

    # 1 · Labs 1/2/6 — basic generation
    def gen():
        r = client.models.generate_content(model=MODEL, contents="Reply with exactly: OK")
        assert r.text and len(r.text) < 50, r.text
        return f"text={r.text.strip()!r}"
    check("generate_content (L1/L2/L6)", gen)

    # 2 · Lab 1 — token counting
    def cnt():
        r = client.models.count_tokens(model=MODEL, contents="தேர்வு அடுத்த திங்கட்கிழமை")
        assert r.total_tokens > 0
        return f"tamil tokens={r.total_tokens}"
    check("count_tokens (L1)", cnt)

    # 3 · Lab 4 — embeddings at 768 dims
    def emb():
        r = client.models.embed_content(model=EMBED, contents=["pass mark", "50% aggregate"],
              config=types.EmbedContentConfig(output_dimensionality=768))
        v = r.embeddings[0].values
        assert len(v) == 768, f"got {len(v)} dims"
        return f"dims={len(v)}, 2 vectors"
    check(f"embed_content {EMBED} (L4)", emb)

    # 4 · Lab 3 Part B2 — guaranteed JSON via response_schema
    def schema():
        cfg = types.GenerateContentConfig(response_mime_type="application/json",
              response_schema={"type":"OBJECT","properties":{"city":{"type":"STRING"},"pop_millions":{"type":"NUMBER"}},"required":["city"]})
        r = client.models.generate_content(model=MODEL, contents="Madurai basic facts.", config=cfg)
        d = json.loads(r.text)
        assert "city" in d
        return f"parsed={d}"
    check("response_schema JSON (L3)", schema)

    # 5 · Lab 5 — function calling round trip
    def tools():
        decl = types.FunctionDeclaration(name="calculator",
              description="Evaluate a basic arithmetic expression.",
              parameters=types.Schema(type="OBJECT",
                properties={"expression": types.Schema(type="STRING")}, required=["expression"]))
        cfg = types.GenerateContentConfig(tools=[types.Tool(function_declarations=[decl])])
        r = client.models.generate_content(model=MODEL, contents="What is 23*19? Use the calculator.", config=cfg)
        fc = (r.function_calls or [None])[0]
        assert fc and fc.name == "calculator", f"no function_call, got text={r.text!r}"
        answer = str(eval(fc.args["expression"], {"__builtins__": {}}))  # trusted demo input
        follow = client.models.generate_content(model=MODEL, contents=[
            types.Content(role="user", parts=[types.Part(text="What is 23*19? Use the calculator.")]),
            r.candidates[0].content,
            types.Content(role="tool", parts=[types.Part.from_function_response(name="calculator", response={"result": answer})]),
        ], config=cfg)
        assert follow.text and "437" in follow.text
        return f"call={fc.args} -> final mentions 437"
    check("function calling loop (L5)", tools)

    # 6 · Lab 3 — vision on a generated image
    def vision():
        from PIL import Image
        im = Image.new("RGB", (120, 80), (200, 30, 30))
        buf = io.BytesIO(); im.save(buf, "PNG")
        part = types.Part.from_bytes(data=buf.getvalue(), mime_type="image/png")
        r = client.models.generate_content(model=MODEL, contents=[part, "One word: what colour is this image?"])
        assert r.text and "red" in r.text.lower(), r.text
        return f"colour={r.text.strip()!r}"
    check("vision input (L3)", vision)

    print("\n" + "=" * 62)
    ok = 0
    for name, passed, dt, detail in results:
        mark = "PASS" if passed else "FAIL"
        ok += passed
        print(f"{mark:4} | {dt:>5} | {name}\n     |       | {detail}")
    print("=" * 62)
    if ok < 6 and any("503" in d or "UNAVAILABLE" in d for _, p_, _, d in results if not p_):
        try:
            r = client.models.generate_content(model="gemini-flash-lite-latest", contents="Reply with exactly: OK")
            print("NOTE: failures look like capacity 503s — gemini-flash-lite-latest is healthy right now")
            print("      (answered %r). One-line fallback: MODEL = \"gemini-flash-lite-latest\"" % r.text.strip())
        except Exception:
            pass
    print(f"{ok}/6 live checks passed — " +
          ("labs are GO for delivery." if ok == 6 else "fix FAILs before lab day (see details above)."))
    sys.exit(0 if ok == 6 else 1)

if __name__ == "__main__":
    main()
