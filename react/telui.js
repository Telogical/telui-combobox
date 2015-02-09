//global.UI = global.UI || require('@telogical/telui-core');
require('@telogical/telui-core');

global.UI.Combobox = require('./widgets/combobox')(global.UI);

module.exports = global.UI;