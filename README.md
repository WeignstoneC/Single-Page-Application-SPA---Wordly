# Wordly Dictionary

A Single Page Application (SPA) dictionary web application built with HTML, CSS, and JavaScript. Users can search for any word to view its definitions, pronunciation, synonyms, and examples without refreshing the page.

## Features

- **Word Search**: Search for any English word
- **Definitions Display**: View multiple meanings and definitions
- **Pronunciation**: See phonetic pronunciation of the word
- **Part of Speech**: Identify word types (noun, verb, adjective, etc.)
- **Examples**: See example sentences when available
- **Synonyms**: View synonyms when available
- **Error Handling**: 
  - Empty input validation
  - Word not found messages
  - Network error handling
  - Missing data handling
- **Responsive Design**: Works on desktop and mobile devices
- **Loading State**: Visual feedback during API calls

## Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Stylling with gradients, flexbox, and animations
- **JavaScript (ES6+)**: Modern JavaScript with async/await
- **Dictionary API**: Free Dictionary API (api.dictionaryapi.dev)

## How to Run

1. Clone the repository or download the files
2. Open `index.html` in any modern web browser
3. Type a word in the search box and click "Search" or press Enter

## Project Structure

```
wordly-dictionary-app/
├── index.html      # Main HTML structure
├── style.css       # Styling and design
├── index.js        # Application logic
└── README.md       # This file
```

## API Reference

This project uses the [Free Dictionary API](https://dictionaryapi.dev/).

Example API call:
```
https://api.dictionaryapi.dev/api/v2/entries/en/hello
```

## Error Handling

The application handles the following cases:

1. **Empty Input**: Prompts user to enter a word
2. **Word Not Found**: Shows "Word not found" message
3. **Network Error**: Shows network error message
4. **Missing Data**: Gracefully handles missing synonyms/pronunciation

## License

This project is for educational purposes.