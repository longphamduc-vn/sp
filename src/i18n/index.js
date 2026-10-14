import { translations } from './translations';

/**
 * Retrieve translation by dotted path (e.g., 'workspace.title')
 */
export function getTranslation(lang = 'vi', path = '', params = {}) {
  const dictionary = translations[lang] || translations.vi || translations.en;
  const parts = path.split('.');
  
  let current = dictionary;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      // Fallback to English
      let fallback = translations.en;
      for (const fPart of parts) {
        if (fallback && typeof fallback === 'object' && fPart in fallback) {
          fallback = fallback[fPart];
        } else {
          fallback = null;
          break;
        }
      }
      current = fallback || path;
      break;
    }
  }

  if (typeof current === 'string') {
    let result = current;
    for (const [key, value] of Object.entries(params)) {
      result = result.replace(new RegExp(`{${key}}`, 'g'), String(value));
    }
    return result;
  }

  return current || path;
}

export function translateCategory(cat, lang = 'vi') {
  if (!cat) return cat;
  const catMap = translations[lang]?.categories || {};
  return catMap[cat] || cat;
}

export function translateReason(reason, lang = 'vi') {
  if (!reason) return reason;
  const reasonMap = translations[lang]?.reasons || {};
  return reasonMap[reason] || reason;
}

export function translateStatus(status, lang = 'vi') {
  if (!status) return status;
  const statusMap = translations[lang]?.statuses || {};
  return statusMap[status] || status;
}

export { translations };
