// creative the directives as re-usable components
// TODO: Require the placeholder shim
var React = require('react/addons');
require('TelUI-Core');
var UI = require('TelUI-Form');

require('TelUI-Core/lib/jquery-ui/jquery.ui.menu.js');
require('TelUI-Core/lib/jquery-ui/jquery.ui.autocomplete.js');
var TelogicalUi = angular.module('TelUI');


TelogicalUi
  .directive('teluiCombobox', ['$http', '$templateCache', 'TelUIValidate',
      function ($http, $templateCache, TelUIValidate) {
      'use strict';

      function link($scope, $element) {

        var inputSelector = '.ui-combobox-input';

        var initialized = false,
          _input = $element.find(inputSelector),
          $dropDownButtonFrame = $element.find('.ui-combobox-dropdownbutton-frame');

        function init() {
          _input = $element.find(inputSelector);

          function select(eve, ui) {
            $scope.$apply(function () {
              eve.preventDefault();
              $scope.value = ui.item.value;
              $scope.staleValue = ui.item.label;
              _input.val(ui.item.label);
              $scope.isEmpty = !ui.item.label.length;
            });
          }

          function focus(eve, ui) {
            if (typeof ui.item === 'object') {
              $scope.$apply(function () {
                eve.preventDefault();
                _input.val(ui.item.label);
                $scope.isEmpty = !ui.item.label.length;
              });
            }
          }

          TelUIValidate.buildValidators($scope);
          TelUIValidate.validate($scope);

          var autoCompleteOptions = {
            delay: 0,
            minLength: 0,
            source: prepareData($scope.data),
            select: select,
            focus: focus,
            open: open
          };

          initialized =
            _input
            .autocomplete(autoCompleteOptions);

          $dropDownButtonFrame
            .off('.combobox')
            .on('click.combobox', dropdownButton);

          _input
            .off('.combobox')
            .on('keydown.combobox', keydown);

          $('body')
            .on('click.combobox', closeSelect);
        }


        function prepareData(data) {
          var _data = $.extend(true, [], data);

          function assignObject(i) {
            var obj = {
              label: _data[i][$scope.labelProp],
              value: _data[i]
            };
            return obj;
          }

          for (var i = 0, ii = _data.length; i < ii; i++) {
            if (!_data[i].label && !_data[i].value) {
              _data[i] = assignObject(i);
            }
          }
          return _data;
        }

        function updateData(data) {
          var autocompleteOpts = {
            source: prepareData(data),
            open: open
          };

          //triggering search forces list to update if new payload
          _input
            .autocomplete(autocompleteOpts);
        }

        function open(eve, ui) {
          var widget = $(this).data('ui-autocomplete'),
            menu = widget.menu,
            $ul = menu.element,
            id = $ul.attr('id');

          $ul
            .css({
              'max-height': $scope.maxHeight || '100%',
              'max-width': $scope.maxWidth || '100%',
              'overflow': 'auto',
              'width': _input.width()
            })
            .addClass('ui-state-' + $scope.state);

          setTimeout(function () {
            $(window).resize();
          });
        }

        function updateValue(val) {
          $scope.value = val;
          if (val && typeof val === 'object') {
            _input.val(val[$scope.labelProp]);
            TelUIValidate.validate($scope);
          } else {
            _input.val(val);
          }
          $scope.isEmpty = !_input.val().length;
        }

        function updateEnablement(value) {
          value =
            (value === true || value === 'true') ?
            true :
            false;

          _input = $element.find(inputSelector);

          _input.prop('disabled', value);
          if (value) {
            _input.autocomplete('disable');
          } else {
            _input.autocomplete('enable');
          }
        }

        function focusInput() {
          _input.focus();
        }

        function closeSelect(eve, target) {
          _input = $element.find(inputSelector);
          if (_input.hasClass('ui-autocomplete-input')) {
            _input
              .autocomplete('search', '')
              .autocomplete('close');
          }

          if ($scope.staleValue) {
            _input.val($scope.staleValue);
            $scope.staleValue = '';

          }

          $scope.$apply(function () {
            $scope.isEmpty = !_input.val().length;
          });
        }

        function dropdownButton() {
          function clickEvent() {
            _input = $element.find(inputSelector);
            if (_input.autocomplete().autocomplete('widget').is(':visible')) {
              closeSelect();
              return;
            }

            $scope.staleValue = _input.val();

            _input
              .val('')
              .keydown()
              .autocomplete('search', '')
              .autocomplete('widget');

            $scope.$apply(function () {
              $scope.isEmpty = !_input.val().length;
            });

          }

          if ($scope.debounceClick) {
            clearTimeout($scope.debounceClick);
          }
          $scope.debounceClick = setTimeout(clickEvent);
        }

        function keydown(eve) {
          if (eve.which === 13 && _input.autocomplete('widget').is(':visible')) {
            _input
              .autocomplete('widget')
              .find('.ui-menu-item:first > a')
              .click();

            _input.autocomplete('close');
          }

          setTimeout(function evaluateIsEmpty() {
            $scope.isEmpty = !_input.val().length;
            $scope.$apply();
          });
        }

        function renderReactButton() {
          var buttonModel = {
            scope: $scope,
            id: $scope.id + '_dropdownbutton',
            text: false,
            iconPrimary: $scope.iconPrimary || 'ui-icon-carat-1-s',
            cssClass: 'ui-combobox-dropdownbutton',
            disabled: $scope.disabled,
            click: dropdownButton
          };

          // We need this in the scope later on so we can set events.
          var generatedReactButton = UI.Button(buttonModel);
          //$scope.generatedReactButton = generatedReactButton;

          React.renderComponent(generatedReactButton, $dropDownButtonFrame[0]);
        }
        
        function updateState(){
          $scope.state = $scope.state || 'default';
        }
        
        function hoverIn() {
          $scope.interact = 'hover';
        }
        
        function hoverOut() {
          $scope.interact = 'default';
        }
        
        function focus() {
          $scope.interact = 'focus';
        }

        function blur() {
          $scope.interact = 'default';
        }
        

        $scope.interact = 'default';
        $scope.hoverIn= hoverIn;
        $scope.hoverOut = hoverOut;
        $scope.focus = focus;
        $scope.blur = blur;
        
        $scope.data = $scope.data || [];
        $scope.value = $scope.value || '';
        $scope.placeholder = $scope.placeholder || '';
        $scope.dropdownButton = dropdownButton;
        $scope.focusInput = focusInput;
        $scope.isEmpty = true;

        $scope.$watch('data', updateData, true);
        $scope.$watch('value', updateValue, true);
        $scope.$watch('disabled', updateEnablement, true);
        $scope.$watch('state', updateState);
        
        
        $scope.$watchCollection('[label, iconPrimary, iconSecondary, disabled, cssClass, text, click, appearance, orientation]', renderReactButton);
        setTimeout(init);
      }

      var scopeObj = {
        'id': '@',
        'data': '=?',
        'disabled': '=',
        'value': '=?',
        'iconPrimary': '@',
        'label': '@',
        'labelProp': '@',
        'maxHeight': '@',
        'maxWidth': '@',
        'placeholder': '@',
        'state': '@'
      };

      TelUIValidate.attach(scopeObj);

      return {
        restrict: 'E',
        require: '',
        scope: scopeObj,
        template: require('../ui/partials/telui-combobox-partial.html'),
        replace: true,
        transclude: false,
        link: link
      };
    }
]);
