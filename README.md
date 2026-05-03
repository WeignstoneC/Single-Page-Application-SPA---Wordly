# Wordly — Interactive Dictionary SPA

> A fast, modern, single-page dictionary application powered by the [Free Dictionary API](https://dictionaryapi.dev/).

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Usage Guide](#usage-guide)
- [Error Handling](#error-handling)
- [Accessibility](#accessibility)
- [Version Control](#version-control)
- [Author](#author)

---

## Overview

Wordly is a Single Page Application (SPA) built for **Wordly**, an online language learning platform. It allows users to search any English word and instantly see:

- Pronunciation (text + audio)
- Definitions grouped by part of speech
- Example sentences
- Synonyms (clickable to search)
- Source links

All results load dynamically without a page refresh, giving users a seamless, app-like experience.

---

## Features

| Feature | Description |
|---|---|
| **Word Search** | Input form with validation — empty queries and non-alphabetic input are rejected gracefully |
| **Pronunciation** | Phonetic text displayed alongside the word heading |
| **Audio Playback** | One-click audio pronunciation using the browser's built-in `Audio` API |
| **Definitions** | Grouped by part of speech (noun, verb, adjective, etc.), showing up to 3 per group |
| **Example Usage** | Inline example sentences shown under each definition where available |
| **Synonyms** | Clickable synonym tags — clicking one searches that word automatically |
| **Source Links** | Links back to Wiktionary or the original source for each entry |
| **Error Handling** | Clear, contextual messages for words not found, network failures, or empty input |
| **Quick Hints** | Suggested example words (`serendipity`, `ephemeral`, `eloquent`) for first-time users |
| **Animated Background** | Particle canvas animation reinforces the modern, tech-forward aesthetic |

---

## Tech Stack

- **HTML5** — Semantic structure with ARIA attributes for accessibility
- **CSS3** — Custom properties (CSS variables), Flexbox, Grid, animations, backdrop-filter
- **Vanilla JavaScript (ES2020+)** — Async/await, Fetch API, DOM manipulation, event listeners
- **Google Fonts** — Syne (display) + Space Mono (monospace)
- **Free Dictionary API** — `https://dictionaryapi.dev/` — no API key required

---

## Project Structure

```
wordly/
├── index.html      # App shell — semantic HTML, accessibility attributes
├── style.css       # All styles — black/green neon theme, responsive layout
├── index.js        # All JavaScript — fetch, DOM manipulation, audio, canvas
└── README.md       # Project documentation (this file)
```

---

## Getting Started

No build tools or dependencies are needed. This is a zero-configuration project.

### Run locally

1. Clone or download the repository.
2. Open `index.html` directly in any modern browser (Chrome, Firefox, Edge, Safari).

```bash
git clone https://github.com/WeignstoneC/wordly-dictionary.git
cd wordly-dictionary
open index.html   # macOS
start index.html  # Windows
```

> **Note:** Audio playback requires an internet connection as audio files are served from the API CDN.

### Deploy

Since this is a static site with no backend, it can be deployed to:

- **GitHub Pages** — Push to `main` branch, enable Pages in repository settings.
- **Netlify** — Drag and drop the project folder.
- **Vercel** — `vercel` CLI, or import from GitHub.

---

## API Reference

**Base URL:** `https://api.dictionaryapi.dev/api/v2/entries/en/{word}`

**Method:** `GET`

**No authentication required.**

### Example Request

```
GET https://api.dictionaryapi.dev/api/v2/entries/en/serendipity
```

### Response Structure (simplified)

```json
[
  {
    "word": "serendipity",
    "phonetic": "/ˌsɛɹ.ənˈdɪp.ɪ.ti/",
    "phonetics": [
      {
        "text": "/ˌsɛɹ.ənˈdɪp.ɪ.ti/",
        "audio": "https://api.dictionaryapi.dev/media/pronunciations/en/serendipity-us.mp3"
      }
    ],
    "meanings": [
      {
        "partOfSpeech": "noun",
        "definitions": [
          {
            "definition": "A fortunate combination of unrelated circumstances...",
            "example": "It was serendipity that brought them together.",
            "synonyms": ["chance", "luck"]
          }
        ],
        "synonyms": ["chance", "luck", "fortune"]
      }
    ],
    "sourceUrls": ["https://en.wiktionary.org/wiki/serendipity"]
  }
]
```

### HTTP Status Codes Handled

| Status | Meaning | App Response |
|---|---|---|
| `200 OK` | Word found | Results rendered |
| `404 Not Found` | Word not in dictionary | User-friendly error message |
| `5xx` | Server error | Generic error with status code |
| Network failure | No internet | Catch block error message |

---

## Usage Guide

1. **Type a word** in the floating search bar.
2. Press **Enter** or click the **search button**.
3. Results appear below — scroll to see definitions, examples, and synonyms.
4. Click **Listen** to hear the word pronounced (when available).
5. Click any **synonym tag** to look up that word instantly.
6. Click the **source link** to view the full Wiktionary entry.

---

## Error Handling

The app handles all common failure scenarios:

| Scenario | Behaviour |
|---|---|
| Empty search field | Error: "Please enter a word to search." |
| Non-alphabetic input | Error: "Please enter a valid English word." |
| Word not found (404) | Error: `"[word]" was not found. Check the spelling.` |
| API server error | Error: `Something went wrong (status). Please try again.` |
| No audio available | Audio button is hidden; no error shown |
| No synonyms available | Synonyms section is hidden |
| No example sentences | Example block is omitted from that definition |

---

## Accessibility

- **Semantic HTML** — Proper use of `<header>`, `<main>`, `<section>`, `<footer>`, `<form>`, `<ol>`, `<li>`.
- **ARIA labels** — `role="search"`, `aria-label` on all interactive elements, `aria-live` on result and error regions.
- **Screen reader only labels** — `.sr-only` class for the search input label.
- **Keyboard navigation** — All interactive elements (search, audio, synonym tags, hint words) are keyboard accessible.
- **Focus management** — Visible focus styles on all interactive elements.
- **Contrast** — Green (`#00ff88`) on black (`#050a08`) exceeds WCAG AA contrast requirements for large text.

---

## Version Control

This project uses **Git** for version control.

### Recommended workflow

```bash
# Create a feature branch
git checkout -b feature/add-history

# Make changes, then stage and commit
git add .
git commit -m "feat: add recent search history to sidebar"

# Push and open a pull request
git push origin feature/add-history
```

### Commit message convention (Conventional Commits)

| Prefix | Use for |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `style:` | CSS / formatting |
| `refactor:` | Code restructure, no behaviour change |
| `docs:` | Documentation updates |
| `chore:` | Dependency updates, config changes |

---

## Author

**Weignstone Churchill**

Built as part of the Wordly language learning platform — a demonstration of modern SPA development using vanilla HTML, CSS, and JavaScript.

---

*Powered by [Free Dictionary API](https://dictionaryapi.dev/) — open and free, no API key required.*
