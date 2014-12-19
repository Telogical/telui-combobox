//this file decorates the global ui object with all widgets in this package

global.UI = require('TelUI-Form');
global.UI.Combobox = require('./widgets/combobox')(global.UI);
module.exports = global.UI;