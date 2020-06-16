const robotest = require('./robotest');

test('Create a robot with a given name', () => {
  expect(robotest('TestRobot')).toBe('TestRobot');
});