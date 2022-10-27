const cpbCurrency = document.querySelector('#edit-cpb-currency');
const cpbCurrencyPopup = document.querySelector('#edit-cpb-currency-popup');
const cpbCurrencyDefault = document.querySelector('input[name="cpb_currency_default"]');

if (typeof cpbCurrency !== 'undefined' && cpbCurrency && cpbCurrencyPopup) {
  cpbCurrency.addEventListener('change', (e) => {
    const defaultCurrency = e.target.value;
    Array.from(cpbCurrencyPopup.children).map(group => {
      let item = group.children[0];
      if (item.disabled) {
        item.disabled = false;
      }
      if (item.value === defaultCurrency) {
        item.checked = true;
        item.disabled = true;
        cpbCurrencyDefault.value = item.value;
      }
    });
    //cpbCurrencyPopup;
  });
}