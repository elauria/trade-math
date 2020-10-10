(function() {
  const round = function round(amount, precision = 1) {
    precision = precision <= 1 ? precision : 1/Math.pow(10, precision);
    return Math.round(amount * 1/precision)/(1/precision);
  };

  const floor = function floor(amount, precision = 1) {
    precision = precision <= 1 ? precision : 1/Math.pow(10, precision);
    return Math.floor(amount * 1/precision)/(1/precision);
  };

  var tradeMath = (function() {
    return {
      round,
      floor,

      riskReward: function riskReward(entry, exit, stop) {
        if (!entry || !exit || !stop) return 0;
        return round((exit - entry) / (entry - stop), 0.01);
      },

      positionSize: function positionSize(balance, riskPercent, entryPrice, stopPrice, entryFeeRate, exitFeeRate, inverse, precision=1) {
        if (!balance || !riskPercent || !entryPrice || !stopPrice || !entryFeeRate) return 0;
        const d = entryPrice > stopPrice ? -1 : 1;
        let ps =
          (
            balance
            *
            riskPercent/100
          )
          /
          (
            d/entryPrice
            - d/stopPrice
            + entryFeeRate/entryPrice
            + exitFeeRate/stopPrice
          );
        if (!inverse)
          ps = ps / (entryPrice*entryPrice);
        return floor(ps, precision);
      },

      avgPrice: function avgPrice(q1, p1, q2, p2) {
        if (!q1 || !q2 || !p2) return p1;
        return round(((q1 + q2) / (q1 / p1 + q2 / p2)), 0.01);
      },

      riskPercent: function riskPercent(balance, qty, entryPrice, exitPrice, inverse) {
        if (!inverse) {
          qty = qty * entryPrice;
          balance = balance / entryPrice;
        }
        return round((100/balance)*Math.abs((qty/entryPrice)-(qty/exitPrice)), 0.01);
      },

      breakEvenPrice: function breakEvenPrice(direction, total_qty, entry_price, fees, exitFeeRate) {
      let be =
          direction === "short"
            ? (1-exitFeeRate) / (1 / entry_price + fees / total_qty)
            : (1+exitFeeRate) / (1 / entry_price - fees / total_qty);
        return round(be, 0.01);
      },
    }
  })();

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = tradeMath;
  else
    window.tradeMath = tradeMath;
})();
