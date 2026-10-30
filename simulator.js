// "Try it yourself" section: a branch stepper (Part 1) and a condition
// calculator (Part 2). Both only appear when JavaScript is running.

// ---------------------------------------------------------------------------
// Part 1: step through a program
//
// Each program is a list of [key, code] lines. Lines with a key are ones the
// simulator can stop on. trace(value) returns the steps the program takes for
// one input value: which line runs, what it prints, and a plain-language note.
// ---------------------------------------------------------------------------

function askAndRead(variable, prompt, value) {
  return [
    { line: 'ask', output: prompt, note: `printf shows the message "${prompt}".` },
    {
      line: 'read',
      output: value + '\n',
      note: `scanf reads the number you typed (${value}) and stores it in the variable ${variable}.`,
    },
  ];
}

function check(line, condition, filledIn, result, ifFalse) {
  const answer = result ? 'Yes' : 'No';
  const next = result ? 'so the program runs the body under it.' : ifFalse;
  return {
    line,
    result,
    note: `Is ${filledIn}? ${answer}. The condition (${condition}) is ${result}, ${next}`,
  };
}

function printStep(line, text) {
  return { line, output: text + '\n', note: `printf shows "${text}".` };
}

const finish = { line: 'end', note: 'return (0); ends the program.' };

const votingLines = (withElse) => [
  ['', '#include <stdio.h>'],
  ['', ''],
  ['', 'int main(void)'],
  ['', '{'],
  ['', '    int age;'],
  ['', ''],
  ['ask', '    printf("Enter your age: ");'],
  ['read', '    scanf("%d", &age);'],
  ['', ''],
  ['if', '    if (age < 21)'],
  ['', '    {'],
  ['young', '        printf("You cannot vote yet\\n");'],
  ['', '    }'],
  ...(withElse
    ? [
        ['', '    else'],
        ['', '    {'],
        ['old', '        printf("You have reached the legal age for voting\\n");'],
        ['', '    }'],
      ]
    : []),
  ['', ''],
  ['end', '    return (0);'],
  ['', '}'],
];

function votingTrace(age, withElse) {
  const young = age < 21;
  const ifFalse = withElse
    ? 'so the program skips to the else part.'
    : "so the body is skipped. There's no else, so nothing else happens.";
  const steps = [...askAndRead('age', 'Enter your age: ', age)];
  steps.push(check('if', 'age < 21', `${age} < 21`, young, ifFalse));
  if (young) {
    steps.push(printStep('young', 'You cannot vote yet'));
  } else if (withElse) {
    steps.push(printStep('old', 'You have reached the legal age for voting'));
  }
  steps.push(finish);
  return steps;
}

const salesNestedLines = [
  ['', '#include <stdio.h>'],
  ['', ''],
  ['', 'int main(void)'],
  ['', '{'],
  ['', '    int sales;'],
  ['', ''],
  ['ask', '    printf("Enter your sales amount: ");'],
  ['read', '    scanf("%d", &sales);'],
  ['', ''],
  ['c1', '    if (sales > 50000)'],
  ['', '    {'],
  ['p1', '        printf("You earn a bonus of 1500\\n");'],
  ['', '    }'],
  ['', '    else'],
  ['', '    {'],
  ['c2', '        if (sales > 35000)'],
  ['', '        {'],
  ['p2', '            printf("You earn a bonus of 500\\n");'],
  ['', '        }'],
  ['', '        else'],
  ['', '        {'],
  ['c3', '            if (sales > 10000)'],
  ['', '            {'],
  ['p3', '                printf("You earn a bonus of 100\\n");'],
  ['', '            }'],
  ['', '            else'],
  ['', '            {'],
  ['p4', '                printf("You are not entitled to any bonus\\n");'],
  ['', '            }'],
  ['', '        }'],
  ['', '    }'],
  ['', ''],
  ['end', '    return (0);'],
  ['', '}'],
];

