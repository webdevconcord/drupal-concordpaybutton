<?php

namespace Drupal\concordpay_button\Utils;

/**
 * ConcordPay Helper class.
 */
class ConcordPayHelper {

  public const CPB_MODE_NONE        = 'none';
  public const CPB_MODE_PHONE       = 'phone';
  public const CPB_MODE_EMAIL       = 'email';
  public const CPB_MODE_PHONE_EMAIL = 'phone_email';

  /**
   * Checkout modal form predefined configs.
   *
   * @var string[][]
   */
  protected static $checkoutParams = [
    self::CPB_MODE_NONE => [
      'cpb_client_amount',
      'cpb_product_name',
      'cpb_product_price',
    ],
    self::CPB_MODE_PHONE => [
      'cpb_client_name',
      'cpb_client_phone',
      'cpb_client_amount',
      'cpb_product_name',
      'cpb_product_price',
    ],
    self::CPB_MODE_EMAIL => [
      'cpb_client_name',
      'cpb_client_email',
      'cpb_client_amount',
      'cpb_product_name',
      'cpb_product_price',
    ],
    self::CPB_MODE_PHONE_EMAIL => [
      'cpb_client_name',
      'cpb_client_phone',
      'cpb_client_email',
      'cpb_client_amount',
      'cpb_product_name',
      'cpb_product_price',
    ],
  ];

  /**
   * Returns ConcordPay plugin config data.
   *
   * @return array
   */
  public static function getPluginConfig() {
    $config = \Drupal::service('config.factory')->getEditable('concordpay_button.settings')->getRawData();

    return $config;
  }

  /**
   * Checkout form validation.
   *
   * @param array $post
   *   $_POST data.
   *
   * @return array
   */
  public static function validateCheckoutForm($post) {
    $result = ['result' => FALSE, 'errors' => []];

    $checkoutParamsKeys = self::getCheckoutParamsKeys();
    $isHasAllValues     = !array_diff_key($checkoutParamsKeys, $post);
    if (!$isHasAllValues) {
      $result['errors'][] = t('Error: Not enough input parameters.');
      return $result;
    }

    // Check client name.
    if (isset($post['cpb_client_name']) && empty(trim($post['cpb_client_name']))) {
      $result['errors']['name'] = t('Invalid name');
    }

    // Check phone.
    if (isset($post['cpb_client_phone'])) {
      $phone = self::sanitizePhone($post['cpb_client_phone']);
      if (empty($phone) || mb_strlen($phone) < 10) {
        $result['errors']['phone'] = t('Invalid phone number');
      }
    }

    // Check email.
    if (isset($post['cpb_client_email'])) {
      $email = trim($post['cpb_client_email']);
      if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $result['errors']['email'] = t('Invalid email');
      }
    }

    // Check amount.
    if (isset($post['cpb_product_price'], $post['cpb_client_amount'])) {
      if (strtolower($post['cpb_product_price']) !== 'custom') {
        $post['cpb_client_amount'] = $post['cpb_product_price'];
      }
      if (!is_numeric($post['cpb_client_amount']) || (float) $post['cpb_client_amount'] <= 0) {
        $result['errors']['amount'] = t('Invalid amount');
      }
    }

    if (empty($result['errors'])) {
      $result['result'] = TRUE;
    }

    return $result;
  }

  /**
   * Remove all non-numerical symbol from phone.
   *
   * @param string $phone
   *   Client phone.
   *
   * @return array|string|string[]|null
   */
  public static function sanitizePhone($phone) {
    return preg_replace('/\D+/', '', $phone);
  }

  /**
   * Get required checkout fields.
   *
   * @return string[]
   */
  protected static function getCheckoutParamsKeys() {
    $settings = self::getPluginConfig();

    $params = $settings['cpb_mode']
        ? self::$checkoutParams[$settings['cpb_mode']]
        : self::$checkoutParams[self::CPB_MODE_PHONE];

    return array_flip($params);
  }

}
