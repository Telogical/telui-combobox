//think...shoudl this be an appearance of menuitem, yet a list of somethign else.

var React = require('react/addons');

function Menu(ui) {
  'use strict';
  return React.createClass({
    displayName: 'Menu',
    mixins: [ui.Mixins.Widget],
    propTypes: {

    },
    getInitialState: function getInitialState() {
      return {
        id: '',
        label: ''
      };
    },
    render: function render() {
      var cx = React.addons.classSet,
        domx = React.DOM,
        model = this.props,
        row = 'w-12 w-alpha w-omega';

      var patrickDuffy = domx.img({
        src: 'http://i.imgur.com/bpSm4Xe.jpg'
      });


      var menuFrameClasses = {
        'ui-widget': true,
        'ui-menu': true,
        'ui-list-menuitem': true
      };

      var menuAttrs = {
        data: model.data,
        appearance: 'menuitem',
        labelProp: model.labelProp,
        scope: model.menuScope
      };

      var menuAttrs = {
        id: model.id + '_list',
        label: '',
        labelProp: model.labelProp,
        uiState: model.state,
        uiStateProp: model.stateProp,
        iconPrimary: model.iconPrimary,
        iconSecondary: model.iconSecondary,
        cssClass: model.cssClass,
        text: true,
        disabled: model.disabled,
        click: model.click,
        value: model.scope.value,
        data: model.data,
        name: model.name,
        appearance: 'menuitem',
        orientation:  'vertical',
        scope: model.scope
      };

      var menuFrameAttrs = {
        id: model.id,
        className: cx(menuFrameClasses),
        componentWidth: '100px'
      };

      var menu = ui.Radiogroup(menuAttrs);
      var menuframe = domx.div(menuFrameAttrs, menu);

      return menuframe;
    }
  });
}

module.exports = Menu;