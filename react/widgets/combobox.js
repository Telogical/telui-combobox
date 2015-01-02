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
    __closeMenu: function closeMenu(eve) {
      var inputNode = this.refs.input.getDOMNode(),
        menuNode = this.refs.menu.getDOMNode();

      var isCombo = eve.target === inputNode || eve.target === menuNode;

      console.log(eve.target === inputNode, eve.target === menuNode);

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
      console.log('focus');
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
        model = this.props;

      if (this.refs.dropdown) {
        var input = this.refs.input.getDOMNode(),
          dropdown = this.refs.dropdown.getDOMNode(),
          menu = this.refs.menu.getDOMNode(),
          //list = this.refs.menu.list.getDOMNode(),  
          iRect = input.getBoundingClientRect(),
          docEl = document.documentElement,
          scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop || 0,
          scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft || 0;

        dropdown.style.width = this._toPx(iRect.width);
        dropdown.style.top = this._toPx(iRect.top + iRect.height + scrollTop);
        dropdown.style.left = this._toPx(iRect.left + scrollLeft);
        input.focus();

        //console.log('list', list);
        document.addEventListener('click', this.__closeMenu);
      } else {
        document.removeEventListener('click', this.__closeMenu);
      }
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
          label: labelTemplate(d),
          value: d
        };

        if (d.id) {
          cbModel.id = d.id;
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
        disabled: model.disabled
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
          state: model.state,
          ref: 'menu',
          name: key + '_menu',
          change: this.__onMenuChange,
          maxHeight: model.maxHeight
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