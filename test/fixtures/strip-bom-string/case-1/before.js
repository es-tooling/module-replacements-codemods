import stripBom from 'strip-bom-string';

const str = '\uFEFFfoo';
const result = stripBom(str);
