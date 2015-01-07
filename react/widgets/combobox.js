var React = require('react/addons');
var _ = require('lodash');

function Combobox(ui) {
  'use strict';
  return React.createClass({
    displayName: 'Combobox',
    mixins: [ui.Mixins.Widget, ui.Mixins.Appearance],
    propTypes: {

    },
    getInitialState: function getInitialState() {
      return {
        id: '',
        label: ''
      };
    },

    __keystrokeNavigation: function keystrokeNavigation(eve) {

      var eve = eve || window.event;

      var up = eve.which === 38,
        down = eve.which === 40,
        enter = eve.which === 13,
        tab = eve.which === 9,
        backspace = eve.which === 8,
        deletekey = eve.which === 46,
        menu = this.refs.menu,
        list = menu.refs.list,
        elMenu = menu.getDOMNode(),
        elList = list.getDOMNode();

      function hoverItem(childRefs) {
        function byHovered(child) {
          return child.state.hover;
        }
        var hoveredKey = _.findKey(childRefs, byHovered),
          index = _.invert(Object.keys(childRefs))[hoveredKey] || -1;
        return parseInt(index, 10);
      }

      function getCurrentIndex() {
        var currentIndex = hoverItem(list.refs);
        if (currentIndex == -1 && list.props.value) {
          currentIndex = _.invert(Object.keys(list.refs))[list.props.value.id] || -1;
        }
        return parseInt(currentIndex, 10);
      }

      function clear(li) {
        if (li.state.hover) {
          li.setState({
            hover: false
          });
        }
      }

      function focusOnLi(li) {
        var elLi = li.getDOMNode(),
          mRect = elMenu.getBoundingClientRect();

        elMenu.scrollTop = elLi.offsetTop - (mRect.height * 0.5);
      }

      function keySelect(index, direction) {
        var newIndex = index + direction,
          lis = list.refs,
          highestIndex = Object.keys(lis).length - 1;

        if (newIndex < 0) {
          newIndex = highestIndex;
        }

        if (newIndex > highestIndex) {
          newIndex = 0;
        }

        _.each(lis, clear);
        var targetProp = Object.keys(lis)[newIndex];
        lis[targetProp].setState({
          hover: true
        });

        focusOnLi(lis[targetProp]);
      }

      function movecursor(direction) {
        var index = getCurrentIndex(),
          dir = direction === 'up' ? -1 : 1;
        if (index > -1) {
          keySelect(index, dir);
        } else {
          keySelect(0, 0);
        }
      }

      function selectItem() {
        var index = getCurrentIndex();

        //you are in the input, so grab the first one!
        if (index === -1) {
          index = 0;
        }

        var lis = list.refs,
          targetProp = Object.keys(lis)[index],
          li = lis[targetProp];


        if (li) {
          //something is selectable
          var elLi = li.refs.appearance.getDOMNode();
          elLi.click();
          return;
        }

      }

      if (up) {
        movecursor('up');
      }

      if (down) {
        movecursor('down');
      }

      if (enter) {
        selectItem();
        this.__onInputFocus();
      }

      if (tab) {
        selectItem();
      }

      if (backspace || deletekey) {

        this.setState({
          value: null,
          inputVal: eve.target.value || ''
        });
      }

    },
    __closeMenu: function closeMenu(eve) {
      var inputNode = this.refs.input.getDOMNode(),
        menuNode = this.refs.menu.getDOMNode(),
        isCombo = eve.target === inputNode || eve.target === menuNode;

      if (isCombo) {
        return;
      }

      var model = this.props;
      model.buttonScope.value = false;
      model.buttonScope.$apply();
    },
    __onInputChange: function (eve) {
      var model = this.props;

      this.setState({
        value: null,
        inputVal: eve.target.value || ''
      });

      model.scope.value = null;
      model.scope.$apply();

      console.log('__onInputChange', model.value, model);
    },
    __onInputFocus: function () {
      var model = this.props;
      model.buttonScope.value = true;
      model.buttonScope.$apply();
    },
    __onInputBlur: function () {
      var model = this.props;
      model.buttonScope.value = false;
      //model.buttonScope.$apply();
      console.log('..blur');
    },
    __onMenuChange: function onMenuChange(value) {
      var model = this.props,
        _value = value.value;

      this.setState({
        value: value,
        inputVal: value.label
      });

      model.scope.$apply(function (scope) {
        scope.value = _value;
      });
    },
    componentDidUpdate: function componentDidUpdate() {
      var body = document.body,
        model = this.props,
        input = this.refs.input.getDOMNode();

      if (this.refs.dropdown) {
        var elDropdown = this.refs.dropdown.getDOMNode(),
          menu = this.refs.menu,
          elMenu = menu.getDOMNode(),
          list = menu.refs.list,
          docEl = document.documentElement;

        //positioning
        elDropdown.style.width = this._toPx(input.offsetWidth);
        elDropdown.style.top = this._toPx(input.offsetTop + input.offsetHeight);
        elDropdown.style.left = this._toPx(input.offsetLeft);

        //eventing
        input.addEventListener('keydown', this.__keystrokeNavigation);
        document.addEventListener('click', this.__closeMenu);

        input.focus();

        //center on active item, if any
        if (model.value) {
          //handle non Id ones.

          if (model.value.id) {
            var li = list.refs[model.value.id];
            var elLi = li.getDOMNode(),
              mRect = elMenu.getBoundingClientRect();

            elMenu.scrollTop = elLi.offsetTop - (mRect.height * 0.5);
          } else {

            console.log('primitives', list.refs);
          }

        }

        return;
      }

      input.removeEventListener('keydown', this.__keystrokeNavigation);
      document.removeEventListener('click', this.__closeMenu);
      return;
    },
    render: function render() {

      //helpers
      var cx = React.addons.classSet,
        domx = React.DOM,
        model = this.props,
        row = 'w-12 w-alpha w-omega',
        key = model.id;

      //templating
      var labelProp = model.labelProp,
        isTemplate = _.contains(labelProp, '<%') || _.contains(labelProp, '%>'),
        labelTemplateString = isTemplate ? labelProp : '<%= ' + labelProp + '%>',
        labelTemplate = _.template(labelTemplateString);



      function toComboDataModel(d) {
        //TODO put template here.

        var cbModel = {
          label: d,
          value: d
        };

        if (_.isObject(d)) {
          cbModel.label = labelTemplate(d);

          if (d.id) {
            cbModel.id = d.id;
          }
        }

        return cbModel;
      }

      function byInputText(_d) {
        var label = (_d.label || '').toLowerCase(),
          val = (inputVal || '').toLowerCase();

        if (model.value) {
          return _d;
        }

        if (_.contains(label, val)) {
          return _d;
        }
      }

      var inputVal = this.state.inputVal || '';

      //sync models
      var outOfSync = model.value && !(this.__equals(model.value, this.state.value));

      if (outOfSync) {
        this.state.value = toComboDataModel(model.value);
        this.state.inputVal = this.state.value.label;
        inputVal = this.state.inputVal;
      }

      //build component
      var frameClasses = {
        'waffles': true,
        'ui-widget': true,
        'ui-combobox': true,
        'ui-corner-all': true
      };

      frameClasses = this.__applyUiStates.call(this, frameClasses);

      var frameAttrs = {
          className: cx(frameClasses),
        },
        labelFrameAttrs = {
          className: row
        },
        labelAttrs = {
          className: 'ui-combobox-label ui-state-default'
        },
        contentFrameAttrs = {
          className: row
        },
        buttonFrameAttrs = {
          className: 'ui-combobox-dropdownbutton-frame'
        },
        inputFrameAttrs = {
          className: 'ui-combobox-input-frame'
        },
        inputAttrs = {
          className: 'ui-combobox-input ui-state-default',
          disabled: model.disabled,
          ref: 'input',
          value: inputVal,
          onChange: this.__onInputChange,
          onFocus: this.__onInputFocus,
          onBlur: this.__onInputBlur
        };

      if (model.value && model.buttonScope.value) {
        inputAttrs.value = '';
      }

      var btnModel = {
        appearance: 'button',
        iconPrimary: model.iconPrimary || 'carat-1-s',
        uiState: model.uiState || 'default',
        value: model.buttonScope.value,
        scope: model.buttonScope,
        disabled: model.disabled,
        focusable: false
      };

      var label = domx.label(labelAttrs, model.label),
        labelFrame = domx.div(labelFrameAttrs, label),
        button = ui.Checkbox(btnModel),
        input = domx.input(inputAttrs),
        buttonFrame = domx.div(buttonFrameAttrs, button),
        inputFrame = domx.div(inputFrameAttrs, input),
        contentFrame = domx.div(contentFrameAttrs, [buttonFrame, inputFrame]);

      var contents = [
          labelFrame,
          contentFrame
      ];

      //add menu if present
      if (model.buttonScope.value) {

        //internal data list
        var _data = _
          .chain(model.data)
          .map(toComboDataModel)
          .filter(byInputText)
          .value();

        //todo memoize this, or
        //provide some option to
        var menuModel = {
          id: key + '_menu',
          data: _data || [],
          value: this.state.value,
          disabled: model.disabled,
          labelProp: 'label',
          scope: model.menuScope,
          uiState: model.uiState,
          ref: 'menu',
          name: key + '_menu',
          change: this.__onMenuChange,
          maxHeight: model.maxHeight,
          focusable: false,
          appearance: 'menuitem'
        };

        var menuframeAttrs = {
          ref: 'dropdown',
          className: 'ui-combobox-dropdown'
        };

        var menu = ui.Menu(menuModel),
          dropdown = domx.div(menuframeAttrs, menu);

        contents.push(dropdown);
      }

      var frame = domx.div(frameAttrs, contents);
      return frame;
    }
  });
}

