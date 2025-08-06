# Multi-Language Support Implementation

This document explains how the multi-language system has been implemented in your website.

## Overview

The website now supports three languages:
- **English (en)**
- **French (fr)** 
- **Spanish (es)**

## How It Works

### 1. Language Selection
- Users can select their preferred language using the dropdown in the header
- The selected language is saved in `localStorage` as `selectedLanguage`
- When the language changes, all dynamic content automatically updates

### 2. Backend Changes

#### Database Models
The `News` and `Blog` models have been updated to store content in multiple languages:

```javascript
// News/Blog Schema
{
  title: {
    en: "English Title",
    fr: "Titre Français", 
    es: "Título Español"
  },
  description: {
    en: "English description...",
    fr: "Description française...",
    es: "Descripción en español..."
  },
  // ... other fields
}
```

#### API Endpoints
All API endpoints now accept a `lang` query parameter:
- `GET /api/news?lang=en` - Get news in English
- `GET /api/news?lang=fr` - Get news in French
- `GET /api/news?lang=es` - Get news in Spanish

### 3. Admin Interface

#### News Dashboard (`/Add News`)
- **Title fields**: Separate input fields for English, French, and Spanish titles
- **Description fields**: Separate textarea fields for each language
- All fields are required to ensure complete multi-language content

#### Blog Dashboard (`/Add Blog`)
- Same structure as News Dashboard
- Separate fields for title and description in each language

### 4. Frontend Display

#### Dynamic Content Updates
- All components that display news/blogs automatically fetch content in the selected language
- When users change the language, content refreshes automatically
- Components listen for language change events to update content

#### Components Updated
- `Blog2.jsx` - News listing page
- `RecentPosts.jsx` - Blog listing section
- `NewsDetails.js` - Individual news article view
- `BlogDetails.jsx` - Individual blog post view

## Usage Instructions

### For Admins

1. **Adding News**:
   - Go to `/Add News`
   - Fill in the title and description for all three languages
   - Upload an image and add tags/category
   - Submit the form

2. **Adding Blogs**:
   - Go to `/Add Blog`
   - Fill in the title and description for all three languages
   - Upload an image and add tags/category
   - Submit the form

### For Users

1. **Changing Language**:
   - Use the language dropdown in the header
   - Select English, French, or Spanish
   - All content will automatically update to the selected language

2. **Viewing Content**:
   - News and blog content will display in the selected language
   - If content is not available in the selected language, it falls back to English

## Technical Implementation

### Language Change Detection
- Custom event `languageChanged` is dispatched when language changes
- Components listen for this event to refresh their content
- `localStorage` changes are also monitored for cross-tab synchronization

### Fallback Mechanism
- If content is not available in the selected language, the system falls back to English
- This ensures users always see content even if translations are incomplete

### API Response Format
The API returns transformed data with the appropriate language content:

```javascript
{
  _id: "post_id",
  title: "Title in selected language",
  description: "Description in selected language", 
  tags: ["tag1", "tag2"],
  category: "Category",
  imageUrl: "image_url",
  createdAt: "timestamp"
}
```

## Future Enhancements

1. **Translation Management**: Add a translation management interface for admins
2. **Auto-translation**: Integrate with translation APIs for automatic content translation
3. **Language-specific URLs**: Add language prefixes to URLs (e.g., `/fr/news`, `/es/blogs`)
4. **SEO Optimization**: Add language-specific meta tags and structured data

## Troubleshooting

### Common Issues

1. **Content not updating**: Check if the language change event is being dispatched
2. **Missing translations**: Ensure all language fields are filled in the admin forms
3. **API errors**: Verify the backend server is running on `localhost:5001`

### Debugging

- Check browser console for any JavaScript errors
- Verify `localStorage.selectedLanguage` contains the correct language code
- Test API endpoints directly with the `lang` parameter 