// Wordly Dictionary - index.js

// API Base URL
const API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

// DOM Elements
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results-container');

// Event Listeners
searchForm.addEventListener('submit', handleSearch);

// Handle Search Form Submission
function handleSearch(event) {
    event.preventDefault();
    
    const word = searchInput.value.trim();
    
    // Case 1: Empty input
    if (!word) {
        showError('empty');
        return;
    }
    
    // Show loading state
    showLoading();
    
    // Fetch data from API
    fetchWordData(word);
}

// Fetch Word Data from API
async function fetchWordData(word) {
    try {
        const response = await fetch(API_URL + word);
        
        if (!response.ok) {
            if (response.status === 404) {
                // Case 2: Word not found
                showError('notFound', word);
                return;
            }
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        
        if (data && data.length > 0) {
            displayResults(data[0]);
        } else {
            showError('notFound', word);
        }
    } catch (error) {
        console.error('Error fetching word data:', error);
        showError('network');
    }
}

// Display Results on the Page
function displayResults(wordData) {
    const phonetic = wordData.phonetic || '';
    const phoneticText = wordData.phonetics?.find(p => p.text)?.text || phonetic;
    
    let html = `
        <div class="word-card">
            <div class="word-header">
                <h2 class="word-title">${wordData.word}</h2>
                ${phoneticText ? `<span class="phonetic">${phoneticText}</span>` : ''}
            </div>
            <div class="meanings">
    `;
    
    // Loop through all meanings
    wordData.meanings?.forEach(meaning => {
        html += `
            <div class="meaning-block">
                <span class="part-of-speech">${meaning.partOfSpeech}</span>
                <ul class="definition-list">
        `;
        
        // Show up to 3 definitions
        meaning.definitions?.slice(0, 3).forEach((def, index) => {
            html += `
                <li class="definition-item">
                    <p class="definition-text">${index + 1}. ${def.definition}</p>
                    ${def.example ? `<p class="example">"${def.example}"</p>` : ''}
                </li>
            `;
        });
        
        html += `</ul>`;
        
        // Display synonyms (Case 3: Missing data)
        const synonyms = meaning.synonyms?.slice(0, 8) || [];
        if (synonyms.length > 0) {
            html += `
                <div class="synonyms-section">
                    <p class="synonyms-title">Synonyms</p>
                    <div class="synonyms-list">
                        ${synonyms.map(s => `<span class="synonym-tag">${s}</span>`).join('')}
                    </div>
                </div>
            `;
        }
        
        html += `</div>`;
    });
    
    html += `
            </div>
        </div>
    `;
    
    resultsContainer.innerHTML = html;
}

// Show Error Message
function showError(type, word = '') {
    let errorContent = '';
    
    switch (type) {
        case 'empty':
            errorContent = `
                <div class="error-message">
                    <div class="error-icon">🔍</div>
                    <p class="error-text">Please enter a word</p>
                    <p class="error-subtext">Type a word in the search box to see its definition.</p>
                </div>
            `;
            break;
        case 'notFound':
            errorContent = `
                <div class="error-message">
                    <div class="error-icon">😕</div>
                    <p class="error-text">Word not found</p>
                    <p class="error-subtext">We couldn't find the word "${word}" in our dictionary. Please try another word.</p>
                </div>
            `;
            break;
        case 'network':
            errorContent = `
                <div class="error-message">
                    <div class="error-icon">⚠️</div>
                    <p class="error-text">Network Error</p>
                    <p class="error-subtext">Something went wrong. Please check your internet connection and try again.</p>
                </div>
            `;
            break;
    }
    
    resultsContainer.innerHTML = errorContent;
}

// Show Loading State
function showLoading() {
    resultsContainer.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p class="loading-text">Searching for word...</p>
        </div>
    `;
}

// Show Empty State (Initial State)
function showEmptyState() {
    resultsContainer.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">📚</div>
            <p class="empty-text">Enter a word above to see its definition</p>
        </div>
    `;
}

// Initialize with empty state
showEmptyState();