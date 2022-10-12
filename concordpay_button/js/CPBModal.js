/**
 * ConcordPay Button Modal class.
 */
class CPBModal {

  static cpbModeNone = 'none';
  static cpbModePhone = 'phone';
  static cpbModeEmail = 'email';
  static cpbModePhoneEmail = 'phone_email';
  static cpbApi = 'https://pay.concord.ua/api/';
  static cpbCurrencies = ['UAH', 'USD', 'EUR'];

  /**
   * Constructor method.
   * @constructor
   */
  constructor()
  {
    this._popup = ".cpb-popup";
    this._popupClass = ["cpb-popup"];
    this.mode = '';
  }

  /**
   * Mode setter.
   *
   * @param mode
   * @returns {boolean}
   */
  setMode(mode)
  {
    if (typeof mode === 'string' && mode.trim() !== '') {
      this.mode = mode.trim();
      return true;
    }
    return false;
  }

  /**
   * Render popup window.
   */
  render() {
    this.setMode(this.mode);

    // Check existing modal form.
    const isHasModal = document.querySelector('#cpb_popup');
    if (isHasModal) {
      return;
    }

    const cpbPopup = document.createElement('div');
    this._popupClass.map(cssClass => cpbPopup.classList.add(cssClass));
    cpbPopup.id = 'cpb_popup';

    const cpbPopupBody = document.createElement('div');
    cpbPopupBody.classList.add('cpb-popup-body');

    const cpbPopupContent = document.createElement('div');
    cpbPopupContent.classList.add('cpb-popup-content');

    // Modal window close cross.
    const cpbPopupClose = document.createElement('a');
    cpbPopupClose.classList.add('cpb-popup-close');
    cpbPopupClose.href = '';
    cpbPopupClose.id = 'cpb-popup-close';

    const cpbPopupCloseCross = document.createElement('span');
    cpbPopupCloseCross.textContent = '×';
    cpbPopupClose.appendChild(cpbPopupCloseCross);

    const cpbPopupTitle = document.createElement('div');
    cpbPopupTitle.classList.add('cpb-popup-title');
    cpbPopupTitle.textContent = Drupal.t('Buyer info');

    const cpbCheckoutForm = document.createElement('form');
    cpbCheckoutForm.classList.add('cpb-checkout-form');
    cpbCheckoutForm.action = '';
    cpbCheckoutForm.id = 'cpb_checkout_form';

    // Product info fields.
    const cpbProductName = document.createElement('input');
    cpbProductName.classList.add('js-cpb-product-name');
    cpbProductName.type = 'hidden';
    cpbProductName.name = 'cpb_product_name';
    cpbProductName.value = '';

    const cpbProductPrice = document.createElement('input');
    cpbProductPrice.classList.add('js-cpb-product-price');
    cpbProductPrice.type = 'hidden';
    cpbProductPrice.name = 'cpb_product_price';
    cpbProductPrice.value = '';

    const cpbPopupFooter = document.createElement('div');
    cpbPopupFooter.classList.add('cpb-popup-footer');

    const cpbPopupSubmit = document.createElement('button');
    cpbPopupSubmit.classList.add('cpb-popup-submit', 'button', 'js-cpb-popup-submit');
    cpbPopupSubmit.id = 'cpb_popup_submit';
    cpbPopupSubmit.type = 'submit';

    const cpbPopupSubmitImage = document.createElement('img');
    cpbPopupSubmitImage.src = '/modules/custom/concordpay_button/images/logo.svg';
    cpbPopupSubmitImage.alt = 'ConcordPay';

    const cpbPopupSubmitSpan = document.createElement('span');
    cpbPopupSubmitSpan.textContent = Drupal.t('Pay Order');

    cpbPopupSubmit.appendChild(cpbPopupSubmitImage);
    cpbPopupSubmit.appendChild(cpbPopupSubmitSpan);
    cpbPopupFooter.appendChild(cpbPopupSubmit);

    // Append Modal to body.
    cpbPopupContent.appendChild(cpbPopupClose);
    cpbPopupContent.appendChild(cpbPopupTitle);

    if (this.mode !== CPBModal.cpbModeNone) {
      cpbCheckoutForm.appendChild(
        this.renderClientField('name', Drupal.t('Name'), Drupal.t('Enter your name'))
      );
    }
    if (this.mode === CPBModal.cpbModePhone || this.mode === CPBModal.cpbModePhoneEmail) {
      cpbCheckoutForm.appendChild(
        this.renderClientField('phone', Drupal.t('Phone'), Drupal.t('Your contact phone'))
      );
    }
    if (this.mode === CPBModal.cpbModeEmail || this.mode === CPBModal.cpbModePhoneEmail) {
      cpbCheckoutForm.appendChild(
        this.renderClientField('email', Drupal.t('Email'), Drupal.t('Your email'))
      );
    }

    cpbCheckoutForm.appendChild(
      this.renderClientField('amount', Drupal.t('Amount'), Drupal.t('Your prefer amount'))
    );

    cpbCheckoutForm.appendChild(cpbProductName);
    cpbCheckoutForm.appendChild(cpbProductPrice);
    cpbCheckoutForm.appendChild(cpbPopupFooter);

    cpbPopupContent.appendChild(cpbCheckoutForm);

    cpbPopupBody.appendChild(cpbPopupContent);
    cpbPopup.appendChild(cpbPopupBody);
    document.body.appendChild(cpbPopup);
  }

