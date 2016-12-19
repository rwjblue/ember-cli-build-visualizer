'use strict';

const BUILD_INSTRUMENTATION = (function() {
  try {
    let experiments = require('ember-cli/lib/experiments');

    return experiments.BUILD_INSTRUMENTATION || 'buildInstrumentation';
  } catch(e) {
    // just return `buildInstrumentation` regardless
    // we make sure to warn if it isn't used below
    return 'buildInstrumentation';
  }
})();

module.exports = {
  name: 'ember-cli-build-visualizer',

  init() {
    this._super && this._super.init.apply(this, arguments);

    this._hasWarned = false;
    this._hasBuildInstrumentationFired = false;

    // enable build instrumentation
    process.env.EMBER_CLI_INSTRUMENTATION = '1';
  },

  _warnExperimentNotFound() {
    if (!this._hasWarned) {
      this._hasWarned = true;

      this.ui.writeLine('Nice message goes here!');
    }
  },

  [BUILD_INSTRUMENTATION](buildInstrumentation) {
    this._hasBuildInstrumentationFired = true;
    this.ui.writeLine('buildSteps: ' + buildInstrumentation.summary.buildSteps);
  },

  outputReady() {
    // confirm that build instrumentation hook was fired
    // this lets us detect and warn when used before
    // the hook was added
    if (!this._hasBuildInstrumentationFired) {
      this._warnExperimentNotFound();
    }
  }
};
