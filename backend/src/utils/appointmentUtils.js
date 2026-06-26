// Used in unit tests — pure logic, no DB dependency
function hasConflict(newStart, newEnd, existingSlots) {
  return existingSlots.some(slot =>
    newStart < slot.end_time && newEnd > slot.start_time
  );
}

module.exports = { hasConflict };