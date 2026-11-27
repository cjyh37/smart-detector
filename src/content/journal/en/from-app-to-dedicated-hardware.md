---
lang: en
slug: from-app-to-dedicated-hardware
title: "Planning a dedicated device for exam rooms"
description: "To overcome phone and OS scanning limits, we are planning a dedicated exam-room receiver that logs wireless signal changes throughout an exam."
category: research
date: "2026-11-17"
updated: "2026-11-27"
readTime: "3 min read"
order: 4
---

A phone app needs no extra hardware, but phone radios and operating-system rules limit what it can observe. To reduce those limits, we are planning a dedicated receiver as our next product for schools and exam institutions to place in exam rooms.

The goal is to log wireless signal changes steadily throughout an exam and help proctors spot items that need checking at a glance. The project is currently in concept and research preparation as we evaluate receiver modules and room workflows.

## Steady reception throughout the exam

We plan to capture a pre-exam baseline and log changes continuously until the session ends. If reception drops or lags, the operator should see it right away, and the report will separate active reception intervals from gaps.

Candidate hardware includes wireless chips and dev boards such as the ESP32 family, to be chosen after comparing real reception benchmarks. Because results shift with protocols, pairing states and room layouts, we will repeat tests across varied conditions and log both captured and missed signals. Detection range and accuracy will be published after head-to-head tests against the phone app under identical conditions.

## A screen and report built for live proctoring

Long raw lists of signal names and numbers are hard to use in a tense exam room. Proctors need to pick out what requires attention quickly and log check results simply.

We plan to connect the pre-exam baseline, new-signal alerts, check notes and final report into a single workflow. Alongside reception quality, we will test whether prompts are clear at a glance and how little time logging takes during active supervision.

Release dates and pricing are not yet set. Once experiments begin, we will publish test conditions, results and limitations in the journal.

We welcome input from schools, exam and interview organizers, and wireless hardware engineers. See our [research plans](/en/research/) and let us know what your rooms need.
