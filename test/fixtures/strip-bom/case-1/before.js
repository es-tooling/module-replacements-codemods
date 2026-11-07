import stripBom from 'strip-bom';

const str = '\uFEFFfoo';
const result = stripBom(str);
