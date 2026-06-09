---
title: "minecrAft — building a voxel game for my son"
date: 2026-06-09
slug: minecraft-building-a-voxel-game-for-my-son
excerpt: "My son asked for Minecraft. I built him one — a custom WebGL voxel engine, no game libraries, an Electron desktop app, and a web version at intrepidkarthi.com/minecraft."
tags: [minecraft, voxel, webgl, electron, personal, adyah, game-development, javascript]
---

My son Adyah wanted Minecraft. The license cost is fine. The Microsoft sign-in flow is not — it felt wrong for a kid I want to introduce to building software, not to managing accounts. So I built him one.

The result is **minecrAft** — a voxel building and survival game, written from scratch, that he runs on the Mac at home and can now also play in a browser at [intrepidkarthi.com/minecraft](/minecraft/).

Here is what I built, why I built it that way, and what it cost.

## the constraint

The hard constraint, set at the start, was no game libraries. No Three.js. No Babylon. No prebuilt voxel engines. Pure WebGL with my own renderer.

The reason was not snobbery. It was pedagogy. If Adyah watches me debug the game over the next year, I want him to see the actual layers — vertex buffers, shader programs, texture atlases, world chunking, raycast hit detection. With a library, those are invisible. The library does the work and you trust it. Without a library, every block on screen is a decision somebody made about how to draw blocks.

The cost of this constraint was time. The first month of evenings produced a renderer that could draw a single chunk of dirt blocks. The second month added world generation and chunked rendering. By the third month the game was playable. A library would have collapsed those three months to two weeks.

The benefit was that I now understand exactly how voxel rendering works — the greedy meshing trick, the per-face culling, the texture atlas packing, the chunk dirty-flag system. None of that knowledge was new to graphics programmers in general. It was new to me.

## the architecture

```
electron main process    │ window management, menu bar, disk save/load
preload bridge           │ secure context bridge, no node in renderer
renderer (src/)          │ the game itself — index.html + game.js
                          │ pure WebGL, no Node APIs touched
web build (web/)         │ same renderer, no Electron, deployable anywhere
save file                │ JSON: seed + per-block diffs from generator
```

Two things to notice. First, the renderer is the same whether it runs inside Electron or in a browser. The Electron side handles save-to-disk and menu items. The renderer itself uses only browser APIs — WebGL, requestAnimationFrame, AudioContext, localStorage as a fallback when Electron is not there.

Second, the save format is a fixed map seed plus the diffs the player has made. The generator produces the world deterministically from the seed. Only the blocks the player has placed or broken get stored. This keeps saves tiny — Adyah's current world after several weeks of play is around 40KB.

## what is in the game

The feature list is shorter than Minecraft and longer than a hackathon prototype.

```
movement                │ WASD + mouse, jump, sprint, fly (creative mode)
block ops               │ break (left click), place (right click), 9-slot hotbar
inventory + crafting    │ 36-slot backpack, crafting table, furnace, recipes
mobs                    │ villagers, zombies, spiders, dragon boss
world                   │ multiple biomes, day/night cycle, weather
survival                │ hunger, health, armor, sleep
quests                  │ find 5 golden stars; defeat the dragon
save/load               │ continue any world, auto-save on pause
```

The day/night cycle is real (about 20 minutes per in-game day). Mobs come out at night. The dragon boss took Adyah three weeks to find and another two evenings to defeat with the Star Blade he crafted from a hero sword, a star shard, and two diamonds.

The crafting recipes are deliberately permissive. The Minecraft I grew up with rewarded research; the version I built for a six-year-old rewards experimentation. The recipe book is visible from the inventory screen. He can see what materials he needs and what they produce.

## the web version

The web version lives at [intrepidkarthi.com/minecraft](/minecraft/). Same code as the Electron desktop app, minus the disk-save layer. Saves go to localStorage in the browser instead of a JSON file on disk.

The web build was a few hours of extra work. The renderer was already browser-only. The save layer needed an adapter that worked with either Electron IPC or browser localStorage. Once that adapter existed, the same source compiled to both targets with no further changes.

For Adyah this means he can play on a friend's laptop without installing anything. For me it means the game is now discoverable to anyone who reads the blog — and the bar for "can I show you this thing I built?" dropped from "install this Electron app from a USB drive" to "open this URL."

## why this took longer than buying Minecraft

The honest answer is that it cost me about eight evenings per month for three months. Around sixty hours of work. Microsoft's Minecraft license for a Mac is around $30. By any rational accounting, I paid sixty hours of skilled engineering time to save a $30 license fee.

The accounting is wrong. The benefit was not the license fee. The benefits were:

1. A game I can modify when Adyah outgrows it. New mobs, new biomes, new mechanics. None of which Microsoft would let me add.
2. A game with no telemetry, no accounts, no sign-in, no shop, no upsell. The game just runs.
3. A codebase I can show him in a few years when he wants to know how games work.
4. Proof to myself that I can still build a non-trivial graphics-stack application from scratch in a reasonable amount of time. The proof was useful for me.

For most parents, the right move is to buy Minecraft. For me, with my specific job and the specific lesson I wanted to model for Adyah, building it was the better trade.

## the bigger pattern

The game is one instance of a broader pattern: build for the people you love.

The output is rarely an objectively-better-than-commercial product. The output is a thing that exists because you cared enough to make it. For the person you made it for, that fact is the whole point. The product is the proof of care.

Most of my best work over the last two decades has had a specific person or specific small audience in mind. Posts written for a particular reader, books written for engineers I knew personally, products built because someone I respected asked. The output gets better when the audience is specific.

Adyah does not know that minecrAft is a custom WebGL engine with greedy meshing. He knows that the game his dad made for him has his name in it, his world saves, the Star Blade he crafted himself, the dragon he defeated. That is enough.

## the close

The game is at [intrepidkarthi.com/minecraft](/minecraft/). The source for the Electron version is at [github.com/intrepidkarthi/minecraaft](https://github.com/intrepidkarthi/minecraaft).

If you have a kid who wants Minecraft and you also like building things, this is the kind of project that pays its keep. The kid is happy. You learn graphics programming. The code becomes a teaching artifact later. Three returns for sixty hours of evenings.

If you do not have a kid but you like building things, the lesson generalises. Pick something somebody you love would use. Build that thing. The specificity is what makes the output durable.

Adyah is currently asking for a sequel. I am thinking about it.
