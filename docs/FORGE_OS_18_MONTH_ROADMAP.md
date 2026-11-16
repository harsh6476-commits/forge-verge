# FORGE OS — 18-Month Engineering Roadmap

**Version:** 1.0.0  |  **Timezone:** Asia/Kolkata  |  **Start:** 16 November 2026

**Curriculum:** 78 weeks / 546 days, ending 14 May 2028. **Day 547:** 15 May 2028, the final portfolio showcase/close-out day (the exact 18-calendar-month date is 16 May 2028).

> This roadmap starts from the learner's actual baseline: some React and backend implementation experience, basic JavaScript and DOM knowledge, MongoDB CRUD/Mongoose, Python, Git/GitHub, basic deployment, and prior projects. Main gaps to strengthen: JavaScript depth, independent logic-building, consistent C++ DSA, backend controller/business logic, database design, debugging/testing, system design and AI/ML foundations.

## 1. Public repository audit

Reviewed the public `main` branch on 16 November 2026. This is a source-code inspection of the published files, not a local build, database connection test or live runtime verification.

- `src/App.tsx` currently mounts **three routes**: Today (`/`), Daily List (`/daily-list`) and Milestones (`/milestones`). The agreed product has only Today and Milestones.
- `src/components/TopNav.tsx` still exposes a **DAILY LIST** navigation item. Remove that route and navigation item; keep historical-date browsing inside Today.
- `src/pages/Today.tsx` is a useful base: it fetches a dated plan, selects the first incomplete item, supports topic/subtopic completion, notes, attachments and date navigation. Preserve and simplify it rather than rebuilding blindly.
- `src/pages/Milestones.tsx` is also reusable: it already renders a winding path, selects the current milestone and supports notes/completion.
- The Express backend is present in the raw published source (`server/index.ts`, `server/services/curriculumService.ts`, and `server/services/curriculumSeeds.ts`). The package also has a `server` script. The backend's existence is therefore not the missing piece; the curriculum data and seed behaviour are.
- **The current `INITIAL_CURRICULUM_SEEDS` contains only seven assigned items:** six learning topics on Phase 1 / Week 1 / Days 1–3, plus one Week 1 Day 7 checkpoint. There are no explicit daily seeds for the rest of Week 1 or Weeks 2–78 in that seed array.
- `getOrCreateDailyPlan()` first looks for an exact phase/week/day match. When none exists, it falls back to any curriculum items whose `day` is 1, 2 or 3, without matching the requested phase or week. This can repeat unrelated Week 1 content on later dates. **Remove this fallback and seed the explicit dated curriculum in the supplied JSON.** Never silently substitute an unrelated topic.
- The existing milestone seed contains 12 broad nodes across six phases. It has useful names and technology groupings, but it does not provide the detailed target dates and measurable acceptance criteria in the new 17-milestone list.
- `package.json` includes `dev`, `client`, `server`, `build`, `lint`, `preview` and `test` scripts. There is no separate `typecheck` script; `build` runs `tsc -b` before Vite. Preserve working scripts and add only checks that actually exist.
- `IMPLEMENTATION_STATUS.md` reports a rebuilt two-page app and claims build, test and startup checks passed. Treat those as repository-reported results, not independently verified results. In particular, the live MongoDB/Cloudinary services and date-specific seed coverage were not tested by this audit.
- `README.md` is still the generic React + TypeScript + Vite starter text; update it to explain the actual app, environment variables, backend and curriculum seeding.

**Audit conclusion:** reuse the existing Today, TopicDetail, PIN-gate, Milestones and Express/Mongoose foundations. The most urgent curriculum defect is the seven-item seed set plus the cross-week fallback. Replace the seed source with the attached 78-week curriculum, remove the third Daily List route, and replace the 12 broad milestones with the outcome-based 17-milestone set. Do not confuse a populated UI or a successful frontend build with a complete, date-correct curriculum.

## 2. Calendar, workload and curriculum rules

- Six phases × 13 weeks = 78 weeks = 546 scheduled days.
- Day 1 is 16 November 2026. Week 78 ends 14 May 2028.
- 15 May 2028 is Day 547: a separate final showcase/close-out day. The existing app uses 15 May as its target end date; the 78 weekly curriculum records end on 14 May. Treat Day 547 as a special final showcase record, not as an extra ordinary day in Week 78. For clarity, the exact 18-calendar-month anniversary of 16 November 2026 is 16 May 2028; this plan preserves the repository’s existing 15 May target.
- Weekly rhythm: Day 1–5 focused learning; Day 6 practical checkpoint/lab; Day 7 light retrieval review and catch-up.
- Typical learning day: 100–160 minutes. Day 6 checkpoint: 150–180 minutes. Day 7 review: 45–60 minutes.
- DSA runs throughout all six phases: two focused sessions weekly plus two short spaced-recall sessions. Aim for approximately 180–220 well-understood and revised problems as a directional goal, not a vanity counter.
- One primary learning item per day, with 3–5 meaningful subtopics and a concrete implementation task. Keep the Today screen calm and focused.
- Watching a lecture is not completion. Completion means explaining, coding, testing or demonstrating the concept.
- University-heavy weeks can be manually rescheduled. Never auto-delete missed topics, fake completion or let backlog grow without bound.

## 3. Phase overview

| Phase | Focus | Weeks | Dates | Outcome |
|---|---|---:|---|---|
| 1 | Programming foundations and frontend engineering | 1–13 | 2026-11-16 – 2027-02-14 | Build JavaScript depth, practical React/TypeScript ability and DSA foundations in C++. |
| 2 | Backend and database engineering | 14–26 | 2027-02-15 – 2027-05-16 | Build maintainable Node/Express APIs, model data correctly and finish the existing e-commerce project. |
| 3 | Advanced DSA and production backend | 27–39 | 2027-05-17 – 2027-08-15 | Progress through advanced DSA and make the backend typed, tested, cached, containerised and observable. |
| 4 | Java, Spring Boot and system design | 40–52 | 2027-08-16 – 2027-11-14 | Learn Java/OOP, build a Spring Boot service and reason about scalable, resilient systems. |
| 5 | Systems, networking, cloud and DevOps | 53–65 | 2027-11-15 – 2028-02-13 | Understand Linux, OS, computer architecture, networking, cloud deployment and operational reliability. |
| 6 | AI engineering, LLM systems and research | 66–78 | 2028-02-14 – 2028-05-14 | Build ML foundations, understand transformers and deliver an evaluated RAG/agent capstone. |

## 4. Complete daily topic list

Each dated day below maps to one primary item in the app. Day 6 is the checkpoint item. Day 7 is a seeded weekly review item using the standard review template shown immediately after the 78-week schedule.

### Week 01 — Baseline, JavaScript runtime and C++ setup
**Phase 1 · Programming foundations and frontend engineering** | **2026-11-16 – 2026-11-22**  
Establish the actual starting level; begin JavaScript depth and a reliable C++ practice environment.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2026-11-16 | **Engineering Foundations**<br>Engineering baseline and toolchain audit | Timed JavaScript task: manipulate an array of objects and render a result<br>Small C++ task: read input, process values and print output<br>Inspect Git workflow, VS Code/CLion setup, terminal and compiler versions | Complete a 60-minute diagnostic without tutorials. Record what you could solve independently and where you got stuck. |
| D2 | 2026-11-17 | **JavaScript**<br>JavaScript values, types and coercion | Primitive values versus objects and reference identity<br>typeof, truthy/falsy values, equality and coercion<br>NaN, null, undefined, and safe type checks | Write small console experiments for coercion and equality; explain each result in your own words. |
| D3 | 2026-11-18 | **C++ / DSA**<br>C++ compilation, syntax and control flow | Source-to-executable compilation and compiler errors<br>Variables, types, operators, input/output<br>if/else, switch, loops and function main | Write three short programs: digit sum, prime check and min/max of input values. |
| D4 | 2026-11-19 | **DSA**<br>Complexity analysis and C++ STL orientation | Time versus space complexity; input-size reasoning<br>Big-O for loops, nested loops and basic searches<br>vector, string, pair and iterators | Analyse five short snippets and implement vector traversal, min/max and frequency counting. |
| D5 | 2026-11-20 | **Developer Workflow**<br>Git, terminal and project workflow refresh | Working tree, staging, commits and branches<br>Pull, push, merge and conflict resolution<br>Terminal navigation, file operations and npm scripts | Create a clean practice repository, make meaningful commits and resolve a deliberately-created merge conflict. |
| D6 · Checkpoint | 2026-11-21 | **Checkpoint**<br>Checkpoint: baseline report and programming warm-up | Solve one JavaScript data-transformation task independently<br>Solve two C++ fundamentals exercises<br>Write a short gap report: confident, shaky, unknown | Submit working code and a concise gap list. This is diagnostic, not a pass/fail exam. |

**Week deliverable:** Baseline code samples, environment notes and a prioritised gap list.
**Project linkage:** Diagnostic setup

### Week 02 — Functions, control flow and C++ fundamentals
**Phase 1 · Programming foundations and frontend engineering** | **2026-11-23 – 2026-11-29**  
Build fluency in writing small functions and reasoning about program flow.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2026-11-23 | **JavaScript**<br>JavaScript control flow and defensive conditions | if/else, switch and guard clauses<br>for, while, for...of and for...in<br>break, continue and early returns | Refactor a nested conditional into guard clauses and implement a menu-driven mini program. |
| D2 | 2026-11-24 | **DSA**<br>Arrays: traversal and invariants | Array indexing and bounds<br>Linear traversal and loop invariants<br>In-place updates versus creating a new array | Solve two array traversal problems: find second-largest and move zeroes. State time/space complexity. |
| D3 | 2026-11-25 | **JavaScript**<br>JavaScript functions and parameter patterns | Function declarations, expressions and arrow functions<br>Default, rest and spread parameters<br>Return values, pure functions and side effects | Implement reusable validators and a collection of pure transformation functions. |
| D4 | 2026-11-26 | **C++ / DSA**<br>C++ functions, references and pointers | Function signatures, pass-by-value and pass-by-reference<br>Pointers, addresses, nullptr and safe dereferencing<br>const correctness and reference parameters | Write swap, min/max and array-processing functions using references where appropriate. |
| D5 | 2026-11-27 | **C++ / DSA**<br>C++ strings, vectors and standard algorithms | std::string operations and character handling<br>vector push_back, size, indexing and iteration<br>sort, reverse, find, count and custom comparators | Implement a string normaliser and vector statistics tool using STL. |
| D6 · Checkpoint | 2026-11-28 | **Checkpoint**<br>Checkpoint: function-driven utility | Split a program into small single-purpose functions<br>Validate input and handle boundary cases<br>Use vector/string and write basic tests by hand | Build a command-line text statistics utility: character count, word count, frequency and longest word. |

**Week deliverable:** One small C++ utility and a JavaScript function practice file.

### Week 03 — Arrays, objects and data transformation
**Phase 1 · Programming foundations and frontend engineering** | **2026-11-30 – 2026-12-06**  
Become comfortable transforming real application data and solving array/string problems.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2026-11-30 | **JavaScript**<br>JavaScript arrays and iteration methods | map, filter, reduce and find<br>some, every, includes and sort comparator<br>Chaining methods and avoiding accidental mutation | Transform an API-like product array: filter, sort, group and compute totals. |
| D2 | 2026-12-01 | **DSA**<br>C++ arrays, vectors and prefix sums | Fixed arrays versus vectors<br>Prefix sums and range-sum queries<br>Subarray versus subsequence distinction | Solve range-sum and equilibrium-index problems; compare brute force with prefix sums. |
| D3 | 2026-12-02 | **JavaScript**<br>JavaScript objects and nested data | Object literals, nested access and optional chaining<br>Object.keys, values, entries and computed properties<br>Shallow copy, deep-copy limits and immutable updates | Model users, orders and products; implement safe nested updates without mutating the original. |
| D4 | 2026-12-03 | **DSA**<br>Strings and frequency patterns | Character arrays and string traversal<br>Frequency arrays and hash maps<br>Anagram, palindrome and duplicate detection | Implement valid-anagram and first-unique-character solutions in C++. |
| D5 | 2026-12-04 | **Web Foundations**<br>JSON, browser data and robust parsing | JSON parse/stringify and malformed input handling<br>Mapping API responses into application models<br>Date, number and missing-field normalisation | Read a local JSON dataset and produce a validated summary. |
| D6 · Checkpoint | 2026-12-05 | **Checkpoint**<br>Checkpoint: data transformation lab | Implement filter/sort/group/aggregate operations<br>Handle empty arrays, missing values and duplicates<br>Explain the complexity of each transformation | Build a small product/order data processor with at least six tested transformations. |

**Week deliverable:** Working data-transformation utility with edge-case tests.

### Week 04 — Searching, sorting and comparator reasoning
**Phase 1 · Programming foundations and frontend engineering** | **2026-12-07 – 2026-12-13**  
Understand algorithmic trade-offs and reliable ordering.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2026-12-07 | **DSA**<br>Sorting fundamentals and comparator contracts | Stable versus unstable sorting<br>Comparator correctness and tie-breaking<br>Selection, insertion and bubble sort as learning models | Implement insertion sort and selection sort; compare their behaviour on nearly sorted input. |
| D2 | 2026-12-08 | **DSA**<br>Binary search on sorted arrays | Search interval invariants<br>Lower bound and upper bound<br>Off-by-one errors and termination | Solve standard binary search, first/last occurrence and insertion position. |
| D3 | 2026-12-09 | **JavaScript**<br>JavaScript sort and data ordering | Numeric versus lexicographic sorting<br>Sort objects by multiple fields<br>Stable ordering and non-mutating copies | Create a reusable multi-key sorter for products and orders. |
| D4 | 2026-12-10 | **C++ / DSA**<br>C++ STL searching and comparator practice | sort, stable_sort and custom lambdas<br>lower_bound, upper_bound and binary_search<br>Pair sorting and coordinate ordering | Solve first-bad-position and count-occurrences tasks using STL. |
| D5 | 2026-12-11 | **Algorithms**<br>Complexity trade-offs and algorithm selection | O(n log n) versus O(n²) at realistic input sizes<br>Best, average and worst-case reasoning<br>Space use and in-place algorithms | Benchmark two sorting approaches on increasing input sizes and explain the observed trend. |
| D6 · Checkpoint | 2026-12-12 | **Checkpoint**<br>Checkpoint: search-and-sort assessment | Implement binary search without looking up code<br>Choose an appropriate sorting strategy<br>Pass empty, singleton, duplicate and boundary tests | Complete a timed set of three search/sort problems and write a complexity note. |

**Week deliverable:** Search/sort implementations and a small benchmark note.
**Research note:** JavaScript execution and browser runtime — Create an event-loop trace and explain scope/closure behaviour using runnable examples.

### Week 05 — JavaScript scope, closures and functional patterns
**Phase 1 · Programming foundations and frontend engineering** | **2026-12-14 – 2026-12-20**  
Master the execution rules that commonly cause bugs in callbacks and asynchronous code.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2026-12-14 | **JavaScript**<br>Execution context, scope and hoisting | Global, function and block scope<br>Lexical environment and shadowing<br>var, let, const and temporal dead zone | Predict outputs for ten scope snippets, then verify them in Node and the browser. |
| D2 | 2026-12-15 | **DSA**<br>Hash maps and set-based problem solving | unordered_map and unordered_set<br>Frequency maps and complement lookup<br>Average-case complexity and collision intuition | Solve Two Sum, Contains Duplicate and frequency-based string problems. |
| D3 | 2026-12-16 | **JavaScript**<br>Closures and higher-order functions | Lexical capture and closure lifetime<br>Callbacks and function factories<br>Private state and module patterns | Build a counter factory, once function and memoize utility; explain captured state. |
| D4 | 2026-12-17 | **DSA**<br>Hashing patterns and prefix-frequency techniques | Prefix-sum hash maps<br>Subarray sum equals K<br>First occurrence and frequency-count maps | Solve subarray-sum and longest-consecutive-sequence style problems. |
| D5 | 2026-12-18 | **JavaScript**<br>Functional composition and immutability | Pure versus impure functions<br>Composition, currying and partial application concepts<br>Immutability in nested objects and arrays | Refactor nested data transformations into composable pure functions. |
| D6 · Checkpoint | 2026-12-19 | **Checkpoint**<br>Checkpoint: closure and hashing lab | Implement closure utilities without copying a tutorial<br>Solve two hash-map problems independently<br>Explain time/space trade-offs | Build a tiny in-memory cache using closures and complete a timed hashing assessment. |

**Week deliverable:** Closure utilities and solved hash-map problems with explanations.
**Project linkage:** JavaScript fundamentals lab

### Week 06 — Objects, this, prototypes and asynchronous foundations
**Phase 1 · Programming foundations and frontend engineering** | **2026-12-21 – 2026-12-27**  
Understand JavaScript object behaviour and prepare for async programming.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2026-12-21 | **JavaScript**<br>this binding and function invocation | Global, implicit, explicit and constructor binding<br>call, apply and bind<br>Arrow functions and lexical this | Fix five this-binding bugs in small object and callback examples. |
| D2 | 2026-12-22 | **DSA**<br>Two pointers and in-place array patterns | Opposite-direction pointers<br>Fast/slow pointers<br>Sorted-array duplicate removal and pair sums | Solve pair sum, remove duplicates and container/two-sum sorted variants. |
| D3 | 2026-12-23 | **JavaScript**<br>Prototypes, classes and inheritance model | Prototype chain and property lookup<br>Constructor functions and class syntax<br>Composition versus inheritance | Implement a small domain model using prototypes/classes and inspect its prototype chain. |
| D4 | 2026-12-24 | **DSA**<br>Sliding window fundamentals | Fixed-size windows<br>Variable-size windows and shrinking conditions<br>Window invariants and frequency state | Solve maximum-sum subarray of size K and longest substring without repeats. |
| D5 | 2026-12-25 | **JavaScript**<br>ES modules, package boundaries and error handling | Named/default exports and imports<br>package.json, npm scripts and dependency boundaries<br>throw, try/catch and custom error classes | Split a small Node utility into modules and handle invalid inputs cleanly. |
| D6 · Checkpoint | 2026-12-26 | **Checkpoint**<br>Checkpoint: object model and window patterns | Explain prototype lookup and this binding<br>Implement fixed and variable sliding windows<br>Refactor a small codebase into modules | Complete two sliding-window problems and a JavaScript object-model code review. |

**Week deliverable:** Modular JavaScript utility and a short object-model explanation.

### Week 07 — Asynchronous JavaScript and browser APIs
**Phase 1 · Programming foundations and frontend engineering** | **2026-12-28 – 2027-01-03**  
Build a correct mental model of promises, async/await, event loop and network requests.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2026-12-28 | **JavaScript**<br>Call stack, task queue and event loop | Synchronous call stack<br>Microtasks versus macrotasks<br>Promise callbacks, timers and rendering order | Predict and explain output order for ten event-loop snippets. |
| D2 | 2026-12-29 | **DSA**<br>Recursion and backtracking foundations | Base cases and recursive state<br>Call-stack growth and recursion trees<br>Subsets and permutations | Solve factorial, subsets and permutation problems; draw the recursion tree for one. |
| D3 | 2026-12-30 | **JavaScript**<br>Promises and async/await | Promise states and chaining<br>Promise.all, allSettled, race and any<br>Sequential versus parallel async work | Refactor callback-style code into promises and async/await; handle failures. |
| D4 | 2026-12-31 | **DSA**<br>Backtracking with constraints | Choose-explore-unchoose pattern<br>Pruning invalid branches<br>Combination sum and maze/path variants | Solve combination-sum and one constraint-based backtracking problem. |
| D5 | 2027-01-01 | **Web Foundations**<br>Fetch API, HTTP errors and cancellation | Request/response lifecycle and status codes<br>JSON parsing and non-2xx handling<br>AbortController, timeout and retry basics | Build a resilient fetch wrapper with timeout, error mapping and cancellation. |
| D6 · Checkpoint | 2027-01-02 | **Checkpoint**<br>Checkpoint: asynchronous API client | Load multiple endpoints concurrently<br>Handle loading, empty, error and timeout states<br>Prevent stale responses from overwriting newer requests | Build a small API client that searches, filters and displays remote data robustly. |

**Week deliverable:** Reusable async API client and event-loop notes.

### Week 08 — DOM, browser storage and TypeScript foundations
**Phase 1 · Programming foundations and frontend engineering** | **2027-01-04 – 2027-01-10**  
Bridge JavaScript knowledge into robust browser applications and typed code.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2027-01-04 | **Browser Engineering**<br>DOM tree, selection and safe rendering | DOM querying and traversal<br>Creating, updating and removing nodes<br>textContent versus unsafe HTML injection | Build a dynamic list interface without a framework and avoid unsafe HTML injection. |
| D2 | 2027-01-05 | **DSA**<br>Linked lists: representation and operations | Node structure and head/tail references<br>Insertion, deletion and traversal<br>Reverse a linked list and fast/slow pointers | Implement a singly linked list in C++ and solve reverse-list and cycle-detection tasks. |
| D3 | 2027-01-06 | **Browser Engineering**<br>Events, bubbling and event delegation | Capture and bubble phases<br>Event target/currentTarget<br>Delegation and default prevention | Implement a dynamic list with delegated click, edit and delete actions. |
| D4 | 2027-01-07 | **DSA**<br>Linked-list patterns and complexity | Cycle detection using Floyd's algorithm<br>Middle node and merge two sorted lists<br>Dummy/sentinel nodes | Solve middle-of-list, linked-list-cycle and merge-two-lists. |
| D5 | 2027-01-08 | **TypeScript**<br>TypeScript essentials | Primitive/object types, arrays and tuples<br>Union types, narrowing and type guards<br>Interfaces, type aliases and optional properties | Convert a JavaScript data model and API response into typed TypeScript. |
| D6 · Checkpoint | 2027-01-09 | **Checkpoint**<br>Checkpoint: typed browser utility | Build a DOM workflow using event delegation<br>Persist state in localStorage<br>Model input/output using TypeScript types | Create a typed browser bookmark or reading-list utility with validation and persistence. |