const salesElseIfLines = [
  ['', '#include <stdio.h>'],
  ['', ''],
  ['', 'int main(void)'],
  ['', '{'],
  ['', '    int sales;'],
  ['', ''],
  ['ask', '    printf("Enter your sales amount: ");'],
  ['read', '    scanf("%d", &sales);'],
  ['', ''],
  ['c1', '    if (sales > 50000)'],
  ['', '    {'],
  ['p1', '        printf("You earn a bonus of 1500\\n");'],
  ['', '    }'],
  ['c2', '    else if (sales > 35000)'],
  ['', '    {'],
  ['p2', '        printf("You earn a bonus of 500\\n");'],
  ['', '    }'],
  ['c3', '    else if (sales > 10000)'],
  ['', '    {'],
  ['p3', '        printf("You earn a bonus of 100\\n");'],
  ['', '    }'],
  ['', '    else'],
  ['', '    {'],
  ['p4', '        printf("You are not entitled to any bonus\\n");'],
  ['', '    }'],
  ['', ''],
  ['end', '    return (0);'],
  ['', '}'],
];

function salesTrace(sales, nested) {
  const tiers = [
    { check: 'c1', print: 'p1', limit: 50000, message: 'You earn a bonus of 1500' },
    { check: 'c2', print: 'p2', limit: 35000, message: 'You earn a bonus of 500' },
    { check: 'c3', print: 'p3', limit: 10000, message: 'You earn a bonus of 100' },
  ];
  const steps = [...askAndRead('sales', 'Enter your sales amount: ', sales)];

  for (let i = 0; i < tiers.length; i++) {
    const tier = tiers[i];
    const passed = sales > tier.limit;
    const last = i === tiers.length - 1;
    let ifFalse;
    if (last) {
      ifFalse = 'so the program goes to the final else.';
    } else if (nested) {
      ifFalse = 'so the program goes into the else part and checks the if inside it.';
    } else {
      ifFalse = 'so the program moves on to the next else if.';
    }
    steps.push(check(tier.check, `sales > ${tier.limit}`, `${sales} > ${tier.limit}`, passed, ifFalse));
    if (passed) {
      steps.push(printStep(tier.print, tier.message));
      steps.push(finish);
      return steps;
    }
  }

  steps.push(printStep('p4', 'You are not entitled to any bonus'));
  steps.push(finish);
  return steps;
}

const programs = {
  'vote-if': {
    inputLabel: 'Age to type in',
    defaultValue: 17,
    lines: votingLines(false),
    trace: (value) => votingTrace(value, false),
  },
  'vote-if-else': {
    inputLabel: 'Age to type in',
    defaultValue: 25,
    lines: votingLines(true),
    trace: (value) => votingTrace(value, true),
  },
  'sales-nested': {
    inputLabel: 'Sales amount to type in',
    defaultValue: 40000,
    lines: salesNestedLines,
    trace: (value) => salesTrace(value, true),
  },
  'sales-else-if': {
    inputLabel: 'Sales amount to type in',
    defaultValue: 40000,
    lines: salesElseIfLines,
    trace: (value) => salesTrace(value, false),
  },
};

const branchSim = document.getElementById('branch-sim');
const programSelect = document.getElementById('sim-program');
const valueInput = document.getElementById('sim-input');
const valueLabel = document.getElementById('sim-input-label');
const stepButton = document.getElementById('sim-step');
const runButton = document.getElementById('sim-run');
const resetButton = document.getElementById('sim-reset');
const simError = document.getElementById('sim-error');
const codeBox = document.getElementById('sim-code');
const log = document.getElementById('sim-log');
const outputBox = document.getElementById('sim-output');

// Where the current run is up to. steps is null until the first Step.
let steps = null;
let stepIndex = 0;

function drawCode() {
  const program = programs[programSelect.value];
  codeBox.replaceChildren();
  codeBox.classList.remove('is-finished');
  program.lines.forEach(([key, code]) => {
    const line = document.createElement('span');
    line.className = 'sim-line';
    if (key) line.dataset.key = key;
    line.textContent = code;
    codeBox.appendChild(line);
  });
}

