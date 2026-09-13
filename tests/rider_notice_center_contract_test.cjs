const fs = require('fs');
const assert = require('assert');

const css = fs.readFileSync('shared/ap-service-mpa.css', 'utf8');
const runtime = fs.readFileSync('shared/ap-service-mpa.js', 'utf8');
const entry = fs.readFileSync('rider/dashboard.html', 'utf8');

assert.match(css, /\.mpa-toast\{position:fixed;z-index:100000;inset:0;margin:auto/, 'แจ้งเตือนไรเดอร์ต้องอยู่กลางจอเลเยอร์หน้าสุด');
assert.match(css, /\.mpa-toast\.error\{background:linear-gradient\(145deg,#9f3041/, 'ผิดพลาดต้องเป็นสีแดง');
assert.match(css, /\.mpa-toast\.warning\{background:linear-gradient\(145deg,#96630b/, 'เตือนต้องเป็นสีส้ม');
assert.match(css, /translateY\(-52px\)/, 'ไรเดอร์ต้องมีเอกลักษณ์ดิ่งลงจากด้านบนแบบความเร็ว');
assert.match(css, /@keyframes mpa-toast-icon-rush/, 'ไอคอนต้องพุ่งเข้าจากด้านข้าง');
assert.match(css, /@keyframes mpa-toast-exit/, 'ต้องมีอนิเมชันขาออก');
assert.match(css, /prefers-reduced-motion/, 'ต้องเคารพการตั้งค่าลดอนิเมชัน');
assert.match(runtime, /is-leaving/, 'runtime ต้องเล่นอนิเมชันออกก่อนซ่อน');
assert.match(entry, /rider-ui-v4-notice-center/, 'ทุกหน้าต้องโหลดชุดแจ้งเตือนรุ่นใหม่');

console.log('rider notice center contract: PASS');