**Week deliverable:** Typed browser utility with clean event handling.
**Research note:** Browser API reliability — Compare failure, timeout and cancellation handling in two API-client implementations.

### Week 09 — React foundations and component architecture
**Phase 1 · Programming foundations and frontend engineering** | **2027-01-11 – 2027-01-17**  
Strengthen React fundamentals by building reusable components rather than copying patterns.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2027-01-11 | **React**<br>React rendering model and component composition | Function components and JSX<br>Props, composition and children<br>Keys, list rendering and component boundaries | Break a dense screen into reusable components with clear props. |
| D2 | 2027-01-12 | **DSA**<br>Stacks and queues | Stack operations and use cases<br>Queue/deque operations<br>Monotonic stack introduction | Implement stack and queue in C++; solve valid-parentheses and next-greater-element basics. |
| D3 | 2027-01-13 | **React**<br>State, events and controlled inputs | useState and state snapshots<br>Controlled inputs and event handlers<br>Lifting state and avoiding duplicated state | Build a searchable/filterable list with controlled inputs and derived state. |
| D4 | 2027-01-14 | **DSA**<br>Stack and queue problem patterns | Balanced parentheses and expression processing<br>Queue-based BFS intuition<br>Monotonic stack for next greater element | Solve valid parentheses, daily temperatures and queue implementation problems. |
| D5 | 2027-01-15 | **React**<br>React forms and validation | Controlled forms and field state<br>Client-side validation and error messages<br>Submission state and accessibility | Build a form with validation, submission feedback and keyboard-friendly labels. |
| D6 · Checkpoint | 2027-01-16 | **Checkpoint**<br>Checkpoint: component-driven React feature | Use at least five purposeful components<br>Keep state in the correct owner<br>Handle empty, loading and validation states | Build a small issue/task board with create, edit, filter and delete interactions. |

**Week deliverable:** Reusable React feature with a documented component tree.

### Week 10 — React hooks, effects and API-driven interfaces
**Phase 1 · Programming foundations and frontend engineering** | **2027-01-18 – 2027-01-24**  
Use hooks correctly and handle real-world asynchronous UI states.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2027-01-18 | **React**<br>useEffect lifecycle and dependency reasoning | Effects versus event handlers<br>Dependency arrays and cleanup<br>Avoiding derived-state and infinite-loop bugs | Fix intentionally broken effects and implement a subscription with cleanup. |
| D2 | 2027-01-19 | **DSA**<br>Binary trees: structure and traversal | Tree node representation<br>Preorder, inorder and postorder<br>Level-order traversal with a queue | Implement recursive and iterative traversals; solve maximum depth and level-order traversal. |
| D3 | 2027-01-20 | **React**<br>API integration and custom hooks | Fetch in effects and cancellation<br>Reusable custom hook design<br>Loading, error, empty and retry states | Create a useApi/useFetch hook with typed result states. |
| D4 | 2027-01-21 | **DSA**<br>BST operations and tree properties | BST insertion, search and deletion concepts<br>Height, depth and balanced-tree intuition<br>Validate BST and lowest common ancestor | Implement BST search/insert and solve validate-BST and LCA tasks. |
| D5 | 2027-01-22 | **React**<br>Context and reducer for shared state | Context API and provider boundaries<br>useReducer and action design<br>Avoiding unnecessary global state | Refactor shared filters or cart-like state into a reducer and context. |
| D6 · Checkpoint | 2027-01-23 | **Checkpoint**<br>Checkpoint: API-powered React application | Integrate a real public API<br>Support search, filtering and detail views<br>Handle request cancellation and failures | Build an API explorer with reusable hooks and a clean state model. |

**Week deliverable:** API explorer with reusable data-fetching hooks.
**Project linkage:** API Explorer

### Week 11 — React routing, state architecture and accessibility
**Phase 1 · Programming foundations and frontend engineering** | **2027-01-25 – 2027-01-31**  
Develop multi-page application structure and accessible interaction patterns.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2027-01-25 | **React**<br>Client-side routing and nested layouts | Route definitions and nested routes<br>URL parameters, query strings and navigation<br>Not-found routes and protected-route concepts | Add list/detail routes to the API explorer and preserve filters in URL query parameters. |
| D2 | 2027-01-26 | **DSA**<br>Heaps and priority queues | Heap property and array representation<br>Push/pop and heapify complexity<br>Top-K and k-way merge use cases | Use C++ priority_queue to solve top-K elements and kth-largest problems. |
| D3 | 2027-01-27 | **React**<br>State architecture and reducer patterns | Server state versus UI state<br>Reducer actions and predictable transitions<br>Avoiding prop drilling without overusing context | Model a multi-step workflow with a reducer and document state transitions. |
| D4 | 2027-01-28 | **DSA**<br>Heap patterns and interval scheduling | Merge K sorted streams intuition<br>Meeting-room scheduling with heaps<br>Greedy interval sorting | Solve meeting rooms and merge-k-sorted-lists/arrays style problems. |
| D5 | 2027-01-29 | **Frontend Engineering**<br>Accessibility and responsive UI audit | Semantic HTML and heading hierarchy<br>Keyboard navigation, focus and labels<br>Responsive layout and reduced-motion preferences | Audit the API explorer with keyboard only and fix the three largest accessibility issues. |
| D6 · Checkpoint | 2027-01-30 | **Checkpoint**<br>Checkpoint: multi-route React release | Implement list/detail routes and resilient state<br>Add accessible navigation and responsive layout<br>Document architecture and known trade-offs | Release a polished API explorer with README, screenshots and deployed demo. |

**Week deliverable:** Deployed React application with route-based navigation and accessibility fixes.

### Week 12 — TypeScript in React, testing and frontend quality
**Phase 1 · Programming foundations and frontend engineering** | **2027-02-01 – 2027-02-07**  
Add type safety and tests; improve maintainability without overengineering.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2027-02-01 | **TypeScript**<br>TypeScript generics and utility types | Generic functions and interfaces<br>keyof, typeof, indexed access<br>Partial, Pick, Omit, Record and mapped types | Create reusable generic API response and form-state types. |
| D2 | 2027-02-02 | **DSA**<br>Graph representations and traversal basics | Adjacency list versus adjacency matrix<br>BFS and DFS<br>Visited sets and connected components | Build graph traversal in C++ and solve number-of-islands and connected-components tasks. |
| D3 | 2027-02-03 | **TypeScript / React**<br>Typed React props, events and hooks | Typing props and children<br>Typing events, refs and state<br>Generic reusable components and hooks | Refactor two reusable components and a custom hook to strict TypeScript. |
| D4 | 2027-02-04 | **DSA**<br>Graph traversal applications | Grid-to-graph modelling<br>BFS shortest path in unweighted graphs<br>Cycle detection in undirected graphs | Solve shortest-path-in-grid and undirected-cycle tasks. |
| D5 | 2027-02-05 | **Testing**<br>Frontend testing and error boundaries | Unit tests for utilities<br>Component tests for interactions<br>Mocking network requests and error boundaries | Test a form, reducer and async component using React Testing Library/Vitest. |
| D6 · Checkpoint | 2027-02-06 | **Checkpoint**<br>Checkpoint: frontend quality gate | No TypeScript any without justification<br>Test critical user flows<br>Run build and lint and resolve warnings | Prepare a release candidate with type checks, tests, lint and a short quality report. |

**Week deliverable:** Tested TypeScript React codebase with a clean build.

### Week 13 — Frontend capstone and DSA foundations assessment
**Phase 1 · Programming foundations and frontend engineering** | **2027-02-08 – 2027-02-14**  
Consolidate frontend engineering and foundational DSA into one demonstrable release.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2027-02-08 | **Frontend Engineering**<br>Frontend architecture and performance review | Component boundaries and feature-based folders<br>Bundle size, lazy loading and code splitting<br>Avoiding unnecessary renders and expensive derived work | Profile the API explorer, identify one bottleneck and make a measured improvement. |
| D2 | 2027-02-09 | **DSA**<br>DSA mixed arrays, strings and hashing review | Choose between two pointers, sliding window and hashing<br>Explain invariants before coding<br>Complexity and edge-case review | Complete a timed mixed set of four problems without topic labels. |
| D3 | 2027-02-10 | **Frontend Engineering**<br>Polish forms, routing and data persistence | Form validation and optimistic UI decisions<br>URL state and browser storage<br>Loading, error, empty and retry UX | Close the remaining usability gaps in the frontend capstone. |
| D4 | 2027-02-11 | **DSA**<br>Trees, heaps and graph fundamentals review | Select traversal strategy from problem constraints<br>Compare DFS, BFS and heap use cases<br>Trace recursion and queue state | Complete three mixed data-structure problems and explain your choices. |
| D5 | 2027-02-12 | **Developer Workflow**<br>Frontend release engineering | Environment variables and production build<br>README, screenshots and reproducible setup<br>Basic deployment and issue triage | Prepare a clean release checklist and test the app in a fresh browser profile. |
| D6 · Checkpoint | 2027-02-13 | **Checkpoint**<br>Phase 1 checkpoint: frontend + DSA demonstration | Demonstrate the deployed React/TypeScript project<br>Solve two unseen DSA problems and explain complexity<br>Present a five-minute architecture walkthrough | Release the frontend capstone and complete a foundational DSA assessment; record gaps for Phase 2. |

**Week deliverable:** Phase 1 portfolio release: deployed React/TypeScript API Explorer plus DSA review notes.
**Research note:** React rendering and accessibility — Profile one React interaction and record one measured performance/accessibility improvement.
**Project linkage:** Frontend capstone

### Week 14 — Node.js runtime and backend foundations
**Phase 2 · Backend and database engineering** | **2027-02-15 – 2027-02-21**  
Move from knowing Express patterns to understanding what Node is doing underneath.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2027-02-15 | **Node.js**<br>Node runtime, V8 and libuv overview | JavaScript runtime versus browser runtime<br>Call stack, event loop and libuv worker pool<br>CommonJS versus ES modules | Trace how an HTTP request is handled and run experiments with timers, promises and file I/O. |
| D2 | 2027-02-16 | **DSA**<br>DSA maintenance: recursion, binary search and arrays | Recursive versus iterative implementation<br>Binary-search boundary templates<br>Array/hash-map pattern selection | Solve two mixed problems and re-solve one Phase 1 problem from memory. |
| D3 | 2027-02-17 | **Node.js**<br>Node modules, npm and configuration | package.json scripts and dependency types<br>Environment variables and config validation<br>Module boundaries and dependency injection basics | Create a small Node service with validated configuration and separate modules. |
| D4 | 2027-02-18 | **DSA**<br>DSA maintenance: linked lists, stacks and queues | Pointer manipulation and dummy nodes<br>Stack/queue use cases<br>Complexity of common operations | Solve one linked-list and one stack/queue problem without looking at old code. |
| D5 | 2027-02-19 | **Node.js**<br>File I/O, streams and buffers | Synchronous versus asynchronous I/O<br>Readable, writable and transform streams<br>Backpressure and Buffer basics | Stream a large text file and compare memory behaviour with readFile. |
| D6 · Checkpoint | 2027-02-20 | **Checkpoint**<br>Checkpoint: Node command-line data service | Use modules and async file APIs<br>Validate configuration and inputs<br>Implement structured errors and tests | Build a CLI that imports, validates and summarises a JSON dataset without loading unnecessary data into memory. |

**Week deliverable:** Modular Node CLI demonstrating async I/O and stream fundamentals.

### Week 15 — Express architecture, middleware and error handling
**Phase 2 · Backend and database engineering** | **2027-02-22 – 2027-02-28**  
Design maintainable Express APIs with clear separation of concerns.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2027-02-22 | **Node.js / Express**<br>Express request lifecycle and routing | Application, router and route handlers<br>Route params, query params and request body<br>Controller responsibility and response shape | Create a resource API with list, detail, create, update and delete routes. |
| D2 | 2027-02-23 | **DSA**<br>DSA maintenance: trees and traversal | Recursive tree traversal<br>Level-order traversal<br>BST invariants and common edge cases | Solve maximum depth and validate-BST; explain recursion stack space. |
| D3 | 2027-02-24 | **Node.js / Express**<br>Middleware, request pipeline and composition | Application-level and router-level middleware<br>Authentication, logging and validation middleware<br>Order of middleware and next/error flow | Implement request logging, request ID, input validation and centralized error middleware. |
| D4 | 2027-02-25 | **DSA**<br>DSA maintenance: binary search and heap patterns | Binary search on answer-space intuition<br>Priority queues for top-K<br>Heap complexity and comparator | Solve one binary-search-on-answer and one heap problem. |
| D5 | 2027-02-26 | **Backend Engineering**<br>Validation, domain errors and API contracts | Schema validation with Zod/Joi or equivalent<br>Consistent error response format<br>Avoiding trust in client-supplied data | Add request validation and domain-specific errors to the resource API. |
| D6 · Checkpoint | 2027-02-27 | **Checkpoint**<br>Checkpoint: clean Express CRUD API | Routes/controllers/services are separated<br>All inputs validated and errors centralised<br>Add endpoint documentation and manual test cases | Deliver a small Express API that has predictable status codes, validation and error handling. |

**Week deliverable:** Express API with clear route/controller/service boundaries.

### Week 16 — REST API design, pagination and filtering
**Phase 2 · Backend and database engineering** | **2027-03-01 – 2027-03-07**  
Design APIs for real clients instead of endpoints that only work in a demo.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2027-03-01 | **Backend Engineering**<br>HTTP semantics and REST resource modelling | GET/POST/PUT/PATCH/DELETE semantics<br>Idempotency and safe methods<br>Status codes, headers and content negotiation | Design an API contract for products and orders before implementing it. |
| D2 | 2027-03-02 | **DSA**<br>DSA maintenance: sliding window and two pointers | Window growth and shrink conditions<br>Sorted versus unsorted two-pointer strategies<br>Invariants and edge cases | Solve one string-window and one sorted-array problem. |
| D3 | 2027-03-03 | **Backend Engineering**<br>Pagination, filtering, sorting and search | Offset versus cursor pagination<br>Stable sorting and deterministic cursors<br>Filter whitelists and query validation | Implement pagination, filtering and sorting for product listing. |
| D4 | 2027-03-04 | **DSA**<br>DSA maintenance: prefix sums and hash maps | Prefix-sum range queries<br>Subarray-sum maps<br>Frequency and counting patterns | Solve two mixed prefix-sum/hash-map problems. |
| D5 | 2027-03-05 | **Backend Engineering**<br>API documentation and versioning | OpenAPI/Swagger basics<br>Request/response examples and error schemas<br>Backward-compatible API changes | Document the resource API and generate a browsable OpenAPI page. |
| D6 · Checkpoint | 2027-03-06 | **Checkpoint**<br>Checkpoint: client-ready REST API | Implement stable pagination and validated filters<br>Document API contracts<br>Test success and error responses | Expose a complete product API that a separate frontend can consume without reading backend source. |

**Week deliverable:** Documented REST API with deterministic pagination and test cases.

### Week 17 — MongoDB data modelling and Mongoose
**Phase 2 · Backend and database engineering** | **2027-03-08 – 2027-03-14**  
Move beyond CRUD and design document structures from application access patterns.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2027-03-08 | **MongoDB**<br>Document modelling and embedding versus referencing | Document boundaries and aggregate concepts<br>Embed data read together; reference shared/high-growth data<br>Avoid unbounded arrays and oversized documents | Model users, products, carts and orders; justify each embed/reference choice. |
| D2 | 2027-03-09 | **DSA**<br>DSA maintenance: sorting and interval patterns | Sort-first strategy<br>Merge intervals<br>Greedy selection after sorting | Solve merge-intervals and one meeting-scheduling problem. |
| D3 | 2027-03-10 | **MongoDB / Mongoose**<br>Mongoose schemas, validation and hooks | Schema types, defaults and required fields<br>Custom validation and enums<br>Pre/post middleware and virtuals | Implement Mongoose models for products and carts with business constraints. |
| D4 | 2027-03-11 | **DSA**<br>DSA maintenance: trees and graph traversal | Tree BFS/DFS selection<br>Graph adjacency list<br>Visited-state design | Solve a tree traversal and graph reachability problem. |
| D5 | 2027-03-12 | **MongoDB**<br>References, population and query design | ObjectId references and populate<br>Projection and lean queries<br>Avoiding N+1-style query patterns | Implement user-specific cart and order reads using intentional projections. |
| D6 · Checkpoint | 2027-03-13 | **Checkpoint**<br>Checkpoint: e-commerce data model review | Document user/product/cart/order schemas<br>Show sample documents and query patterns<br>Explain consistency and growth risks | Produce a data-model document and implement the core Mongoose schemas for the existing e-commerce project. |

**Week deliverable:** E-commerce data model and initial schemas.
**Research note:** REST API contract design — Read an API design guide and critique pagination, errors and idempotency in a real API.

### Week 18 — MongoDB querying, indexes and aggregation
**Phase 2 · Backend and database engineering** | **2027-03-15 – 2027-03-21**  
Build efficient and expressive data access.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2027-03-15 | **MongoDB**<br>MongoDB query operators and projections | Comparison, logical and array operators<br>Projection and field inclusion/exclusion<br>Update operators and atomic document updates | Implement product filters and cart quantity updates with validated query operators. |
| D2 | 2027-03-16 | **DSA**<br>DSA maintenance: heap and greedy patterns | Priority queue operations<br>Top-K selection<br>Greedy choice and counterexamples | Solve top-K frequent elements and one interval greedy problem. |
| D3 | 2027-03-17 | **MongoDB**<br>Indexes and query planning | Single-field and compound indexes<br>Selectivity, sort support and index prefixes<br>Explain plans and index trade-offs | Add indexes for actual product/order queries and inspect explain output. |
| D4 | 2027-03-18 | **DSA**<br>DSA maintenance: binary search and monotonic structures | Search in rotated arrays<br>Monotonic stack/queue<br>Amortised complexity intuition | Solve search-in-rotated-array and next-greater-element. |
| D5 | 2027-03-19 | **MongoDB**<br>Aggregation pipeline fundamentals | match, group, project and sort<br>lookup and unwind<br>Pipeline order and aggregation cost | Build order summary, revenue by category and stock-report aggregation pipelines. |
| D6 · Checkpoint | 2027-03-20 | **Checkpoint**<br>Checkpoint: query optimisation lab | Identify two slow or inefficient query patterns<br>Add appropriate indexes<br>Compare explain output before and after | Submit an aggregation report and a short query-performance note for the e-commerce database. |

**Week deliverable:** Indexed schemas and tested aggregation pipelines.

### Week 19 — Authentication, sessions and authorisation
**Phase 2 · Backend and database engineering** | **2027-03-22 – 2027-03-28**  
Implement secure user access and server-side permission checks.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2027-03-22 | **Backend Security**<br>Password storage and authentication flow | Hashing versus encryption; bcrypt/Argon2 concepts<br>Registration and login flow<br>Credential validation and account enumeration | Implement registration/login with password hashing and generic failure responses. |
| D2 | 2027-03-23 | **DSA**<br>DSA maintenance: graph BFS/DFS and connected components | Adjacency lists and visited arrays<br>BFS shortest path in unweighted graphs<br>Connected components | Solve number-of-islands and connected-components style problems. |
| D3 | 2027-03-24 | **Backend Security**<br>Session cookies and token-based auth trade-offs | Cookie attributes: HttpOnly, Secure, SameSite<br>Session storage and expiration<br>JWT structure, signature and revocation trade-offs | Implement either a secure server-side session or a carefully validated token approach; document the trade-off. |
| D4 | 2027-03-25 | **DSA**<br>DSA maintenance: recursion/backtracking review | Backtracking state and pruning<br>Combinatorial search<br>Avoiding duplicate branches | Solve one subset/permutation problem and one constrained search problem. |
| D5 | 2027-03-26 | **Backend Security**<br>Authorisation, ownership and common vulnerabilities | Role-based and resource-level access<br>IDOR and broken object-level authorisation<br>CORS, CSRF, rate limits and secure headers | Add ownership checks to cart/order endpoints and test access-denied cases. |
| D6 · Checkpoint | 2027-03-27 | **Checkpoint**<br>Checkpoint: secure account and access layer | Secure password handling and session lifecycle<br>Protect private routes and resources<br>Test unauthorised and cross-user access | Demonstrate login, logout, expiry and resource-ownership tests in the e-commerce backend. |

**Week deliverable:** Working account access layer with security tests.

### Week 20 — E-commerce cart: state, invariants and business logic
**Phase 2 · Backend and database engineering** | **2027-03-29 – 2027-04-04**  
Finish the cart feature that previously blocked your e-commerce implementation.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2027-03-29 | **Backend Engineering**<br>Cart domain model and invariants | Cart ownership and one active cart per user<br>Cart item product reference and quantity constraints<br>Price snapshot versus live price decision | Write cart invariants before controller code; define expected behaviour for unavailable products. |
| D2 | 2027-03-30 | **DSA**<br>DSA maintenance: graph and tree mixed problems | Tree depth and ancestor patterns<br>Graph traversal state<br>Complexity from node/edge counts | Solve two mixed problems and explain why the chosen traversal is correct. |
| D3 | 2027-03-31 | **Node.js / Express**<br>Cart controller operations | Add item: create or increment existing line<br>Update quantity with min/max validation<br>Remove item and clear cart | Implement add/update/remove/clear endpoints using service functions rather than large controllers. |
| D4 | 2027-04-01 | **DSA**<br>DSA maintenance: sorting, hash and sliding-window review | Pattern recognition from constraints<br>Write brute force before optimisation<br>Prove the invariant for the optimised approach | Complete a timed set of three mixed problems. |
| D5 | 2027-04-02 | **Backend Engineering**<br>Cart totals, validation and stale products | Compute totals on the server<br>Handle deleted/disabled products and stock limits<br>Prevent trusting client-submitted price values | Implement a single cart-summary service and test price/quantity edge cases. |
| D6 · Checkpoint | 2027-04-03 | **Checkpoint**<br>Checkpoint: complete persistent cart | Add/update/remove/clear operations work<br>Cart persists by user across refresh/login<br>Totals and invalid cases are handled server-side | Finish the cart end-to-end in the existing e-commerce project and test it through the React UI. |

