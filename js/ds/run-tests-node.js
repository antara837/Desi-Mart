import { runDsTests } from './tests.js';

console.log('Running Node.js Data Structure Tests...');
const success = runDsTests();
if (success) {
  console.log('✅ ALL DS TESTS PASSED SUCCESSFULLY!');
  process.exit(0);
} else {
  console.error('❌ SOME DS TESTS FAILED!');
  process.exit(1);
}