  /**
   * Create input field group.
   *
   * @param field
   * @param label
   * @param description
   * @returns {HTMLDivElement}
   */
  renderClientField(field, label, description)
  {
    const cpbPopupInputGroup = document.createElement('div');
    cpbPopupInputGroup.classList.add('cpb-popup-input-group');

    const cpbPopupLabel = document.createElement('label');
    cpbPopupLabel.classList.add('cpb-popup-label');
    cpbPopupLabel.htmlFor = `cpb_client_${field}`;
    cpbPopupLabel.textContent = Drupal.t(label);

    const cpbClientField = document.createElement('input');
    cpbClientField.classList.add('cpb-popup-input', `js-cpb-client-${field}`);
    cpbClientField.type = 'text';
    cpbClientField.name = `cpb_client_${field}`;
    cpbClientField.id = `cpb_client_${field}`;
    cpbClientField.value = '';

    const cpbClientFieldDescription = document.createElement('div');
    cpbClientFieldDescription.classList.add('cpb-popup-description');
    cpbClientFieldDescription.textContent = Drupal.t(description);

    const cpbErrorField = document.createElement('div');
    cpbErrorField.classList.add(`js-cpb-error-${field}`);

    [cpbPopupLabel, cpbClientField, cpbClientFieldDescription, cpbErrorField].map(
      el => cpbPopupInputGroup.appendChild(el)
    );

    // Create amount field.
    if (cpbClientField.classList.contains('js-cpb-client-amount')) {
      // Create amount row with currency select.
      const cpbFormRow = document.createElement('div');
      cpbFormRow.classList.add('cpb-form-row');
      cpbPopupInputGroup.querySelector('label').after(cpbFormRow);
      cpbFormRow.appendChild(cpbPopupInputGroup.querySelector('input'));
      // Hide amount field group.
      cpbPopupInputGroup.classList.add('js-cpb-display-off');
      // Add currency field.
      cpbPopupInputGroup.querySelector('input').after(this.renderClientSelect('currency'));
    }

    return cpbPopupInputGroup;
  }

  /**
   * Create select element.
   *
   * @param field
   * @returns {HTMLSelectElement}
   */
  renderClientSelect(field)
  {
    const cpbClientField = document.createElement('select');
    cpbClientField.classList.add('cpb-popup-input', `js-cpb-client-${field}`, 'cpb-popup-select');
    cpbClientField.name = `cpb_client_${field}`;
    cpbClientField.id = `cpb_client_${field}`;
    cpbClientField.value = 'UAH';

    CPBModal.cpbCurrencies.map(el => {
      let option = document.createElement('option');
      option.value = el;
      option.innerHTML = el;
      cpbClientField.appendChild(option);
    });

    return cpbClientField;
  }

  /**
   * Create payment form.
   *
   * @param data
   * @returns {HTMLFormElement}
   */
  renderPaymentForm(data)
  {
    const cpbPaymentForm = document.createElement('form');
    cpbPaymentForm.id = 'cpb_payment_form';
    cpbPaymentForm.action = CPBModal.cpbApi;
    cpbPaymentForm.method = 'POST';

    for (let field in data) {
        let el = document.createElement('input');
        el.type = 'hidden';
        el.name = field;
        el.value = data[field];
        cpbPaymentForm.appendChild(el);
    }

    const cpbPaymentFormSubmit = document.createElement('button');
    cpbPaymentFormSubmit.type = 'submit';
    cpbPaymentFormSubmit.textContent = 'Pay';
    cpbPaymentForm.appendChild(cpbPaymentFormSubmit);

    return cpbPaymentForm;
  }
}
