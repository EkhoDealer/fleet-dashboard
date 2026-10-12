/**
 * Validates a Vehicle Identification Number (VIN).
 * Standard VINs are exactly 17 characters and exclude letters I, O, Q.
 */
function isValidVin(vin) {
  if (!vin || typeof vin !== 'string') return false;
  if (vin.length !== 17) return false;

  const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
  return vinRegex.test(vin.toUpperCase());
}

module.exports = { isValidVin };
