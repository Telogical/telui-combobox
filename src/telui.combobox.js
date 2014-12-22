var React = require('react/addons');
require('TelUI-Core');
var TelogicalUi = angular.module('TelUI');
var UI = require('../react/telui');
var _ = require('lodash');

TelogicalUi
  .directive('teluiCombobox', [

    function reactComboboxDirective() {
      'use strict';

      return {
        restrict: 'E',
        replace: true,
        scope: {
          id: '@',
          value: '=?',
          label: '@',
          disabled: '=',
          iconPrimary: '@',
          iconSecondary: '@',
          appearance: '@',
          click: '&?',
          cssClass: '@',
          text: '=?',
          state: '@',
          open: '=?'
        },
        template: '<div class="waffles"></div>',
        link: function link(scope, $el, attrs) {
          var id = scope.id ?
            scope.id :
            'combobox_' + Math.round(Math.random() * 9999);
          
          scope.buttonScope = scope.$new(true);
          scope.buttonScope.value = scope.open || false;
          
          function render(newValue, oldValue) {

            if (typeof scope.text === 'undefined') {
              scope.text = true;
            }

            $el.removeAttr('disabled');

            var model = {
              scope: scope,
              buttonScope: scope.buttonScope,
              id: id,
              label: scope.label,
              iconPrimary: scope.iconPrimary,
              iconSecondary: scope.iconSecondary,
              cssClass: scope.cssClass,
              text: scope.text,
              disabled: scope.disabled,
              click: scope.click,
              value: scope.value,
              appearance: scope.appearance || 'button',
              orientation: scope.orientation || 'vertical',
              uiState: scope.state || ''
            };

            React.renderComponent(UI.Combobox(model), $el[0]);
          }

          //scope.$parent.$watch(attrs.ngDisabled, render);
          scope.$watchCollection('[value, label, iconPrimary, iconSecondary, disabled, cssClass, text, click, appearance, state, open, buttonScope.value]', render);

        }
      };
    }
]);