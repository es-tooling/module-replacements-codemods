import fs from 'fs';
import crypto from "crypto";

fs.readFile('example.txt', function (err, buf) {
    console.log(crypto.createHash("md5").update(buf).digest("hex"));
});