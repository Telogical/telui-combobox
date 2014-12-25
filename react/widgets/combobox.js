var React = require('react/addons');

function Combobox(ui) {
  'use strict';
  return React.createClass({
    displayName: 'Combobox',
    mixins: [ui.Mixins.Widget],
    propTypes: {

    },
    getInitialState: function getInitialState() {
      return {
        id: '',
        label: ''
      };
    },
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

    componentDidUpdate: function componentDidUpdate() {

      function px(n) {
        return n + 'px';
      }

      if (this.refs.dropdown) {
        var input = this.refs.input.getDOMNode(),
          dropdown = this.refs.dropdown.getDOMNode(),
          iRect = input.getBoundingClientRect(),
          body = document.body,
          docEl = document.documentElement,
          scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop || 0,
          scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft || 0;

        dropdown.style.width = px(iRect.width);
        dropdown.style.top = px(iRect.top + iRect.height + scrollTop);
        dropdown.style.left = px(iRect.left + scrollLeft);
      }
    },
    render: function render() {
      var cx = React.addons.classSet,
        domx = React.DOM,
        model = this.props,
        row = 'w-12 w-alpha w-omega',
        key = model.id;

      console.log(model.id, model);

      var frameAttrs = {
          className: 'waffles ui-widget ui-combobox ui-corner-all',
        },
        labelFrameAttrs = {
          className: row
        },
        labelAttrs = {
          className: 'ui-combobox-label'
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
          className: 'ui-combobox-input',
          ref: 'input'
        };

      //model.buttonScope.value = model.open;
      //{
      //  id: id,
      //  label: scope.label,
      //  labelProp: scope.labelProp,
      //  iconPrimary: scope.iconPrimary,
      //  iconSecondary: scope.iconSecondary,
      //  cssClass: scope.cssClass,
      //  text: scope.text,
      //  disabled: scope.disabled,
      //  click: scope.click,
      //  value: scope.value,
      //  data: scope.data,
      //  name: scope.name,
      //  appearance: scope.appearance || 'checkbox',
      //  uiState: scope.state || '',
      //  scope: scope
      //}

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


      if (model.buttonScope.value) {
        //then stick a menu in a dropdown.

        console.log('data', model.data);
        var menuModel = {
          id: key + '_menu',
          data: model.data || [],
          disabled: model.disabled,
          labelProp: model.labelProp,
          scope: model.menuScope,
          state: model.state,
          ref: 'menu'
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