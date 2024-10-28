const assert = require('node:assert');
const tm = require('.')

const tests = [
    [tm.round(3.151416),            '3.15'],
    [tm.round(46, 0.1),             '46.0'],
    [tm.round(0.0018234, 0.001),    '0.002'],
    [tm.round(0.0018234, 1),        '0'],
    [tm.round(1350, 100),           '1400'],
    [tm.round(0.994275, 4),         '0.9943']
]

tests.map(([a, e], i) => {
    try {
        assert.equal(a, e, `Failed at ${i}, actual: ${a}, expected: ${e}`);
    } catch (err) {
        console.error(`Error:`, err.message);
    }
});