# Модуль ConcordPay Button для Drupal 9

Creator: [ConcordPay](https://concordpay.concord.ua)<br>
Tags: ConcordPay, ConcordPay Button, payment, payment gateway, credit card, Visa, Masterсard, Apple Pay, Google Pay<br>
Requires at least: Drupal 9.0<br>
License: GNU GPL v3.0<br>
License URI: [License](https://opensource.org/licenses/GPL-3.0)

Этот модуль позволит вам принимать платежи через платёжную систему **ConcordPay**.

Для работы модуля **НЕ требуется** наличия сторонних модулей электронной коммерции.

Плагин предоставляет возможность создать на вашем сайте неограниченное число платёжных кнопок **ConcordPay** для
осуществления продаж различных товаров, услуг, подписок, пожертвований и т.п.
Управление заказами при этом осуществляется через Личный кабинет **ConcordPay**.

## Установка

1. Разархивировать папку с кодом модуля и скопировать в каталог `{YOUR_SITE}/modules` с сохранением структуры папок.
   
2. В административном разделе сайта зайти в подраздел *«Extend»*.

3. Активировать модуль **Commerce ConcordPay Payment** и нажать **«Install»**.

4. Перейти в раздел *«Commerce -> Конфигурация -> Payment gateways»* и нажать кнопку **Add payment gateway**.

5. **ВАЖНО!**
   - *Название платёжной системы* (**Name**): **ConcordPay Payment**;
   - *Идентификатор платёжной системы* (**Machine name**): **concordpay_payment**. 

6. Заполнить данные вашего торговца значениями, полученными от платёжной системы:
   - *Идентификатор торговца (Merchant ID)*;
   - *Секретный ключ (Merchant ID)*.

7. Сохранить настройки платёжного метода.

Модуль готов к работе.

*Модуль протестирован для работы с Drupal 9.3.9 и PHP 7.4.*
