'use strict';
var appDependencies = [
    'ui.router',
    'TelUI',
    'ComboboxDemoDirectives',
    'ComboboxDemoControllers',
    'ComboboxDemoServices',
    'ComboboxDemoValues',
    'ComboboxDemoPartials',
];

var ComboboxDemo = {
  App: angular.module('ComboboxDemoApp', appDependencies),
  Directives: angular.module('ComboboxDemoDirectives', []),
  Controllers: angular.module('ComboboxDemoControllers', []),
  Services: angular.module('ComboboxDemoServices', []),
  Values: angular.module('ComboboxDemoValues', []),
  Partials: angular.module('ComboboxDemoPartials', []),
  Telui: angular.module('TelUI')
};

function stateChangeError(event, toState, toParams, fromState) {
  console.log('!EVENT!', event);
  console.log('!TOSTATE!', toState);
  console.log('!TOPARAMS!', toParams);
  console.log('$stateChangeError to "' + toState.name + '" from state "' + fromState.name + '"- fired when the transition begins. toState,toParams : \n', toState, toParams);
}

function stateNotfound(event, unfoundState, fromState, fromParams) {
  console.log('$stateNotFound ' + unfoundState.to + '  - fired when a state cannot be found by its name.');
  console.log(unfoundState, fromState, fromParams);
}

function debug($rootScope) {
  $rootScope.$on('$stateChangeError', stateChangeError);
  $rootScope.$on('$stateNotFound', stateNotfound);
}

function run($rootScope) {
  $rootScope.skin = $rootScope.skin || '_Blank';
  debug($rootScope);
}

ComboboxDemo
  .App
  .run(run);

module.exports = ComboboxDemo;