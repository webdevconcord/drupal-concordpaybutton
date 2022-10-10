<?php

namespace Drupal\concordpay_button\Controller;

use Drupal\concordpay_button\Utils\ConcordPayApi;
use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Drupal\concordpay_button\Utils\ConcordPayHelper;

/**
 * Payment Controller Class.
 */
class PaymentController extends ControllerBase {

  /**
   * Payment processing.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *
   * @return \Symfony\Component\HttpFoundation\Response
   */
  public function pay(Request $request) {

    $config = ConcordPayHelper::getPluginConfig();
    $data = $request->request->all();

    $validation = ConcordPayHelper::validateCheckoutForm($data);

    // Response with validation errors.
    if ($validation['result'] !== TRUE) {
      return new Response(json_encode($validation));
    }

    $baseUrl = \Drupal::request()->getSchemeAndHttpHost();

    list($client_first_name, $client_last_name) = explode(' ', trim($data['cpb_client_name']));
    $phone = ConcordPayHelper::sanitizePhone($data['cpb_client_phone']) ?? '';
    $email = $data['cpb_client_email'] ?? '';

    $description = $this->t('Payment by card on the site') . ' '
        . rtrim("$baseUrl, $client_first_name $client_last_name, $phone", '. ,');

    $output = [
      'operation'    => 'Purchase',
      'merchant_id'  => $config['cpb_merchant_id'],
      'amount'       => (float) $data['cpb_product_price'],
      'order_id'     => $config['cpb_order_prefix'] . time(),
      'currency_iso' => $config['cpb_currency'],
      'description'  => $description,
      'approve_url'  => $config['cpb_approve_url'],
      'decline_url'  => $config['cpb_decline_url'],
      'cancel_url'   => $config['cpb_cancel_url'],
      'callback_url' => '',
      'language'     => $config['cpb_language'],
      // Statistics.
      'client_first_name' => $client_first_name,
      'client_last_name'  => $client_last_name,
      'phone' => $phone,
      'email' => $email,
    ];

    $concordpay = new ConcordPayApi($config['cpb_secret_key']);
    $output['signature'] = $concordpay->getRequestSignature($output);

    $response = ['result' => TRUE, 'output' => $output];

    return new Response(json_encode($response));
  }

}
