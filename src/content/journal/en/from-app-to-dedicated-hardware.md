---
lang: en
slug: from-app-to-dedicated-hardware
title: "Planning a dedicated device for exam rooms"
description: "We are planning hardware that records signal changes during exams and helps proctors carry out checks. Here is what we need to investigate."
category: research
date: "2026-11-17"
readTime: "3 min read"
order: 4
---

A phone app requires no separate equipment, but the signals it can receive depend on the phone and operating system. Our next hardware product is intended for schools and institutions to place in an exam room.

The goal is to record wireless signal changes throughout an exam and help proctors find the items that need checking. We are at the concept and research preparation stage, considering the receiver and how people would use the device.

## Reception throughout the exam

We plan to record a pre-exam baseline and track changes during the session. If reception stops or is delayed, the operator needs to know. The record should show both the intervals with reception and the gaps.

Wireless chips and development boards, including the ESP32 family, are candidates for research. We will compare actual reception results before choosing components. Results can vary with a device’s communication method, connection state and surroundings, so we plan to repeat tests under different conditions and record both received and missed signals.

Any improvement over the app needs to be measured under comparable conditions. We will describe detection range and accuracy once we have test results.

## A screen and report proctors can use

Proctors need to find signals that warrant a check and record what they confirmed. A long list of names and numbers is difficult to use if it leaves them unsure what to look at.

We plan to design the pre-exam baseline, new-signal checks, notes and report as one workflow. Alongside reception quality, we will examine whether the instructions are clear and how much time it takes to keep records while supervising an exam.

Release dates and pricing have not been set. When research starts, we will publish test conditions, results, missed signals and areas for improvement in the journal.

We welcome input from schools, exam and interview teams, and people with wireless device development experience. See our [development plans](/en/research/) and tell us which features you need or how we could work together.
