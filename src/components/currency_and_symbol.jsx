const currency_display_dictionary = { EUR: '€', USD: '$', RUB: '₽', GBP: '£', CNY: '¥', JPY: '¥', CHF: 'Fr' };
export const currency_symbol_converter = (currency) => {
  return currency_display_dictionary[currency];
};