function resetRun() {
  steps = null;
  stepIndex = 0;
  simError.textContent = '';
  log.replaceChildren();
  outputBox.textContent = '';
  stepButton.disabled = false;
  runButton.disabled = false;
  stepButton.textContent = 'Step';
  drawCode();
}

function readValue() {
  const text = valueInput.value.trim();
  const value = Number(text);
  if (text === '' || !Number.isInteger(value)) {
    simError.textContent = 'Type a whole number first (like 17 or 40000). This program reads it with %d, which only takes whole numbers.';
    return null;
  }
  if (Math.abs(value) > 2147483647) {
    simError.textContent = 'That number is too big for an int. Try a smaller one.';
    return null;
  }
  return value;
}

function lineFor(key) {
  return codeBox.querySelector(`[data-key="${key}"]`);
}

function takeStep() {
  if (steps === null) {
    const value = readValue();
    if (value === null) return false;
    simError.textContent = '';
    steps = programs[programSelect.value].trace(value);
    stepButton.textContent = 'Next step';
  }

  const step = steps[stepIndex];
  codeBox.querySelectorAll('.is-current').forEach((el) => el.classList.remove('is-current'));
  const line = lineFor(step.line);
  line.classList.add('is-current', 'is-ran');

  if (step.result !== undefined) {
    const badge = document.createElement('span');
    badge.className = 'sim-badge ' + (step.result ? 'is-true' : 'is-false');
    badge.textContent = step.result ? '  ← true' : '  ← false';
    line.appendChild(badge);
  }
  if (step.output) outputBox.textContent += step.output;

  const item = document.createElement('li');
  item.textContent = step.note;
  log.appendChild(item);

  stepIndex++;
  if (stepIndex === steps.length) {
    codeBox.classList.add('is-finished');
    stepButton.disabled = true;
    runButton.disabled = true;
    resetButton.focus(); // the Step button is now disabled, so keep keyboard focus nearby
  }
  return true;
}

stepButton.addEventListener('click', () => {
  takeStep();
  const current = codeBox.querySelector('.is-current');
  if (current) current.scrollIntoView({ block: 'nearest' });
});

runButton.addEventListener('click', () => {
  while (takeStep() && stepIndex < steps.length) {
    // keep stepping until the program ends (or the input is invalid)
  }
});

resetButton.addEventListener('click', resetRun);
valueInput.addEventListener('input', resetRun);

programSelect.addEventListener('change', () => {
  const program = programs[programSelect.value];
  valueLabel.textContent = program.inputLabel;
  valueInput.value = program.defaultValue;
  resetRun();
});

resetRun();
branchSim.hidden = false;

// ---------------------------------------------------------------------------
// Part 2: work out a condition
//
// The condition is split into tokens (numbers, operators, brackets), turned
// into a tree that follows C's precedence rules, then simplified one operator
// at a time: innermost brackets first, then the highest-precedence operator,
// then left to right.
// ---------------------------------------------------------------------------

// Lower number = higher precedence (worked out earlier), as in lesson 10's table.
const PRECEDENCE = {
  '*': 1, '/': 1, '%': 1,
  '+': 2, '-': 2,
  '<': 3, '<=': 3, '>': 3, '>=': 3,
  '==': 4, '!=': 4,
};
const LOWEST = 4;
const INT_LIMIT = 2147483647;

function tokenize(text) {
  const tokens = [];
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    const two = text.slice(i, i + 2);
    if (/\s/.test(ch)) {
      i++;
    } else if (/\d/.test(ch)) {
      let j = i;
      while (j < text.length && /\d/.test(text[j])) j++;
      const value = Number(text.slice(i, j));
      if (value > INT_LIMIT) throw new Error('One of the numbers is too big for an int. Try smaller numbers.');
      tokens.push({ type: 'num', value });
      i = j;
    } else if (['<=', '>=', '==', '!='].includes(two)) {
      tokens.push({ type: 'op', value: two });
      i += 2;
    } else if ('+-*/%<>'.includes(ch)) {
      tokens.push({ type: 'op', value: ch });
      i++;
    } else if (ch === '(' || ch === ')') {
      tokens.push({ type: ch, value: ch });
      i++;
    } else if (ch === '=') {
      throw new Error('A single = stores a value in a variable. To check whether two values are equal, use == instead.');
    } else if (ch === '.') {
      throw new Error('Please use whole numbers only (like 7, not 7.5).');
    } else if (/[a-z_]/i.test(ch)) {
      throw new Error("Please use numbers only. Variables like age or sales aren't supported here.");
    } else {
      throw new Error(`The character "${ch}" isn't one this calculator understands.`);
    }
  }
  if (tokens.length === 0) throw new Error('Type a condition first, for example 2 + 3 > 4.');
  return tokens;
}

