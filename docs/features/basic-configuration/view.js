'use strict';

var ComboboxDemo = require('../../scripts/app.js');

ComboboxDemo
  .App
  .config(
    function ($stateProvider) {

      var basicConfigurationView = {
        url: '/basic-configuration',
        controller: 'basicConfigurationViewCtrl',
        templateUrl: 'basic-configuration/view-partial.html'
      };

      $stateProvider
        .state('ComboboxDemo.basic-configuration', basicConfigurationView);
    });
