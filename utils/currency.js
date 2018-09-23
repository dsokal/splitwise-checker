import _ from 'lodash';

export function findAvailableCurrencies(members) {
  const currencyPopularities = members.reduce((acc, member) => {
    member.balance.forEach(({ currencyCode, amount }) => {
      if (!(currencyCode in acc)) {
        acc[currencyCode] = 0;
      }
      if (amount !== 0) {
        acc[currencyCode]++;
      }
    });
    return acc;
  }, {});
  const mostPopularCurrency = _.chain(Object.entries(currencyPopularities))
    .sort(currency => -currency[1])
    .head()
    .value()[0];
  return [Object.keys(currencyPopularities), mostPopularCurrency];
}

export function findCurrencyBalance(member, givenCurrencyCode) {
  const balance = member.balance.find(({ currencyCode }) => currencyCode === givenCurrencyCode);
  return (
    balance || {
      amount: 0,
      currencyCode: givenCurrencyCode,
    }
  );
}
