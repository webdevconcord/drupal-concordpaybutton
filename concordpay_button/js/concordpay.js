/**
 * ConcordPay scripts.
 *
 * @package 'concordpay-button'
 */
(function ($, Drupal, settings) {
    const __ = Drupal.t;

    // Add ConcordPay modal form.
    const cpbModal = new CPBModal();
    cpbModal.mode = settings['cpb_mode'] ? settings['cpb_mode'] : 'none';
    cpbModal.render();
    // Set pay button custom text.
    if (settings['cpb_pay_button_text'].trim() !== '') {
        const cpbPopupSubmit = document.querySelector('#cpb_popup_submit');
        if (typeof cpbPopupSubmit !== 'undefined' && cpbPopupSubmit) {
            cpbPopupSubmit.innerHTML = '<img src="/modules/custom/concordpay_button/images/logo.svg" alt="ConcordPay"><span>' + settings['cpb_pay_button_text'] + '</span>';
        }
    }

    const cpbPopup = document.querySelector('#cpb_popup');
    const cpbCheckoutForm = document.querySelector('#cpb_checkout_form');
    // Shortcode parameters.
    const productNameField = document.querySelector('.js-cpb-product-name');
    const productPriceField = document.querySelector('.js-cpb-product-price');
    // Client info.
    const clientNameField = document.querySelector('.js-cpb-client-name');
    const clientPhoneField = document.querySelector('.js-cpb-client-phone');
    const clientEmailField = document.querySelector('.js-cpb-client-email');
    const clientAmountField = document.querySelector('.js-cpb-client-amount');
    // Required fields when making a purchase.
    const requiredFields = [clientNameField, clientPhoneField, clientEmailField, clientAmountField];

    // ConcordPay payment button listener.
    window.addEventListener(
        'click',
        (event) => {
            if (event.target.dataset.type !== 'cpb_submit') {
                return;
            }
            event.preventDefault();
            if (typeof cpbPopup !== 'undefined' && cpbPopup && productNameField && productPriceField) {
                productNameField.value = event.target.dataset.name;
                productPriceField.value = event.target.dataset.price;

                // For custom amount value.
                if (productPriceField.value.toLowerCase() === 'custom') {
                    clientAmountField.closest('.cpb-popup-input-group').classList.remove('js-cpb-display-off');
                } else {
                    clientAmountField.closest('.cpb-popup-input-group').classList.add('js-cpb-display-off');
                }

                if (
                  requiredFields.every(element => (element === null || element.name === 'cpb_client_amount'))
                  && productPriceField.value.toLowerCase() !== 'custom'
                ) {
                    // If 'CPB_MODE_NONE' enabled.
                    cpbCheckoutForm.dispatchEvent(new Event('submit'));
                } else {
                    // Other modes. Open popup window.
                    cpbPopup.classList.add('open');
                }
            }
        }
    );

    // Popup window close button handler.
    const cpbClose = document.querySelector('.cpb-popup-close');
    if (typeof cpbClose !== 'undefined' && cpbClose) {
        cpbClose.onclick = event => {
            event.preventDefault();
            resetFormFields();
            cpbPopup.classList.remove('open');
            resetValidationMessages();
        };
    }

    // Checkout form handler (popup window).
    if (typeof cpbCheckoutForm !== 'undefined' && cpbCheckoutForm) {
        cpbCheckoutForm.onsubmit = event => {
            event.preventDefault();
            if (isFormHasNoErrors()) {
                validateCheckoutForm(event)
            }
        };
        // Event listeners for separate form fields.
        requiredFields.map(field => {
            if (typeof field !== 'undefined' && field) {
                field.onchange = event => validateCheckoutField(event);
            }
        });
    }

    /**
     * Validate a form field if its value has changed.
     *
     * @param event
     */
    function validateCheckoutField(event) {
        const fieldId = event.target.id;
        const fieldValue = event.target.value;

        if (fieldId === 'cpb_client_name') {
            validateName(fieldValue);
        } else if (fieldId === 'cpb_client_phone') {
            validatePhone(fieldValue);
        } else if (fieldId === 'cpb_client_email') {
            validateEmail(fieldValue);
        } else if (fieldId === 'cpb_client_amount') {
            validateAmount(fieldValue);
        }
    }

    /**
     * Validate name field.
     *
     * @param value
     */
    function validateName(value) {
        const errorMessage = document.querySelector('.js-cpb-error-name');
        if (value.trim().length !== 0) {
            removeValidationMessage(errorMessage);
            return;
        }

        errorMessage.innerHTML = Drupal.t('Invalid name');
        highlightNearestInput(errorMessage);
    }

    /**
     * Validate phone field.
     *
     * @param value
     */
    function validatePhone(value) {
        const errorMessage = document.querySelector('.js-cpb-error-phone');
        if (value.replace(/\D/g, '').length >= 10) {
            removeValidationMessage(errorMessage);
            return;
        }

        errorMessage.innerHTML = Drupal.t('Invalid phone number');
        highlightNearestInput(errorMessage);
    }

    /**
     * Validate email field.
     *
     * @param value
     */
    function validateEmail(value) {
        const errorMessage = document.querySelector('.js-cpb-error-email');
        const emailPattern = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if (String(value).toLowerCase().match(emailPattern)) {
            removeValidationMessage(errorMessage);
            return;
        }

        errorMessage.innerHTML = Drupal.t('Invalid email');
        highlightNearestInput(errorMessage);
    }

    /**
     * Validate amount field.
     *
     * @param value
     */
    function validateAmount(value) {
        const errorMessage = document.querySelector('.js-cpb-error-amount');
        let amount = value.trim();
        if (amount.length !== 0 && !isNaN(amount) && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0) {
            removeValidationMessage(errorMessage);
            return;
        }

        errorMessage.innerHTML = Drupal.t('Invalid amount');
        highlightNearestInput(errorMessage);
    }

    /**
     * Checkout form validator.
     *
     * @param event
     */
    function validateCheckoutForm(event) {
        event.preventDefault();

        const cpb_ajax = {};
        cpb_ajax.url = settings['cpb_ajax']['url'];
        if (!cpb_ajax.url) {
            return;
        }

        const request = new XMLHttpRequest();
        request.open('POST', cpb_ajax.url, true);
        request.send(new FormData(cpbCheckoutForm));

        request.onload = function () {
            if (this.status >= 200 && this.status < 400) {
                const response = JSON.parse(this.response);
                if (response && response.result === false) {
                    // Response has validation errors. Add validation errors on form.
                    resetValidationMessages();
                    const errors = response.errors;
                    for (let error in errors) {
                        if (errors.hasOwnProperty(error)) {
                            let errorMessage = document.querySelector('.js-cpb-error-' + error);
                            errorMessage.innerHTML = errors[error];
                            highlightNearestInput(errorMessage);
                        }
                    }
                } else if (event.type === 'change') {
                    resetValidationMessages();
                } else {
                    // Success.
                    cpbPopup.classList.remove('open');
                    // Waiting for the end of the popup closing animation.
                    const waitEndAnimation = setTimeout(
                        () => {
                            lockBody();
                            const cpbCheckoutFormWrapper = document.querySelector('.cpb-popup-content');
                            cpbCheckoutFormWrapper.innerHTML = '';
                            const cpbPaymentForm = cpbModal.renderPaymentForm(response.output);
                            cpbCheckoutFormWrapper.appendChild(cpbPaymentForm);
                            cpbPaymentForm.submit();
                        },
                        800
                    );
                }
            } else {
                // Fail.
                console.log('ConcordPay plugin request error');
            }
        }

        request.onerror = function () {
            console.log('ConcordPay plugin error');
        }
    }

    /**
     * Blocking the scroll page body while redirecting to the payment page.
     */
    function lockBody() {
        document.body.classList.add('cpb-lock');
    }

    /**
     * Checking if json was received in the response.
     *
     * @param str
     * @returns {boolean}
     */
    function isJson(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    /**
     * Reset all validation messages in form.
     */
    function resetValidationMessages() {
        const messages = document.querySelectorAll('[class^=js-cpb-error-]');
        messages.forEach(message => message.innerHTML = '');

        const fields = document.querySelectorAll('.cpb-popup-input');
        fields.forEach(field => field.classList.remove('cpb-not-valid'));
    }

    /**
     * Reset form fields to empty.
     */
    function resetFormFields() {
        productNameField.value = '';
        productPriceField.value = '';
        cpbCheckoutForm.reset();
    }

    /**
     * Reset validation message for specify field.
     *
     * @param elem
     */
    function removeValidationMessage(elem) {
        elem.innerHTML = '';
        offHighlightNearestInput(elem);
    }

    /**
     * Add warning selection on nearest input field.
     *
     * @param elem
     */
    function highlightNearestInput(elem) {
        let input = elem.parentNode.querySelector('.cpb-popup-input');
        input.classList.add('cpb-not-valid');
    }

    /**
     * Remove warning selection from the nearest input field.
     *
     * @param elem
     */
    function offHighlightNearestInput(elem) {
        let input = elem.parentNode.querySelector('.cpb-popup-input');
        input.classList.remove('cpb-not-valid');
    }

    /**
     * Check that form has no errors.
     *
     * @returns {boolean}
     */
    function isFormHasNoErrors() {
        const hasErrors = cpbCheckoutForm.querySelectorAll('.cpb-not-valid');

        return hasErrors.length === 0;
    }

})(jQuery, Drupal, drupalSettings);
