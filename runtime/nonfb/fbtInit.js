/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 * @oncall i18n_fbt_js
 */

import type {FbtHookRegistrations} from 'FbtHooks';
import type {TranslationDict} from 'FbtTranslations';

const FbtHooks = require('FbtHooks');
const FbtResult = require('FbtResult');
const FbtTranslations = require('FbtTranslations');
const IntlViewerContext = require('IntlViewerContext'); // default VC

const getFbsResult = require('getFbsResult');

export type FbtInitInput = {
  hooks?: ?FbtHookRegistrations,
  translations: TranslationDict,
};

// Using "auto-bind" to avoid Flow "method-unbinding" issue
const getFbtResult = FbtResult.get.bind(FbtResult);

function fbtInit(input: FbtInitInput): void {
  FbtTranslations.registerTranslations(input.translations);

  // Hookup default implementations
  const hooks = input.hooks ?? {};
  if (hooks.getFbtResult == null) {
    hooks.getFbtResult = getFbtResult;
  }
  if (hooks.getFbsResult == null) {
    hooks.getFbsResult = getFbsResult;
  }
  if (hooks.getTranslatedInput == null) {
    hooks.getTranslatedInput = FbtTranslations.getTranslatedInput;
  }
  if (hooks.getViewerContext == null) {
    hooks.getViewerContext = () => IntlViewerContext;
  }

  FbtHooks.register(hooks);
}

module.exports = fbtInit;
