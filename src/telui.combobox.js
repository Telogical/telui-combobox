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
          data: '=?',
          label: '@',
          disabled: '=',
          iconPrimary: '@',
          iconSecondary: '@',
          click: '&?',
          cssClass: '@',
          text: '=?',
          state: '@',
          maxHeight: '@',
          labelProp: '@'
        },
        template: '<div class="waffles"></div>',
        link: function link(scope, $el, attrs) {
          var id = scope.id ?
            scope.id :
            'combobox_' + Math.round(Math.random() * 9999);

          scope.buttonScope = scope.$new(true);
          scope.buttonScope.value = scope.open || false;

          scope.menuScope = scope.$new(true);
          scope.menuScope.value = scope.value;

          function render(newValue, oldValue) {


            function toObject(d) {
              return {
                label: d,
                value: d
              };
            }

            if (typeof scope.text === 'undefined') {
              scope.text = true;
            }

            $el.removeAttr('disabled');

            var model = {
              //scopes
              scope: scope,
              buttonScope: scope.buttonScope,
              menuScope: scope.menuScope,

              //attrs
              id: id,
              label: scope.label,
              iconPrimary: scope.iconPrimary,
              iconSecondary: scope.iconSecondary,
              cssClass: scope.cssClass,
              text: scope.text,
              disabled: scope.disabled,
              click: scope.click,
              value: scope.value,
              data: scope.data,
              uiState: scope.state || '',
              maxHeight: scope.maxHeight || 'auto',
              labelProp: scope.labelProp || 'label'
            };

//            if (model.data.length && !(typeof model.data[0] === 'object')) {
//              model.data = model.data.map(toObject);
//              model.labelProp = 'label';
//              console.warn('you should be using a list of objects, rather than primitives for', model.id);
//            }


            React.renderComponent(UI.Combobox(model), $el[0]);
          }

          //scope.$parent.$watch(attrs.ngDisabled, render);
          scope.$watchCollection('[value, data, label, labelProp,iconPrimary, iconSecondary, disabled, cssClass, text, click, state, buttonScope.value, menuScope.value, maxHeight]', render);

        }
      };
    }
]);