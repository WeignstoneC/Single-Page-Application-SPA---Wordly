/**
 * Wordly Dictionary SPA — index.js
 * Fetches definitions from Free Dictionary API and renders them dynamically.
 * https://dictionaryapi.dev/
 */

// ─── Constants ───────────────────────────────────────────────────────────────

const API_BASE = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const MAX_DEFINITIONS = 3;
const MAX_SYNONYMS = 12;

// ─── DOM References ──────────────────────────────────────────────────────────

const searchForm       = document.getElementById("search-form");
const searchInput      = document.getElementById("search-input");
const errorMessage     = document.getElementById("error-message");
const loadingState     = document.getElementById("loading-state");
const resultsSection   = document.getElementById("results-section");
const emptyState       = document.getElementById("empty-state");

const resultWord       = document.getElementById("result-word");
const resultPhonetic   = document.getElementById("result-phonetic");
const audioBtn         = document.getElementById("audio-btn");
const meaningsContainer = document.getElementById("meanings-container");
const synonymsSection  = document.getElementById("synonyms-section");
const synonymsList     = document.getElementById("synonyms-list");
const sourceSection    = document.getElementById("source-section");
const sourceLink       = document.getElementById("source-link");

// ─── State ───────────────────────────────────────────────────────────────────

let currentAudio = null;

// ─── UI Helpers ──────────────────────────────────────────────────────────────

/**
 * Show only one main content area at a time.
 * @param {"loading"|"results"|"error"|"empty"} state
 */
function setUIState(state) {
  loadingState.classList.add("hidden");
  resultsSection.classList.add("hidden");
  errorMessage.classList.add("hidden");
  emptyState.classList.add("hidden");

  if (state === "loading")  loadingState.classList.remove("hidden");
  if (state === "results")  resultsSection.classList.remove("hidden");
  if (state === "empty")    emptyState.classList.remove("hidden");
  // error is shown inline alongside other states
}

/**
 * Display an error message to the user.
 * @param {string} message
 */
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
}

function clearError() {
  errorMessage.textContent = "";
  errorMessage.classList.add("hidden");
}

// ─── Fetch ───────────────────────────────────────────────────────────────────

/**
 * Fetch word data from the Free Dictionary API.
 * @param {string} word
 * @returns {Promise<Array>} Array of entry objects from the API
 */
async function fetchWordData(word) {
  const response = await fetch(`${API_BASE}${encodeURIComponent(word.trim())}`);

  if (response.status === 404) {
    throw new Error(`"${word}" was not found. Check the spelling and try again.`);
  }

  if (!response.ok) {
    throw new Error(`Something went wrong (${response.status}). Please try again.`);
  }

  const data = await response.json();
  return data;
}

// ─── Parse & Display ─────────────────────────────────────────────────────────

/**
 * Extract the best phonetic text and audio URL from the API entry.
 * @param {Object} entry
 * @returns {{ text: string, audio: string }}
 */
function extractPhonetic(entry) {
  let text = "";
  let audio = "";

  // Prefer phonetics array entries with audio
  if (Array.isArray(entry.phonetics)) {
    for (const p of entry.phonetics) {
      if (!text && p.text) text = p.text;
      if (!audio && p.audio) audio = p.audio;
      if (text && audio) break;
    }
  }

  // Fallback to top-level phonetic string
  if (!text && entry.phonetic) text = entry.phonetic;

  return { text, audio };
}

/**
 * Collect all unique synonyms across all meanings.
 * @param {Array} meanings
 * @returns {string[]}
 */
function collectSynonyms(meanings) {
  const seen = new Set();
  const result = [];

  for (const meaning of meanings) {
    for (const syn of (meaning.synonyms || [])) {
      if (!seen.has(syn)) {
        seen.add(syn);
        result.push(syn);
      }
    }
    for (const def of (meaning.definitions || [])) {
      for (const syn of (def.synonyms || [])) {
        if (!seen.has(syn)) {
          seen.add(syn);
          result.push(syn);
        }
      }
    }
  }

  return result.slice(0, MAX_SYNONYMS);
}

/**
 * Build and inject a single meaning block into the DOM.
 * @param {Object} meaning  — { partOfSpeech, definitions }
 * @returns {HTMLElement}
 */
function buildMeaningBlock(meaning) {
  const block = document.createElement("div");
  block.classList.add("meaning-block");

  // Part of speech badge
  const pos = document.createElement("span");
  pos.classList.add("part-of-speech");
  pos.textContent = meaning.partOfSpeech || "unknown";
  block.appendChild(pos);

  // Definitions list
  const list = document.createElement("ol");
  list.classList.add("definitions-list");

  const defs = (meaning.definitions || []).slice(0, MAX_DEFINITIONS);

  defs.forEach((def, index) => {
    const item = document.createElement("li");
    item.classList.add("definition-item");

    // Number label
    const num = document.createElement("span");
    num.classList.add("def-number");
    num.setAttribute("aria-hidden", "true");
    num.textContent = `${String(index + 1).padStart(2, "0")}`;

    // Content wrapper
    const content = document.createElement("div");
    content.classList.add("def-content");

    // Definition text
    const defText = document.createElement("p");
    defText.classList.add("definition-text");
    defText.textContent = def.definition || "No definition available.";
    content.appendChild(defText);

    // Optional example usage
    if (def.example) {
      const example = document.createElement("p");
      example.classList.add("example-text");
      example.textContent = `"${def.example}"`;
      content.appendChild(example);
    }

    item.appendChild(num);
    item.appendChild(content);
    list.appendChild(item);
  });

  block.appendChild(list);
  return block;
}