function parse(tokens) {
  let pos = 0;

  function primary() {
    const token = tokens[pos];
    if (!token) throw new Error('The condition ends too early. Is a number missing at the end?');
    if (token.type === 'num') {
      pos++;
      return { type: 'num', value: token.value };
    }
    if (token.type === '(') {
      pos++;
      const inner = level(LOWEST);
      if (!tokens[pos] || tokens[pos].type !== ')') throw new Error('A closing bracket ) is missing.');
      pos++;
      if (inner.type === 'op') inner.paren = true;
      return inner;
    }
    if (token.value === '-' && tokens[pos + 1] && tokens[pos + 1].type === 'num') {
      pos += 2;
      return { type: 'num', value: -tokens[pos - 1].value };
    }
    throw new Error(`A number was expected, but found "${token.value}".`);
  }

  // Reads operators at this precedence level and above, grouping left to right.
  function level(n) {
    if (n === 0) return primary();
    let left = level(n - 1);
    while (tokens[pos] && tokens[pos].type === 'op' && PRECEDENCE[tokens[pos].value] === n) {
      const op = tokens[pos].value;
      pos++;
      left = { type: 'op', op, left, right: level(n - 1) };
    }
    return left;
  }

  const tree = level(LOWEST);
  if (pos < tokens.length) {
    const token = tokens[pos];
    if (token.type === ')') throw new Error('There is an extra closing bracket ).');
    throw new Error(`Something is missing before "${token.value}". Is there an operator between the numbers?`);
  }
  return tree;
}

function show(node) {
  if (node.type === 'num') return String(node.value);
  const text = `${show(node.left)} ${node.op} ${show(node.right)}`;
  return node.paren ? `(${text})` : text;
}

// Operators whose two sides are already plain numbers, so they can be worked out now.
function readyOperators(node, depth = 0, found = []) {
  if (node.type === 'num') return found;
  const inside = depth + (node.paren ? 1 : 0);
  if (node.left.type === 'num' && node.right.type === 'num') {
    found.push({ node, depth: inside, order: found.length });
  } else {
    readyOperators(node.left, inside, found);
    readyOperators(node.right, inside, found);
  }
  return found;
}

function allOperators(node, found = []) {
  if (node.type === 'op') {
    allOperators(node.left, found);
    found.push(node);
    allOperators(node.right, found);
  }
  return found;
}

function calculate(op, a, b) {
  switch (op) {
    case '*': return a * b;
    case '/': return Math.trunc(a / b); // whole-number division, like C's int
    case '%': return a % b;
    case '+': return a + b;
    case '-': return a - b;
    case '<': return a < b ? 1 : 0;
    case '<=': return a <= b ? 1 : 0;
    case '>': return a > b ? 1 : 0;
    case '>=': return a >= b ? 1 : 0;
    case '==': return a === b ? 1 : 0;
    case '!=': return a !== b ? 1 : 0;
  }
}

function whyThisOne(choice, others) {
  if (choice.depth > 0) return 'Brackets come first.';
  if (others.length === 0) return 'This is the last operator left.';
  const op = choice.node.op;
  if (others.some((other) => PRECEDENCE[other.op] === PRECEDENCE[op])) {
    return `Nothing left has higher precedence than ${op}, and operators on the same level go left to right.`;
  }
  const next = others.slice().sort((a, b) => PRECEDENCE[a.op] - PRECEDENCE[b.op])[0].op;
  return `${op} has higher precedence than ${next}, so it goes first.`;
}

