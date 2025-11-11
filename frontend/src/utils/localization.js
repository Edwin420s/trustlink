/**
 * Localization utility for TrustLink
 * Supports English and Swahili
 */

export const LANGUAGES = {
  EN: 'en',
  SW: 'sw' // Swahili
}

export const translations = {
  en: {
    // Landing page
    'landing.hero.title': 'A Better Way to Confirm What\'s Real',
    'landing.hero.subtitle': 'Create, confirm, and verify important digital documents — privately and permanently.',
    'landing.cta.getStarted': 'Get Started',
    'landing.cta.learnMore': 'Learn More',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.agreements': 'Agreements',
    'nav.recordProof': 'Record Proof',
    'nav.verify': 'Verify',
    'nav.about': 'About',
    'nav.settings': 'Settings',
    
    // Verification
    'verify.title': 'Verify Document',
    'verify.uploadPrompt': 'Drop your file here or click to upload',
    'verify.verifying': 'Verifying...',
    'verify.button': 'Verify Proof',
    'verify.result.verified': 'Document Verified',
    'verify.result.notFound': 'No Record Found',
    'verify.result.revoked': 'Proof Revoked',
    'verify.result.pending': 'Awaiting Partner Acknowledgement',
    'verify.result.inactive': 'Agreement Inactive',
    
    // Agreements
    'agreement.create': 'Create Agreement',
    'agreement.accept': 'Accept',
    'agreement.cancel': 'Cancel',
    'agreement.active': 'Active',
    'agreement.pending': 'Pending',
    'agreement.partner': 'Partner',
    'agreement.created': 'Created',
    
    // Proof recording
    'proof.record': 'Record Proof',
    'proof.selectAgreement': 'Select Agreement',
    'proof.uploadFile': 'Upload File',
    'proof.requireAck': 'Require Partner Acknowledgement',
    'proof.useSalt': 'Use Salted Hash (Enhanced Privacy)',
    'proof.computing': 'Computing fingerprint...',
    'proof.recorded': 'Proof recorded successfully',
    
    // Common
    'common.connect': 'Connect Wallet',
    'common.disconnect': 'Disconnect',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.copy': 'Copy',
    'common.copied': 'Copied!',
    'common.close': 'Close',
    'common.confirm': 'Confirm',
    
    // Explanations
    'explain.verified': 'This means: The exact file existed at that time and is linked to an agreement.',
    'explain.notMeaning': 'This does NOT mean: The contents are factually correct or legally binding without review.',
    'explain.privacy': 'Your file is never uploaded. Only its fingerprint is stored onchain.',
    'explain.saltedHash': 'Salted hashing prevents others from guessing common document hashes.',
  },
  
  sw: {
    // Landing page
    'landing.hero.title': 'Njia Bora ya Kuthibitisha Kile Kilicho Halisi',
    'landing.hero.subtitle': 'Unda, thibitisha, na hakiki hati muhimu za kidijitali — kwa faragha na kudumu.',
    'landing.cta.getStarted': 'Anza Sasa',
    'landing.cta.learnMore': 'Jifunze Zaidi',
    
    // Navigation
    'nav.dashboard': 'Dashibodi',
    'nav.agreements': 'Mikataba',
    'nav.recordProof': 'Rekodi Uthibitisho',
    'nav.verify': 'Hakiki',
    'nav.about': 'Kuhusu',
    'nav.settings': 'Mipangilio',
    
    // Verification
    'verify.title': 'Hakiki Hati',
    'verify.uploadPrompt': 'Dondosha faili yako hapa au bofya kupakia',
    'verify.verifying': 'Inahakiki...',
    'verify.button': 'Hakiki Uthibitisho',
    'verify.result.verified': 'Hati Imethibitishwa',
    'verify.result.notFound': 'Hakuna Rekodi Iliyopatikana',
    'verify.result.revoked': 'Uthibitisho Umefutwa',
    'verify.result.pending': 'Inasubiri Uthibitisho wa Mshirika',
    'verify.result.inactive': 'Mkataba Haujawezesha',
    
    // Agreements
    'agreement.create': 'Unda Mkataba',
    'agreement.accept': 'Kubali',
    'agreement.cancel': 'Ghairi',
    'agreement.active': 'Hai',
    'agreement.pending': 'Inasubiri',
    'agreement.partner': 'Mshirika',
    'agreement.created': 'Iliyoundwa',
    
    // Proof recording
    'proof.record': 'Rekodi Uthibitisho',
    'proof.selectAgreement': 'Chagua Mkataba',
    'proof.uploadFile': 'Pakia Faili',
    'proof.requireAck': 'Hitaji Uthibitisho wa Mshirika',
    'proof.useSalt': 'Tumia Hash Iliyo na Chumvi (Faragha Bora)',
    'proof.computing': 'Inakokotoa alama ya kidole...',
    'proof.recorded': 'Uthibitisho umerekodi kwa mafanikio',
    
    // Common
    'common.connect': 'Unganisha Mkoba',
    'common.disconnect': 'Tenganisha',
    'common.loading': 'Inapakia...',
    'common.error': 'Kosa',
    'common.success': 'Mafanikio',
    'common.copy': 'Nakili',
    'common.copied': 'Imenakiliwa!',
    'common.close': 'Funga',
    'common.confirm': 'Thibitisha',
    
    // Explanations
    'explain.verified': 'Hii inamaanisha: Faili hii kamili ilikuwepo wakati huo na imeunganishwa na mkataba.',
    'explain.notMeaning': 'Hii HAI maana: Yaliyomo ni sahihi au yanafuata sheria bila ukaguzi.',
    'explain.privacy': 'Faili yako haijapakiwa. Alama yake tu inahifadhiwa kwenye blockchain.',
    'explain.saltedHash': 'Hash iliyochanganywa na chumvi inazuia wengine wasifikiwe hash za kawaida.',
  }
}

/**
 * Get translation for a key
 * @param {string} key - Translation key
 * @param {string} lang - Language code
 * @returns {string} Translated text
 */
export const t = (key, lang = LANGUAGES.EN) => {
  return translations[lang]?.[key] || translations[LANGUAGES.EN][key] || key
}

/**
 * Get current language from localStorage
 * @returns {string} Current language code
 */
export const getCurrentLanguage = () => {
  return localStorage.getItem('trustlink_language') || LANGUAGES.EN
}

/**
 * Set current language in localStorage
 * @param {string} lang - Language code to set
 */
export const setCurrentLanguage = (lang) => {
  if (Object.values(LANGUAGES).includes(lang)) {
    localStorage.setItem('trustlink_language', lang)
  }
}

/**
 * Get all available languages
 * @returns {Array} Array of language objects
 */
export const getAvailableLanguages = () => {
  return [
    { code: LANGUAGES.EN, name: 'English', native: 'English' },
    { code: LANGUAGES.SW, name: 'Swahili', native: 'Kiswahili' }
  ]
}
