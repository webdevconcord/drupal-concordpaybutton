<?php

namespace Drupal\concordpay_button\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Configure settings for module.
 */
class ConcordpaySettingsForm extends ConfigFormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'concordpay_button_admin_settings';
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return [
      'concordpay_button.settings',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('concordpay_button.settings');
    $baseUrl = \Drupal::request()->getSchemeAndHttpHost();

    $form['cpb_merchant_id'] = [
      '#type' => 'textfield',
      '#required' => TRUE,
      '#size' => 60,
      '#title' => $this->t('Merchant ID'),
      '#default_value' => $config->get('cpb_merchant_id'),
      '#description' => t('Given to Merchant by ConcordPay'),
    ];

    $form['cpb_secret_key'] = [
      '#type' => 'textfield',
      '#required' => TRUE,
      '#title' => $this->t('Secret key'),
      '#default_value' => $config->get('cpb_secret_key'),
      '#description' => t('Given to Merchant by ConcordPay'),
    ];

    $form['cpb_currency'] = [
      '#type' => 'select',
      '#title' => $this->t('Currency'),
      '#options' => $this->cpbGetCurrencies(),
      '#default_value' => $config->get('cpb_currency') ?? 'UAH',
      '#description' => t('Specify your currency'),
    ];

    // Это поле нужно для того, чтобы сохранить значение чекбокса валюты,
    // имеющего состояние 'disabled'.
    $form['cpb_currency_default'] = [
      '#type' => 'hidden',
      '#default_value' => $form['cpb_currency']['#default_value'],
    ];

    $form['cpb_currency_popup'] = [
      '#type' => 'checkboxes',
      '#title' => $this->t('Currency for popup'),
      '#options' => $this->cpbGetCurrencies(),
      '#description' => t('Specify your popup currency'),
    ];

    if ($config->get('cpb_currency_popup') === NULL) {
      $form['cpb_currency_popup']['#default_value'] = [$form['cpb_currency']['#default_value']];
    }
    else {
      $form['cpb_currency_popup']['#default_value'] = $this->cpbGetCurrenciesPopup();
    }
    $form['cpb_currency_popup'][$form['cpb_currency']['#default_value']]['#disabled'] = TRUE;

    $form['cpb_mode'] = [
      '#type' => 'select',
      '#title' => $this->t('Required fields'),
      '#options' => [
        'none' => $this->t('Do not require'),
        'phone' => $this->t('Name + Phone'),
        'email' => $this->t('Name + Email'),
        'phone_email' => $this->t('Name + Phone + Email'),
      ],
      '#default_value' => $config->get('cpb_mode'),
      '#description' => t('Fields required to be entered by the buyer'),
    ];

    $form['cpb_language'] = [
      '#type' => 'select',
      '#title' => $this->t('Payment page language'),
      '#options' => [
        'ua' => $this->t('UA'),
        'en' => $this->t('EN'),
        'ru' => $this->t('RU'),
      ],
      '#default_value' => $config->get('cpb_language') ?? 'ua',
      '#description' => t('Specify ConcordPay payment page language'),
    ];

    $form['cpb_order_prefix'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Order prefix'),
      '#default_value' => $config->get('cpb_order_prefix') ?? 'cpb_',
      '#description' => t('Prefix for order'),
    ];

    $form['cpb_approve_url'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Redirect URL on successful payment'),
      '#default_value' => $config->get('cpb_approve_url') ?? $baseUrl,
      '#description' => t('Redirect URL on successful payment'),
    ];

    $form['cpb_decline_url'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Redirect URL on failed payment'),
      '#default_value' => $config->get('cpb_decline_url') ?? $baseUrl,
      '#description' => t('Redirect URL on failed payment'),
    ];

    $form['cpb_cancel_url'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Redirect URL on canceled payment'),
      '#default_value' => $config->get('cpb_cancel_url') ?? $baseUrl,
      '#description' => t('Redirect URL on canceled payment'),
    ];

    $form['cpb_pay_button_text'] = [
      '#type' => 'textfield',
      '#title' => $this->t('ConcordPay button text'),
      '#default_value' => $config->get('cpb_pay_button_text') ?? $config->get('donate'),
      '#description' => t('Custom ConcordPay button text'),
    ];

    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $currencies = $form_state->getValue('cpb_currency_popup');
    $currencies[$form_state->getValue('cpb_currency_default')] = $form_state->getValue('cpb_currency_default');
    // Retrieve the configuration.
    $this->configFactory->getEditable('concordpay_button.settings')
      ->set('cpb_merchant_id', $form_state->getValue('cpb_merchant_id'))
      ->set('cpb_secret_key', $form_state->getValue('cpb_secret_key'))
      ->set('cpb_currency', $form_state->getValue('cpb_currency'))
      ->set('cpb_currency_popup', $currencies)
      ->set('cpb_mode', $form_state->getValue('cpb_mode'))
      ->set('cpb_language', $form_state->getValue('cpb_language'))
      ->set('cpb_order_prefix', $form_state->getValue('cpb_order_prefix'))
      ->set('cpb_approve_url', $form_state->getValue('cpb_approve_url'))
      ->set('cpb_decline_url', $form_state->getValue('cpb_decline_url'))
      ->set('cpb_cancel_url', $form_state->getValue('cpb_cancel_url'))
      ->set('cpb_pay_button_text', $form_state->getValue('cpb_pay_button_text'))
      ->save();

    parent::submitForm($form, $form_state);
  }

  /**
   * Returns plugin currencies.
   *
   * @return array
   */
  protected function cpbGetCurrencies() {
    return [
      'UAH' => $this->t('Ukrainian hryvnia'),
      'USD' => $this->t('U.S. Dollar'),
      'EUR' => $this->t('Euro'),
    ];
  }

  /**
   * @return array
   */
  protected function cpbGetCurrenciesPopup() {
    $config = $this->config('concordpay_button.settings');
    $currencies = [];
    foreach ($config->get('cpb_currency_popup') as $key => $val) {
      if ($key === $val) {
        $currencies[$key] = $val;
      }
    }

    return $currencies;
  }

}
