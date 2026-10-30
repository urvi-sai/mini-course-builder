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

// Tabs and lesson switching. The "#..." part of the address says what to show:
// "#quiz" or "#simulator" opens that tab, and a lesson id (or nothing) opens
// the Lesson tab at that lesson. So the tabs, menu links, Back button and
// bookmarks all work. Without JavaScript, everything shows on one long page
// and the tabs act as "jump to" links.

const tabLinks = Array.from(document.querySelectorAll('[data-tab-link]'));
const tabParts = Array.from(document.querySelectorAll('[data-tab]'));
const lessonTab = document.getElementById('tab-lesson');
const lessons = Array.from(document.querySelectorAll('.lesson'));
const menuLinks = Array.from(document.querySelectorAll('#lesson-menu a'));
const pager = document.querySelector('.lesson-pager');
const prevButton = document.getElementById('prev-lesson');
const nextButton = document.getElementById('next-lesson');
const position = document.getElementById('lesson-position');

let current = 0;

function markCurrent(links, isCurrent) {
  links.forEach((link) => {
    if (isCurrent(link)) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

function focusHeading(heading) {
  // Bring the heading into view (below the menu on phones) and move keyboard
  // and screen-reader focus to it.
  heading.scrollIntoView({ block: 'start' });
  heading.focus({ preventScroll: true });
}

function showTab(name) {
  tabParts.forEach((part) => {
    part.hidden = part.dataset.tab !== name;
  });
  markCurrent(tabLinks, (link) => link.dataset.tabLink === name);
}

function lessonIndexFromHash() {
  const index = lessons.findIndex((lesson) => '#' + lesson.id === location.hash);
  return index === -1 ? 0 : index;
}

function showLesson(index, moveFocus) {
  current = index;

  lessons.forEach((lesson, i) => {
    lesson.hidden = i !== index;
  });
  markCurrent(menuLinks, (link) => link.getAttribute('href') === '#' + lessons[index].id);

  prevButton.disabled = index === 0;
  nextButton.disabled = index === lessons.length - 1;
  position.textContent = `Lesson ${index + 1} of ${lessons.length}`;

  // Coming back to the Lesson tab returns to this lesson, not the first one.
  lessonTab.setAttribute('href', '#' + lessons[index].id);

  if (moveFocus) focusHeading(lessons[index].querySelector('h2'));
}

function showFromHash(moveFocus) {
  const name = location.hash.slice(1);
  const panel = name !== 'lesson' && document.querySelector(`[data-tab="${name}"]`);
  if (name && panel) {
    showTab(name);
    if (moveFocus) focusHeading(panel.querySelector('h2'));
  } else {
    showTab('lesson');
    showLesson(lessonIndexFromHash(), moveFocus);
  }
}

function goTo(index) {
  location.hash = lessons[index].id;
}

prevButton.addEventListener('click', () => goTo(current - 1));
nextButton.addEventListener('click', () => goTo(current + 1));
window.addEventListener('hashchange', () => showFromHash(true));

pager.hidden = false;
showFromHash(false);

// Check-in questions: one at the end of each lesson, and eight more in the
// Quiz tab. They're answered on the page (nothing is saved). Each form's
// data-answer lists the accepted answers, separated by "|". Like the
// Previous / Next buttons, they only appear when JavaScript is running.

function resetCheckIn(form) {
  form.reset(); // clears the chosen option or typed answer
  form.querySelectorAll('input, button').forEach((el) => {
    el.disabled = false;
  });
  const verdict = form.querySelector('.check-in-verdict');
  verdict.textContent = '';
  verdict.classList.remove('is-correct', 'is-wrong');
  form.querySelector('.check-in-explanation').hidden = true;
  delete form.dataset.result;
}

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
    form.dataset.result = correct ? 'correct' : 'wrong';

    // Lock the question, then move focus to the result so it's read out and
    // the Next button is the next stop for keyboard users.
    form.querySelectorAll('input, button').forEach((el) => {
      el.disabled = true;
    });
    result.focus();

    // Let the quiz know, so it can update the score.
    form.dispatchEvent(new Event('answered'));
  });

  form.hidden = false;
});

// Quiz tab: a running count, then the score once every question is answered.

const quizQuestions = Array.from(document.querySelectorAll('.quiz-question'));
const quizProgress = document.getElementById('quiz-progress');
const quizScore = document.getElementById('quiz-score');
const quizScoreTotal = document.getElementById('quiz-score-total');
const quizScoreMessage = document.getElementById('quiz-score-message');
const quizRetake = document.getElementById('quiz-retake');

function updateQuiz(moveFocus) {
  const total = quizQuestions.length;
  const answered = quizQuestions.filter((form) => form.dataset.result);
  const right = answered.filter((form) => form.dataset.result === 'correct').length;

  quizProgress.textContent = `Answered ${answered.length} of ${total}`;
  quizScore.hidden = answered.length < total;
  if (quizScore.hidden) return;

  quizScoreTotal.textContent = `Your score: ${right} out of ${total}`;
  if (right === total) {
    quizScoreMessage.textContent = 'Perfect score! You have a solid grip on selection structures.';
  } else if (right >= total * 0.75) {
    quizScoreMessage.textContent = 'Great work! Read the explanations for any you missed.';
  } else {
    quizScoreMessage.textContent =
      'Keep going! Read the explanations above, look back at the lessons, then try again.';
  }

  if (moveFocus) {
    quizScore.scrollIntoView({ block: 'nearest' });
    quizScore.focus({ preventScroll: true });
  }
}

quizQuestions.forEach((form) => {
  form.addEventListener('answered', () => updateQuiz(true));
});

quizRetake.addEventListener('click', () => {
  quizQuestions.forEach(resetCheckIn);
  updateQuiz(false);
  focusHeading(document.getElementById('quiz-title'));
});

updateQuiz(false);