module.exports = Combobox;

// <div data-ng-id="combobox" class="waffles ui-widget ui-combobox ui-corner-all">
//    <div class="w-12 w-alpha w-omega">
//        <div class="w-12 w-alpha w-omega" for="{{id}}_input">
//            <label class="ui-combobox-label" for="{{id}}_input">{{label}}</label>
//        </div>
//        <div class="w-12 w-alpha w-omega">
//            <div class="ui-combobox-dropdownbutton-frame">
//                <telui-button
//                        id="{{id}}_dropdownbutton"
//                        text="false"
//                        icon-primary="ui-icon-carat-1-s"
//                        class="ui-combobox-dropdownbutton"
//                        click="dropdownButton()"
//                        tabindex="-1"
//                        >
//                </telui-button>
//            </div>
//            <div class="ui-combobox-input-frame w-v-1">
//                <div
//                        id="{{id}}_placeholder_frame"
//                        class="ui-shim-placeholder-frame"
//                        data-ng-show="isEmpty"
//                        data-ng-click="focusInput()"
//                        data-role="placeholder"
//                        >
//                    <div id="{{id}}_placeholder" class="ui-shim-placeholder">{{placeholder}}</div>
//                </div>
//                <input id="{{id}}_input" class="ui-combobox-input"/>
//            </div>
//        </div>
//    </div>
//</div>