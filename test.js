const JitBitClass = require('./lib/JitBitClass');
const jitBit = new JitBitClass({ isTest: true, baseUrl: 'http://testing.com/api/' });
jitBit.getTickets({});
