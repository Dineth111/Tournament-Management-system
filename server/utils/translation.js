const axios = require('axios');

/**
 * Translation utility for multilingual support
 * Supports English to Sinhala and Sinhala to English translation
 */

// Translation cache to improve performance
const translationCache = new Map();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

// Supported languages
const SUPPORTED_LANGUAGES = {
  EN: 'en',
  SI: 'si',
  SINHALA: 'si'
};

// Language codes for different translation services
const LANGUAGE_CODES = {
  en: 'en',
  si: 'si',
  sinhala: 'si'
};

/**
 * Main translation function
 * @param {string} text - Text to translate
 * @param {string} targetLanguage - Target language code (en, si)
 * @param {string} sourceLanguage - Source language code (optional, auto-detect if not provided)
 * @returns {Promise<string>} Translated text
 */
async function translateText(text, targetLanguage, sourceLanguage = null) {
  try {
    // Validate input
    if (!text || typeof text !== 'string') {
      throw new Error('Invalid text input');
    }

    // Normalize language codes
    const targetLang = normalizeLanguageCode(targetLanguage);
    const sourceLang = sourceLanguage ? normalizeLanguageCode(sourceLanguage) : null;

    // Check if translation is needed
    if (sourceLang === targetLang) {
      return text;
    }

    // Check cache first
    const cacheKey = `${text}|${sourceLang || 'auto'}|${targetLang}`;
    const cachedTranslation = getCachedTranslation(cacheKey);
    if (cachedTranslation) {
      return cachedTranslation;
    }

    // Try different translation services in order of preference
    let translatedText = null;

    // Try Google Translate API first (if available)
    translatedText = await translateWithGoogle(text, targetLang, sourceLang);
    
    // If Google fails, try alternative services
    if (!translatedText) {
      translatedText = await translateWithAlternative(text, targetLang, sourceLang);
    }

    // If all services fail, use fallback translation
    if (!translatedText) {
      translatedText = await fallbackTranslation(text, targetLang, sourceLang);
    }

    // Cache the translation
    setCachedTranslation(cacheKey, translatedText);

    return translatedText;

  } catch (error) {
    console.error('Translation error:', error);
    
    // Return original text if translation fails completely
    return text;
  }
}

/**
 * Normalize language code
 */
function normalizeLanguageCode(languageCode) {
  const code = languageCode.toLowerCase().trim();
  return LANGUAGE_CODES[code] || code;
}

/**
 * Get cached translation
 */
function getCachedTranslation(cacheKey) {
  const cached = translationCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.text;
  }
  return null;
}

/**
 * Set cached translation
 */
function setCachedTranslation(cacheKey, translatedText) {
  translationCache.set(cacheKey, {
    text: translatedText,
    timestamp: Date.now()
  });

  // Prevent cache from growing too large
  if (translationCache.size > 1000) {
    const firstKey = translationCache.keys().next().value;
    translationCache.delete(firstKey);
  }
}

/**
 * Google Translate API integration
 */
async function translateWithGoogle(text, targetLang, sourceLang = null) {
  try {
    // Check if Google Translate API key is available
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    if (!apiKey) {
      console.log('Google Translate API key not available');
      return null;
    }

    const url = `https://translation.googleapis.com/language/translate/v2`;
    
    const params = {
      key: apiKey,
      q: text,
      target: targetLang,
      format: 'text'
    };

    if (sourceLang) {
      params.source = sourceLang;
    }

    const response = await axios.post(url, null, { params });
    
    if (response.data && response.data.data && response.data.data.translations) {
      return response.data.data.translations[0].translatedText;
    }

    return null;

  } catch (error) {
    console.error('Google Translate API error:', error.message);
    return null;
  }
}

/**
 * Alternative translation service (MyMemory)
 */
async function translateWithMyMemory(text, targetLang, sourceLang = null) {
  try {
    const url = 'https://api.mymemory.translated.net/get';
    
    const params = {
      q: text,
      langpair: sourceLang ? `${sourceLang}|${targetLang}` : `auto|${targetLang}`,
      de: process.env.MYMEMORY_EMAIL || 'tournament@example.com'
    };

    const response = await axios.get(url, { params });
    
    if (response.data && response.data.responseData && response.data.responseData.translatedText) {
      return response.data.responseData.translatedText;
    }

    return null;

  } catch (error) {
    console.error('MyMemory API error:', error.message);
    return null;
  }
}

/**
 * LibreTranslate API (self-hosted or public)
 */
async function translateWithLibreTranslate(text, targetLang, sourceLang = null) {
  try {
    // Use public LibreTranslate API or self-hosted instance
    const baseUrl = process.env.LIBRE_TRANSLATE_URL || 'https://libretranslate.de';
    
    const data = {
      q: text,
      source: sourceLang || 'auto',
      target: targetLang,
      format: 'text'
    };

    const response = await axios.post(`${baseUrl}/translate`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data && response.data.translatedText) {
      return response.data.translatedText;
    }

    return null;

  } catch (error) {
    console.error('LibreTranslate API error:', error.message);
    return null;
  }
}

/**
 * Try alternative translation services
 */
async function translateWithAlternative(text, targetLang, sourceLang) {
  // Try MyMemory first
  let result = await translateWithMyMemory(text, targetLang, sourceLang);
  if (result) return result;

  // Try LibreTranslate
  result = await translateWithLibreTranslate(text, targetLang, sourceLang);
  if (result) return result;

  return null;
}

/**
 * Fallback translation using predefined dictionaries and rules
 */
