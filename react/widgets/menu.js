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




      //temporary....



      function toMenuitem(d) {

        console.log(d)

        var menuitemModel = {
          label: d[model.labelProp],
          text: true,
          appearance: 'menuitem',
          disabled: model.diabled
        };

        return ui.Button(menuitemModel);
      }



      var menulist = model.data.map(toMenuitem);

      var menuClasses = {
        'ui-widget': true,
        'ui-menu': true,
        'ui-list-menuitem': true
      };

      var menuAttrs = {
        className: cx(menuClasses)
      };

      var menu = domx.ul(menuAttrs, menulist);

      return menu;
    }
  });
}

module.exports = Menu;