function describe(op, a, b, value) {
  const sum = `${a} ${op} ${b}`;
  if (PRECEDENCE[op] >= 3) {
    return value ? `${sum} is true, so it gives 1.` : `${sum} is false, so it gives 0.`;
  }
  if (op === '/' && a % b !== 0) {
    return `${sum} = ${value} (dividing whole numbers drops the remainder).`;
  }
  return `${sum} = ${value}.`;
}

function workOut(text) {
  const tree = parse(tokenize(text));
  const start = show(tree);
  const steps = [];

  while (tree.type === 'op') {
    const ready = readyOperators(tree).sort(
      (a, b) =>
        b.depth - a.depth ||
        PRECEDENCE[a.node.op] - PRECEDENCE[b.node.op] ||
        a.order - b.order
    );
    const choice = ready[0];
    const { op, left, right } = choice.node;
    const others = allOperators(tree).filter((node) => node !== choice.node);

    if ((op === '/' || op === '%') && right.value === 0) {
      throw new Error(`${left.value} ${op} 0 divides by zero, which isn't allowed in C.`);
    }
    const value = calculate(op, left.value, right.value);
    if (Math.abs(value) > INT_LIMIT) throw new Error('The result gets too big for an int. Try smaller numbers.');

    const reason = whyThisOne(choice, others);
    const result = describe(op, left.value, right.value, value);

    // Replace the operator in the tree with its result.
    const node = choice.node;
    delete node.op;
    delete node.left;
    delete node.right;
    node.type = 'num';
    node.value = value;
    node.paren = false;

    steps.push({ op, reason, result, now: show(tree) });
  }

  return { start, steps, value: tree.value };
}

const conditionSim = document.getElementById('condition-sim');
const calcForm = document.getElementById('calc-form');
const calcInput = document.getElementById('calc-input');
const calcResult = document.getElementById('calc-result');

function code(text) {
  const el = document.createElement('code');
  el.textContent = text;
  return el;
}

function paragraph(...parts) {
  const p = document.createElement('p');
  parts.forEach((part) => p.append(part));
  return p;
}

// A comparison always gives 1 or 0. Any other result still works in an if:
// C treats 0 as false and every other number as true.
function finalMeaning(value, lastOp) {
  if (PRECEDENCE[lastOp] >= 3) {
    return value ? ' (true)' : ' (false)';
  }
  return value
    ? ` (an if would treat this as true, because it isn't 0)`
    : ` (an if would treat this as false, because it's 0)`;
}

function showWorking() {
  calcResult.replaceChildren();
  let working;
  try {
    working = workOut(calcInput.value);
  } catch (error) {
    const message = paragraph(error.message);
    message.className = 'sim-error';
    calcResult.append(message);
    return;
  }

  calcResult.append(paragraph('Start with: ', code(working.start)));

  if (working.steps.length === 0) {
    calcResult.append(paragraph('There are no operators to work out. Add a comparison, like 5 > 3.'));
    return;
  }

  const list = document.createElement('ol');
  const lastStep = working.steps[working.steps.length - 1];
  working.steps.forEach((step) => {
    const item = document.createElement('li');
    item.append(`${step.reason} ${step.result}`);
    if (step !== lastStep) {
      item.append(document.createElement('br'), 'Now: ', code(step.now));
    }
    list.append(item);
  });
  calcResult.append(list);

  const final = document.createElement('strong');
  final.textContent = `Final result: ${working.value}${finalMeaning(working.value, lastStep.op)}`;
  calcResult.append(paragraph(final));
}

calcForm.addEventListener('submit', (event) => {
  event.preventDefault(); // stay on the page instead of submitting the form
  showWorking();
});

document.querySelectorAll('.calc-example').forEach((button) => {
  button.addEventListener('click', () => {
    calcInput.value = button.textContent;
    showWorking();
  });
});

showWorking();
conditionSim.hidden = false;
