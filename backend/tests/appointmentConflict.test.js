const { hasConflict } = require('../src/utils/appointmentUtils');

const existing = [
  { start_time: '09:00', end_time: '09:30' },
  { start_time: '11:00', end_time: '11:30' },
];

describe('hasConflict', () => {
  it('detects overlap', () => {
    expect(hasConflict('09:15', '09:45', existing)).toBe(true);
  });
  it('allows non-overlapping slot', () => {
    expect(hasConflict('10:00', '10:30', existing)).toBe(false);
  });
  it('catches exact boundary collision', () => {
    expect(hasConflict('09:00', '09:30', existing)).toBe(true);
  });
  it('allows slot immediately after an existing one', () => {
    expect(hasConflict('09:30', '10:00', existing)).toBe(false);
  });
});