**Week deliverable:** Working user-specific e-commerce cart—the original blocker is resolved.
**Project linkage:** E-commerce flagship

### Week 21 — Orders, checkout and inventory consistency
**Phase 2 · Backend and database engineering** | **2027-04-05 – 2027-04-11**  
Turn a cart into an order safely, including concurrent requests and stock changes.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2027-04-05 | **Backend Engineering**<br>Order lifecycle and state machine | Cart-to-order transition<br>Order statuses and allowed transitions<br>Immutable order line snapshots | Design a state diagram for pending, confirmed, cancelled and fulfilled orders. |
| D2 | 2027-04-06 | **DSA**<br>DSA maintenance: greedy and interval problems | Interval sorting and scheduling<br>Heap-based resource allocation<br>Greedy proof intuition | Solve two interval/priority-queue problems with complexity analysis. |
| D3 | 2027-04-07 | **Backend Engineering**<br>Checkout and server-side pricing | Revalidate product status and price at checkout<br>Shipping/tax/discount calculation boundaries<br>Idempotent order creation | Implement checkout preview and order creation with a simulated payment result. |
| D4 | 2027-04-08 | **DSA**<br>DSA maintenance: graph shortest-path introduction | Weighted versus unweighted graphs<br>Dijkstra intuition and non-negative weights<br>Priority queue relaxation | Implement Dijkstra on a small weighted graph and trace its priority queue. |
| D5 | 2027-04-09 | **Database Engineering**<br>Inventory consistency and MongoDB transactions | Stock decrement and overselling scenario<br>Atomic conditional updates<br>Transactions, rollback and retry handling | Implement safe inventory reservation or conditional decrement; test two concurrent checkout attempts. |
| D6 · Checkpoint | 2027-04-10 | **Checkpoint**<br>Checkpoint: order and inventory workflow | Create orders from validated carts<br>Prevent negative stock/duplicate checkout<br>Persist order history and handle cancellation | Deliver a complete simulated checkout flow with order history and inventory-safe behaviour. |

**Week deliverable:** Order lifecycle, simulated checkout and inventory-consistency tests.
**Research note:** Database consistency and transactions — Reproduce an inventory race condition and document the database-level fix.

### Week 22 — SQL fundamentals and relational modelling
**Phase 2 · Backend and database engineering** | **2027-04-12 – 2027-04-18**  
Learn relational data modelling and SQL as a complementary backend skill.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2027-04-12 | **SQL / DBMS**<br>Relational databases and schema design | Tables, rows, columns, primary and foreign keys<br>Functional dependencies and normalisation intuition<br>One-to-one, one-to-many and many-to-many relationships | Design a relational schema for users, products, orders and order items. |
| D2 | 2027-04-13 | **DSA**<br>DSA maintenance: DP intuition and recurrence | Overlapping subproblems and optimal substructure<br>Memoisation versus tabulation<br>State definition and base cases | Solve Fibonacci and climbing-stairs; write the recurrence before code. |
| D3 | 2027-04-14 | **SQL**<br>SQL SELECT, filtering, sorting and aggregation | WHERE, ORDER BY, LIMIT and DISTINCT<br>GROUP BY and HAVING<br>NULL semantics and aggregate behaviour | Write queries for revenue, top products, customer totals and monthly order counts. |
| D4 | 2027-04-15 | **DSA**<br>DSA dynamic programming: one-dimensional states | House robber pattern<br>Minimum-cost and maximum-value state transitions<br>Space optimisation | Solve house-robber and minimum-cost climbing-stairs variants. |
| D5 | 2027-04-16 | **SQL / DBMS**<br>JOINs and relational query reasoning | INNER, LEFT and self joins<br>Join cardinality and duplicate rows<br>Subqueries and common table expressions | Write joins for order summaries, customer history and low-stock product reports. |
| D6 · Checkpoint | 2027-04-17 | **Checkpoint**<br>Checkpoint: SQL schema and reporting | Create tables with constraints<br>Write at least eight meaningful queries<br>Explain normalisation and join choices | Build a small PostgreSQL schema and a reporting query set for the e-commerce domain. |

**Week deliverable:** PostgreSQL schema and documented reporting queries.

### Week 23 — PostgreSQL indexes, transactions and query plans
**Phase 2 · Backend and database engineering** | **2027-04-19 – 2027-04-25**  
Understand how relational databases preserve correctness and improve query performance.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2027-04-19 | **SQL / DBMS**<br>Constraints, keys and migrations | Unique, check, not-null and foreign-key constraints<br>Schema migration and rollback strategy<br>Seed data and repeatable environments | Create versioned migrations for the e-commerce relational schema. |
| D2 | 2027-04-20 | **DSA**<br>DSA maintenance: DP grids and knapsack basics | Grid-state modelling<br>0/1 knapsack recurrence<br>Iteration order and state dependency | Solve unique-paths and a basic 0/1 knapsack problem. |
| D3 | 2027-04-21 | **SQL / DBMS**<br>Transactions and isolation | ACID properties<br>Read committed, repeatable read and serializable intuition<br>Dirty/non-repeatable/phantom reads | Demonstrate a lost-update or overselling scenario and fix it with transaction design. |
| D4 | 2027-04-22 | **DSA**<br>DSA maintenance: mixed DP and greedy | Recognise DP versus greedy<br>State transition and proof of choice<br>Time/space optimisation | Solve one DP and one greedy problem from unseen prompts. |
| D5 | 2027-04-23 | **SQL / DBMS**<br>Indexes and EXPLAIN plans | B-tree index concepts<br>Composite indexes and selectivity<br>EXPLAIN/ANALYZE and sequential scan | Compare query plans before/after indexes for a realistic dataset. |
| D6 · Checkpoint | 2027-04-24 | **Checkpoint**<br>Checkpoint: relational consistency lab | Run a multi-step transaction<br>Enforce constraints at database level<br>Explain and measure an index improvement | Submit a transaction demo and query-plan comparison with findings. |

**Week deliverable:** Migration-backed SQL schema with transaction and index experiments.

### Week 24 — Backend testing, security and release quality
**Phase 2 · Backend and database engineering** | **2027-04-26 – 2027-05-02**  
Make the e-commerce project reliable and ready for a real code review.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2027-04-26 | **Testing**<br>Unit and integration testing for services | Pure unit tests for business rules<br>Database integration tests with isolated data<br>Arrange/act/assert and test fixtures | Test cart totals, validation and order-state transitions. |
| D2 | 2027-04-27 | **DSA**<br>DSA maintenance: graph algorithms review | BFS/DFS, Dijkstra and topological ordering<br>When a graph is directed/weighted<br>Complexity from V and E | Complete two graph problems and explain algorithm choice. |
| D3 | 2027-04-28 | **Testing**<br>API integration tests and test doubles | Supertest or equivalent HTTP-level tests<br>Mock external services at boundaries<br>Test success, validation, auth and server errors | Create API tests for auth, products, cart and checkout. |
| D4 | 2027-04-29 | **DSA**<br>DSA maintenance: mixed arrays, trees and DP | Timed problem selection<br>Trace before coding<br>Post-solve complexity and alternative | Complete a 60-minute mixed problem set and review failures. |
| D5 | 2027-04-30 | **Backend Engineering**<br>Security, logging and operational basics | Input size/rate limits and secure headers<br>Structured logs and request correlation IDs<br>Secrets, config and dependency audit | Add request IDs, structured errors and rate limits; remove secrets from source. |
| D6 · Checkpoint | 2027-05-01 | **Checkpoint**<br>Checkpoint: backend release candidate | Critical API tests pass<br>Auth, cart and order flows work end-to-end<br>Document setup, API contract and known risks | Prepare the e-commerce backend release candidate and demonstrate the key user journey. |

**Week deliverable:** Tested and documented e-commerce backend release candidate.

### Week 25 — E-commerce integration, deployment and Phase 2 review
**Phase 2 · Backend and database engineering** | **2027-05-03 – 2027-05-09**  
Integrate frontend, backend and database into a complete end-to-end application.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2027-05-03 | **Full Stack**<br>Frontend-backend contract integration | Typed API client and consistent response shapes<br>Loading/error/success state integration<br>CORS, cookie and credentials behaviour | Connect the React frontend to the finished backend without hardcoded mock responses. |
| D2 | 2027-05-04 | **DSA**<br>DSA maintenance: timed mixed assessment | Arrays/strings/hash maps<br>Trees/heaps/graphs<br>Explain brute force and optimised approach | Complete a 90-minute mixed DSA assessment; classify mistakes by concept. |
| D3 | 2027-05-05 | **Full Stack**<br>End-to-end user journey and edge cases | Signup/login and protected routes<br>Product discovery, cart and checkout<br>Order history, logout and expired session | Test the full e-commerce user journey manually and with integration tests. |
| D4 | 2027-05-06 | **DSA**<br>DSA remediation from assessment | Identify repeated error patterns<br>Re-derive the failed solution<br>Re-solve without notes after a delay | Re-solve the two weakest assessment problems and one related variant. |
| D5 | 2027-05-07 | **Deployment**<br>Deployment, environment and documentation | Production environment variables and secrets<br>Database connection and deployment health check<br>README, API documentation and demo setup<br>File upload validation, MIME/type checks and size limits<br>Storage abstraction and metadata persistence | Deploy the application to a stable environment and verify production configuration. Add a secure file-upload endpoint or document its integration boundary. |
| D6 · Checkpoint | 2027-05-08 | **Checkpoint**<br>Phase 2 checkpoint: E-commerce V1 release | Product browsing and authentication work<br>Persistent cart, checkout simulation and order history work<br>Database constraints, tests and documentation included | Release the E-commerce V1 flagship project; record a short demo and architecture diagram. |

**Week deliverable:** Flagship E-commerce V1: full-stack app with cart, orders, inventory checks, tests and deployment.
**Project linkage:** E-commerce V1

### Week 26 — Production deployment, hardening and Phase 2 exit
**Phase 2 · Backend and database engineering** | **2027-05-10 – 2027-05-16**  
Finish the flagship application with a repeatable deployment and evidence of backend competence.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2027-05-10 | **Deployment**<br>Production configuration and deployment architecture | Frontend and backend hosting boundaries<br>Environment configuration and secret injection<br>Health/readiness endpoints and deployment logs | Create a production deployment plan and verify that no secret is present in the frontend bundle or Git history. |
| D2 | 2027-05-11 | **DSA**<br>DSA maintenance: weakest-pattern remediation | Review the Phase 2 mixed-assessment error log<br>Revisit binary search, graph and DP gaps<br>Write a personal pattern-selection checklist | Solve three previously failed problems after a minimum one-day gap. |
| D3 | 2027-05-12 | **Database Engineering**<br>Database backup, migration and recovery | Backup and restore concepts<br>Migration ordering and rollback<br>Connection pooling and graceful shutdown | Test restoring a backup into a separate database and document the recovery steps. |
| D4 | 2027-05-13 | **DSA**<br>DSA maintenance: mock interview round | Clarifying constraints and examples<br>Brute-force baseline and optimisation<br>Communicating complexity and edge cases | Run two 35-minute problems as if in an interview; record where communication broke down. |
| D5 | 2027-05-14 | **Backend Engineering**<br>Observability and production smoke tests | Structured logs and request IDs<br>Health checks and failure diagnostics<br>Smoke tests after deployment | Run a deployment smoke-test script covering auth, products, cart and orders. |
| D6 · Checkpoint | 2027-05-15 | **Checkpoint**<br>Phase 2 final checkpoint: public E-commerce V1 demonstration | Deploy a working full-stack application<br>Show cart, checkout, order history and safe inventory behaviour<br>Present schema, API documentation, tests and operational notes | Record a 5–8 minute demo and publish a clean README with architecture and trade-offs. |

**Week deliverable:** Production-ready E-commerce V1 release with documented recovery and smoke tests.
**Research note:** Query performance and data modelling — Compare MongoDB/PostgreSQL query plans or indexes and document trade-offs.
**Project linkage:** E-commerce V1 release

### Week 27 — TypeScript for backend engineering
**Phase 3 · Advanced DSA and production backend** | **2027-05-17 – 2027-05-23**  
Use TypeScript to make backend domain logic safer and easier to maintain.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2027-05-17 | **TypeScript**<br>TypeScript strict mode and type modelling | strict compiler options and null safety<br>Literal unions, discriminated unions and narrowing<br>Runtime validation versus static types | Convert backend request/response contracts to TypeScript and keep runtime validation at API boundaries. |
| D2 | 2027-05-18 | **DSA**<br>DSA: graph modelling and traversal depth | Directed versus undirected graphs<br>Adjacency-list memory and traversal complexity<br>BFS/DFS iterative and recursive implementations | Implement reusable graph utilities and solve two graph traversal problems. |
| D3 | 2027-05-19 | **TypeScript**<br>Generics, utility types and inference | Generic constraints and default parameters<br>keyof, typeof and indexed access<br>Mapped and conditional types | Create generic repository/result types and typed pagination helpers. |
| D4 | 2027-05-20 | **DSA**<br>DSA: topological sorting and cycle detection | Indegree/Kahn's algorithm<br>DFS colouring for directed-cycle detection<br>Dependency ordering and DAG constraints | Solve course-schedule and task-dependency ordering problems. |
| D5 | 2027-05-21 | **TypeScript / Backend**<br>Type-safe Express architecture | Typed request DTOs and service return values<br>Typed error/result handling<br>Avoiding unsafe any and type assertions | Migrate one e-commerce feature slice from JavaScript to TypeScript. |
| D6 · Checkpoint | 2027-05-22 | **Checkpoint**<br>Checkpoint: typed backend feature slice | Strict TypeScript builds without untyped escape hatches<br>Validation at runtime and typing internally<br>Tests remain green | Deliver a typed product or cart module with controllers, services, validation and tests. |

**Week deliverable:** One complete TypeScript backend vertical slice.

### Week 28 — Backend testing strategy and test architecture
**Phase 3 · Advanced DSA and production backend** | **2027-05-24 – 2027-05-30**  
Build confidence through meaningful automated tests at the right boundaries.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2027-05-24 | **Testing**<br>Test pyramid and boundary selection | Unit, integration and end-to-end test roles<br>Test isolation and deterministic fixtures<br>Arrange/act/assert and behavioural assertions | Map the e-commerce critical flows to unit, integration and E2E tests. |
| D2 | 2027-05-25 | **DSA**<br>DSA: shortest paths with BFS and Dijkstra | Unweighted shortest paths using BFS<br>Dijkstra with non-negative weights<br>Relaxation and stale priority-queue entries | Implement both algorithms and solve one grid path and one weighted network problem. |
| D3 | 2027-05-26 | **Testing**<br>Database integration tests | Ephemeral database or isolated test database<br>Resetting state between tests<br>Testing constraints and transaction behaviour | Write integration tests for cart persistence and order creation against a test database. |
| D4 | 2027-05-27 | **DSA**<br>DSA: minimum spanning trees | Kruskal and edge sorting<br>Prim and priority queue<br>MST correctness intuition | Implement Kruskal with a basic disjoint-set structure and solve one network-connection problem. |
| D5 | 2027-05-28 | **Testing**<br>API contract and end-to-end tests | Test request/response contract<br>Test auth, permissions and expired sessions<br>Test failure paths and retries | Create E2E tests for one complete purchase flow and one forbidden-access flow. |
| D6 · Checkpoint | 2027-05-29 | **Checkpoint**<br>Checkpoint: CI-ready test suite | Critical business rules tested<br>API and database integration tests deterministic<br>Tests can run with one documented command | Create a dependable test suite and a test report for the e-commerce project. |

**Week deliverable:** Test suite covering core business rules and end-to-end flows.

### Week 29 — Redis fundamentals and caching
**Phase 3 · Advanced DSA and production backend** | **2027-05-31 – 2027-06-06**  
Understand caching as a system design tool and implement it safely.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2027-05-31 | **Redis**<br>Caching concepts and cache-aside pattern | Latency, hit rate and cache invalidation<br>Cache-aside, write-through and write-behind concepts<br>TTL and stale-data trade-offs | Add cache-aside caching to a read-heavy product listing endpoint. |
| D2 | 2027-06-01 | **DSA**<br>DSA: disjoint set union | Parent and rank/size arrays<br>Path compression and union by rank<br>Connected-component queries | Implement DSU and solve redundant-connection and connectivity problems. |
| D3 | 2027-06-02 | **Redis**<br>Redis data structures and commands | Strings, hashes, lists, sets and sorted sets<br>TTL, expiry and key naming<br>Persistence and memory considerations | Build a small Redis-backed recent-viewed-products and counter feature. |
| D4 | 2027-06-03 | **DSA**<br>DSA: graph review and union-find applications | Connected components and cycle detection<br>Kruskal's MST<br>Offline connectivity intuition | Solve two graph/DSU problems and compare DSU with BFS. |
| D5 | 2027-06-04 | **Backend Engineering**<br>Cache invalidation and consistency | Invalidation on create/update/delete<br>Stale cache and race conditions<br>Versioned keys and short TTL strategies | Implement cache invalidation for product mutations and add tests for stale values. |
| D6 · Checkpoint | 2027-06-05 | **Checkpoint**<br>Checkpoint: measured Redis caching | Show cache hit/miss behaviour<br>Demonstrate correct invalidation<br>Measure latency with and without caching | Add Redis caching to one endpoint and report response-time measurements from repeatable tests. |

**Week deliverable:** Redis-backed feature and cache performance note.

### Week 30 — Redis for rate limits, sessions and coordination
**Phase 3 · Advanced DSA and production backend** | **2027-06-07 – 2027-06-13**  
Use Redis primitives for shared state across multiple backend instances.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2027-06-07 | **Redis**<br>Atomic operations and counters | INCR/DECR and expiry interactions<br>Atomic command sequences and Lua overview<br>Race conditions in multi-step updates | Implement a fixed-window rate limiter using atomic Redis operations. |
| D2 | 2027-06-08 | **DSA**<br>DSA: dynamic programming state design | State definition from problem constraints<br>Memoisation and tabulation conversion<br>Base cases and transition dependencies | Solve coin-change and longest-increasing-subsequence intro; write state definitions first. |
| D3 | 2027-06-09 | **Backend Engineering**<br>Rate-limiting algorithms | Fixed window and sliding window<br>Token bucket and leaky bucket<br>Per-IP and per-user limits | Implement one limiter and test bursts, reset boundaries and distributed requests. |
| D4 | 2027-06-10 | **DSA**<br>DSA: two-dimensional DP | Grid DP and path counting<br>String DP and longest common subsequence<br>Space compression | Solve unique paths and longest-common-subsequence problems. |
| D5 | 2027-06-11 | **Backend Engineering**<br>Distributed sessions, locks and idempotency | Server-side session storage<br>SET NX EX and lock limitations<br>Idempotency keys and duplicate requests | Implement a short-lived idempotency record for order creation; document lock failure modes. |
| D6 · Checkpoint | 2027-06-12 | **Checkpoint**<br>Checkpoint: shared-state backend feature | Rate limits work across server instances<br>Duplicate requests do not create duplicate orders<br>Expiration and failure cases are handled | Demonstrate distributed rate limiting and idempotent checkout using Redis. |

**Week deliverable:** Shared-state backend feature with reproducible concurrency tests.
**Research note:** Rate limiting and distributed coordination — Compare fixed-window and token-bucket approaches with a small experiment.

### Week 31 — Background jobs, queues and reliable workflows
**Phase 3 · Advanced DSA and production backend** | **2027-06-14 – 2027-06-20**  
Move slow or retryable work out of request handlers.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2027-06-14 | **Backend Engineering**<br>Background job concepts and queue semantics | Producer, queue, worker and consumer<br>At-least-once delivery and duplicate processing<br>Retry, backoff and dead-letter concepts | Design an order-confirmation workflow that does not block the checkout response. |
| D2 | 2027-06-15 | **DSA**<br>DSA: dynamic programming patterns | Knapsack-style states<br>Partition/subset-sum transitions<br>Reconstructing a chosen solution | Solve subset-sum and partition-equal-subset-sum; explain the state compression. |
| D3 | 2027-06-16 | **Node.js**<br>Implementing workers and job payloads | Queue library concepts (e.g. BullMQ)<br>Job payload versioning and validation<br>Worker concurrency and graceful shutdown | Create a worker to generate an order receipt or send a simulated notification. |
| D4 | 2027-06-17 | **DSA**<br>DSA: advanced DP and memoisation review | State-space reduction<br>Transition optimisation<br>Common off-by-one and memory bugs | Solve one medium DP problem and re-implement it iteratively. |
| D5 | 2027-06-18 | **Backend Engineering**<br>Retries, idempotency and dead-letter handling | Exponential backoff with jitter<br>Permanent versus transient errors<br>Poison messages and manual replay | Add retry policy and dead-letter handling to the order notification worker. |
| D6 · Checkpoint | 2027-06-19 | **Checkpoint**<br>Checkpoint: reliable asynchronous workflow | API returns without waiting for slow work<br>Retries do not duplicate side effects<br>Failed jobs are observable and replayable | Deliver an asynchronous order-notification or report-generation pipeline with tests. |

**Week deliverable:** Queue-backed workflow with retry and idempotency handling.

