# CLAUDE.md

## Tech Stack

- Plain HTML, CSS, and JavaScript only.
- No frameworks or libraries (no React, Vue, Tailwind, etc.).
- No build step: files are opened directly in the browser as written.

## Project Structure

- `index.html` – the whole course: header, tabs, lesson menu, one
  `<section class="lesson">` per slide, and the Quiz and Simulator panels
- `styles.css` – layout, light/dark colors (CSS variables), responsive rules
- `script.js` – theme toggle, tab and lesson switching, check-in questions,
  and quiz scoring
- `simulator.js` – the Simulator tab: program stepper and
  condition calculator
- `README.md` – short project readme
- `CLAUDE.md` – this file

The source slide deck is not stored in the repository.

Keep new files at the top level until there is a reason to organize them
into folders. Ask before introducing a folder structure.

## Key Requirements

1. Every page must be responsive and work on desktop, tablet, and phone.
2. Users can toggle between a light and a dark theme. The default is the
   light theme.

## Rules for Claude

- Explain technical terms in plain language.
- Ask before making big changes.
- When something is unclear, ask rather than guess.

## Feature Plan

A one-time mini-course site built from the user's slide deck. It's for
complete beginners. Everything lives in one page, split into three tabs
(Lesson, Quiz, Simulator) that JavaScript switches between (no separate
pages). Visitors don't upload anything.

### Site structure

1. **Header**: course title, light/dark toggle, and a thin progress bar
   at the top showing how far down the page you are.
2. **Intro**: what you'll learn and who it's for.
3. **Lesson menu**: links that jump to each lesson. Collapsible on phones,
   a sidebar that stays in view on desktop.
4. **Lessons 1–N**: one per slide, rewritten in plain language, with
   "key term" callouts and one check-in question at the end (multiple
   choice or a short typed answer). Checking it shows right/wrong plus a
   short explanation, then locks it. It never blocks moving on.
5. **Recap**: key takeaways, each linking back to its lesson.

Items 2–5 are in the **Lesson tab**. The other two tabs are:

- **Quiz tab**: 8 questions covering the whole course, using the same
  check-in style. It shows "Answered X of 8", then the score once all 8 are
  answered, with a button to take it again.
- **Simulator tab** (heading "Practice simulator"): Part 1 steps through the
  lesson programs line by line for a chosen input. Part 2 works out a typed
  condition one operator at a time, in C's precedence order.

Students switch tabs with the tab links, and move between lessons with the
lesson menu or the Previous / Next buttons. The address bar keeps track of
where they are (`#quiz`, `#simulator`, or `#lesson-id`), so Back and
bookmarks work. Going back to the Lesson tab returns to the last lesson
viewed. Without JavaScript, everything shows on one long page.

### Phases

- **Phase 1: Course from the slides.** *(Done: plain styling.)* One lesson
  per slide, a basic lesson menu with Previous / Next switching, a responsive
  layout, and the light/dark toggle (light by default).
- **Phase 2: Navigation.** Make the menu collapsible on phones and add the
  progress bar (how far through the course you are).
- **Phase 3: Practice and recap.** *(Done: one check-in per lesson, the
  8-question Quiz tab, and the Simulator tab. Nothing is saved.)* Still to
  do: the recap section.
- **Phase 4: Check and polish.** Test on phone, tablet, and desktop in
  both themes. Check keyboard use and readability.
