import fs from 'fs';
import md5 from 'md5';

fs.readFile('example.txt', function (err, buf) {
    console.log(md5(buf));
});