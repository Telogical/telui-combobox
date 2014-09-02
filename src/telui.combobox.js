// creative the directives as re-usable components
// TODO: Require the placeholder shim
require('TelUI-Core');
require('TelUI-Form');
require('TelUI-Core/lib/jquery-ui/jquery.ui.button.js');
require('TelUI-Core/lib/jquery-ui/jquery.ui.menu.js');
require('TelUI-Core/lib/jquery-ui/jquery.ui.autocomplete.js');
var TelogicalUi = angular.module('TelUI');

TelogicalUi
    .directive('teluiCombobox', ['$http', '$templateCache',
        function ($http, $templateCache) {
            'use strict';

            function isIE() {
                var ua = window.navigator.userAgent;
                var msie = ua.indexOf("MSIE ");

                return (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./));
              }

            function link($scope, $element) {
                //TODO: switch _input and _button with $input and $button

                var initialized = false,
                    _input = $element.find('input:first'),
                    _button = $element.find('.ui-button');

                function init() {
                    _input = $element.find('input:first');
                    _button = $element.find('.ui-button');

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

                    _button
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
                            'overflow': 'auto'
                        });

                    setTimeout(function () {
                        $(window).resize();
                    });
                }

                function updateValue(val) {
                    $scope.value = val;
                    if (val && typeof val === 'object') {
                        _input.val(val[$scope.labelProp]);
                    } else {
                        _input.val(val);
                    }
                    $scope.isEmpty = !_input.val().length;
                }

                function updateEnablement(value) {
                    value =
                        (value == true || value == 'true') ?
                        true :
                        false;

                    _input = $element.find('input:first');
                    _button = $element.find('.ui-button');

                    _input.prop('disabled', value);
                    _button.prop('disabled', value);
                    if (value) {
                        _input.autocomplete('disable');
                        _button.button('disable');
                    } else {
                        _input.autocomplete('enable');
                        _button.button('enable');
                    }
                }

                function focusInput() {
                    _input.focus();
                }

                function closeSelect(eve, target) {

                    _input = $element.find('input:first');
                    _button = $element.find('.ui-button');
                    if (_input.hasClass('ui-autocomplete-input')) {
                        _input
                            .autocomplete('search', '')
                            .autocomplete('close');
                    }
                    _button.blur();

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
                        _input = $element.find('input:first');
                        _button = $element.find('.ui-button');
                        if (_input.autocomplete('widget').is(':visible')) {
                            closeSelect();
                            return;
                        }

                        $scope.staleValue = _input.val();

                        _input
                            .val('')
                            .keydown()
                            .autocomplete('search', '')
                            .autocomplete('widget');

                        _button
                            .focus();

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
                        _button.blur();
                    }

                    setTimeout(function evaluateIsEmpty() {
                        $scope.isEmpty = !_input.val().length;
                        $scope.$apply();
                    });
                }

                $scope.isIE = isIE();
                $scope.data = $scope.data || [];
                $scope.value = $scope.value || '';
                $scope.placeholder = $scope.placeholder || '';
                $scope.dropdownButton = dropdownButton;
                $scope.focusInput = focusInput;
                $scope.isEmpty = true;

                $scope.$watch('data', updateData, true);
                $scope.$watch('value', updateValue, true);
                $scope.$watch('ngDisabled', updateEnablement, true);

                setTimeout(init);
            }

            return {
                restrict: 'E',
                require: '',
                template: require('../ui/partials/telui-combobox-partial.html'),
                replace: true,
                transclude: false,
                scope: {
                    'id': '@',
                    'data': '=?',
                    'ngDisabled': '=?',
                    'value': '=?',
                    'label': '@',
                    'labelProp': '@',
                    'maxHeight': '@',
                    'placeholder': '@'
                },
                link: link
            };
        }
    ]);
