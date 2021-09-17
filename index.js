(function() {
  const round = function round(amount, precision = 0.01) {
    precision = precision <= 1 ? precision : 1/Math.pow(10, precision);
    return Math.round(amount * 1/precision)/(1/precision);
  };

  const floor = function floor(amount, precision = 0.01) {
    precision = precision <= 1 ? precision : 1/Math.pow(10, precision);
    return Math.floor(amount * 1/precision)/(1/precision);
  };

  var tradeMath = (function() {
    return {
      round,
      floor,

      // R-Multiple for a trade. How many units risked will be rewarded if targets are met.
      riskReward: function riskReward(entry, exit, stop) {
        if (!entry || !exit || !stop) return 0;
        return round((exit - entry) / (entry - stop));
      },

      // Returns the amount of contracts for a given percentual risk from an starting balance
      // How many contracts should be bought/sell in order to risk a specified percentage of the initial balance
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

      // Returns the percent of a balance that is at risk, given a position size and entry and exit parameters
      riskPercent: function riskPercent(balance, qty, entryPrice, stopPrice, entryFeeRate, exitFeeRate, inverse) {
        if (!inverse) {
          qty = qty * entryPrice;
          balance = balance / entryPrice;
        }
        const d = entryPrice > stopPrice ? -1 : 1;
        const risk =
          qty
          *
          (
            d/entryPrice
            - d/stopPrice
            + entryFeeRate/entryPrice
            + exitFeeRate/stopPrice
          );
        return round((100/balance)*risk);
      },

      // Returns the amout of capital at risk given a position size and entry and stop parameters
      // This is the amount of collateral that would be lost if a stop is met
      initialRisk: function initialRisk(positionSize, entryPrice, stopPrice, entryFeeRate, exitFeeRate, inverse, precision=1) {
        if (!positionSize || !entryPrice || !stopPrice || !entryFeeRate || !exitFeeRate)
          return 0;
        const d = entryPrice > stopPrice ? -1 : 1;
        let r =
          positionSize
          *
          (
            d/entryPrice
            - d/stopPrice
            + entryFeeRate/entryPrice
            + exitFeeRate/stopPrice
          );
        if (!inverse)
          r = r * entryPrice;
        return round(r, precision);
      },

      // volume adjusted average price
      // useful to calculate average entry and average exit prices
      avgPrice: function avgPrice(q1, p1, q2, p2) {
        if (!q1 || !q2 || !p2) return p1;
        return round(((q1 + q2) / (q1 / p1 + q2 / p2)));
      },

      // price at which the position can be closed without profits or losses, including fees
      breakEvenPrice: function breakEvenPrice(direction, total_qty, entry_price, fees, exitFeeRate, inverse = false) {
        if (!inverse) {
          total_qty *= entry_price;
          fees /= entry_price;
        }
        const be = 
          round(
            direction === "short"
              ? (1-exitFeeRate) / (1 / entry_price + fees / total_qty)
              : (1+exitFeeRate) / (1 / entry_price - fees / total_qty)
          );
        return be;
      },

      // return on investment; fees must include all trading and funding fees
      roi: function roi(pnl, investment, fees = 0) {
        if (isNaN(pnl) || !investment) return 0;
        return round(pnl/(investment+fees)*100);
      },

      gainLossPercent: function gainLossPercent(initialBalance, pnl) {
        if (!initialBalance || isNaN(pnl)) return 0;
        const finalBalance = initialBalance + pnl;
        return round(100*(finalBalance/initialBalance - 1));
      },

      // Risk of Ruin (method by R.Vince)
      riskOfRuin: function riskOfRuin(maxRisk, winp, avgWin, avgLoss, initialCapital) {
        if (!maxRisk || !winp || !avgWin || !avgLoss || !initialCapital) return NaN;
        const avgWinP = avgWin/initialCapital;
        const avgLossP = avgLoss/initialCapital;
        const lossp = 1-winp;
        const Z = winp * avgWinP - Math.abs(lossp * avgLossP);
        const A = Math.pow(winp * Math.pow(avgWinP, 2) + Math.abs( lossp * Math.pow(avgLossP, 2) ), 0.5);
        const P = 0.5*(1+Z/A);
        const RoR = Math.pow((1-P)/P, (maxRisk/A));
        return RoR;
      }
    }
  })();

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = tradeMath;
  else
    window.tradeMath = tradeMath;
})();
