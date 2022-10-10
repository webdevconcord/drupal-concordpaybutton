<?php

namespace Drupal\concordpay_button\Plugin\Shortcode;

use Drupal\Core\Language\Language;
use Drupal\shortcode\Plugin\ShortcodeBase;

/**
 * The image shortcode.
 *
 * @Shortcode(
 *   id = "concordpay_button",
 *   title = @Translation("Button"),
 *   description = @Translation("Insert ConcordPay button.")
 * )
 */
class ConcordpayButtonShortcode extends ShortcodeBase {

  /**
   * {@inheritdoc}
   */
  public function process(array $attributes, $text, $langcode = Language::LANGCODE_NOT_SPECIFIED) {

    $host = \Drupal::request()->getSchemeAndHttpHost() . '/';
    $plugin_path = \Drupal::service('extension.path.resolver')->getPath('module', 'concordpay_button');
    // Merge with default attributes.
    $attributes = $this->getAttributes([
      'path'  => '<front>',
      'url'   => '',
      'title' => '',
      'class' => 'cpb-button-image',
      'id'    => '',
      'style' => 'background:url(' . $host . $plugin_path . '/images/concordpay.svg) no-repeat center center content-box;',
      'type'  => 'cpb_submit',
      'name'  => 'Example name',
      'price' => '0.00',
      'media_file_url' => FALSE,
    ],
      $attributes
    );
    $url = $attributes['url'];
    if (empty($url)) {
      $url = $this->getUrlFromPath($attributes['path'], $attributes['media_file_url']);
    }
    $title = $this->getTitleFromAttributes($attributes['title'], $text);
    $class = $this->addClass($attributes['class'], 'button');

    // Build element attributes to be used in twig.
    $element_attributes = [
      'href'  => $url,
      'class' => $class,
      'id'    => $attributes['id'],
      'style' => $attributes['style'],
      'title' => $title,
      'data-type'  => $attributes['type'],
      'data-name'  => $attributes['name'],
      'data-price' => $attributes['price'],
    ];

    // Filter away empty attributes.
    $element_attributes = array_filter($element_attributes);

    $output = [
      '#theme' => 'concordpay_button',
      // Not required for rendering, just for extra context.
      '#url' => $url,
      '#attributes' => $element_attributes,
      '#text' => $text,
    ];

    return $this->render($output);
  }

  /**
   * {@inheritdoc}
   */
  public function tips($long = FALSE) {
    $output = [];
    $output[] = '<p><strong>' . $this->t('[concordpay_button name="Product name" price="12.50"][/concordpay_button]') . '</strong> ';
    if ($long) {
      $output[] = $this->t('Inserts a link formatted like as a button. The <em>name</em> parameter provides the Product name.
    The <em>price</em> shows product price.') . '</p>';
    }
    else {
      $output[] = $this->t('Inserts a link formatted as a ConcordPay button.') . '</p>';
    }
    return implode(' ', $output);
  }

}
