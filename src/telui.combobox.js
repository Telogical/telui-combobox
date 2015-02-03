require('@telogical/telui-validate');
var TelogicalUi = angular.module('TelUI'),
  UI = require('../react/telui');

TelogicalUi
  .directive('teluiCombobox', [
    'TelUIValidate',
    function reactComboboxDirective(TelUIValidate) {
      'use strict';


      function link(scope, $el, attrs) {
        
        var id = scope.id ?
          scope.id :
          'combobox_' + Math.round(Math.random() * 9999);

        scope.buttonScope = scope.$new(true);
        scope.buttonScope.value = scope.open || false;
        scope.menuScope = scope.$new(true);
        scope.menuScope.value = scope.value;

        scope.clearable = _.isUndefined(scope.clearable) ?
          false :
          scope.clearable;

        function render(newValue, oldValue) {

          TelUIValidate.validate(scope, attrs);

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
            clearable: scope.clearable,
            uiState: scope.state || 'default',
            maxHeight: scope.maxHeight || 'auto',
            labelProp: scope.labelProp || 'label'
          };

          React.renderComponent(UI.Combobox(model), $el[0]);
        }
        
        scope.$watchCollection(
          '[value, data, label, labelProp,iconPrimary, iconSecondary, disabled, cssClass, text, click, state, buttonScope.value, menuScope.value, maxHeight]',
          render);
      }

      var scopeDefinition = {
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
        clearable: '=?',
        maxHeight: '@',
        labelProp: '@'
      };

      return {
        restrict: 'E',
        replace: true,
        scope: TelUIValidate.extend(scopeDefinition),
        template: '<div class="waffles"></div>',
        link: link
      };
    }
]);