/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * @emails oncall+i18n_fbt_js
 * @format
 * @flow
 */

'strict';

import type {IntlFbtVariationTypeValue} from './IntlVariations';
import type TranslationConfig from './TranslationConfig';

/**
 * Corresponds to IntlJSTranslatationDataEntry in Hack
 */
type Translation = {|
  translation: string,
  id?: number,
  // Allow variation enum values to be stored in string or number type,
  // and we will parse it into IntlVariationEnumValue in config.isDefaultVariation()
  variations: {[index: string]: number | string},
|};

class TranslationData {
  +tokens: Array<string>;
  +types: Array<IntlFbtVariationTypeValue>;
  +translations: Array<Translation>;
  _defaultTranslation: ?string;

  constructor(
    tokens: Array<string>,
    types: Array<IntlFbtVariationTypeValue>,
    translations: Array<Translation>,
  ) {
    this.tokens = tokens;
    this.types = types;
    this.translations = translations;
  }

  static fromJSON(json: Object): TranslationData {
    return new TranslationData(json.tokens, json.types, json.translations);
  }

  hasTranslation(): boolean {
    return this.translations.length > 0;
  }

  // Makes a best effort attempt at finding the default translation.
  getDefaultTranslation(config: TranslationConfig): ?string {
    if (this._defaultTranslation === undefined) {
      for (let i = 0; i < this.translations.length; ++i) {
        const trans = this.translations[i];
        let isDefault = true;
        for (const v in trans.variations) {
          if (!config.isDefaultVariation(trans.variations[v])) {
            isDefault = false;
            break;
          }
        }
        if (isDefault) {
          return (this._defaultTranslation = trans.translation);
        }
      }
      this._defaultTranslation = null;
    }
    return this._defaultTranslation;
  }
}
module.exports = TranslationData;
