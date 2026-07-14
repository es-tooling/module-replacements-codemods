const { red, blue, bold } = require('chalk');

red();
red('im red');
red.bold('im red and bold');
red`im a red template`;
red.bold`im a red and bold template`;
red`im an interpolated ${val} template`;
red`i contain ${bold('sub chalks')}`;
red`i contain ${bold`sub templates`}`;
red`i contain chained ${blue.bold('sub chalks')}`;
