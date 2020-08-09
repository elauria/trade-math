(function() {
  var tradeMath = (function() {
    return {

      riskReward: function riskReward(entry, exit, stop) {
        if (!entry || !exit || !stop) return 0;
        return Math.round(((exit - entry) / (entry - stop)) * 100) / 100;
      },

      qty: function qty(direction, balance, risk_percent, entry, stop, entry_fee_rate, exit_fee_rate, inverse = false) {
        if (!direction || !balance || !risk_percent || !entry || !stop || !entry_fee_rate || !exit_fee_rate) {
          console.error(new Error('missing parameters for qty'));
          return 0;
        }  
        const l = direction === 'long' ? 1 : -1;
        const risk = balance * risk_percent/100;
        const fees = entry_fee_rate/100 / entry + exit_fee_rate/100 /stop;
        return (
          Math.round(
            Math.abs(
              risk
              /
              (
                (l/stop - l/entry + fees) * (inverse ? 1 : entry)
              )
            ) 
          ) || 0
        );
      },

      activeRisk: function activeRisk(balance, entry, stop, qty) {
        return (
          Math.round((10000 * (qty * Math.abs(1 / stop - 1 / entry))) / balance) /
            100 || 0
        );
      },

      avgPrice: function avgPrice(q1, p1, q2, p2) {
        if (!q1 || !q2 || !p2) return p1;
          return Math.round(((q1 + q2) / (q1 / p1 + q2 / p2)) * 100) / 100;
      },

      riskPercent: function riskPercent(balance, qty, entry, stop) {
        if (qty === 0) return 0;
        if (balance && qty && entry && stop) {
          var rp = (qty * Math.abs(1 / stop - 1 / entry)) / balance;
          return Math.round(rp * 10000) / 100;
        }
      },

      breakEvenPrice: function breakEvenPrice(direction, total_qty, entry_price, fees) {
      let be =
          direction === "short"
            ? 0.99925 / (1 / entry_price + fees / total_qty)
            : 1.00075 / (1 / entry_price - fees / total_qty);
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
