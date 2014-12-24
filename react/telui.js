//this file decorates the global ui object with all widgets in this package

global.UI = require('TelUI-Form');


global.UI.Mixins.Dropdown = require('./mixins/dropdown')(global.UI);


global.UI.Appearances.menuitem = require('./appearances/menuitem')(global.UI);

global.UI.Textbox = require('./widgets/textbox')(global.UI);
global.UI.Menu = require('./widgets/menu')(global.UI);

global.UI.Combobox = require('./widgets/combobox')(global.UI);

module.exports = global.UI;