async function fallbackTranslation(text, targetLang, sourceLang) {
  console.log('Using fallback translation');

  // Simple word-by-word translation for common terms
  const translationDict = getTranslationDictionary(targetLang);
  
  // Replace common words
  let translatedText = text;
  Object.entries(translationDict).forEach(([sourceWord, targetWord]) => {
    const regex = new RegExp(`\\b${sourceWord}\\b`, 'gi');
    translatedText = translatedText.replace(regex, targetWord);
  });

  // Apply language-specific rules
  if (targetLang === 'si') {
    translatedText = applySinhalaRules(translatedText);
  }

  return translatedText;
}

/**
 * Get translation dictionary for fallback
 */
function getTranslationDictionary(targetLang) {
  const dictionaries = {
    en: {
      // Sinhala to English
      'ආයුබෝවන්': 'Hello',
      'නමස්තේ': 'Hello',
      'ඉස්තුතියි': 'Thank you',
      'සමාවෙන්න': 'Sorry',
      'ඔව්': 'Yes',
      'නැහැ': 'No',
      'ටුර්නමන්ට්': 'Tournament',
      'මැච්': 'Match',
      'ලියාපදිංචි': 'Registration',
      'ගෙවීම': 'Payment',
      'ලකුණු': 'Score',
      'ජයග්‍රාහකයා': 'Winner',
      'අනාගත': 'Future',
      'ප්‍රතිඵල': 'Result',
      'කාලසටහන': 'Schedule',
      'පැතිකඩ': 'Profile',
      'උදව්': 'Help',
      'භාෂාව': 'Language'
    },
    si: {
      // English to Sinhala
      'hello': 'ආයුබෝවන්',
      'hi': 'හෙලෝ',
      'thank you': 'ඉස්තුතියි',
      'thanks': 'ඉස්තුතියි',
      'sorry': 'සමාවෙන්න',
      'yes': 'ඔව්',
      'no': 'නැහැ',
      'tournament': 'ටුර්නමන්ට්',
      'match': 'මැච්',
      'game': 'ක්‍රීඩාව',
      'registration': 'ලියාපදිංචි',
      'register': 'ලියාපදිංචි වන්න',
      'payment': 'ගෙවීම',
      'pay': 'ගෙවන්න',
      'score': 'ලකුණු',
      'winner': 'ජයග්‍රාහකයා',
      'result': 'ප්‍රතිඵල',
      'schedule': 'කාලසටහන',
      'profile': 'පැතිකඩ',
      'help': 'උදව්',
      'language': 'භාෂාව',
      'english': 'ඉංග්‍රීසි',
      'sinhala': 'සිංහල'
    }
  };

  return dictionaries[targetLang] || {};
}

/**
 * Apply Sinhala language rules
 */
function applySinhalaRules(text) {
  // Simple Sinhala grammar rules
  let result = text;

  // Add appropriate endings for verbs
  if (result.endsWith('න්න')) {
    // Already in correct form
  } else if (result.endsWith('වන්න')) {
    // Correct form
  } else if (result.length > 3 && !result.endsWith('ය')) {
    // Add appropriate endings
    if (result.includes('ලියාපදිංචි')) {
      result = result.replace(/register$/i, 'ලියාපදිංචි වන්න');
    }
    if (result.includes('ගෙවීම')) {
      result = result.replace(/pay$/i, 'ගෙවන්න');
    }
  }

  return result;
}

/**
 * Detect language of input text
 */
function detectLanguage(text) {
  // Check for Sinhala characters
  const sinhalaPattern = /[\u0D80-\u0DFF]/;
  if (sinhalaPattern.test(text)) {
    return 'si';
  }

  // Check for common Sinhala words
  const sinhalaWords = ['ආයුබෝවන්', 'ඉස්තුතියි', 'සමාවෙන්න', 'ඔව්', 'නැහැ', 'ටුර්නමන්ට්', 'මැච්'];
  const hasSinhalaWords = sinhalaWords.some(word => text.toLowerCase().includes(word.toLowerCase()));
  
  if (hasSinhalaWords) {
    return 'si';
  }

  return 'en';
}

/**
 * Translate multiple texts at once
 */
async function translateMultiple(texts, targetLanguage, sourceLanguage = null) {
  try {
    const translations = await Promise.all(
      texts.map(text => translateText(text, targetLanguage, sourceLanguage))
    );

    return translations;
  } catch (error) {
    console.error('Multiple translation error:', error);
    
    // Return original texts if translation fails
    return texts;
  }
}

/**
 * Get supported languages
 */
function getSupportedLanguages() {
  return Object.keys(SUPPORTED_LANGUAGES).map(code => ({
    code: SUPPORTED_LANGUAGES[code],
    name: getLanguageName(SUPPORTED_LANGUAGES[code])
  }));
}

/**
 * Get language name from code
 */
function getLanguageName(languageCode) {
  const names = {
    en: 'English',
    si: 'Sinhala'
  };

  return names[languageCode] || languageCode;
}

/**
 * Clear translation cache
 */
function clearTranslationCache() {
  translationCache.clear();
  console.log('Translation cache cleared');
}

/**
 * Get cache statistics
 */
function getCacheStats() {
  return {
    size: translationCache.size,
    entries: Array.from(translationCache.keys())
  };
}

module.exports = {
  translateText,
  translateMultiple,
  detectLanguage,
  getSupportedLanguages,
  getLanguageName,
  clearTranslationCache,
  getCacheStats,
  SUPPORTED_LANGUAGES
};