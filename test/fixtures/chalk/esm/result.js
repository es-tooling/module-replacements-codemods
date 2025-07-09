import pc from 'picocolors';

pc.red();
pc.red('im red');
pc.red(pc.bold('im red and bold'));
pc.red(`im a red template`);
pc.red(pc.bold(`im a red and bold template`));
pc.red(`im an interpolated ${val} template`);
pc.red(`i contain ${pc.bold('sub chalks')}`);
pc.red(`i contain ${pc.bold(`sub templates`)}`);
pc.red(`i contain chained ${pc.blue(pc.bold('sub chalks'))}`);
