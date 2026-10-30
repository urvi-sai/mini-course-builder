// Light/dark theme toggle. Light is the default; the choice is remembered.

const root = document.documentElement;
const themeButton = document.getElementById('theme-toggle');

function applyTheme(theme) {
  if (theme === 'dark') {
    root.dataset.theme = 'dark';
  } else {
    delete root.dataset.theme;
  }
  themeButton.textContent = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
}

themeButton.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  try {
    localStorage.setItem('theme', next);
  } catch (e) {
    // Storage can be blocked (e.g. private browsing); the toggle still works for this visit.
  }
});

applyTheme(root.dataset.theme === 'dark' ? 'dark' : 'light');

// Lesson switching: show one lesson at a time. The address bar's "#lesson-id"
// says which one, so the menu links, Back button and bookmarks all work.
// Without JavaScript, every lesson simply shows on one long page.

const lessons = Array.from(document.querySelectorAll('.lesson'));
const menuLinks = Array.from(document.querySelectorAll('#lesson-menu a'));
const pager = document.querySelector('.lesson-pager');
const prevButton = document.getElementById('prev-lesson');
const nextButton = document.getElementById('next-lesson');
const position = document.getElementById('lesson-position');

let current = 0;

function lessonIndexFromHash() {
  const index = lessons.findIndex((lesson) => '#' + lesson.id === location.hash);
  return index === -1 ? 0 : index;
}

function showLesson(index, moveFocus) {
  current = index;

  lessons.forEach((lesson, i) => {
    lesson.hidden = i !== index;
  });

  menuLinks.forEach((link, i) => {
    if (i === index) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });

  prevButton.disabled = index === 0;
  nextButton.disabled = index === lessons.length - 1;
  position.textContent = `Lesson ${index + 1} of ${lessons.length}`;

  if (moveFocus) {
    // Bring the new lesson's heading into view (below the menu on phones) and
    // move keyboard and screen-reader focus to it.
    const heading = lessons[index].querySelector('h2');
    heading.scrollIntoView({ block: 'start' });
    heading.focus({ preventScroll: true });
  }
}

function goTo(index) {
  location.hash = lessons[index].id;
}

prevButton.addEventListener('click', () => goTo(current - 1));
nextButton.addEventListener('click', () => goTo(current + 1));
window.addEventListener('hashchange', () => showLesson(lessonIndexFromHash(), true));

pager.hidden = false;
showLesson(lessonIndexFromHash(), false);

// Check-in questions: one per lesson, answered on the page (nothing is saved).
// Each form's data-answer lists the accepted answers, separated by "|".
// Like the Previous / Next buttons, they only appear when JavaScript is running.

document.querySelectorAll('.check-in').forEach((form) => {
  const textInput = form.querySelector('input[type="text"]');
  const result = form.querySelector('.check-in-result');
  const verdict = form.querySelector('.check-in-verdict');
  const explanation = form.querySelector('.check-in-explanation');

  form.addEventListener('submit', (event) => {
    event.preventDefault(); // stay on the page instead of submitting the form

    let response = '';
    if (textInput) {
      response = textInput.value.trim().toLowerCase();
    } else {
      const chosen = form.querySelector('input[type="radio"]:checked');
      response = chosen ? chosen.value : '';
    }

    if (!response) {
      verdict.textContent = textInput ? 'Type an answer first.' : 'Choose an answer first.';
      result.focus();
      return;
    }

    const correct = form.dataset.answer.split('|').includes(response);
    verdict.textContent = correct ? 'Correct!' : 'Not quite.';
    verdict.classList.add(correct ? 'is-correct' : 'is-wrong');
    explanation.hidden = false;

    // Lock the question, then move focus to the result so it's read out and
    // the Next button is the next stop for keyboard users.
    form.querySelectorAll('input, button').forEach((el) => {
      el.disabled = true;
    });
    result.focus();
  });

  form.hidden = false;
});
