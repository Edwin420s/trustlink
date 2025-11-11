import React, { useState, useEffect } from 'react'
import { Globe } from 'lucide-react'
import { getCurrentLanguage, setCurrentLanguage, getAvailableLanguages, LANGUAGES } from '../utils/localization'

/**
 * LanguageSwitcher Component
 * Toggle between English and Swahili
 */
const LanguageSwitcher = ({ onLanguageChange }) => {
  const [currentLang, setCurrentLang] = useState(getCurrentLanguage())
  const [isOpen, setIsOpen] = useState(false)
  const languages = getAvailableLanguages()

  useEffect(() => {
    setCurrentLanguage(currentLang)
    if (onLanguageChange) {
      onLanguageChange(currentLang)
    }
  }, [currentLang, onLanguageChange])

  const handleLanguageSelect = (langCode) => {
    setCurrentLang(langCode)
    setIsOpen(false)
  }

  const currentLanguage = languages.find(lang => lang.code === currentLang)

  return (
    <div className="language-switcher">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="language-toggle-btn"
        title="Change Language"
      >
        <Globe size={20} />
        <span>{currentLanguage?.native}</span>
      </button>

      {isOpen && (
        <div className="language-dropdown">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              className={`language-option ${lang.code === currentLang ? 'active' : ''}`}
            >
              <span className="lang-native">{lang.native}</span>
              <span className="lang-name">{lang.name}</span>
              {lang.code === currentLang && <span className="check">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default LanguageSwitcher