### Week 32 — Docker fundamentals and containerised services
**Phase 3 · Advanced DSA and production backend** | **2027-06-21 – 2027-06-27**  
Package applications reproducibly and understand what containers actually isolate.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2027-06-21 | **Docker**<br>Containers, images, layers and namespaces | Image versus container<br>Namespaces and cgroups at a conceptual level<br>Container lifecycle and process model | Run and inspect containers; identify PID, ports and mounted files. |
| D2 | 2027-06-22 | **DSA**<br>DSA: tries and prefix trees | Trie node representation<br>Insert/search/prefix operations<br>Time and memory complexity | Implement a trie and solve prefix-search and word-dictionary problems. |
| D3 | 2027-06-23 | **Docker**<br>Dockerfiles and image construction | Base images and multi-stage builds<br>COPY, RUN, CMD and ENTRYPOINT<br>Layer caching and small-image strategy | Write a multi-stage Dockerfile for the Node backend. |
| D4 | 2027-06-24 | **DSA**<br>DSA: bit manipulation fundamentals | Bitwise AND/OR/XOR and shifts<br>Masks, set/clear/toggle bits<br>XOR cancellation and subset masks | Solve single-number, bit-count and subset-mask exercises. |
| D5 | 2027-06-25 | **Docker**<br>Container networking, volumes and users | Port publishing and bridge networking<br>Bind mounts versus named volumes<br>Non-root user and environment configuration | Run the backend with persistent data volume and a non-root container user. |
| D6 · Checkpoint | 2027-06-26 | **Checkpoint**<br>Checkpoint: containerise backend service | Build reproducible backend image<br>Persist required data and configure environment safely<br>Verify health and graceful shutdown | Containerise the e-commerce API and document build/run commands. |

**Week deliverable:** Reproducible Docker image for the backend.

### Week 33 — Docker Compose and local production-like stack
**Phase 3 · Advanced DSA and production backend** | **2027-06-28 – 2027-07-04**  
Run multiple dependent services locally and understand network boundaries.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2027-06-28 | **Docker**<br>Compose services and dependency configuration | Compose services, networks and volumes<br>Environment files and service discovery<br>Health checks and depends_on limitations | Define API, Redis and required local dependencies in Docker Compose. |
| D2 | 2027-06-29 | **DSA**<br>DSA: bitwise and trie problem practice | XOR patterns<br>Trie-based prefix matching<br>Choose data structure from operation requirements | Solve two bitwise/trie problems and review memory complexity. |
| D3 | 2027-06-30 | **Docker**<br>Persistent data and developer environments | Named volume lifecycle and backup<br>Development bind mounts versus production images<br>Reproducible local environment | Create a one-command local development environment with documented reset steps. |
| D4 | 2027-07-01 | **DSA**<br>DSA: mixed advanced data structures | Heap, trie, DSU and graph recognition<br>Problem constraint extraction<br>Complexity explanation | Complete a timed mixed set of three problems. |
| D5 | 2027-07-02 | **Docker Security**<br>Container hardening and supply-chain basics | Minimal base images and pinned versions<br>Secrets outside images<br>Image scanning and dependency updates | Audit the Dockerfile and remove secrets, unnecessary packages and root execution. |
| D6 · Checkpoint | 2027-07-03 | **Checkpoint**<br>Checkpoint: full local stack | API and Redis communicate by service name<br>Persistent data behaves as expected<br>Fresh clone can start stack using documented commands | Deliver a Compose-based local stack and a fresh-machine setup test. |

**Week deliverable:** One-command multi-service development environment.

### Week 34 — CI/CD with GitHub Actions
**Phase 3 · Advanced DSA and production backend** | **2027-07-05 – 2027-07-11**  
Automate quality checks and deployment steps instead of relying on manual commands.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2027-07-05 | **DevOps**<br>CI concepts and pipeline stages | Commit, build, test and deploy stages<br>Artifacts, caches and environment separation<br>Fast feedback and fail-fast strategy | Design a CI pipeline for the e-commerce repository. |
| D2 | 2027-07-06 | **DSA**<br>DSA: timed interview practice and review | Clarify constraints and edge cases<br>Choose a pattern and state invariant<br>Explain complexity and test manually | Complete two 35-minute problems and review the solution quality. |
| D3 | 2027-07-07 | **DevOps**<br>GitHub Actions workflow syntax | Workflow, event, job and step<br>Runner, checkout and setup actions<br>Dependency caching and artifact upload | Create a CI workflow that installs dependencies, lints, typechecks and builds. |
| D4 | 2027-07-08 | **DSA**<br>DSA: weak-topic repair | Review problem log for recurring errors<br>Re-derive one old solution from first principles<br>Solve a variant without hints | Repair the two weakest DSA patterns from the first 30 weeks. |
| D5 | 2027-07-09 | **DevOps**<br>Secrets and deployment environments | Repository/environment secrets<br>Preview versus production deployment<br>Branch protection and required checks | Configure safe environment variables and prevent deployment when CI fails. |
| D6 · Checkpoint | 2027-07-10 | **Checkpoint**<br>Checkpoint: automated quality pipeline | CI runs on pull requests and main branch<br>Build/lint/type checks are enforced<br>Deployment is gated on successful checks | Add a working CI pipeline and document how a failed check blocks release. |

**Week deliverable:** Automated CI pipeline with documented release flow.
**Research note:** Container supply chain and CI security — Audit a Docker image/workflow for secrets, permissions and unpinned dependencies.

### Week 35 — Profiling, observability and backend performance
**Phase 3 · Advanced DSA and production backend** | **2027-07-12 – 2027-07-18**  
Diagnose performance from measurements rather than guessing.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2027-07-12 | **Backend Performance**<br>CPU, memory and event-loop profiling | CPU-bound versus I/O-bound workload<br>Heap usage, garbage collection and leaks<br>Event-loop delay and profiling tools | Profile a deliberately slow endpoint and identify the real bottleneck. |
| D2 | 2027-07-13 | **DSA**<br>DSA: graph algorithms consolidation | BFS/DFS, shortest paths and topological sort<br>MST and DSU<br>Graph constraints and complexity | Complete a 90-minute graph assessment and record algorithm-selection mistakes. |
| D3 | 2027-07-14 | **Observability**<br>Structured logging and correlation IDs | Log levels and structured fields<br>Request IDs and trace context<br>Sensitive-data redaction | Add structured logs and trace one request across route, service and database calls. |
| D4 | 2027-07-15 | **DSA**<br>DSA: DP consolidation | 1D and 2D DP<br>Knapsack/LIS/LCS pattern selection<br>Space optimisation and recurrence proof | Complete two DP problems and explain the state definition aloud. |
| D5 | 2027-07-16 | **Observability**<br>Metrics, latency percentiles and load testing | Throughput, error rate and latency<br>p50/p95/p99 and saturation<br>Load-test design and realistic datasets | Load-test a read/write endpoint and capture repeatable baseline measurements. |
| D6 · Checkpoint | 2027-07-17 | **Checkpoint**<br>Checkpoint: backend performance report | Identify bottleneck using evidence<br>Apply one measured improvement<br>Compare before/after metrics and note trade-offs | Publish a concise performance report with commands, measurements and interpretation. |

**Week deliverable:** Measured performance improvement and observability notes.

### Week 36 — Graph algorithms: shortest paths and dependencies
**Phase 3 · Advanced DSA and production backend** | **2027-07-19 – 2027-07-25**  
Deepen algorithmic reasoning while applying graph models to dependency and routing problems.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2027-07-19 | **DSA**<br>Graph representation and edge cases review | Weighted/directed/multi-edge graph variants<br>Adjacency list and matrix trade-offs<br>Disconnected graphs and invalid endpoints | Implement a reusable graph input/model layer in C++. |
| D2 | 2027-07-20 | **DSA**<br>Dijkstra's algorithm and priority queues | Relaxation and distance array<br>Stale priority-queue entries<br>Non-negative weight requirement | Implement Dijkstra and solve network-delay/shortest-path problems. |
| D3 | 2027-07-21 | **DSA**<br>Topological sorting and DAG dynamic programming | Kahn's algorithm<br>DFS finishing order<br>Dependency graph interpretation | Solve course-schedule and longest-path-in-DAG style tasks. |
| D4 | 2027-07-22 | **DSA**<br>Bellman-Ford and negative edges | Relax all edges repeatedly<br>Detect reachable negative cycles<br>When Bellman-Ford is preferable | Implement Bellman-Ford and compare it with Dijkstra on sample graphs. |
| D5 | 2027-07-23 | **System Thinking**<br>Graph modelling in real systems | Dependency graphs and build systems<br>Routing and shortest path<br>Failure propagation and service dependencies | Model a small service-dependency graph and identify critical dependency paths. |
| D6 · Checkpoint | 2027-07-24 | **Checkpoint**<br>Checkpoint: graph algorithm assessment | Implement Dijkstra and topological sort from memory<br>Choose algorithms from weight/direction constraints<br>Explain complexity in V and E | Complete a mixed graph assessment and submit a reusable C++ graph template. |

**Week deliverable:** Reusable graph algorithms template and solved problem set.

### Week 37 — Disjoint sets, spanning trees and graph optimisation
**Phase 3 · Advanced DSA and production backend** | **2027-07-26 – 2027-08-01**  
Cover connectivity and minimum-cost network structures.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2027-07-26 | **DSA**<br>Disjoint Set Union implementation | Parent/size or rank representation<br>Path compression<br>Union by size/rank | Implement DSU with iterative find and test it on disconnected inputs. |
| D2 | 2027-07-27 | **DSA**<br>Kruskal's minimum spanning tree | Sort edges by weight<br>Use DSU to avoid cycles<br>MST cost and disconnected graph handling | Implement Kruskal and solve a minimum-connection cost problem. |
| D3 | 2027-07-28 | **DSA**<br>Prim's minimum spanning tree | Growing frontier and priority queue<br>Lazy versus decrease-key approaches<br>Connected graph assumptions | Implement Prim and compare complexity with Kruskal. |
| D4 | 2027-07-29 | **DSA**<br>DSA: graph problem variants | Bipartite checking with BFS/DFS<br>Flood fill and connected components<br>Cycle detection in directed/undirected graphs | Solve one bipartite and one cycle-detection task. |
| D5 | 2027-07-30 | **Algorithms**<br>Graph complexity and correctness reasoning | Proof sketch for BFS/Dijkstra/MST<br>V/E notation and representation cost<br>Choosing an algorithm under constraints | Write short correctness and complexity explanations for three graph algorithms. |
| D6 · Checkpoint | 2027-07-31 | **Checkpoint**<br>Checkpoint: network design exercise | Model a weighted network<br>Find a minimum spanning structure<br>Explain rejected edges and final cost | Build a small network-connection planner and solve its core graph problem. |

**Week deliverable:** Graph optimisation exercise and DSU/MST implementations.

### Week 38 — Dynamic programming: core patterns
**Phase 3 · Advanced DSA and production backend** | **2027-08-02 – 2027-08-08**  
Make DP systematic by defining states, transitions and base cases.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2027-08-02 | **DSA**<br>DP problem recognition and state definition | Overlapping subproblems and optimal substructure<br>State variables and base cases<br>Memoisation recursion tree | For five problems, write the state and recurrence before attempting code. |
| D2 | 2027-08-03 | **DSA**<br>One-dimensional DP patterns | Fibonacci/climbing stairs<br>House robber and take/skip decisions<br>Minimum/maximum path cost | Solve house robber, decode-ways introduction and minimum-cost path. |
| D3 | 2027-08-04 | **DSA**<br>Grid and two-dimensional DP | Grid transitions and boundary states<br>Unique paths and obstacles<br>In-place versus separate DP table | Solve unique paths and minimum path sum; explain each table cell. |
| D4 | 2027-08-05 | **DSA**<br>Knapsack and subset-sum | 0/1 versus unbounded knapsack<br>Capacity state and reverse iteration<br>Subset sum and partition | Implement 0/1 knapsack and subset-sum with space optimisation. |
| D5 | 2027-08-06 | **DSA**<br>String DP: LCS and edit distance | Prefix-pair states<br>Match versus mismatch transitions<br>Recovering the chosen sequence | Solve longest common subsequence and edit-distance basics. |
| D6 · Checkpoint | 2027-08-07 | **Checkpoint**<br>Checkpoint: DP assessment and explanation | State and recurrence are explicit<br>Correct base cases and iteration order<br>Compare memoised and tabulated approaches | Complete three DP problems across different patterns and explain the recurrence for each. |

**Week deliverable:** DP pattern notebook with tested solutions and recurrence explanations.

### Week 39 — Advanced structures, mixed DSA and production backend release
**Phase 3 · Advanced DSA and production backend** | **2027-08-09 – 2027-08-15**  
Consolidate advanced problem solving and ship the production-oriented backend upgrade.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2027-08-09 | **DSA**<br>Tries and string prefix search | Trie insertion, lookup and deletion concept<br>Prefix counts and memory trade-offs<br>Use cases in autocomplete and dictionaries | Implement trie autocomplete and compare with hash-set scanning. |
| D2 | 2027-08-10 | **DSA**<br>Bit manipulation and bitmask DP introduction | XOR identities and bit masks<br>Subset enumeration<br>Bitmask state representation | Solve single-number variants and one small bitmask-state problem. |
| D3 | 2027-08-11 | **DSA**<br>Advanced data structures: Fenwick and segment trees | Fenwick tree for prefix sums and point updates<br>Segment tree structure and range queries<br>Build, update and query complexity<br>When a simple prefix-sum array is sufficient | Implement a Fenwick tree and trace a segment-tree range query; treat segment tree as a stretch if time is limited. |
| D4 | 2027-08-12 | **DSA**<br>String matching: KMP, Z algorithm and rolling hash | Prefix function / failure function<br>KMP linear-time matching<br>Z-function and prefix matches<br>Rolling hash and collision caveats | Implement KMP or Z-function and solve one pattern-search problem; compare with a brute-force baseline. |
| D5 | 2027-08-13 | **Backend Engineering**<br>Production backend hardening review | Security checklist and dependency updates<br>Logs, metrics, rate limit and cache behaviour<br>Docker, CI and graceful shutdown | Review the e-commerce backend as a production service and close critical issues. |
| D6 · Checkpoint | 2027-08-14 | **Checkpoint**<br>Phase 3 checkpoint: production backend V2 | TypeScript feature slice and automated tests<br>Redis caching/rate limit and background job<br>Docker Compose and CI pipeline<br>Performance measurement and documentation | Publish the production-oriented backend V2 with an architecture diagram, tests and measured improvement. |

**Week deliverable:** Production-oriented e-commerce backend V2 with Redis, Docker, tests, CI and observability.
**Research note:** Backend performance and observability — Publish a before/after performance note using measured latency and logs.
**Project linkage:** E-commerce V2

### Week 40 — Java language and JVM foundations
**Phase 4 · Java, Spring Boot and system design** | **2027-08-16 – 2027-08-22**  
Start Java from a programming perspective, using existing C++ and backend knowledge.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2027-08-16 | **Java**<br>Java toolchain, compilation and language model | JDK, JRE, JVM and bytecode<br>Primitive types, reference types and strings<br>Packages, classpath and build tools | Create a small Java project and run it from both IDE and terminal. |
| D2 | 2027-08-17 | **DSA**<br>DSA maintenance: arrays, strings and hashing | Pattern selection under constraints<br>Hash map and set complexity<br>Boundary and duplicate cases | Complete two mixed problems in C++ or Java and compare implementation clarity. |
| D3 | 2027-08-18 | **Java**<br>Control flow, methods and arrays in Java | Methods, overloads and varargs<br>Arrays and multidimensional arrays<br>String immutability and StringBuilder | Implement a small text-processing utility with unit-sized methods. |
| D4 | 2027-08-19 | **DSA**<br>DSA maintenance: trees and heaps | Tree traversal templates<br>BST invariant<br>Heap and top-K patterns | Re-solve one tree and one heap problem without notes. |
| D5 | 2027-08-20 | **Java**<br>Java packages, exceptions and clean code | Checked versus unchecked exceptions<br>Package organisation and access modifiers<br>Input validation and meaningful exceptions | Refactor the utility into packages with predictable error handling. |
| D6 · Checkpoint | 2027-08-21 | **Checkpoint**<br>Checkpoint: Java fundamentals utility | Use classes, methods and packages appropriately<br>Handle invalid input and exceptions<br>Add tests for normal and edge cases | Build a Java CLI utility that parses and analyses structured records. |

**Week deliverable:** Java CLI utility and working JDK/build setup.

### Week 41 — Object-oriented design and principles
**Phase 4 · Java, Spring Boot and system design** | **2027-08-23 – 2027-08-29**  
Understand object design through responsibilities, invariants and changeability.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2027-08-23 | **Java / OOP**<br>Classes, objects, constructors and encapsulation | Instance/static members and constructors<br>Encapsulation and invariant enforcement<br>Access modifiers and immutable fields | Model a library or inventory domain with encapsulated state. |
| D2 | 2027-08-24 | **DSA**<br>DSA maintenance: graph and DP review | Graph traversal and shortest paths<br>DP recurrence reasoning<br>Complexity and memory trade-offs | Solve one graph and one DP problem under timed conditions. |
| D3 | 2027-08-25 | **Java / OOP**<br>Inheritance, polymorphism and composition | Inheritance and method overriding<br>Runtime polymorphism and interfaces<br>Composition over inheritance | Model interchangeable payment/shipping strategies with interfaces and composition. |
| D4 | 2027-08-26 | **DSA**<br>DSA maintenance: binary search, intervals and greedy | Search on sorted data and answer space<br>Interval scheduling and merging<br>Greedy choice explanation | Solve two unseen medium problems and explain why the approach is valid. |
| D5 | 2027-08-27 | **Software Design**<br>SOLID principles and dependency inversion | Single responsibility and open/closed<br>Liskov, interface segregation and dependency inversion<br>Avoiding speculative abstraction | Refactor one tightly coupled Java example using constructor injection. |
| D6 · Checkpoint | 2027-08-28 | **Checkpoint**<br>Checkpoint: object-oriented domain model | Model a small domain with invariants<br>Use interfaces and composition where justified<br>Add tests for behaviour rather than implementation details | Deliver a tested Java inventory/order domain model with a short class diagram. |

**Week deliverable:** Tested OOP domain model with clear responsibilities.

### Week 42 — Java collections, generics and functional programming
**Phase 4 · Java, Spring Boot and system design** | **2027-08-30 – 2027-09-05**  
Use Java's standard library confidently and write type-safe reusable code.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2027-08-30 | **Java**<br>Collections framework | List, Set, Map and Queue contracts<br>ArrayList versus LinkedList trade-offs<br>HashMap, HashSet and TreeMap basics | Implement a small in-memory index and choose collections based on access patterns. |
| D2 | 2027-08-31 | **DSA**<br>DSA maintenance: heaps, queues and monotonic structures | PriorityQueue usage<br>Deque and sliding windows<br>Monotonic stack/queue | Solve top-K, sliding-window maximum or next-greater-element tasks. |
| D3 | 2027-09-01 | **Java**<br>Generics and type safety | Generic classes and methods<br>Bounded type parameters<br>Wildcards extends/super intuition | Create a generic repository/result wrapper and avoid raw types. |
| D4 | 2027-09-02 | **DSA**<br>DSA maintenance: tries and DSU | Prefix search with tries<br>Connectivity with DSU<br>Memory and amortised complexity | Re-implement DSU and trie operations from memory. |
| D5 | 2027-09-03 | **Java**<br>Lambdas, streams and Optional | Functional interfaces and lambdas<br>Stream map/filter/reduce/collect<br>Optional and null-safe APIs | Transform order/product collections using streams; avoid side effects in pipelines. |
| D6 · Checkpoint | 2027-09-04 | **Checkpoint**<br>Checkpoint: Java collections challenge | Choose correct collections for the workload<br>Use generics without raw types<br>Implement testable transformation logic | Build a small analytics/reporting module over order data using Java collections and streams. |

**Week deliverable:** Java collections/reporting module.

### Week 43 — JVM, concurrency and runtime behaviour
**Phase 4 · Java, Spring Boot and system design** | **2027-09-06 – 2027-09-12**  
Understand memory, threads and concurrent execution before building Spring services.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2027-09-06 | **Java / Systems**<br>JVM memory model and garbage collection | Stack, heap, metaspace and object lifetime<br>References and garbage-collection reachability<br>Heap pressure and memory leaks | Inspect a simple application with JVM memory flags and observe heap behaviour. |
| D2 | 2027-09-07 | **DSA**<br>DSA maintenance: advanced mixed practice | DP and graph pattern selection<br>Heap/trie/DSU trade-offs<br>Explain correctness and complexity | Complete a 75-minute mixed assessment and update the weak-topic list. |
| D3 | 2027-09-08 | **Java / Concurrency**<br>Threads, executors and task coordination | Thread lifecycle and Runnable/Callable<br>ExecutorService and thread pools<br>Future and CompletableFuture basics | Run independent tasks with an executor and shut it down cleanly. |
| D4 | 2027-09-09 | **DSA**<br>DSA maintenance: timed interview communication | Clarifying questions and constraints<br>Walk through examples before coding<br>Explain trade-offs aloud | Complete one 40-minute problem with a spoken explanation and self-review. |
| D5 | 2027-09-10 | **Java / Concurrency**<br>Race conditions and thread safety | Shared mutable state and race conditions<br>synchronized, locks and atomic types<br>Concurrent collections and immutability | Create a counter race condition, reproduce it and fix it with a thread-safe approach. |
| D6 · Checkpoint | 2027-09-11 | **Checkpoint**<br>Checkpoint: concurrency lab | Demonstrate a race condition<br>Fix the race with a correct primitive<br>Explain visibility, atomicity and shutdown | Build a concurrent task processor and document throughput and correctness trade-offs. |

**Week deliverable:** Concurrent Java task processor with correctness notes.
**Research note:** JVM concurrency — Reproduce a race condition and explain the Java Memory Model behaviour involved.

