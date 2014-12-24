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

      return patrickDuffy;
    }
  });
}

module.exports = Menu;