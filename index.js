(function() {
  var tradeMath = (function() {
    return {

      riskReward: function riskReward(entry, exit, stop) {
        if (!entry || !exit || !stop) return 0;
        return Math.round(((exit - entry) / (entry - stop)) * 100) / 100;
      },

      positionSize: function positionSize(balance, riskPercent, entryPrice, stopPrice, entryFeeRate, exitFeeRate, inverse, precision=1) {
        if (!balance || !riskPercent || !entryPrice || !stopPrice || !entryFeeRate) return 0;
        const d = entryPrice > stopPrice ? -1 : 1;
        return Math.floor(
          (
            (balance * riskPercent/100)
            /
            (d/entryPrice - d/stopPrice + entryFeeRate/entryPrice + exitFeeRate/stopPrice)

          )/(!!inverse?1:entryPrice*entryPrice) * (1/precision)
        )/(1/precision);
      },

      avgPrice: function avgPrice(q1, p1, q2, p2) {
        if (!q1 || !q2 || !p2) return p1;
          return Math.round(((q1 + q2) / (q1 / p1 + q2 / p2)) * 100) / 100;
      },

      riskPercent: function riskPercent(balance, qty, entryPrice, exitPrice, inverse) {
        qty = !!inverse ? qty : qty * entryPrice;
        return Math.round((100/balance)*Math.abs((qty/entryPrice)-(qty/exitPrice))*100)/100;
      },

      breakEvenPrice: function breakEvenPrice(direction, total_qty, entry_price, fees, exitFeeRate) {
      let be =
          direction === "short"
            ? (1-exitFeeRate) / (1 / entry_price + fees / total_qty)
            : (1+exitFeeRate) / (1 / entry_price - fees / total_qty);
        return Math.round(be * 100) / 100;
      },

      fixed8: function fixed8(number) {
        return Math.floor(number * 100000000) / 100000000;
      }
    }
  })();

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = tradeMath;
  else
    window.tradeMath = tradeMath;
})();
