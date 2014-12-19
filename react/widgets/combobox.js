var React = require('react/addons');


function Combobox(ui) {
  'use strict';

  return React.createClass({
    displayName: 'Button',
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




    render: function render() {
      var cx = React.addons.classSet,
        domx = React.DOM,
        model = this.props,
        row = 'w-12 w-alpha w-omega';

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
          className: 'ui-combobox-input'
        };

      var btnModel = {
        appearance: 'button',
        iconPrimary: model.iconPrimary || 'carat-1-s',
        uiState: model.uiState || 'default',
        scope: {
          value: true,
          //$apply: model.scope.$apply
        }
      };

      var label = domx.label(labelAttrs, model.label),
        labelFrame = domx.div(labelFrameAttrs, label),
        button = ui.Checkbox(btnModel),
        input = domx.input(inputAttrs),
        buttonFrame = domx.div(buttonFrameAttrs, button),
        inputFrame = domx.div(inputFrameAttrs, input),
        contentFrame = domx.div(contentFrameAttrs, [buttonFrame, inputFrame]),
        frame = domx.div(frameAttrs, [labelFrame, contentFrame]);

      return frame;
    }
  });
}

module.exports = Combobox;