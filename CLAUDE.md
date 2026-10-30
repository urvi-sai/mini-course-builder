# CLAUDE.md

## Tech Stack

- Plain HTML, CSS, and JavaScript only.
- No frameworks or libraries (no React, Vue, Tailwind, etc.).
- No build step: files are opened directly in the browser as written.

## Project Structure

The project is nearly empty for now:

- `README.md` – short project readme
- `CLAUDE.md` – this file

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

A one-time mini-course site built from 3–5 slides (PDF or PowerPoint) that the
user will share. It's for complete beginners. All lessons are on one long
scrolling page. Visitors don't upload anything.

### Site structure

1. **Header**: course title, light/dark toggle, and a thin progress bar
   at the top showing how far down the page you are.
2. **Intro**: what you'll learn and who it's for.
3. **Lesson menu**: links that jump to each lesson. Collapsible on phones,
   a sidebar that stays in view on desktop.
4. **Lessons 1–N**: one per slide, rewritten in plain language, with
   "key term" callouts and a short quiz at the end.
5. **Recap**: key takeaways, each linking back to its lesson.

Students move through the page by scrolling or by using the lesson menu.
The menu highlights the lesson currently on screen.

### Phases

- **Phase 1: Course from the slides.** Ask for the slides. Pull out the topic
  and learning goals, then confirm them with the user. Build the page with the intro and
  lessons, a responsive layout, and the light/dark toggle (light by default).
- **Phase 2: Navigation.** Add the lesson menu (with current-lesson
  highlight) and the progress bar.
- **Phase 3: Practice and recap.** Add 2–3 quiz questions per lesson
  with instant feedback (nothing saved), plus the recap section.
- **Phase 4: Check and polish.** Test on phone, tablet, and desktop in
  both themes. Check keyboard use and readability.
