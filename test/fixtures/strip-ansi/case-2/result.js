import { stripVTControlCharacters } from "node:util";

stripVTControlCharacters('\u001B[4mUnicorn\u001B[0m');