### Week 44 — Spring Boot fundamentals and layered REST services
**Phase 4 · Java, Spring Boot and system design** | **2027-09-13 – 2027-09-19**  
Build a clean Spring Boot service using the ecosystem's standard conventions.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2027-09-13 | **Spring Boot**<br>Spring Boot project structure and dependency injection | Starters, auto-configuration and application context<br>Beans and dependency injection<br>Configuration properties and profiles | Create a Spring Boot application with separate controller, service and repository layers. |
| D2 | 2027-09-14 | **DSA**<br>DSA maintenance: mixed graphs and DP | Shortest paths and topological sort<br>DP state selection<br>Graph and DP complexity | Solve two medium problems and write a compact explanation for each. |
| D3 | 2027-09-15 | **Spring Boot**<br>Spring MVC and REST controllers | Request mappings and DTOs<br>Path/query/body binding<br>ResponseEntity and status codes | Implement CRUD endpoints for an inventory resource using DTOs. |
| D4 | 2027-09-16 | **DSA**<br>DSA maintenance: trees and greedy | Tree recursion and BFS<br>Heap-based greedy<br>Interval patterns | Complete two problem variants and compare brute-force with optimised solutions. |
| D5 | 2027-09-17 | **Spring Boot**<br>Service layer, configuration and error handling | Business logic in services<br>Bean validation and exception handlers<br>Environment-specific configuration | Add validation, centralised errors and profile-based configuration. |
| D6 · Checkpoint | 2027-09-18 | **Checkpoint**<br>Checkpoint: Spring REST API skeleton | Layered architecture with DTOs<br>Validation and predictable error response<br>Configuration externalised | Deliver a tested Spring Boot inventory REST API skeleton. |

**Week deliverable:** Spring Boot REST service with controller/service/repository separation.

### Week 45 — Spring Data JPA and relational persistence
**Phase 4 · Java, Spring Boot and system design** | **2027-09-20 – 2027-09-26**  
Persist domain data safely and understand ORM behaviour rather than treating it as magic.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2027-09-20 | **Spring Data JPA**<br>JPA entities and persistence context | Entity identity and lifecycle<br>Persistence context and dirty checking<br>Entity mapping and ID strategies | Map inventory, product and order entities to PostgreSQL. |
| D2 | 2027-09-21 | **DSA**<br>DSA maintenance: DP and graph review | DP base states and transitions<br>Graph algorithm selection<br>Revisit previously failed variants | Solve one DP and one graph problem from a mixed prompt. |
| D3 | 2027-09-22 | **Spring Data JPA**<br>Relationships and fetch strategies | One-to-many and many-to-one mapping<br>Lazy versus eager loading<br>N+1 query problem | Model order/order-item relationships and inspect generated SQL. |
| D4 | 2027-09-23 | **DSA**<br>DSA maintenance: heap, trie and monotonic patterns | Top-K and priority queues<br>Trie prefix lookups<br>Monotonic stack/queue | Solve two problems chosen from these structures without hints. |
| D5 | 2027-09-24 | **Spring Data JPA**<br>Repositories, transactions and locking | Repository methods and JPQL<br>Transactional boundaries<br>Optimistic/pessimistic locking concepts | Implement a safe inventory update and demonstrate transaction rollback. |
| D6 · Checkpoint | 2027-09-25 | **Checkpoint**<br>Checkpoint: persistent Spring service | JPA entities and relationships are correct<br>Use transactions for multi-step updates<br>Avoid N+1 and validate persistence behaviour | Persist inventory and orders in PostgreSQL with integration tests. |

**Week deliverable:** Spring Boot service with relational persistence and tested transaction boundaries.

### Week 46 — Spring validation, security and API testing
**Phase 4 · Java, Spring Boot and system design** | **2027-09-27 – 2027-10-03**  
Bring the Spring service to a robust, testable API standard.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2027-09-27 | **Spring Boot**<br>Validation and domain error mapping | Bean Validation annotations<br>DTO validation and cross-field rules<br>Domain exceptions and global exception handler | Add validation for order creation and consistent error responses. |
| D2 | 2027-09-28 | **DSA**<br>DSA maintenance: mixed timed assessment | Arrays, strings, hashing and binary search<br>Trees, graphs and DP<br>Communicate complexity under time pressure | Complete a 90-minute mixed assessment and categorise every failed test. |
| D3 | 2027-09-29 | **Spring Security**<br>Authentication and method-level authorisation | Security filter chain concepts<br>Password encoder and authentication provider<br>Role and method-level access checks | Secure the service's admin inventory operations and test forbidden access. |
| D4 | 2027-09-30 | **DSA**<br>DSA maintenance: weakness repair | Revisit error patterns from the assessment<br>Solve a related unseen variant<br>Write a reusable template only after understanding | Fix two weak areas and re-solve one earlier problem from scratch. |
| D5 | 2027-10-01 | **Testing**<br>Spring testing and Testcontainers concepts | Unit tests for services<br>MockMvc/controller tests<br>Integration tests with a real database container | Test validation, auth, persistence and rollback behaviour. |
| D6 · Checkpoint | 2027-10-02 | **Checkpoint**<br>Checkpoint: secure and tested Spring API | Authentication and authorisation behave correctly<br>Validation/errors are consistent<br>Controller/service/database tests cover critical flows | Produce a secure Spring Boot API release candidate with test report and API documentation. |

**Week deliverable:** Secure and tested Spring Boot API.

### Week 47 — System design foundations and requirement modelling
**Phase 4 · Java, Spring Boot and system design** | **2027-10-04 – 2027-10-10**  
Learn to turn ambiguous requirements into clear system boundaries and trade-offs.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2027-10-04 | **System Design**<br>Functional and non-functional requirements | Use cases and user journeys<br>Latency, throughput, availability and durability<br>Constraints, assumptions and scope control | Write requirements for a URL shortener and identify what is deliberately out of scope. |
| D2 | 2027-10-05 | **DSA**<br>DSA maintenance: interview-style problems | Problem decomposition and constraints<br>Select a suitable data structure<br>Explain correctness and complexity | Solve two interview-style problems in 35 minutes each. |
| D3 | 2027-10-06 | **System Design**<br>Capacity estimation and back-of-envelope maths | Requests per second and peak traffic<br>Storage and bandwidth estimates<br>Read/write ratio and growth assumptions | Estimate traffic and storage for a small URL-shortening or notes service. |
| D4 | 2027-10-07 | **DSA**<br>DSA maintenance: data-structure selection | Hash map versus tree index<br>Heap versus sorted array<br>Graph traversal versus dynamic programming | Answer five design prompts by selecting structures and justifying complexity. |
| D5 | 2027-10-08 | **System Design**<br>API design and service boundaries | Resource-oriented API contracts<br>Monolith modules and bounded contexts<br>Synchronous versus asynchronous calls | Draw a service boundary diagram for an order management system. |
| D6 · Checkpoint | 2027-10-09 | **Checkpoint**<br>Checkpoint: system-design one-pager | State requirements and assumptions<br>Estimate load and storage<br>Draw API and component boundaries | Produce a one-page design for a URL shortener with trade-offs and failure cases. |

**Week deliverable:** System-design one-pager with assumptions, estimates and component diagram.
**Research note:** System design requirements — Write a concise design review with assumptions, capacity estimates and failure cases.

### Week 48 — System design: caching, scaling and load balancing
**Phase 4 · Java, Spring Boot and system design** | **2027-10-11 – 2027-10-17**  
Understand the standard tools used to scale read-heavy services.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2027-10-11 | **System Design**<br>Horizontal/vertical scaling and stateless services | Bottlenecks and scaling dimensions<br>Stateless application instances<br>Session and shared-state implications | Draw a before/after architecture that adds multiple API instances. |
| D2 | 2027-10-12 | **DSA**<br>DSA maintenance: graph/heap problem practice | Priority queues and top-K<br>Shortest path and dependency graphs<br>Complexity explanation | Solve two mixed problems and review approach selection. |
| D3 | 2027-10-13 | **System Design**<br>Load balancing and reverse proxies | Layer 4 versus Layer 7 concepts<br>Round-robin, least-connections and health checks<br>TLS termination and reverse proxy | Run two backend instances behind a local reverse proxy and test failure behaviour. |
| D4 | 2027-10-14 | **DSA**<br>DSA maintenance: DP and binary-search review | DP state/transition review<br>Binary search boundary templates<br>Timed problem-solving discipline | Solve two unseen problems and explain the invariant before coding. |
| D5 | 2027-10-15 | **System Design**<br>Caching layers and CDN concepts | Browser, CDN, application and database caches<br>Cache keys, TTL and invalidation<br>Cache stampede and stale data | Design a cache strategy for products, user profile and static assets. |
| D6 · Checkpoint | 2027-10-16 | **Checkpoint**<br>Checkpoint: scalable read-path design | Draw load balancer, cache and database path<br>Identify stale-data and cache-failure cases<br>Estimate which component becomes bottleneck | Produce and test a small read-heavy architecture with load balancer and Redis cache. |

**Week deliverable:** Scalable read-path prototype and architecture diagram.

### Week 49 — System design: database scaling and reliability
**Phase 4 · Java, Spring Boot and system design** | **2027-10-18 – 2027-10-24**  
Understand database performance, consistency and recovery trade-offs.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2027-10-18 | **System Design / DBMS**<br>Database indexing and query performance review | Index selection and write amplification<br>Query plans and cardinality<br>Connection pooling and saturation | Review query plans from both MongoDB and PostgreSQL projects. |
| D2 | 2027-10-19 | **DSA**<br>DSA maintenance: trees, maps and interval patterns | Balanced tree versus hash map<br>Interval merging and sweeps<br>Time/space trade-offs | Solve one interval problem and one ordered-map problem. |
| D3 | 2027-10-20 | **System Design**<br>Replication, read replicas and consistency | Primary/replica topology<br>Replication lag and stale reads<br>Read-after-write consistency | Design a read-heavy service with replicas and explain stale-read behaviour. |
| D4 | 2027-10-21 | **DSA**<br>DSA maintenance: mixed medium problems | Recognise core pattern from constraints<br>Write brute force then optimise<br>Test boundary cases | Complete a 60-minute mixed set and review the weakest problem. |
| D5 | 2027-10-22 | **System Design**<br>Sharding, partitioning and data locality | Partition key selection<br>Hot partitions and rebalancing<br>Range versus hash partitioning<br>CAP theorem as a constrained trade-off, not a simplistic slogan<br>Consistency models and eventual consistency | Choose a partition key for users/orders and explain skew risks. Relate consistency choices to replicated order and product data. |
| D6 · Checkpoint | 2027-10-23 | **Checkpoint**<br>Checkpoint: database scaling design | Explain indexing, replication and sharding separately<br>Identify consistency and partition-key risks<br>Include backup and recovery plan | Create a database scaling proposal for an e-commerce workload. |

**Week deliverable:** Database scaling proposal with partition-key and consistency decisions.

### Week 50 — System design: messaging and distributed workflows
**Phase 4 · Java, Spring Boot and system design** | **2027-10-25 – 2027-10-31**  
Design asynchronous systems that tolerate retries, partial failure and duplicate messages.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2027-10-25 | **System Design**<br>Message brokers and event-driven architecture | Queue versus pub/sub<br>Producer, broker, consumer and acknowledgement<br>Event schema and versioning | Draw an asynchronous order-processing flow and identify ownership of each event. |
| D2 | 2027-10-26 | **DSA**<br>DSA maintenance: graph and dependency problems | DAG and dependency order<br>Cycle detection<br>Shortest path | Solve two graph problems and explain how the model reflects the prompt. |
| D3 | 2027-10-27 | **Distributed Systems**<br>Delivery semantics and idempotent consumers | At-most-once, at-least-once and effectively-once outcomes<br>Idempotency key and deduplication store<br>Retry and dead-letter queue | Implement an idempotent event consumer for order-created events. |
| D4 | 2027-10-28 | **DSA**<br>DSA maintenance: DP and greedy assessment | DP versus greedy choice<br>Proof intuition and counterexamples<br>Complexity analysis | Complete one DP and one greedy problem under timed conditions. |
| D5 | 2027-10-29 | **Distributed Systems**<br>Consistency, sagas and compensating actions | Eventual consistency<br>Saga steps and compensating transactions<br>Outbox pattern concept | Design cancellation/refund compensation for a multi-step order workflow. |
| D6 · Checkpoint | 2027-10-30 | **Checkpoint**<br>Checkpoint: resilient workflow design | Model retries and duplicate delivery<br>Define compensating actions<br>Document failure and recovery paths | Deliver a design and small implementation for an asynchronous order workflow. |

**Week deliverable:** Resilient order-processing workflow design and prototype.

### Week 51 — System design: reliability, API resilience and architecture review
**Phase 4 · Java, Spring Boot and system design** | **2027-11-01 – 2027-11-07**  
Design services that degrade gracefully and make the Spring project ready for a credible architecture discussion.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2027-11-01 | **System Design**<br>Timeouts, retries and circuit breakers | Timeout budgets across service calls<br>Retry with exponential backoff and jitter<br>Circuit-breaker states and failure isolation | Add explicit timeouts and retry rules to a service client; document which errors should not be retried. |
| D2 | 2027-11-02 | **DSA**<br>DSA maintenance: graph and DP interview practice | Graph traversal and shortest paths<br>DP state/transition<br>Correctness and complexity explanation | Solve two medium problems and explain the algorithm before coding. |
| D3 | 2027-11-03 | **System Design**<br>Rate limiting, bulkheads and graceful degradation | Token bucket and per-user limits<br>Bulkhead isolation and concurrency limits<br>Fallbacks and graceful degradation | Design overload protection for the Spring API and identify what should fail fast. |
| D4 | 2027-11-04 | **DSA**<br>DSA maintenance: mixed timed problem set | Array/hash map pattern<br>Tree/heap or graph pattern<br>Boundary tests and complexity | Complete a 60-minute mixed assessment and review the first wrong assumption. |
| D5 | 2027-11-05 | **System Design**<br>API versioning, compatibility and security boundaries | Backward-compatible contract changes<br>Authentication versus authorisation<br>Trust boundaries and sensitive data | Review the Spring API contract and document a safe versioning strategy. |
| D6 · Checkpoint | 2027-11-06 | **Checkpoint**<br>Checkpoint: resilient service architecture review | Include timeouts, retry policy and circuit-breaker behaviour<br>Document rate limits and graceful degradation<br>Show compatibility and security boundaries | Deliver a reliability design note and update the Spring service with one resilience improvement. |

**Week deliverable:** Resilience design note and one implemented reliability feature.

### Week 52 — Spring Boot project and Phase 4 exit
**Phase 4 · Java, Spring Boot and system design** | **2027-11-08 – 2027-11-14**  
Complete a substantial Java service and demonstrate system-design reasoning.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2027-11-08 | **Spring Boot**<br>Spring application architecture review | Package by feature versus layer<br>Service boundaries and dependency direction<br>Configuration and secrets<br>Bash variables, command arguments and safe quoting<br>Exit codes and set -euo pipefail | Refactor the Spring service into clear feature modules without unnecessary abstractions. |
| D2 | 2027-11-09 | **DSA**<br>DSA maintenance: full mock interview | Two unseen medium problems<br>Communicate thought process and edge cases<br>Complexity and alternative solutions | Complete a timed mock and record communication and coding gaps. |
| D3 | 2027-11-10 | **Spring Boot / DBMS**<br>Transactions, locking and concurrency in the project | Transactional service methods<br>Optimistic locking and conflict handling<br>Idempotent write endpoints<br>Shell functions, loops and conditionals<br>Cron scheduling and log rotation concepts | Implement a concurrency-safe inventory reservation or order update. |
| D4 | 2027-11-11 | **DSA**<br>DSA maintenance: revision and spaced repetition | Re-solve one array/hash problem<br>Re-solve one graph or DP problem<br>Compare old and improved solution | Re-solve three old problems with no notes and update the spaced-revision queue. |
| D5 | 2027-11-12 | **Software Delivery**<br>Documentation, test report and API contract | OpenAPI documentation<br>Architecture and entity diagrams<br>Local run and environment instructions<br>systemd service lifecycle and restart policies<br>Journal logs and graceful shutdown | Prepare release documentation and a short technical walkthrough. |
| D6 · Checkpoint | 2027-11-13 | **Checkpoint**<br>Phase 4 checkpoint: Spring Boot service release | CRUD/API and relational persistence work<br>Security, validation and tests included<br>Concurrency/transaction behaviour demonstrated<br>One system-design document included<br>Write a safe maintenance script<br>Describe cron/systemd service operation | Release an Inventory and Order Management API using Spring Boot and PostgreSQL. |

**Week deliverable:** Linux command-line lab, safe maintenance script and basic service-operation runbook.
**Research note:** Spring transactions and resilience — Study a transaction/resilience case and connect it to the Spring capstone.
**Project linkage:** Spring Boot Inventory and Order API

### Week 53 — Linux command line and filesystem fundamentals
**Phase 5 · Systems, networking, cloud and DevOps** | **2027-11-15 – 2027-11-21**  
Build practical confidence operating and diagnosing a Linux system.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2027-11-15 | **Linux**<br>Linux shell, filesystem and permissions | pwd, ls, cd, find and path navigation<br>Files, directories, pipes, redirection and safe quoting<br>Users, groups, chmod/chown and least-privilege access<br>Bash variables, command arguments and exit codes | Navigate a project tree and write a shell command sequence to organise logs and files. |
| D2 | 2027-11-16 | **DSA**<br>DSA maintenance: mixed timed practice | Pattern recognition across arrays, trees and graphs<br>Complexity explanation<br>Test edge cases before finalising | Complete two medium problems and explain one solution aloud. |
| D3 | 2027-11-17 | **Linux**<br>Pipes, log processing and safe shell scripting | stdin/stdout/stderr, redirection and pipes<br>grep, sort, uniq, wc, sed and awk basics<br>Bash variables, functions, loops and conditionals<br>set -euo pipefail and input validation | Build a command pipeline that extracts error counts and top endpoints from a log file. |
| D4 | 2027-11-18 | **DSA**<br>DSA maintenance: weakest-pattern repair | Review repeated failure modes<br>Re-derive an algorithm from constraints<br>Implement and test from a blank file | Re-solve two problems from your personal weak-topic list. |
| D5 | 2027-11-19 | **Computer Architecture**<br>Computer architecture: binary data and representation | Binary and hexadecimal representation<br>Unsigned and signed integers; two's complement<br>Floating-point representation and precision limits<br>Character encoding and bytes | Convert values between binary/decimal/hex, explain signed overflow and inspect byte representations in a small program. |
| D6 · Checkpoint | 2027-11-20 | **Checkpoint**<br>Checkpoint: Linux operations lab | Navigate and inspect a Linux filesystem<br>Filter logs using pipes and text tools<br>Explain users, groups and permissions<br>Write a safe maintenance script with meaningful exit codes | Complete a documented Linux lab with commands and screenshots of outputs. |

**Week deliverable:** Linux command-line lab, safe maintenance script and binary data-representation notes.

### Week 54 — Operating systems: processes, threads and scheduling
**Phase 5 · Systems, networking, cloud and DevOps** | **2027-11-22 – 2027-11-28**  
Connect OS concepts to the behaviour of your Node, Java and containerised services.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2027-11-22 | **Operating Systems**<br>Process model and system calls | Process versus program<br>Process states and context switching<br>System calls and user/kernel mode | Inspect process IDs, parent-child relationships and open resources on Linux. |
| D2 | 2027-11-23 | **DSA**<br>DSA maintenance: interview problem review | Two-pointer and sliding-window review<br>Tree/graph traversal review<br>Communicate constraints before coding | Solve two mixed problems and write a short complexity explanation. |
| D3 | 2027-11-24 | **Operating Systems**<br>Threads, concurrency and synchronisation | Thread versus process<br>Mutex, semaphore and condition-variable concepts<br>Race condition and deadlock conditions | Write a small concurrent program or Node worker example and reproduce shared-state contention. |
| D4 | 2027-11-25 | **DSA**<br>DSA maintenance: graph and heap refresh | Priority queues and shortest paths<br>Graph traversal and cycle detection<br>MST/DSU overview | Complete two problems from the advanced DSA set. |
| D5 | 2027-11-26 | **Computer Architecture / Operating Systems**<br>CPU instruction cycle, pipelining and process scheduling | CPU registers, instruction fetch/decode/execute cycle<br>Instruction set and the role of the program counter<br>Pipelining, hazards and branch-prediction intuition<br>FCFS, SJF, priority and round-robin scheduling<br>Waiting, turnaround and response-time calculations | Trace a short instruction sequence, calculate scheduling metrics for sample processes and explain a pipeline hazard. |
| D6 · Checkpoint | 2027-11-27 | **Checkpoint**<br>Checkpoint: process and thread reasoning | Explain process/thread distinction<br>Trace a scheduling example<br>Identify a race and a deadlock risk | Write a concise OS lab report and demonstrate one concurrent program. |

**Week deliverable:** OS process/thread lab report tied to application behaviour.

### Week 55 — Operating systems: memory, virtual memory and filesystems
**Phase 5 · Systems, networking, cloud and DevOps** | **2027-11-29 – 2027-12-05**  
Understand memory pressure and storage behaviour in applications and containers.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2027-11-29 | **Operating Systems**<br>Memory layout and allocation | Stack, heap and static/global regions<br>Allocation, deallocation and fragmentation<br>Memory leaks and ownership concepts | Inspect memory use of a simple program and explain allocation lifetime. |
| D2 | 2027-11-30 | **DSA**<br>DSA maintenance: DP and algorithmic complexity | State-space and memory complexity<br>Memoisation versus tabulation<br>Space optimisation | Re-solve one DP problem and reduce space where dependency allows. |
| D3 | 2027-12-01 | **Operating Systems**<br>Virtual memory, paging and page faults | Virtual versus physical address<br>Pages, frames and page tables<br>TLB and page-fault intuition | Explain what happens when a process accesses a page not currently in RAM. |
| D4 | 2027-12-02 | **DSA**<br>DSA maintenance: data structure selection | Hashing versus ordered maps<br>Heap versus sort<br>Graph representation trade-offs | Complete a scenario-based data-structure selection drill. |
| D5 | 2027-12-03 | **Computer Architecture / Operating Systems**<br>Memory hierarchy, CPU caches and filesystem I/O | Registers, L1/L2/L3 cache, RAM and secondary storage<br>Temporal and spatial locality; cache hits and misses<br>Cache lines and why contiguous memory can be faster<br>Files, inodes, file descriptors and buffering<br>I/O latency and operating-system page cache | Compare sequential and random access in a small benchmark and explain the result using locality and cache behaviour. |
| D6 · Checkpoint | 2027-12-04 | **Checkpoint**<br>Checkpoint: memory and I/O diagnostic | Explain memory allocation and virtual memory<br>Diagnose a simple memory-growth issue<br>Describe filesystem and descriptor behaviour | Prepare a diagnostic note with one memory experiment and one file-I/O experiment. |

