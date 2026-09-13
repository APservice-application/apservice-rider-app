const fs = require('fs');
const path = require('path');
const vm = require('vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'rider', 'rider-app.js'), 'utf8');
const coreSource = fs.readFileSync(path.join(__dirname, '..', 'shared', 'ap-service-core.js'), 'utf8');
const context = { window: {} };
vm.createContext(context);
vm.runInContext(coreSource, context);
const core = context.window.APServiceCore;
const status = core.contracts.orderStatus;
const checks = [
  ['queries unassigned jobs', source.includes('rider_id=is.null')],
  ['limits available jobs to contract-eligible statuses', source.includes('claimableStatuses') && source.includes('STORE_ACCEPTED') && source.includes('PREPARING')],
  ['uses server-side atomic claim operation to prevent a double claim', source.includes("updateRiderDelivery('claim'") && source.includes("action: 'update_rider_delivery'")],
  ['sets rider identity during claim', source.includes('rider_name: ctx.rider.name')],
  ['moves claimed work to rider pickup according to shared contract', source.includes('C.contracts.orderStatus.RIDER_PICKUP') && source.includes("actor: 'rider'")],
  ['checks server claim returned an order row', source.includes('!claimed?.id')],
  ['shared contract holds orders for admin review first', status.ADMIN_REVIEW === 'รอแอดมินตรวจสอบ'],
  ['orders under admin review are never listed as claimable', !source.includes('ADMIN_REVIEW')],
  ['rider cannot pick up an order still under admin review', core.order.canTransition({ from: status.ADMIN_REVIEW, to: status.RIDER_PICKUP, actor: 'rider' }).ok === false],
  ['merchant cannot advance an order still under admin review', core.order.canTransition({ from: status.ADMIN_REVIEW, to: status.PREPARING, actor: 'merchant' }).ok === false],
];

let failed = false;
for (const [label, passed] of checks) {
  console.log(`${passed ? 'PASS' : 'FAIL'}: ${label}`);
  failed ||= !passed;
}
if (failed) process.exit(1);
console.log('Rider available-job claim contract: PASS');
