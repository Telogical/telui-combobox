var React = require('react/addons');

function Textbox(ui) {
  'use strict';
  return React.createClass({
    displayName: 'Textbox',
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

      return domx.input();  
    }
  });
}

module.exports = Textbox;