**Week deliverable:** Memory and filesystem diagnostic note.

### Week 56 — Networking fundamentals: TCP/IP, DNS and HTTP
**Phase 5 · Systems, networking, cloud and DevOps** | **2027-12-06 – 2027-12-12**  
Understand the network stack used by every web application you build.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2027-12-06 | **Computer Networks**<br>Network layers and packet journey | OSI/TCP-IP model mapping<br>Encapsulation and decapsulation<br>MAC, IP, port and socket roles | Trace a browser request from application data down to Ethernet/Wi-Fi and back. |
| D2 | 2027-12-07 | **DSA**<br>DSA maintenance: mixed interview practice | Arrays/hashing and two pointers<br>Trees and graphs<br>Explain complexity and edge cases | Complete two timed problems and compare the first attempt with the final solution. |
| D3 | 2027-12-08 | **Computer Networks**<br>IP addressing, subnetting and routing basics | IPv4 address and CIDR<br>Private/public addresses and NAT<br>Default gateway and routing table | Calculate subnet ranges for small CIDR examples and inspect local routes. |
| D4 | 2027-12-09 | **DSA**<br>DSA maintenance: graph path and connectivity | BFS shortest path<br>Dijkstra assumptions<br>Connected components and DSU | Solve two graph problems and justify the algorithm from edge weights. |
| D5 | 2027-12-10 | **Computer Networks**<br>DNS, HTTP request lifecycle and status codes | DNS resolver and caching<br>HTTP methods, headers and status codes<br>Persistent connections and HTTP/2 overview | Use curl/devtools to inspect DNS resolution, headers, redirects and response timing. |
| D6 · Checkpoint | 2027-12-11 | **Checkpoint**<br>Checkpoint: network request investigation | Trace DNS to TCP connection to HTTP response<br>Inspect headers and status codes<br>Explain one latency or failure scenario | Produce a reproducible network investigation report for a deployed application. |

**Week deliverable:** Network request trace and protocol notes.
**Research note:** Operating systems and memory hierarchy — Run a memory/cache locality experiment and interpret the result.

### Week 57 — Transport security and practical networking
**Phase 5 · Systems, networking, cloud and DevOps** | **2027-12-13 – 2027-12-19**  
Understand transport reliability and secure web traffic.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2027-12-13 | **Computer Networks**<br>TCP connection and reliability | Three-way handshake and connection teardown<br>Sequence numbers, ACKs and retransmission<br>Flow control and congestion control intuition | Capture or inspect a TCP connection and explain handshake and retransmission fields. |
| D2 | 2027-12-14 | **DSA**<br>DSA maintenance: DP, greedy and intervals | Greedy proof intuition<br>DP state and base cases<br>Interval scheduling | Solve one DP and one interval problem under timed conditions. |
| D3 | 2027-12-15 | **Computer Networks**<br>UDP, sockets and application protocols | UDP datagrams and trade-offs<br>Socket client/server concepts<br>DNS, streaming and real-time examples | Build or run a tiny TCP and UDP echo example and compare behaviour. |
| D4 | 2027-12-16 | **DSA**<br>DSA maintenance: mixed review | Pattern recognition from constraints<br>Complexity and test design<br>Re-solve previously failed tasks | Complete a 60-minute unseen problem set and document errors. |
| D5 | 2027-12-17 | **Computer Networks / Security**<br>TLS, certificates and HTTPS | Public-key cryptography role in TLS<br>Certificate chain and hostname validation<br>TLS termination and secure cookies | Inspect a certificate chain and explain the HTTPS handshake at a high level. |
| D6 · Checkpoint | 2027-12-18 | **Checkpoint**<br>Checkpoint: secure web traffic lab | Explain TCP versus UDP<br>Inspect TLS certificate details<br>Identify insecure transport/configuration patterns | Create a network security note for the e-commerce and Spring services. |

**Week deliverable:** Hands-on TLS/networking lab with evidence and explanations.

### Week 58 — Containers in production and container security
**Phase 5 · Systems, networking, cloud and DevOps** | **2027-12-20 – 2027-12-26**  
Move from local Docker usage to safer runtime and image operations.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2027-12-20 | **Docker / Systems**<br>Container runtime, namespaces and cgroups in practice | PID, network and mount namespaces<br>CPU/memory limits<br>Container health and restart behaviour | Run a container with resource limits and observe its behaviour under load. |
| D2 | 2027-12-21 | **DSA**<br>DSA maintenance: mixed graphs and trees | Tree BFS/DFS<br>Graph shortest path and MST<br>Choose structures under constraints | Complete two timed problems and update your revision notes. |
| D3 | 2027-12-22 | **Docker**<br>Image registries, tags and build pipelines | Registry login and image tagging<br>Immutable tags and versioning<br>Image pull/push and deployment provenance | Build and publish a versioned image to a registry using secure credentials. |
| D4 | 2027-12-23 | **DSA**<br>DSA maintenance: DP and binary search review | DP recurrence and table order<br>Binary-search invariants<br>Complexity | Solve one DP and one binary-search problem without reference notes. |
| D5 | 2027-12-24 | **Docker Security**<br>Container security and runtime configuration | Non-root execution and read-only filesystem<br>Secrets/config injection<br>Image scanning and minimal permissions | Harden the application image and document the security settings. |
| D6 · Checkpoint | 2027-12-25 | **Checkpoint**<br>Checkpoint: hardened container release | Image builds reproducibly<br>Runtime is non-root and resource-limited<br>Secrets are not baked into layers | Release hardened Docker images for the API and worker. |

**Week deliverable:** Hardened container images and deployment notes.

### Week 59 — AWS fundamentals: IAM, networking and compute
**Phase 5 · Systems, networking, cloud and DevOps** | **2027-12-27 – 2028-01-02**  
Understand the main cloud building blocks and deploy without unsafe defaults.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2027-12-27 | **AWS**<br>Cloud shared-responsibility and IAM | Regions and availability zones<br>Users, roles, policies and least privilege<br>Credentials and temporary role assumption | Design a least-privilege role for deploying an application; do not use root credentials. |
| D2 | 2027-12-28 | **DSA**<br>DSA maintenance: timed mixed interview | One array/hash/stack problem<br>One tree/graph problem<br>Explain trade-offs | Complete a two-problem mock and record time spent on reading versus coding. |
| D3 | 2027-12-29 | **AWS / Networking**<br>VPC, subnets, route tables and security groups | VPC and CIDR planning<br>Public/private subnets and routing<br>Security group versus network ACL | Draw a simple application VPC with public ingress and private data services. |
| D4 | 2027-12-30 | **DSA**<br>DSA maintenance: weak-topic review | Identify weak patterns from mock<br>Re-derive algorithms<br>Solve a new related variant | Re-solve two weak problems and one new variation. |
| D5 | 2027-12-31 | **AWS**<br>Compute options and deployment model | EC2 instance and AMI concepts<br>Load balancer and autoscaling overview<br>Cost, availability and patching trade-offs | Choose a simple hosting approach for the Node app and estimate its monthly cost before provisioning. |
| D6 · Checkpoint | 2028-01-01 | **Checkpoint**<br>Checkpoint: cloud architecture plan | Least-privilege IAM plan<br>Network diagram with security boundaries<br>Compute choice and cost assumptions | Produce a cloud deployment plan and validate that no public data store is exposed. |

**Week deliverable:** AWS architecture diagram and cost/safety checklist.

### Week 60 — AWS storage, databases and secrets
**Phase 5 · Systems, networking, cloud and DevOps** | **2028-01-03 – 2028-01-09**  
Connect a deployed application to managed cloud storage and database services.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2028-01-03 | **AWS**<br>Object storage and S3 | Buckets, objects, keys and versioning<br>Block public access and bucket policies<br>Lifecycle and encryption | Create a private object-storage design for user uploads and define access requirements. |
| D2 | 2028-01-04 | **DSA**<br>DSA maintenance: graph and heap refresh | Dijkstra and priority queue<br>MST and DSU<br>Graph complexity | Solve two graph problems and explain data-structure selection. |
| D3 | 2028-01-05 | **AWS / DBMS**<br>Managed relational database and backups | RDS instance, subnet group and security groups<br>Backups, snapshots and restore<br>Connection limits and database credentials | Design a private managed database connection for the Spring service. |
| D4 | 2028-01-06 | **DSA**<br>DSA maintenance: DP review | 1D and 2D DP<br>Knapsack and string DP<br>Recurrence explanation | Re-solve one DP task and one related variant. |
| D5 | 2028-01-07 | **AWS Security**<br>Secrets management and application configuration | Environment variables versus secret stores<br>Rotation and least privilege<br>Avoiding secrets in logs/images/repos | Move sensitive configuration out of image/build and define a rotation procedure. |
| D6 · Checkpoint | 2028-01-08 | **Checkpoint**<br>Checkpoint: cloud storage and database integration | Private storage access strategy<br>Managed database with backup plan<br>Secrets managed outside source control | Prepare a tested cloud integration plan; deploy only within a budget-safe environment. |

**Week deliverable:** Cloud storage/database design and secret-handling plan.
**Research note:** Network security and cloud identity — Trace HTTPS and review least-privilege IAM/network boundaries.

### Week 61 — Cloud deployment and Infrastructure as Code introduction
**Phase 5 · Systems, networking, cloud and DevOps** | **2028-01-10 – 2028-01-16**  
Deploy a real service with repeatable infrastructure and controlled costs.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2028-01-10 | **Cloud Deployment**<br>Deployment architecture and health checks | Frontend/API/data-service boundaries<br>Health and readiness probes<br>Reverse proxy and TLS | Create a production deployment diagram and health-check endpoints. |
| D2 | 2028-01-11 | **DSA**<br>DSA maintenance: timed review | Two medium problems from different categories<br>Complexity and edge case discussion<br>Post-solve review | Run a 70-minute mock and review the lowest-confidence topic. |
| D3 | 2028-01-12 | **AWS / Docker**<br>Deploy containerised API to cloud compute | Provision compute and secure ingress<br>Pull versioned image and configure environment<br>Logs, health checks and restart behaviour | Deploy a small containerised API in a cost-controlled environment or equivalent cloud lab. |
| D4 | 2028-01-13 | **DSA**<br>DSA maintenance: mixed graph/DP | Choose graph versus DP representation<br>Build recurrence or traversal invariant<br>Test edge cases | Complete one graph and one DP problem. |
| D5 | 2028-01-14 | **DevOps**<br>Infrastructure as Code concepts | Declarative desired state<br>Terraform providers/resources/state<br>Plan/apply/destroy and drift | Write a small Terraform configuration for a non-production resource or local practice provider. |
| D6 · Checkpoint | 2028-01-15 | **Checkpoint**<br>Checkpoint: repeatable cloud deployment | Deployment can be reproduced from instructions<br>Health and logs are accessible<br>Cost and teardown steps are documented | Demonstrate a deployed container and a teardown/recreate runbook. |

**Week deliverable:** Repeatable cloud deployment demo and runbook.

### Week 62 — Kubernetes fundamentals
**Phase 5 · Systems, networking, cloud and DevOps** | **2028-01-17 – 2028-01-23**  
Understand container orchestration and when it is useful.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2028-01-17 | **Kubernetes**<br>Kubernetes architecture and objects | Control plane and worker-node roles<br>Pod, Deployment, ReplicaSet and Service<br>Desired state and reconciliation loop | Draw a basic cluster and map the API deployment into Kubernetes objects. |
| D2 | 2028-01-18 | **DSA**<br>DSA maintenance: advanced mixed practice | DP/graph/heap selection<br>Write concise correctness argument<br>Timed implementation | Complete two medium problems and update spaced revisions. |
| D3 | 2028-01-19 | **Kubernetes**<br>Pods, deployments and services | Pod lifecycle and restart policy<br>Deployment replicas and rollout<br>ClusterIP and external service exposure | Deploy a small stateless API to a local Kubernetes cluster. |
| D4 | 2028-01-20 | **DSA**<br>DSA maintenance: patterns under constraints | Read constraints first<br>Choose data structure and complexity target<br>Avoid premature optimisation | Solve two unseen tasks and compare brute-force with final approach. |
| D5 | 2028-01-21 | **Kubernetes**<br>ConfigMaps, Secrets and probes | ConfigMap and Secret use<br>Liveness, readiness and startup probes<br>Resource requests and limits | Configure probes, environment and resource limits for the API deployment. |
| D6 · Checkpoint | 2028-01-22 | **Checkpoint**<br>Checkpoint: basic orchestrated service | Deployments and services work<br>Configuration and probes are correct<br>Rollout and rollback demonstrated | Deliver a local Kubernetes deployment with a short operations walkthrough. |

**Week deliverable:** Local Kubernetes deployment and YAML manifests.

### Week 63 — Kubernetes operations, ingress and deployment strategy
**Phase 5 · Systems, networking, cloud and DevOps** | **2028-01-24 – 2028-01-30**  
Learn the practical operational layer without turning Kubernetes into a tool-collecting exercise.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2028-01-24 | **Kubernetes**<br>Ingress, DNS and TLS routing | Ingress controller role<br>Host/path routing<br>TLS certificates and service discovery | Expose the local API through an ingress route and test host/path matching. |
| D2 | 2028-01-25 | **DSA**<br>DSA maintenance: data structure review | Heap, trie and DSU<br>Graph traversal and shortest paths<br>Complexity and correctness | Solve two selected problems and explain the structure choice. |
| D3 | 2028-01-26 | **Kubernetes**<br>Rolling updates, rollback and autoscaling | Rolling update strategy<br>Horizontal pod autoscaler concepts<br>Disruption budgets and replicas | Demonstrate a rollout and rollback; simulate a pod failure. |
| D4 | 2028-01-27 | **DSA**<br>DSA maintenance: DP and mixed review | State definition and recurrence<br>Space optimisation<br>Pattern recognition | Re-solve one DP problem and one mixed problem. |
| D5 | 2028-01-28 | **Kubernetes**<br>Persistent storage and cluster security | PersistentVolume and PersistentVolumeClaim<br>Service accounts and RBAC<br>Network policy and secret handling | Document a secure deployment boundary and test a persistent-volume scenario locally. |
| D6 · Checkpoint | 2028-01-29 | **Checkpoint**<br>Checkpoint: Kubernetes operations drill | Perform rollout and rollback<br>Inspect logs/events and diagnose a failed pod<br>Explain service and ingress path | Complete a Kubernetes troubleshooting lab and write a runbook. |

**Week deliverable:** Kubernetes deployment and troubleshooting runbook.

### Week 64 — Kafka and event-streaming fundamentals
**Phase 5 · Systems, networking, cloud and DevOps** | **2028-01-31 – 2028-02-06**  
Understand event streams, partitions and consumer behaviour.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2028-01-31 | **Kafka**<br>Kafka architecture and event model | Broker, topic, partition and record<br>Producer and consumer roles<br>Ordering within a partition | Draw a topic/partition layout for order and inventory events. |
| D2 | 2028-02-01 | **DSA**<br>DSA maintenance: mixed interview session | Pattern identification<br>Complexity and edge cases<br>Explain approach before coding | Complete two interview problems and review communication. |
| D3 | 2028-02-02 | **Kafka**<br>Partitions, keys and consumer groups | Partition key and ordering<br>Consumer group assignment<br>Offsets and rebalancing | Build a simple producer/consumer demo and observe partition assignment. |
| D4 | 2028-02-03 | **DSA**<br>DSA maintenance: graph and DP | Dijkstra/topological patterns<br>DP transition design<br>Re-solve previous failures | Complete two problems selected from the weak-topic list. |
| D5 | 2028-02-04 | **Kafka**<br>Delivery semantics and retries | At-most-once and at-least-once<br>Offset commit strategy<br>Idempotent consumer and duplicate events | Implement a consumer that safely handles replayed order events. |
| D6 · Checkpoint | 2028-02-05 | **Checkpoint**<br>Checkpoint: event-driven order flow | Publish domain events<br>Consume asynchronously with retry policy<br>Handle duplicate messages safely | Build an order-created event flow and document ordering, retries and idempotency. |

**Week deliverable:** Kafka producer/consumer demo and event-flow diagram.

### Week 65 — Observability, reliability and Phase 5 capstone
**Phase 5 · Systems, networking, cloud and DevOps** | **2028-02-07 – 2028-02-13**  
Operate a deployed system using logs, metrics, traces and realistic failure handling.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2028-02-07 | **Observability**<br>Observability pillars and instrumentation | Logs, metrics and distributed traces<br>Correlation IDs and trace context<br>RED/USE metrics concepts | Instrument the backend with structured logs and a few meaningful metrics. |
| D2 | 2028-02-08 | **DSA**<br>DSA maintenance: timed cumulative assessment | Arrays/strings/hashing<br>Trees/graphs/DP<br>Communicate approach and complexity | Complete a cumulative timed assessment and compare with the Phase 3 result. |
| D3 | 2028-02-09 | **Reliability Engineering**<br>SLOs, error budgets and alert design | SLI/SLO/SLA differences<br>Availability and latency objectives<br>Alert on symptoms rather than noise | Define two SLIs and one SLO for the e-commerce API. |
| D4 | 2028-02-10 | **DSA**<br>DSA maintenance: targeted remediation | Review assessment misses<br>Solve related unseen variants<br>Build a deliberate revision schedule | Repair the two weakest DSA categories. |
| D5 | 2028-02-11 | **Reliability Engineering**<br>Incident response, backups and recovery | Failure detection and incident timeline<br>Rollback and backup restore<br>Runbooks and postmortem structure | Simulate a failed deployment or unavailable dependency and follow a recovery runbook. |
| D6 · Checkpoint | 2028-02-12 | **Checkpoint**<br>Phase 5 checkpoint: operated cloud service | Containerised service deployed<br>CI/CD and environment security in place<br>Logs/metrics/health checks available<br>Cost, backup and recovery plan documented | Deliver a deployed application with an operations dashboard/runbook and a short failure-recovery demonstration. |

**Week deliverable:** Cloud/DevOps capstone with CI/CD, containers, observability and recovery documentation.
**Research note:** Reliability engineering — Create a mini-postmortem from a simulated outage and propose one preventive control.
**Project linkage:** Cloud Operations Capstone

### Week 66 — Python, NumPy, Pandas and reproducible data workflows
**Phase 6 · AI engineering, LLM systems and research** | **2028-02-14 – 2028-02-20**  
Strengthen Python for AI work and become able to load, clean and analyse a real dataset reproducibly.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2028-02-14 | **Python**<br>Python project structure, environments and quality | Virtual environments and dependency pinning<br>Modules, packages and project layout<br>Typing, linting and test basics | Create a reproducible Python project with tests, pinned dependencies and a clean README. |
| D2 | 2028-02-15 | **Python**<br>Python data structures, mutability and iterators | Lists, tuples, sets and dictionaries<br>Comprehensions, generators and iterators<br>Mutability, shallow copies and memory behaviour | Build a JSON-lines processor and compare generator versus list memory use. |
| D3 | 2028-02-16 | **Python / Data**<br>NumPy arrays and vectorisation | ndarray shape, dtype and broadcasting<br>Indexing, slicing and boolean masks<br>Vectorised operations versus Python loops | Analyse a numeric dataset with NumPy and measure a vectorised operation. |
| D4 | 2028-02-17 | **Pandas**<br>Pandas DataFrame, selection and data cleaning | CSV/JSON/Parquet input and dtypes<br>loc/iloc, filtering and missing values<br>Duplicate handling and date parsing | Load a real dataset, create a cleaning pipeline and record assumptions. |
| D5 | 2028-02-18 | **Pandas / Data**<br>Aggregation, joins and exploratory analysis | groupby/agg and pivot tables<br>merge/join and key cardinality<br>Outliers, distributions and correlation caveats | Produce an EDA report with at least five useful findings and caveats. |
| D6 · Checkpoint | 2028-02-19 | **Checkpoint**<br>Checkpoint: reproducible Python data pipeline | Create a clean, reproducible Python environment<br>Load, validate and clean a real dataset<br>Produce meaningful summaries and a reproducible EDA report | Publish a script/notebook-based data pipeline with tests, source provenance and clear limitations. |

**Week deliverable:** Python data-processing and EDA project with reproducible dependencies, tests and a concise report.

### Week 67 — Math and statistics for machine learning
**Phase 6 · AI engineering, LLM systems and research** | **2028-02-21 – 2028-02-27**  
Learn the mathematical tools needed to understand model behaviour rather than memorise APIs.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2028-02-21 | **Math for ML**<br>Linear algebra: vectors and matrices | Vectors, dimensions and norms<br>Matrix operations and multiplication<br>Dot product and geometric interpretation | Implement vector/matrix operations in NumPy and explain shape errors. |
| D2 | 2028-02-22 | **DSA**<br>DSA maintenance: mixed timed practice | Array/hash map and binary search<br>Tree/graph reasoning<br>Complexity explanation | Complete two interview problems and review weak reasoning. |
| D3 | 2028-02-23 | **Math for ML**<br>Linear algebra: projections and eigen intuition | Linear combinations and basis<br>Projection and cosine similarity<br>Eigenvalue/eigenvector intuition | Compute vector similarity and a simple projection with NumPy. |
| D4 | 2028-02-24 | **DSA**<br>DSA maintenance: DP and greedy review | State design and transition<br>Greedy correctness intuition<br>Re-solve a failed task | Complete one DP and one greedy problem. |
| D5 | 2028-02-25 | **Math for ML**<br>Probability, distributions and statistics | Conditional probability and Bayes' rule<br>Mean, variance and common distributions<br>Sampling, correlation and uncertainty | Analyse a sample dataset and distinguish correlation from causation. |
| D6 · Checkpoint | 2028-02-26 | **Checkpoint**<br>Checkpoint: mathematical ML foundations | Explain vectors, dot products and cosine similarity<br>Compute summary statistics correctly<br>Interpret a probability-based result | Complete a small math notebook with worked examples and interpretation. |

