/**
 * IATS CONNECT - Academic Integrity & Strong Content Filtration Engine
 * Enforces strict prohibition of pornography, adult content, sexually explicit material,
 * vulgarity, and non-academic solicitation across student profiles, events, courses, and chats.
 */

(function () {
  'use strict';

  // Comprehensive list of adult, sexually explicit, pornographic, and prohibited non-academic keywords
  const FORBIDDEN_PATTERNS = [
    // Pornography & Sexually Explicit
    /\bporn\w*/i,
    /\bxxx\w*/i,
    /\bnsfw\w*/i,
    /\bsex(ual|y|ing|ed)?\b/i,
    /\berotic\w*/i,
    /\bnude\w*/i,
    /\bnaked\w*/i,
    /\bbareback\w*/i,
    /\bescort\w*/i,
    /\bonlyfans\w*/i,
    /\bcams?(how|ite)?\b/i,
    /\bwebcam(model|girl|site)?\b/i,
    /\bhookup\w*/i,
    /\bdildo\w*/i,
    /\bvibrator\w*/i,
    /\bmasturbat\w*/i,
    /\borgasm\w*/i,
    /\bblowjob\w*/i,
    /\bhandjob\w*/i,
    /\bbondage\w*/i,
    /\bbdsm\w*/i,
    /\bstrip(per|club|ping)?\b/i,
    /\bhentai\w*/i,
    /\bmilf\w*/i,
    /\bpenis\w*/i,
    /\bvagina\w*/i,
    /\bclitor\w*/i,
    /\bboobs?\b/i,
    /\btits?\b/i,
    /\bnipples?\b/i,
    /\basshole\b/i,
    /\bfuck\w*/i,
    /\bwhore\w*/i,
    /\bslut\w*/i,
    /\bbitch\w*/i,
    /\bcunt\w*/i,
    /\bhorny\w*/i,
    /\bincest\w*/i,
    /\bpedophil\w*/i,
    /\brape\w*/i,
    /\bsmut\w*/i,
    /\bthreesome\w*/i,
    /\bgangbang\w*/i,
    /\bcum\w*/i,
    /\bjizz\w*/i,
    /\banal\b/i,
    /\bswinger\w*/i,
    /\blust\w*/i,
    /\bplayboy\w*/i,
    /\bx-rated\w*/i,
    /\bsugardaddy\w*/i,
    /\bsugarbaby\w*/i,
    /\bcybersex\w*/i,

    // Non-Academic Exploitation & Gambling
    /\bcasino\w*/i,
    /\bbetting\w*/i,
    /\bpoker\w*/i,
    /\bdrugdeal\w*/i
  ];

  // Leetspeak & substitution normalization mapping
  function normalizeText(text) {
    if (!text || typeof text !== 'string') return '';
    return text
      .toLowerCase()
      .replace(/[@4]/g, 'a')
      .replace(/[1!|]/g, 'i')
      .replace(/[0]/g, 'o')
      .replace(/[3]/g, 'e')
      .replace(/[$5]/g, 's')
      .replace(/[7]/g, 't')
      .replace(/[^a-z0-9\s]/g, ' '); // remove punctuation obfuscations like p.o.r.n
  }

  const IATSContentFilter = {
    /**
     * Checks if text violates academic content policies
     * @param {string} text - text to inspect
     * @returns {{ isClean: boolean, matchedTerm: string | null, reason: string }}
     */
    check(text) {
      if (!text || typeof text !== 'string') {
        return { isClean: true, matchedTerm: null, reason: '' };
      }

      const normalized = normalizeText(text);

      for (const pattern of FORBIDDEN_PATTERNS) {
        if (pattern.test(text) || pattern.test(normalized)) {
          const match = text.match(pattern) || normalized.match(pattern);
          const term = match ? match[0] : 'prohibited term';
          return {
            isClean: false,
            matchedTerm: term,
            reason:
              'In accordance with the IATS Academic Code of Conduct, sexually explicit, pornographic, adult, or non-academic material is strictly prohibited on IATS CONNECT.'
          };
        }
      }

      return { isClean: true, matchedTerm: null, reason: '' };
    },

    /**
     * Inspects an object containing multiple text fields
     * @param {Object} obj - object containing fields to check
     * @param {string[]} fields - list of key names to check
     * @returns {{ isClean: boolean, matchedField: string | null, matchedTerm: string | null, reason: string }}
     */
    checkFields(obj, fields = []) {
      if (!obj || typeof obj !== 'object') {
        return { isClean: true, matchedField: null, matchedTerm: null, reason: '' };
      }

      for (const field of fields) {
        const value = obj[field];
        if (typeof value === 'string') {
          const result = this.check(value);
          if (!result.isClean) {
            return {
              isClean: false,
              matchedField: field,
              matchedTerm: result.matchedTerm,
              reason: result.reason
            };
          }
        } else if (Array.isArray(value)) {
          for (const item of value) {
            if (typeof item === 'string') {
              const itemResult = this.check(item);
              if (!itemResult.isClean) {
                return {
                  isClean: false,
                  matchedField: field,
                  matchedTerm: itemResult.matchedTerm,
                  reason: itemResult.reason
                };
              }
            }
          }
        }
      }

      return { isClean: true, matchedField: null, matchedTerm: null, reason: '' };
    }
  };

  // Expose to global window
  if (typeof window !== 'undefined') {
    window.IATSContentFilter = IATSContentFilter;
  }
})();
