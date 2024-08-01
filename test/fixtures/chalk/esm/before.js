import ch from 'chalk';

ch.red();
ch.red('im red');
ch.red.bold('im red and bold');
ch.red`im a red template`;
ch.red.bold`im a red and bold template`;
ch.red`im an interpolated ${val} template`;
ch.red`i contain ${ch.bold('sub chalks')}`;
ch.red`i contain ${ch.bold`sub templates`}`;
ch.red`i contain chained ${ch.blue.bold('sub chalks')}`;