**Week deliverable:** Math-for-ML notebook with vector and statistics experiments.

### Week 68 — Machine learning workflow and supervised learning
**Phase 6 · AI engineering, LLM systems and research** | **2028-02-28 – 2028-03-05**  
Build an end-to-end classical ML workflow with correct data handling.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2028-02-28 | **Machine Learning**<br>ML problem framing and dataset splits | Regression versus classification<br>Train/validation/test split<br>Data leakage and target leakage | Define a supervised learning task and create a leakage-safe split. |
| D2 | 2028-02-29 | **DSA**<br>DSA maintenance: mixed assessment | Pattern selection<br>Correctness and complexity<br>Timed communication | Complete a 75-minute mixed set and compare progress with prior assessments. |
| D3 | 2028-03-01 | **Machine Learning**<br>Linear regression and loss functions | Prediction function and residuals<br>MSE/MAE and objective functions<br>Gradient-descent intuition | Train a linear regression baseline and plot residuals. |
| D4 | 2028-03-02 | **DSA**<br>DSA maintenance: graphs and advanced arrays | Graph traversal and shortest paths<br>Sliding window and prefix sums<br>Edge-case reasoning | Solve two medium problems selected from weak topics. |
| D5 | 2028-03-03 | **Machine Learning**<br>Logistic regression and classification | Sigmoid and probability output<br>Binary cross-entropy<br>Decision threshold and class balance | Train a logistic-regression classifier and interpret probabilities. |
| D6 · Checkpoint | 2028-03-04 | **Checkpoint**<br>Checkpoint: baseline ML model | Build a reproducible train/evaluate pipeline<br>Compare baseline metrics<br>Document leakage and limitations | Deliver a small supervised ML model with dataset provenance, metrics and reproducible code. |

**Week deliverable:** Baseline supervised ML project with reproducible evaluation.

### Week 69 — Model evaluation, feature engineering and tree models
**Phase 6 · AI engineering, LLM systems and research** | **2028-03-06 – 2028-03-12**  
Evaluate models correctly and learn the strength/limits of tree-based methods.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2028-03-06 | **Machine Learning**<br>Classification and regression metrics | Confusion matrix, precision, recall and F1<br>ROC-AUC and PR-AUC use cases<br>MAE, RMSE and R-squared | Choose metrics appropriate to imbalanced and balanced tasks; explain the decision. |
| D2 | 2028-03-07 | **DSA**<br>DSA maintenance: graph and DP patterns | BFS/DFS and Dijkstra<br>1D/2D DP<br>Pattern selection from constraints | Complete two problems and explain complexity. |
| D3 | 2028-03-08 | **Machine Learning**<br>Feature engineering and preprocessing | Scaling and categorical encoding<br>Missing-data handling<br>Pipelines and fit/transform separation | Build a preprocessing pipeline without fitting on test data. |
| D4 | 2028-03-09 | **DSA**<br>DSA maintenance: trees, heaps and intervals | Tree traversal and BST<br>Heap top-K<br>Sort and interval patterns | Solve two medium problems and revisit one earlier failure. |
| D5 | 2028-03-10 | **Machine Learning**<br>Decision trees and ensemble methods | Tree splits and overfitting<br>Random forest and bagging<br>Gradient boosting intuition | Compare linear, tree and ensemble baselines using cross-validation. |
| D6 · Checkpoint | 2028-03-11 | **Checkpoint**<br>Checkpoint: model comparison report | Use an appropriate metric and cross-validation<br>Compare at least three model baselines<br>Explain overfit/underfit and feature choices | Produce a model-comparison report with reproducible code and limitations. |

**Week deliverable:** Model comparison report with a justified model choice.
**Research note:** Machine learning evaluation — Compare models with appropriate metrics and document leakage/overfitting risks.

### Week 70 — Neural networks and PyTorch fundamentals
**Phase 6 · AI engineering, LLM systems and research** | **2028-03-13 – 2028-03-19**  
Understand how neural networks learn and implement a small model from tensors.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2028-03-13 | **Deep Learning**<br>Perceptrons, activations and network layers | Linear layers and weighted sums<br>ReLU, sigmoid and softmax<br>Loss function and prediction output | Implement a tiny feed-forward network using PyTorch modules. |
| D2 | 2028-03-14 | **DSA**<br>DSA maintenance: timed medium problems | Select a data structure from constraints<br>Prove loop/recursion invariant<br>Complexity and edge cases | Complete two medium problems and write a correctness outline. |
| D3 | 2028-03-15 | **Deep Learning**<br>Gradient descent and backpropagation | Computational graph and chain rule<br>Gradients and parameter updates<br>Learning rate and convergence | Visualise loss over epochs and vary learning rate in a small experiment. |
| D4 | 2028-03-16 | **DSA**<br>DSA maintenance: advanced revision | DP/graph/trie/DSU review<br>Re-solve old medium problem<br>Explain trade-offs | Solve one advanced problem and re-implement one old solution from scratch. |
| D5 | 2028-03-17 | **PyTorch**<br>Training loops and regularisation | Dataset/DataLoader and batch training<br>Train/eval modes and gradient reset<br>Dropout, weight decay and early stopping | Build a complete training loop with validation and checkpoint saving. |
| D6 · Checkpoint | 2028-03-18 | **Checkpoint**<br>Checkpoint: train and evaluate a neural network | Prepare data and model<br>Train with validation monitoring<br>Report metrics and overfitting behaviour | Train a small neural network on a public dataset and document experiments. |

**Week deliverable:** PyTorch training project and experiment log.

### Week 71 — Embeddings, tokenisation and NLP foundations
**Phase 6 · AI engineering, LLM systems and research** | **2028-03-20 – 2028-03-26**  
Understand how text becomes model input and how semantic representations are formed.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2028-03-20 | **NLP**<br>Text preprocessing and tokenisation | Normalisation and token boundaries<br>Word, subword and byte-level tokenisation<br>Vocabulary, unknown tokens and special tokens | Compare token counts for several texts using an available tokenizer. |
| D2 | 2028-03-21 | **DSA**<br>DSA maintenance: strings and trie problems | String parsing and frequency maps<br>Trie prefix operations<br>Sliding-window substrings | Solve two string-focused problems and explain complexity. |
| D3 | 2028-03-22 | **AI Engineering**<br>Vector embeddings and semantic similarity | Embedding vectors and dimensions<br>Cosine similarity and nearest neighbours<br>Semantic versus lexical similarity | Generate or use a small embedding set and inspect nearest-neighbour results. |
| D4 | 2028-03-23 | **DSA**<br>DSA maintenance: graph/heap patterns | Priority queue and top-K<br>Graph traversal and shortest path<br>Complexity | Solve two graph/heap problems and review prior mistakes. |
| D5 | 2028-03-24 | **NLP**<br>NLP task framing and text classification | Bag-of-words/TF-IDF baseline<br>Embeddings-based classification<br>Evaluation and error analysis | Compare TF-IDF and embedding-based text similarity/classification on a small dataset. |
| D6 · Checkpoint | 2028-03-25 | **Checkpoint**<br>Checkpoint: semantic search prototype | Create text chunks/items with metadata<br>Compute vector similarity<br>Inspect false-positive and false-negative matches | Build a tiny semantic-search prototype and document where lexical search works better. |

**Week deliverable:** Semantic search prototype with an error-analysis note.

### Week 72 — Transformers, attention and language-model mechanics
**Phase 6 · AI engineering, LLM systems and research** | **2028-03-27 – 2028-04-02**  
Develop a conceptual and implementation-level understanding of transformer models.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2028-03-27 | **Deep Learning / LLM**<br>Transformer architecture overview | Encoder, decoder and encoder-decoder roles<br>Token embeddings and positional information<br>Residual connections and layer normalisation | Draw a transformer block and describe the data flow through it. |
| D2 | 2028-03-28 | **DSA**<br>DSA maintenance: mixed interview practice | Arrays/hash maps and strings<br>Tree/graph problems<br>Complexity and edge cases | Complete two timed problems and communicate the solution. |
| D3 | 2028-03-29 | **LLM Foundations**<br>Self-attention and multi-head attention | Queries, keys and values<br>Scaled dot-product attention<br>Multi-head attention intuition | Implement a tiny scaled dot-product attention operation with NumPy or PyTorch. |
| D4 | 2028-03-30 | **DSA**<br>DSA maintenance: DP and graph revision | DP state and transition<br>Graph shortest path/topological order<br>Revisit spaced problems | Solve one DP and one graph problem. |
| D5 | 2028-03-31 | **LLM Foundations**<br>Token prediction, context windows and loss | Next-token prediction objective<br>Cross-entropy and perplexity intuition<br>Context length and attention cost | Trace a toy next-token prediction example and explain how context changes output. |
| D6 · Checkpoint | 2028-04-01 | **Checkpoint**<br>Checkpoint: transformer mechanics notebook | Explain tokenisation and embeddings<br>Trace Q/K/V attention at small dimensions<br>Describe next-token training objective | Create a notebook that computes a tiny attention example and explains each tensor shape. |

**Week deliverable:** Transformer mechanics notebook with tensor-shape explanations.

### Week 73 — Local model inference, Ollama and serving
**Phase 6 · AI engineering, LLM systems and research** | **2028-04-03 – 2028-04-09**  
Understand how models are loaded, served and constrained on real hardware.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2028-04-03 | **LLM Engineering**<br>Inference pipeline and model formats | Tokenizer, weights and generation loop<br>Model formats and quantisation overview<br>Memory requirements and context cache | Inspect local model metadata and estimate memory needs before loading. |
| D2 | 2028-04-04 | **DSA**<br>DSA maintenance: mixed assessment | Problem decomposition<br>Pattern recognition<br>Complexity explanation | Complete a timed two-problem set and compare with the previous month. |
| D3 | 2028-04-05 | **LLM Engineering**<br>Ollama and local model serving | Model pull/run and local API<br>Generation parameters and prompt format<br>Streaming and request lifecycle | Call a local model through its HTTP API from a Python script. |
| D4 | 2028-04-06 | **DSA**<br>DSA maintenance: weak-topic repair | Review mistakes from timed test<br>Re-solve from blank editor<br>Create a variant problem | Repair two weak patterns and write a short solution explanation. |
| D5 | 2028-04-07 | **LLM Engineering**<br>Quantisation, fine-tuning and inference trade-offs | Parameter count, memory estimates and quantisation levels<br>Quality, memory and speed trade-offs<br>Supervised fine-tuning (SFT) data preparation and instruction format<br>LoRA/QLoRA intuition and when parameter-efficient tuning helps<br>Evaluation before and after tuning; avoid training-data leakage | Estimate memory for a small model, inspect a fine-tuning dataset format and compare inference benchmarks; do not attempt full-scale training. |
| D6 · Checkpoint | 2028-04-08 | **Checkpoint**<br>Checkpoint: local model inference service | Expose model calls through a small service<br>Handle timeout and streaming responses<br>Record latency and resource use | Build a small local LLM-backed API using Ollama with explicit error and timeout handling. |

**Week deliverable:** Local inference API with benchmark notes.
**Research note:** Transformer inference and quantisation — Benchmark local inference settings and explain memory/latency/quality trade-offs.

### Week 74 — Vector databases and retrieval foundations
**Phase 6 · AI engineering, LLM systems and research** | **2028-04-10 – 2028-04-16**  
Build retrieval systems that can find relevant source material before generating answers.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2028-04-10 | **RAG**<br>Vector search and similarity indexes | Vector dimensions and distance metrics<br>Exact versus approximate nearest neighbour<br>Recall/latency trade-offs | Compare exact cosine search with an approximate vector index on a small corpus. |
| D2 | 2028-04-11 | **DSA**<br>DSA maintenance: advanced mixed problems | Graph/DP/heap selection<br>Correctness and complexity<br>Timed implementation | Complete two medium problems and review the weak-topic log. |
| D3 | 2028-04-12 | **RAG**<br>Vector database schema and metadata filters | Document IDs, chunks and metadata<br>Namespaces/collections and metadata filters<br>Delete/update and re-indexing | Store embeddings with source, section and document metadata in a vector store. |
| D4 | 2028-04-13 | **DSA**<br>DSA maintenance: tree, trie and graph patterns | Prefix search and trie<br>BFS/DFS and weighted paths<br>Tree ancestry | Solve two mixed problems without looking at templates. |
| D5 | 2028-04-14 | **RAG Evaluation**<br>Retrieval evaluation basics | Query set and relevance labels<br>Precision@K, Recall@K and MRR intuition<br>False positives and retrieval misses | Create a small labelled query set and calculate retrieval metrics. |
| D6 · Checkpoint | 2028-04-15 | **Checkpoint**<br>Checkpoint: evaluated retrieval layer | Index a small document corpus<br>Retrieve and filter relevant chunks<br>Measure retrieval quality on labelled queries | Deliver a vector-search component and a small retrieval-evaluation report. |

**Week deliverable:** Vector retrieval layer with labelled queries and measured retrieval metrics.

### Week 75 — RAG pipeline: ingestion, chunking and generation
**Phase 6 · AI engineering, LLM systems and research** | **2028-04-17 – 2028-04-23**  
Connect document ingestion, retrieval and grounded generation into one system.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2028-04-17 | **RAG**<br>Document ingestion and parsing | PDF/text extraction and metadata<br>Document identity and deduplication<br>Source provenance and parser errors | Build an ingestion pipeline for a curated collection of technical PDFs and web-exported text. |
| D2 | 2028-04-18 | **DSA**<br>DSA maintenance: graph and DP review | Graph traversal and shortest paths<br>DP recurrence and state<br>Timed practice | Complete one graph and one DP problem. |
| D3 | 2028-04-19 | **RAG**<br>Chunking strategies and overlap | Fixed-size versus semantic chunking<br>Chunk size and overlap trade-offs<br>Preserving headings, page and section metadata | Implement two chunking strategies and inspect chunks for boundary quality. |
| D4 | 2028-04-20 | **DSA**<br>DSA maintenance: strings, hashing and intervals | String matching and frequency maps<br>Hash map patterns<br>Intervals and sorting | Solve two problem variants and explain the data structure choice. |
| D5 | 2028-04-21 | **RAG**<br>Prompt context assembly and grounded answers | Top-K selection and context ordering<br>Citations/source references<br>Prompt injection and untrusted document content | Generate answers only from retrieved context and require source citations. |
| D6 · Checkpoint | 2028-04-22 | **Checkpoint**<br>Checkpoint: end-to-end basic RAG | Ingest documents and split into chunks<br>Embed and retrieve relevant passages<br>Generate cited answers with a no-answer path | Build a basic RAG assistant over a small technical document collection. |

**Week deliverable:** Working document RAG prototype with source citations.

### Week 76 — RAG quality: hybrid search, reranking and evaluation
**Phase 6 · AI engineering, LLM systems and research** | **2028-04-24 – 2028-04-30**  
Improve retrieval and answer quality using measurable experiments.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2028-04-24 | **RAG**<br>Lexical search and hybrid retrieval | BM25 and term matching intuition<br>Dense vector retrieval<br>Hybrid score fusion and metadata filtering | Compare BM25, dense and hybrid retrieval on the same labelled query set. |
| D2 | 2028-04-25 | **DSA**<br>DSA maintenance: mixed interview practice | Pattern recognition under constraints<br>Correctness and complexity<br>Re-solve a spaced problem | Complete two timed problems and review mistakes. |
| D3 | 2028-04-26 | **RAG**<br>Reranking and context compression | Bi-encoder versus cross-encoder role<br>Reranking top candidate passages<br>Removing irrelevant context safely | Add a reranking stage and compare top-K relevance before/after. |
| D4 | 2028-04-27 | **DSA**<br>DSA maintenance: advanced structures review | Trie, heap, DSU and graph selection<br>Amortised complexity<br>Edge-case handling | Solve two selected problems from weaker categories. |
| D5 | 2028-04-28 | **RAG Evaluation**<br>RAG evaluation and failure analysis | Retrieval recall and answer relevance<br>Faithfulness and citation correctness<br>Abstention and unanswerable questions | Build a test set with expected source passages and score failures by category. |
| D6 · Checkpoint | 2028-04-29 | **Checkpoint**<br>Checkpoint: RAG evaluation report | Compare baseline and improved retrieval<br>Measure retrieval and answer quality<br>Document limitations and reproducible settings | Produce an evaluation report with examples of correct, unsupported and failed answers. |

**Week deliverable:** RAG system with hybrid retrieval/reranking and an evaluation report.

### Week 77 — AI agents, tool calling and controlled workflows
**Phase 6 · AI engineering, LLM systems and research** | **2028-05-01 – 2028-05-07**  
Build useful tool-using systems without confusing an agent loop with a reliable application.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2028-05-01 | **AI Agents**<br>Tool calling and structured outputs | Tool schema and typed arguments<br>Model tool request versus actual execution<br>Validation and permission boundaries | Expose two safe tools (e.g. search notes and calculate) through a typed interface. |
| D2 | 2028-05-02 | **DSA**<br>DSA maintenance: mixed timed review | Graph, DP and data-structure patterns<br>Explain complexity<br>Timed implementation | Complete two medium problems and review the solution process. |
| D3 | 2028-05-03 | **AI Agents**<br>Agent loop, state and bounded execution | Plan/act/observe cycle<br>Conversation and task state<br>Step limits, timeout and retry handling | Implement a bounded tool-calling loop with explicit maximum steps. |
| D4 | 2028-05-04 | **DSA**<br>DSA maintenance: repair and spaced revision | Re-solve previously failed tasks<br>Identify conceptual versus implementation error<br>Write concise explanation | Re-solve two weak-topic problems from a blank editor. |
| D5 | 2028-05-05 | **AI Agents**<br>Memory, retrieval and multi-step workflows | Short-term state versus persistent memory<br>RAG as a tool rather than hidden context<br>Human confirmation for risky actions | Build a multi-step research workflow that searches, retrieves and drafts with explicit source references. |
| D6 · Checkpoint | 2028-05-06 | **Checkpoint**<br>Checkpoint: safe tool-using assistant | Tools have strict schemas and validation<br>Execution is bounded and logged<br>Unsafe or unsupported actions are rejected | Deliver an assistant that uses two or more tools with traceable steps and failure handling. |

**Week deliverable:** Bounded tool-using assistant with execution logs and tests.

### Week 78 — Research capstone, integration and final portfolio
**Phase 6 · AI engineering, LLM systems and research** | **2028-05-08 – 2028-05-14**  
Turn accumulated skills into one independently designed, evaluated and documented engineering project.

| Day | Date | Category and topic | Subtopics to complete | Practice / expected output |
|---|---|---|---|---|
| D1 | 2028-05-08 | **Research / AI Engineering**<br>Capstone scope and research question | Choose a bounded user problem and measurable objective<br>Define baseline, dataset/corpus and evaluation metrics<br>Identify risks, privacy and compute constraints | Write a one-page proposal for the Forge Research Companion (or approved Border Sentinel research extension). |
| D2 | 2028-05-09 | **DSA**<br>DSA final revision: patterns and communication | Review weak-topic matrix<br>Solve one unseen medium problem<br>Explain trade-offs clearly | Complete a final timed DSA session and compare with the Phase 1 baseline. |
| D3 | 2028-05-10 | **AI Engineering**<br>Capstone implementation: robust ingestion and retrieval | Reliable document ingestion and deduplication<br>Hybrid retrieval and metadata filters<br>Citations and source traceability | Implement the complete ingestion/retrieval path with repeatable tests. |
| D4 | 2028-05-11 | **AI Engineering**<br>Capstone implementation: model and agent integration | Local model or provider abstraction<br>Bounded tool calling and state<br>Timeout, no-answer and error paths | Integrate model generation and safe tool use; ensure answers remain grounded in retrieved sources. |
| D5 | 2028-05-12 | **Research**<br>Evaluation, ablation and reproducibility | Baseline versus improved approach<br>Ablation of chunking/retrieval/reranking choices<br>Limitations, failure cases and reproducible setup | Run the evaluation set, compare variants and document results without cherry-picking. |
| D6 · Checkpoint | 2028-05-13 | **Checkpoint**<br>Final checkpoint: capstone and portfolio review | Working end-to-end project<br>Evaluation with real test data and reported limitations<br>README, architecture diagram, demo and short technical report<br>DSA/Core CS retrospective and next 6-month plan | Release the capstone, publish a concise research/engineering report and prepare a portfolio walkthrough. |

**Week deliverable:** Final capstone: documented, tested, evaluated AI application plus research report and portfolio.
**Research note:** RAG/agent research evaluation — Summarise a relevant paper, run one ablation and document limitations.
**Project linkage:** Forge Research Companion / approved AI research capstone

### Day 7 — Weekly review template (every week)
**Time:** 45–60 minutes. No new lecture or new large topic.
- Explain the week's three most important ideas without notes.
- Re-solve one DSA problem after a delay.
- Complete or reschedule unfinished work; do not carry an unbounded backlog.
- Write what you can now build or explain independently.

## 5. Real milestones — outcome-based, not just technology labels

The Milestones page should display these 17 nodes on one winding path. Dates are targets, not automatic completion dates. The learner manually marks a milestone complete only after meeting its acceptance criteria.

### M01 — Programming baseline validated
**Target:** Week 4 · 2026-12-13  
**Tagline:** You can reason about code, not just run it.  
Demonstrate working JavaScript fundamentals, a reliable C++ setup and basic complexity reasoning.  
**Technologies:** JavaScript, C++, Git
**Acceptance criteria:**
- [ ] Complete the initial diagnostic and document gaps.
- [ ] Write small JavaScript and C++ programs independently.
- [ ] Explain the complexity of a simple traversal, nested loop and search.
- [ ] Use Git branches and meaningful commits.

