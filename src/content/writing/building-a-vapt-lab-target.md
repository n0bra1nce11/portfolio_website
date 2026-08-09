---
title: 'Notes on building a hospital management system as a VAPT lab target'
date: 2026-08-09
summary: >-
  Why I built the system I'm testing rather than using an off-the-shelf
  vulnerable app, and what threat-modeling a healthcare app up front changed.
tags: ['VAPT', 'Healthcare', 'Threat Modeling']
draft: true
---

TODO — draft this post. Outline:

1. Why build the target rather than use something like a pre-made vulnerable app: control over
   the threat model, and the ability to test the full lifecycle (build it insecurely on purpose
   vs. discover incidental bugs).
2. The threat-modeling step done before writing any test cases — see
   [Section 3.0 of the hospital VAPT case study](/work/hospital-vapt/#3-0-threat-model).
3. What surprised me once testing started.
4. What I'd change about the build itself, in hindsight.
