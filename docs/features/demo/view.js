'use strict';

var ComboboxDemo = require('../../scripts/app.js');

ComboboxDemo
  .App
  .config(
    function ($stateProvider) {

      var demoView = {
        url: '/demo',
        controller: 'demoViewCtrl',
        templateUrl: 'demo/view-partial.html'
      };

      $stateProvider
        .state('ComboboxDemo', demoView);
    });
