function Combobox(ui) {
  'use strict';

  var React = ui.Core.React,
    _ = ui.Core._;

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

      var eve = (eve || window.event);

      var up = eve.which === 38,
        down = eve.which === 40,
        enter = eve.which === 13,
        tab = eve.which === 9,
        menu = this.refs.menu,
        list = menu.refs.list,
        elMenu = menu.getDOMNode();

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
    },

    __openMenu: function openMenu(eve) {

      var alphanum = eve.which > 47 && eve.which < 91,
        upDown = eve.which === 40 || eve.which === 38,
        backDel = eve.which === 8 || eve.which === 46,
        extAlpha = eve.which > 185 && eve.which < 223,
        legitKeystroke = (alphanum || upDown || backDel || extAlpha);

      //be more explicit
      if (!legitKeystroke) {
        return;
      }

      var model = this.props;

      this.setState({
        inputVal: ''
      });

      model.buttonScope.value = true;
      model.buttonScope.$apply();
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
        inputVal: eve.target.value || ''
      });
    },

    __clear: function clear() {
      var model = this.props;

      this.setState({
        value: null,
        inputVal: ''
      });

      model.scope.$apply(function (scope) {
        scope.value = null;
      });

      this
        .refs
        .input
        .getDOMNode()
        .focus();
    },
    __onInputFocus: function () {

    },
    __onInputBlur: function () {
      this.props.buttonScope.value = false;
    },
    __onMenuChange: function onMenuChange(value) {
      var model = this.props;

      this.setState({
        value: value,
        inputVal: value.label
      });

      model.scope.$apply(function (scope) {
        scope.value = value.value;
      });

      this.refs.input.getDOMNode().focus();
    },

    __centerMenuValue: function (value) {

      if (!value) {
        return;
      }

      function byValue(ref) {
        if (ref.props.value && value === ref.props.value.value) {
          return ref;
        }
      }

      var menu = this.refs.menu,
        list = menu.refs.list,
        elMenu = menu.getDOMNode();

      var li = (value.id) ?
        list.refs[value.id] :
        _.find(list.refs, byValue);

      if (li) {
        var elLi = li.getDOMNode(),
          mRect = elMenu.getBoundingClientRect();
        elMenu.scrollTop = elLi.offsetTop - (mRect.height * 0.5);
      }

    },

    _positionMenu: function positionMenu(elDropdown, elInput, fitsOnScreen, bottomHalf) {

      var goUp = !fitsOnScreen && bottomHalf,
        inputOffset = this.__offset(elInput),
        dropDownOffset = this.__offset(elDropdown);

      elDropdown.style.left = this._toPx(inputOffset.left);
      elDropdown.style.width = this._toPx(inputOffset.width);
      
      var upwards =inputOffset.top - dropDownOffset.height,
          downwards = inputOffset.top + inputOffset.height;
      
      elDropdown.style.top = goUp ?
        this._toPx(upwards) :
        this._toPx(downwards);

    },
    componentDidUpdate: function componentDidUpdate() {
      var model = this.props,
        elInput = this.refs.input.getDOMNode(),
        dropdown = this.refs.dropdown;

      if (!dropdown) {
        elInput.addEventListener('keydown', this.__openMenu);
        elInput.removeEventListener('keydown', this.__keystrokeNavigation);
        document.removeEventListener('click', this.__closeMenu);
        return;
      }

      var elDropdown = dropdown.getDOMNode(),
        elMenu = this.refs.menu.getDOMNode();

      var viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
        inputTop = elInput.getBoundingClientRect().top,
        elDropdownHeight = elDropdown.offsetHeight,
        inputBlock = inputTop + elInput.offsetHeight;

      var fitsOnScreen = viewportHeight > (inputBlock + elDropdownHeight),
        bottomHalf = inputBlock > (viewportHeight * 0.5);

      //positioning
      this._positionMenu(elDropdown, elInput, fitsOnScreen, bottomHalf);

      var clearSide = fitsOnScreen ?
        'borderTopWidth' :
        'borderBottomWidth';
      elMenu.style[clearSide] = '0'; //clear the menu side so it looks liek its coming out of the box.


      //eventing
      elInput.addEventListener('keydown', this.__keystrokeNavigation);
      elInput.removeEventListener('keydown', this.__openMenu);
      document.addEventListener('click', this.__closeMenu);

      elInput.focus();
      this.__centerMenuValue(model.value);

      return;
    },
    render: function render() {

      //helpers
      var cx = React.addons.classSet,
        domx = React.DOM,
        model = this.props,
        row = 'w-12 w-alpha w-omega',
        key = model.id,
        isClearable = model.clearable,
        inputVal;

      //templating
      var labelProp = model.labelProp,
        isTemplate = _.contains(labelProp, '<%') || _.contains(labelProp, '%>'),
        labelTemplateString = isTemplate ? labelProp : '<%= ' + labelProp + '%>',
        labelTemplate = _.template(labelTemplateString);

      function toComboDataModel(d) {
        var cbModel = {
          label: _.isObject(d) ? labelTemplate(d) : d,
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

        if (_.contains(label, val)) {
          return _d;
        }
      }

      this.state.value = this.state.value || {};

      var outOfSync = model.value && !(this.__equals(model.value, this.state.value.value));

      if (outOfSync) {
        this.state.value = toComboDataModel(model.value);
      }

      if (model.buttonScope.value) {
        inputVal = this.state.inputVal || '';
      } else {

        this.state.inputVal = '';
        inputVal = this.state.value ? this.state.value.label : '';
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
          value: inputVal || '',
          onChange: this.__onInputChange,
          onFocus: this.__onInputFocus,
          onBlur: this.__onInputBlur
        };

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
        inputRow = [buttonFrame, inputFrame];

      if (model.value) {
        inputRow = [buttonFrame];

        if (isClearable) {
          var xFrameAttrs = {
              className: 'ui-combobox-closeicon-frame'
            },
            xIconAttrs = {
              className: 'ui-state-default ui-icon ui-icon-close ui-combobox-closeicon',
              onClick: this.__clear
            };

          var xIcon = domx.span(xIconAttrs, ''),
            xFrame = domx.div(xFrameAttrs, xIcon);

          inputRow.push(xFrame);
        }

        inputRow.push(inputFrame);
      }
      var contentFrame = domx.div(contentFrameAttrs, inputRow);

      var contents = [
          labelFrame,
          contentFrame
      ];

      if (model.buttonScope.value) {

        var _data = _
          .chain(model.data)
          .map(toComboDataModel)
          .filter(byInputText)
          .value();

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

      return domx.div(frameAttrs, contents);
    }
  });
}

module.exports = Combobox;