### M02 — Browser-side JavaScript engineer
**Target:** Week 8 · 2027-01-10  
**Tagline:** You understand the browser runtime and asynchronous code.  
Build browser features using DOM events, storage, async APIs and TypeScript foundations.  
**Technologies:** JavaScript, DOM, Fetch API, TypeScript
**Acceptance criteria:**
- [ ] Build a browser utility with dynamic DOM interactions and persistence.
- [ ] Handle API loading, failure, timeout and cancellation.
- [ ] Explain one event-loop output trace and one closure example.
- [ ] Use TypeScript types for data boundaries.

### M03 — Frontend engineer: React + TypeScript release
**Target:** Week 13 · 2027-02-14  
**Tagline:** A deployed interface with maintainable state and tests.  
Ship a polished multi-route React/TypeScript application and demonstrate foundational DSA.  
**Technologies:** React, TypeScript, Vite, Tailwind CSS, Vitest
**Acceptance criteria:**
- [ ] Deploy the API Explorer with list/detail routes.
- [ ] Support loading, empty, error, search and filter states.
- [ ] Pass build, typecheck, lint and critical component tests.
- [ ] Solve unseen foundational DSA problems and explain complexity.

### M04 — Backend foundations: Node, Express and MongoDB
**Target:** Week 20 · 2027-04-04  
**Tagline:** You can design and implement backend business logic.  
Build secure API boundaries, intentional data models and the first complete cart flow.  
**Technologies:** Node.js, Express.js, MongoDB, Mongoose
**Acceptance criteria:**
- [ ] Explain the Node request/event-loop model.
- [ ] Implement controllers that delegate business rules to services.
- [ ] Enforce user ownership and validate all inputs.
- [ ] Demonstrate persistent add/update/remove cart operations.

### M05 — Full-stack E-commerce V1
**Target:** Week 26 · 2027-05-16  
**Tagline:** A complete product, cart and order journey.  
Finish the existing e-commerce project instead of abandoning it for another tutorial.  
**Technologies:** React, Node.js, Express, MongoDB, PostgreSQL fundamentals, REST
**Acceptance criteria:**
- [ ] A user can browse products, log in, manage a persistent cart and create an order.
- [ ] Server-side logic recalculates prices and validates stock.
- [ ] Duplicate checkout and invalid quantities are handled safely.
- [ ] Critical routes have automated tests and a documented API.

### M06 — Reliable backend primitives
**Target:** Week 31 · 2027-06-20  
**Tagline:** Your API handles shared state and asynchronous work.  
Use TypeScript, automated tests, Redis, rate limits and background jobs in one real service.  
**Technologies:** TypeScript, Redis, BullMQ or equivalent, Vitest/Jest, Supertest
**Acceptance criteria:**
- [ ] A backend feature is fully typed and runtime-validated.
- [ ] Critical business rules and API flows are tested.
- [ ] Redis-backed caching or rate limiting works and is measured.
- [ ] A background job retries safely without duplicate side effects.

### M07 — Production-oriented backend V2
**Target:** Week 39 · 2027-08-15  
**Tagline:** Build, test, containerise and observe your service.  
Harden the e-commerce backend with Docker, CI, performance measurements and advanced DSA.  
**Technologies:** Node.js, TypeScript, Redis, Docker, Docker Compose, GitHub Actions
**Acceptance criteria:**
- [ ] The service runs from a reproducible Docker Compose setup.
- [ ] CI runs lint, typecheck, tests and build.
- [ ] Redis and queue features have failure-path tests.
- [ ] One performance improvement is measured before and after.
- [ ] Advanced DSA implementations are explained and tested.

### M08 — Java and object-oriented design
**Target:** Week 43 · 2027-09-12  
**Tagline:** You can model domain behaviour in Java.  
Demonstrate Java language fluency, composition, interfaces, collections and concurrency basics.  
**Technologies:** Java, JVM, Collections, Concurrency
**Acceptance criteria:**
- [ ] Build a tested Java domain model with clear invariants.
- [ ] Choose collections based on access patterns.
- [ ] Demonstrate and fix a race condition.
- [ ] Explain one meaningful design trade-off.

### M09 — Secure Spring Boot API
**Target:** Week 46 · 2027-10-03  
**Tagline:** A relational backend with tests and access control.  
Implement Spring Boot REST endpoints backed by PostgreSQL and JPA.  
**Technologies:** Spring Boot, Spring MVC, Spring Data JPA, PostgreSQL, Spring Security
**Acceptance criteria:**
- [ ] CRUD endpoints use DTOs and service boundaries.
- [ ] Database relations and transactions behave correctly.
- [ ] Validation and consistent errors are implemented.
- [ ] Authentication and resource permissions are tested.

### M10 — System design and Spring service capstone
**Target:** Week 52 · 2027-11-14  
**Tagline:** You can explain how your service behaves under load and failure.  
Release an Inventory and Order Management API with explicit system-design trade-offs.  
**Technologies:** Spring Boot, PostgreSQL, System Design, Distributed Systems
**Acceptance criteria:**
- [ ] Release a documented Spring Boot inventory/order service.
- [ ] Present one-page architecture and API diagrams.
- [ ] Explain database, caching and messaging trade-offs.
- [ ] Demonstrate one timeout/retry or idempotency behaviour.
- [ ] Complete a system-design walkthrough.

### M11 — Core systems and networking foundation
**Target:** Week 57 · 2027-12-19  
**Tagline:** You understand what happens below the API.  
Connect Linux operations, computer architecture, OS concepts and network protocols to application behaviour.  
**Technologies:** Linux, Operating Systems, Computer Architecture, Computer Networks
**Acceptance criteria:**
- [ ] Use shell tools to inspect processes, logs and permissions.
- [ ] Explain binary representation, CPU execution and cache locality.
- [ ] Explain virtual memory, scheduling and concurrency.
- [ ] Trace DNS, TCP and HTTPS at a high level.

### M12 — Cloud-deployed application
**Target:** Week 61 · 2028-01-16  
**Tagline:** You can deploy a containerised service with secure cloud boundaries.  
Deploy a service with a clear network, identity, storage and database plan.  
**Technologies:** AWS IAM, VPC, EC2 or equivalent, S3, RDS, Docker, Terraform basics
**Acceptance criteria:**
- [ ] Deploy a versioned container image in a budget-controlled environment.
- [ ] Keep the database private and credentials outside the repository.
- [ ] Document health checks, logs, backups and teardown.
- [ ] Recreate the deployment from written instructions.

### M13 — DevOps and reliability capstone
**Target:** Week 65 · 2028-02-13  
**Tagline:** You can operate and recover a deployed application.  
Demonstrate CI/CD, basic Kubernetes, Kafka concepts and observability without unnecessary complexity.  
**Technologies:** GitHub Actions, Kubernetes, Kafka, Metrics, Logs, Tracing
**Acceptance criteria:**
- [ ] CI/CD gates a deployment on successful quality checks.
- [ ] A local Kubernetes deployment can be rolled out and rolled back.
- [ ] A producer/consumer demo handles retries and duplicate events.
- [ ] The application has basic metrics/logs and a recovery runbook.

### M14 — Machine learning engineering foundation
**Target:** Week 70 · 2028-03-19  
**Tagline:** You can train and evaluate a model responsibly.  
Build a leakage-safe, reproducible ML pipeline and a small neural network.  
**Technologies:** Python, NumPy, Pandas, scikit-learn, PyTorch
**Acceptance criteria:**
- [ ] Build a reproducible dataset and training pipeline.
- [ ] Compare multiple baselines using appropriate metrics.
- [ ] Explain data leakage and overfitting.
- [ ] Train and evaluate a small PyTorch model.

### M15 — LLM retrieval engineer
**Target:** Week 75 · 2028-04-23  
**Tagline:** You can build grounded answers from a document collection.  
Run local models and construct vector retrieval and a basic cited RAG system.  
**Technologies:** Ollama, Embeddings, Vector Search, RAG
**Acceptance criteria:**
- [ ] Run a local model through a documented API.
- [ ] Ingest a curated document collection with source metadata.
- [ ] Retrieve relevant chunks and produce source-linked answers.
- [ ] Record latency and retrieval-quality measurements.

### M16 — AI research capstone
**Target:** Week 78 · 2028-05-14  
**Tagline:** You can design, evaluate and explain a complete AI system.  
Ship a RAG/agent application or approved research extension with reproducible evaluation.  
**Technologies:** Python, LLMs, RAG, Tool Calling, Evaluation
**Acceptance criteria:**
- [ ] Deliver a working end-to-end AI application.
- [ ] Evaluate on a curated test set with documented metrics.
- [ ] Compare at least one baseline and one improved variant.
- [ ] Include failure examples, limitations and setup instructions.
- [ ] Publish a short technical report and demo.

### M17 — 18-month engineering showcase
**Target:** Day 547 · 2028-05-15  
**Tagline:** Show what you can build and explain independently.  
Final portfolio review and programme close-out on 15 May 2028, the repository's target end date.  
**Technologies:** Portfolio, Technical Communication, Interview Readiness
**Acceptance criteria:**
- [ ] Present three strongest projects with demos and READMEs.
- [ ] Explain architecture, data model, testing and deployment choices.
- [ ] Complete a final DSA/Core CS self-assessment.
- [ ] Write a realistic next six-month learning and internship plan.

## 6. Projects — seven substantial deliverables

Do not create a new toy project every week. Weekly labs feed into these deliverables.

### P01 — Browser API Lab
**Window:** Weeks 6–8 · **Type:** Foundational practical project  
**Purpose:** Apply async JavaScript, DOM events, browser storage and network error handling.  
**Stack:** JavaScript, DOM, Fetch API, Browser Storage
**Requirements:**
- Search/filter a real public API or local JSON dataset
- Loading, empty, error, retry and timeout states
- Event delegation and form validation
- Persist a small user preference or saved list
- Readable module boundaries
**Acceptance criteria:**
- [ ] Works without a tutorial during a short walkthrough
- [ ] Handles malformed and empty responses
- [ ] No unsafe HTML injection
- [ ] README explains architecture and edge cases

### P02 — Developer Resource API Explorer
**Window:** Weeks 9–13 · **Type:** Frontend portfolio project  
**Purpose:** Demonstrate React/TypeScript frontend engineering without rebuilding another generic todo app.  
**Stack:** React, TypeScript, Vite, Tailwind CSS, React Router, Vitest
**Requirements:**
- List/detail routes
- Search, filter, sort and URL query state
- Reusable typed API hooks
- Accessible forms and keyboard navigation
- Loading, error, empty and retry states
- Unit/component tests and deployment
**Acceptance criteria:**
- [ ] Fresh clone setup documented
- [ ] Build/typecheck/lint/tests pass
- [ ] Responsive and keyboard-usable
- [ ] Deployed demo plus architecture note

### P03 — Existing E-commerce Application — V1
**Window:** Weeks 17–26 · **Type:** Flagship full-stack project  
**Purpose:** Finish the user's existing incomplete e-commerce project, especially the cart controller logic.  
**Stack:** React, Node.js, Express, MongoDB, Mongoose, PostgreSQL practice
**Requirements:**
- Product browsing and detail
- User access and protected routes
- Persistent per-user cart
- Add/update/remove/clear cart
- Server-side price and quantity validation
- Checkout simulation
- Order history and order status
- Inventory-safe updates/transactions
- API tests and documentation
**Acceptance criteria:**
- [ ] A complete browse-to-order journey works end-to-end
- [ ] Cart persists across refresh and login
- [ ] No client-submitted price is trusted
- [ ] Concurrent checkout cannot silently oversell inventory
- [ ] Critical routes have tests

### P04 — E-commerce Backend — Production V2
**Window:** Weeks 27–39 · **Type:** Backend engineering project  
**Purpose:** Upgrade the flagship backend with type safety, testing, caching, queues and deployment discipline.  
**Stack:** Node.js, TypeScript, Express, MongoDB, Redis, Docker, Docker Compose, GitHub Actions
**Requirements:**
- Migrate one vertical slice to strict TypeScript
- Unit, integration and end-to-end tests
- Redis caching with invalidation
- Rate limiting and idempotent checkout
- Background job/worker
- Docker image and Compose stack
- CI quality gate
- Structured logs and performance baseline
**Acceptance criteria:**
- [ ] Fresh clone can run the stack from documented commands
- [ ] Critical flows pass tests
- [ ] Cache/queue failure paths are handled
- [ ] One performance change is measured
- [ ] Secrets are not committed or baked into images

### P05 — Inventory and Order Management API
**Window:** Weeks 40–52 · **Type:** Java/Spring Boot project  
**Purpose:** Build a clean Java service to demonstrate OOP, Spring and relational data design.  
**Stack:** Java, Spring Boot, Spring MVC, Spring Data JPA, PostgreSQL, Spring Security
**Requirements:**
- Product and inventory entities
- Order/order-item model
- DTOs and validation
- Service/repository boundaries
- Transactions and concurrency-safe inventory update
- Authentication and role/resource checks
- API/integration tests
- OpenAPI documentation
**Acceptance criteria:**
- [ ] CRUD and order workflows work against PostgreSQL
- [ ] Transactions and locking behaviour are tested
- [ ] Security checks prevent unauthorised updates
- [ ] Architecture diagram and API documentation are complete

### P06 — Cloud Operations Capstone
**Window:** Weeks 53–65 · **Type:** Cloud/DevOps project  
**Purpose:** Operate one existing backend service in a repeatable, observable, cost-controlled environment.  
**Stack:** Linux, Docker, AWS or comparable cloud, GitHub Actions, Kubernetes local lab, Kafka local lab, Metrics/logs
**Requirements:**
- Container image and CI pipeline
- Least-privilege cloud identity and network boundaries
- Application deployment with health checks
- Managed storage/database or documented equivalent
- Kubernetes local deployment and rollback lab
- Kafka producer/consumer demonstration
- Logs, metrics, SLO and recovery runbook
**Acceptance criteria:**
- [ ] Deployment can be recreated and torn down from instructions
- [ ] Database is not publicly exposed
- [ ] CI blocks bad builds
- [ ] Failure/recovery drill is demonstrated
- [ ] Costs and security assumptions are documented

### P07 — Forge Research Companion
**Window:** Weeks 66–78 · **Type:** AI/LLM research capstone  
**Purpose:** Build a grounded assistant for a curated collection of technical PDFs and research papers.  
**Stack:** Python, NumPy/Pandas, PyTorch fundamentals, Ollama or model API abstraction, Embeddings, Vector search, RAG, Tool calling
**Requirements:**
- Ingest a curated set of technical PDFs/text files
- Preserve document/page/section provenance
- Compare chunking strategies
- Implement dense and lexical/hybrid retrieval
- Return cited answers and abstain when evidence is missing
- Evaluate retrieval and answer quality on a labelled test set
- Add bounded tool calling with step limits and logs
- Benchmark latency and document compute requirements
**Acceptance criteria:**
- [ ] Every answer citation resolves to a source passage
- [ ] The system can say it does not know
- [ ] A labelled test set reports retrieval metrics
- [ ] At least one baseline and improved variant are compared
- [ ] Failure cases and limitations are documented
- [ ] README, architecture diagram and demo are complete
**Optional extension:** If choosing to continue Border Sentinel, replace only the final capstone domain with a narrowly scoped CV experiment (e.g. low-light detection/tracking robustness) with a fixed dataset, baseline, metrics and ablation. Do not attempt both capstones simultaneously.

## 7. Monthly research checkpoints

Research is integrated into the learning journey, not built as a separate dashboard. Each checkpoint means: read a technical source/paper, reproduce or test one claim, and write a concise note.

- **01 · Week 4 · 2026-12-13 — JavaScript execution and browser runtime:** Create an event-loop trace and explain scope/closure behaviour using runnable examples.
- **02 · Week 8 · 2027-01-10 — Browser API reliability:** Compare failure, timeout and cancellation handling in two API-client implementations.
- **03 · Week 13 · 2027-02-14 — React rendering and accessibility:** Profile one React interaction and record one measured performance/accessibility improvement.
- **04 · Week 17 · 2027-03-14 — REST API contract design:** Read an API design guide and critique pagination, errors and idempotency in a real API.
- **05 · Week 21 · 2027-04-11 — Database consistency and transactions:** Reproduce an inventory race condition and document the database-level fix.
- **06 · Week 26 · 2027-05-16 — Query performance and data modelling:** Compare MongoDB/PostgreSQL query plans or indexes and document trade-offs.
- **07 · Week 30 · 2027-06-13 — Rate limiting and distributed coordination:** Compare fixed-window and token-bucket approaches with a small experiment.
- **08 · Week 34 · 2027-07-11 — Container supply chain and CI security:** Audit a Docker image/workflow for secrets, permissions and unpinned dependencies.
- **09 · Week 39 · 2027-08-15 — Backend performance and observability:** Publish a before/after performance note using measured latency and logs.
- **10 · Week 43 · 2027-09-12 — JVM concurrency:** Reproduce a race condition and explain the Java Memory Model behaviour involved.
- **11 · Week 47 · 2027-10-10 — System design requirements:** Write a concise design review with assumptions, capacity estimates and failure cases.
- **12 · Week 52 · 2027-11-14 — Spring transactions and resilience:** Study a transaction/resilience case and connect it to the Spring capstone.
- **13 · Week 56 · 2027-12-12 — Operating systems and memory hierarchy:** Run a memory/cache locality experiment and interpret the result.
- **14 · Week 60 · 2028-01-09 — Network security and cloud identity:** Trace HTTPS and review least-privilege IAM/network boundaries.
- **15 · Week 65 · 2028-02-13 — Reliability engineering:** Create a mini-postmortem from a simulated outage and propose one preventive control.
- **16 · Week 69 · 2028-03-12 — Machine learning evaluation:** Compare models with appropriate metrics and document leakage/overfitting risks.
- **17 · Week 73 · 2028-04-09 — Transformer inference and quantisation:** Benchmark local inference settings and explain memory/latency/quality trade-offs.
- **18 · Week 78 · 2028-05-14 — RAG/agent research evaluation:** Summarise a relevant paper, run one ablation and document limitations.

## 8. Core CS coverage

| Subject | Coverage |
|---|---|
| DSA | All 78 weeks: C++/STL, complexity, arrays, strings, hashing, sorting/searching, two pointers, sliding window, prefix sums, recursion/backtracking, linked lists, stacks/queues, trees/BST, heaps, graphs, BFS/DFS, Dijkstra, Bellman-Ford, topological sort, MST, DSU, greedy, DP, tries, bit manipulation, Fenwick/segment trees, KMP/Z/rolling hash, timed interviews. |
| DBMS | Weeks 17–26, 45, 49–50: document modelling, normalisation, SQL, joins, indexes, query plans, ACID, isolation, transactions, replication, partitioning and consistency. |
| Operating Systems | Weeks 54–55: processes, threads, system calls, scheduling, synchronisation, deadlocks, memory allocation, virtual memory, paging, filesystems and I/O. |
| Computer Architecture | Weeks 53–55: binary/hex, signed and floating-point representation, CPU instruction cycle, registers, pipelining, hazards, memory hierarchy and cache locality. |
| Computer Networks | Weeks 56–57: network layers, IP/CIDR, routing, NAT, DNS, HTTP, TCP, UDP, sockets, TLS, certificates and HTTPS. |
| OOP | Weeks 40–43: encapsulation, abstraction, inheritance, polymorphism, composition, interfaces, SOLID, dependency inversion, JVM and concurrency. |

## 9. Curriculum rules for Antigravity

1. Use `FORGE_OS_18_MONTH_CURRICULUM.json` as the machine-readable source of truth. This Markdown file is the human-readable companion.
2. Seed all 78 weeks and 546 daily entries idempotently. Add the separate Day 547 graduation task.
3. Preserve snapshots of historical topic title, description, subtopics, completion and notes. Updating future curriculum must not rewrite history.
4. Every daily item must have a title, category, description, 3–5 subtopics, practical task, expected outcome and duration. Map those fields into the existing `AssignedItem` model.
5. Day 6 is a manual checkpoint. Day 7 is the standard light review task.
6. Compute progress from stored subtopic/parent completion state. Never trust a stale frontend percentage.
7. Keep the two-page product: Today and Milestones. Historical browsing belongs inside Today. Do not add Daily List.
8. Milestones are manual; dates do not auto-complete them. First incomplete milestone is current.
9. No old modules: Academic Manager, Exam Mode, DSA Lab, Research Dashboard, Skill Matrix, proof verification, analytics or career tools.
10. Use Asia/Kolkata and logical `YYYY-MM-DD` dates. Do not shift dates through UTC conversion.
11. Do not seed past progress as completed. All tasks begin incomplete; only the first milestone starts as current.

## 10. Free reference sources

Use official documentation and implementation experiments by default; paid bootcamps are not required.
- JavaScript/browser: MDN Web Docs, JavaScript.info, Node.js documentation.
- React/TypeScript: React documentation, TypeScript Handbook, Vite documentation.
- C++/DSA: cppreference, C++ Core Guidelines, CP-Algorithms, free LeetCode/Codeforces practice.
- Backend/databases: Express documentation, MongoDB Manual, Mongoose documentation, PostgreSQL documentation, OWASP Cheat Sheets.
- Redis/containers/CI: Redis documentation, Docker documentation, GitHub Actions documentation.
- Java/Spring: dev.java, Java API documentation, Spring Guides and Spring Boot reference.
- Systems/cloud: Linux man-pages, Kubernetes documentation, Apache Kafka documentation, AWS documentation and cost calculator.
- AI/ML: Python documentation, NumPy/Pandas docs, scikit-learn User Guide, PyTorch Tutorials, Hugging Face documentation and original Transformer/RAG papers.

## 11. Existing projects

Gram Setu and Border Sentinel are prior portfolio assets. Audit, test and selectively improve them only when a milestone benefits from it; do not schedule a full rebuild. The default final AI capstone is Forge Research Companion. A narrowly scoped Border Sentinel computer-vision experiment may replace that final capstone, but both must not be mandatory.

---

**Machine-readable source:** `FORGE_OS_18_MONTH_CURRICULUM.json`.