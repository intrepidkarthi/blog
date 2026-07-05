---
title: "porting sdp-transform to Java for WebRTC on Android"
date: 2020-11-05
slug: porting-sdp-transform-to-java-for-webrtc-android
excerpt: "SDP — Session Description Protocol, RFC 4566 — is the negotiation language of WebRTC. The JS and C++ libraries to parse it existed. Java did not. I ported one."
tags: [webrtc, sdp, android, java, rfc-4566, networking, open-source]
---

In October 2020 I needed a clean Session Description Protocol parser for an Android WebRTC project. Such a thing existed for JavaScript (`sdp-transform` on npm) and for C++ (`libsdptransform` by ibc). For Java on Android, there was nothing that exposed the same API at the same level of completeness.

I ported the C++ library to Java. The result is at [intrepidkarthi/libSDPtransform-android](https://github.com/intrepidkarthi/libSDPtransform-android). It parses SDP strings into structured `SessionDescription` objects and writes them back. The internal grammar is based on RFC 4566 (SDP) and RFC 5245 (ICE), with extensions for the dozens of WebRTC-specific attributes that have accumulated over the years.

Here is what SDP is, why parsing it correctly matters for WebRTC, and what porting the library taught me.

## what SDP is

SDP is a plain-text format used to describe multimedia sessions — what media types are being offered, what codecs each side supports, where the media should be sent, what cryptographic parameters are in use, what ICE candidates are available for NAT traversal.

A minimal SDP for a WebRTC audio session looks roughly like this:

```
v=0
o=- 6664106312341408180 2 IN IP4 127.0.0.1
s=-
t=0 0
a=group:BUNDLE 0
m=audio 52125 UDP/TLS/RTP/SAVPF 111 103 104 0 8
c=IN IP4 192.168.1.42
a=rtcp:9 IN IP4 0.0.0.0
a=candidate:2447636755 1 udp 2122260223 192.168.1.42 52125 typ host
a=ice-ufrag:a2rv
a=ice-pwd:BDGAC5wK2pqN7sZ2VuZIuNhn
a=fingerprint:sha-256 22:D8:AC:A3:36:D2:...
a=setup:actpass
a=mid:0
a=sendrecv
a=rtcp-mux
a=rtpmap:111 opus/48000/2
a=rtcp-fb:111 transport-cc
a=fmtp:111 minptime=10;useinbandfec=1
```

Each line is `<type>=<value>`. The line types are mostly one-character codes — `v` for version, `o` for origin, `s` for session name, `m` for media description, `a` for attribute, and so on. The attributes (`a=` lines) are where the complexity lives — `a=rtpmap`, `a=rtcp-fb`, `a=fmtp`, `a=candidate`, `a=ice-ufrag`, dozens of others.

For WebRTC specifically, the SDP is the *negotiation language*. Two peers exchange SDPs to agree on codecs, transport, encryption, and network candidates before any media flows. Parsing SDP correctly is what makes the negotiation work.

## why parsing it correctly matters

Three reasons WebRTC stacks need a real SDP parser, not regex.

**The grammar is recursive.** Some attributes have sub-fields with their own grammar. `a=fmtp:111 minptime=10;useinbandfec=1` has a payload type (`111`) followed by a parameter list, each with its own `key=value` structure. Regex falls over on the nested grammar.

**The attribute set is open.** New attributes get added with each WebRTC working draft. A parser that knows the structure of each attribute lets you handle the known ones precisely and pass through the unknown ones cleanly. A regex-based approach has to be rewritten for every new attribute.

**Round-tripping is required.** WebRTC implementations frequently parse an SDP, modify it (re-prioritise codecs, strip unsupported features, add custom attributes), and serialise it back. The serialiser has to produce a string the other peer can re-parse correctly. A lossy parser breaks the round-trip and breaks the call.

The `sdp-transform` library and its ports solve all three by maintaining a structured representation that round-trips losslessly.

## the port

The C++ library `libsdptransform` had two main entry points: `parse(string sdp)` returning a `SessionDescription`, and `write(SessionDescription session)` returning a string.

The Java port preserved the same API surface:

```java
// parse
SessionDescription session = SdpTransform.parse(sdpString);

// inspect
for (Media media : session.getMedia()) {
  System.out.println(media.getType() + " on port " + media.getPort());
}

// modify
session.getMedia().get(0).setDirection("recvonly");

// serialise
String modifiedSdp = SdpTransform.write(session);
```

The `SessionDescription` object exposed nested structures: `media` (list of media descriptions), each with `candidates`, `fingerprint`, `extmap`, `fmtp`, `rtpmap`, `rtcpFb`, `ssrc`, and many more. Each sub-structure had typed fields matching what the SDP grammar produced.

The port was largely mechanical — translate C++ types to Java, replace STL containers with Java collections, replace string handling with Java strings. The grammar itself was unchanged; the same regex-style line parsing worked in either language.

## what was tricky

Three things that took longer than expected.

**The grammar files.** The C++ library defined the grammar declaratively in header files. The Java port had to replicate the same grammar without C++'s preprocessor macros. The result was more verbose Java but the structure was preserved.

**Round-trip stability.** The C++ library's serialisation order matched the conventional SDP attribute order. The Java port initially serialised in HashMap iteration order, which broke round-trip tests. The fix was to use `LinkedHashMap` everywhere and explicitly maintain insertion order. Not glamorous, but necessary.

**Optional fields.** Many SDP attributes have optional sub-fields. The C++ library used `std::optional` for these. Java's null-or-not-null pattern is the equivalent but requires careful null checks throughout the codebase. The port introduced helper methods like `hasFingerprint()` to make the null-checking less error-prone.

## what the port enabled

The port was specifically for Android WebRTC projects. Android's built-in WebRTC integration gives you SDPs as plain strings. To do anything meaningful with them — strip unsupported codecs, force a specific codec preference order, debug a negotiation failure — you need a structured parser.

In the WebRTC project I was building, the parser was used for:

- **Codec preference reordering.** Force Opus to be the first audio codec offered, override the default which sometimes prioritised lower-quality codecs.
- **SDP munging for compatibility.** Strip attributes that some peer implementations did not handle correctly.
- **Debugging.** Pretty-print the SDP at every signalling step so we could see what was being exchanged. The parsed structured form was much easier to diff than the raw text.

Without a structured parser, all of this would have been regex-based, fragile, and broken whenever WebRTC's SDP changed.

## what I would do differently in 2026

Two things.

**Use the existing libraries where they exist.** By 2022-2023, several Android WebRTC SDP parsers became available, both as open-source projects and as parts of larger WebRTC SDK distributions. The 2020 port was useful at the time. Today, the right move would be to use an actively maintained library rather than maintaining the port myself.

**Generate the grammar from a schema.** Both the C++ library and my Java port hand-coded the SDP grammar. A schema-driven approach (define the grammar in some declarative form, generate parser and serialiser code) would scale better as new attributes are added.

The 2020 port is still on GitHub. It works for the SDP versions in use at the time. Newer WebRTC features (some of the bundle group extensions, simulcast attributes, recent SCTP extensions) are not in it. Anyone using it today would need to either update it themselves or use a more current library.

## the close

SDP parsing is one of those infrastructure problems that nobody wants to work on but everyone needs solved. The libraries that exist for it are doing the world a quiet favour by absorbing the grammar's complexity behind a clean API.

When the JS and C++ versions of `sdp-transform` existed and the Java version didn't, porting was the right move. The cost was a weekend of work and a maintenance commitment. The benefit was that the next Android WebRTC project I built (and several others) could treat SDP as structured data rather than as opaque text.

If you find yourself wanting a library that exists in other languages but not in yours, porting it is often the cheapest path to having the right primitive in your stack. The 2020 port took less time than building anything similar from scratch would have, and inherited all the prior work's bug fixes and edge cases.