/**
 * Render the full API response to the DOM.
 * @param {Array} data — Array of entry objects from the API
 */
function renderResults(data) {
  const entry = data[0];

  // ── Word title ──────────────────────────────────────────────────────
  resultWord.textContent = entry.word || "";

  // ── Phonetic ────────────────────────────────────────────────────────
  const { text: phoneticText, audio: audioUrl } = extractPhonetic(entry);
  resultPhonetic.textContent = phoneticText || "";

  // ── Audio button ────────────────────────────────────────────────────
  if (audioUrl) {
    audioBtn.classList.remove("hidden");
    currentAudio = new Audio(audioUrl);

    currentAudio.addEventListener("ended", () => {
      audioBtn.classList.remove("playing");
    });
  } else {
    audioBtn.classList.add("hidden");
    currentAudio = null;
  }

  // ── Meanings ────────────────────────────────────────────────────────
  meaningsContainer.innerHTML = "";
  const meanings = entry.meanings || [];

  if (meanings.length === 0) {
    const fallback = document.createElement("p");
    fallback.style.color = "var(--text-secondary)";
    fallback.textContent = "No definitions available for this word.";
    meaningsContainer.appendChild(fallback);
  } else {
    meanings.forEach((meaning) => {
      const block = buildMeaningBlock(meaning);
      meaningsContainer.appendChild(block);
    });
  }

  // ── Synonyms ────────────────────────────────────────────────────────
  const allSynonyms = collectSynonyms(meanings);

  if (allSynonyms.length > 0) {
    synonymsList.innerHTML = "";
    synonymsSection.classList.remove("hidden");

    allSynonyms.forEach((syn) => {
      const tag = document.createElement("button");
      tag.classList.add("synonym-tag");
      tag.textContent = syn;
      tag.setAttribute("aria-label", `Search for synonym: ${syn}`);
      tag.addEventListener("click", () => {
        searchInput.value = syn;
        handleSearch(syn);
      });
      synonymsList.appendChild(tag);
    });
  } else {
    synonymsSection.classList.add("hidden");
  }

  // ── Source ──────────────────────────────────────────────────────────
  const sourceUrl = Array.isArray(entry.sourceUrls) && entry.sourceUrls[0];

  if (sourceUrl) {
    sourceLink.href = sourceUrl;
    sourceLink.textContent = sourceUrl;
    sourceSection.classList.remove("hidden");
  } else {
    sourceSection.classList.add("hidden");
  }
}

// ─── Search Handler ──────────────────────────────────────────────────────────

/**
 * Main search function — validates input, fetches, and renders.
 * @param {string} [overrideWord] — optional word to search (skips input value)
 */
async function handleSearch(overrideWord) {
  const query = (overrideWord ?? searchInput.value).trim();

  // Validate: not empty
  if (!query) {
    showError("Please enter a word to search.");
    return;
  }

  // Validate: only letters and hyphens
  if (!/^[a-zA-Z\-]+$/.test(query)) {
    showError("Please enter a valid English word (letters only).");
    return;
  }

  clearError();
  setUIState("loading");

  // Reset audio
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }

  try {
    const data = await fetchWordData(query);
    renderResults(data);
    setUIState("results");
    // Scroll results into view smoothly
    resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (err) {
    setUIState("empty");
    showError(err.message || "An unexpected error occurred. Please try again.");
    console.error("Wordly fetch error:", err);
  }
}

// ─── Event Listeners ─────────────────────────────────────────────────────────

// Form submission
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  handleSearch();
});

// Audio playback
audioBtn.addEventListener("click", () => {
  if (!currentAudio) return;

  if (!currentAudio.paused) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    audioBtn.classList.remove("playing");
    return;
  }

  audioBtn.classList.add("playing");
  currentAudio.play().catch(() => {
    showError("Audio playback is not available for this word.");
    audioBtn.classList.remove("playing");
  });
});

// Quick hint words
document.querySelectorAll(".hint-word").forEach((btn) => {
  btn.addEventListener("click", () => {
    const word = btn.dataset.word;
    searchInput.value = word;
    handleSearch(word);
  });
});

// ─── Background Particle Animation ───────────────────────────────────────────

(function initCanvas() {
  const canvas = document.getElementById("bg-canvas");
  const ctx = canvas.getContext("2d");

  const PARTICLE_COUNT = 55;
  const particles = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener("resize", resize);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.5 + 0.1,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 255, 136, ${p.alpha})`;
      ctx.fill();

      // Draw connections
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(0, 255, 136, ${0.06 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // Move particle
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x < 0)              p.x = canvas.width;
      if (p.x > canvas.width)   p.x = 0;
      if (p.y < 0)              p.y = canvas.height;
      if (p.y > canvas.height)  p.y = 0;
    }

    requestAnimationFrame(draw);
  }

  draw();
})();
