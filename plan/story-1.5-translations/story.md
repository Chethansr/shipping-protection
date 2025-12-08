# Story 1.5: Translations & Localization

## Overview
Implement internationalization (i18n) support for the SDK. Enable multi-language support through config service translations, with fallback to English for missing translations.

## Description
This story creates the config service getTranslations() method to fetch translations from retailer config, translation key definitions for all widget strings, component translation integration in narvar-secure-widget, locale fallback mechanism (default to English), and multi-locale testing (en-US, es-ES, fr-FR).

## Goals
- Full i18n support
- Translation keys for all strings
- Fallback to English
- Easy retailer customization
- Support major languages

## Acceptance Criteria
- ✅ getTranslations() fetches translations from config
- ✅ All widget strings use translation keys
- ✅ Components render localized strings
- ✅ Missing translations fallback to English
- ✅ Locale validated (BCP 47 format)
- ✅ Three locales tested (en-US, es-ES, fr-FR)
- ✅ 90%+ test coverage

## Tasks
- [Task 1.5.1](./task-1.5.1.md) - Config service getTranslations()
- [Task 1.5.2](./task-1.5.2.md) - Translation key definitions
- [Task 1.5.3](./task-1.5.3.md) - Component translation integration
- [Task 1.5.4](./task-1.5.4.md) - Locale fallback
- [Task 1.5.5](./task-1.5.5.md) - Multi-locale testing

## Dependencies
- Story 0.4 (Config service)
- Story 0.7 (Web components)

## Technical Notes
- Translations stored in retailer config
- Key-based translation system
- Fallback chain: locale → en-US
- No runtime translation switching in MVP

