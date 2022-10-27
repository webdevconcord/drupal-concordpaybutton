# Модуль ConcordPay Button для Drupal 9

Creator: [ConcordPay](https://concordpay.concord.ua)<br>
Tags: ConcordPay, ConcordPay Button, payment, payment gateway, credit card, Visa, Masterсard, Apple Pay, Google Pay<br>
Requires at least: Drupal 9.0<br>
License: GNU GPL v3.0<br>
License URI: [License](https://opensource.org/licenses/GPL-3.0)

Этот модуль позволит вам принимать платежи через платёжную систему **ConcordPay**.

Для работы плагина требуется наличие установленного модуля [Shortcode](https://www.drupal.org/project/shortcode). 

Плагин предоставляет возможность создать на вашем сайте неограниченное число платёжных кнопок **ConcordPay** для
осуществления продаж различных товаров, услуг, подписок, пожертвований и т.п.
Управление заказами при этом осуществляется через Личный кабинет **ConcordPay**.

## Установка

1. Разархивировать папку с кодом модуля и скопировать каталог `concordpay_button` в `{YOUR_SITE}/modules/custom`.
   
2. В административном разделе сайта зайти в подраздел *«Extend»*.

3. Активировать модуль **ConcordPay Button** и нажать **«Install»**.

4. Перейти в раздел *«Конфигурация -> Работа с содержимым -> ConcordPay Button»*. Если данный раздел не появился, очистить кэш **Drupal**.

5. Заполнить данные вашего торговца значениями, полученными от платёжной системы:
   - *Идентификатор торговца (Merchant ID)*;
   - *Секретный ключ (Merchant ID)*.

  Также указать:
  - *Валюту, в которой будут осуществляться платежи*;
  - *Валюты, разрешённые к применению в режиме ввода суммы платежа пользователем (для пожертвований)*;
  - *Язык страницы оплаты **ConcordPay***;
  - *Обязательные поля с данными покупателя*;
  - *Префикс к обозначению заказа*;
  - *URL переадресации покупателя по результатам платежа (успешный или нет)*.

6. Настройка *«Обязательные поля»* отвечает за набор полей,
   которые **обязательно** должен будет заполнить покупатель при оформлении заказа.
   Настройка устанавливает следующие режимы работы:
   - *«Не требовать»* - После нажатия на кнопку оплаты, покупатель сразу перенаправляется на страницу оплаты **ConcordPay**.
     Данный режим хорошо подходит для осуществления таких платежей как пожертвования, когда не требуется наличия контактных данных плательщика;
   - *«Имя + Телефон»*, *«Имя + Email»*, *«Имя + Телефон + Email»* - после нажатия на кнопку оплаты появляется диалоговое окно с соответствующим набором полей.
     По заполнению всех полей формы, покупатель перенаправляется на страницу оплаты **ConcordPay**.

7. Сохранить настройки платёжного метода.

Модуль готов к работе.

## Использование кнопки ConcordPay

В режиме редактирования содержимого материала (Article) добавить код кнопки и её атрибуты:<br>
`[concordpay_button name='Good Product' price='12.30' description='Благотворительный взнос'][/concordpay_button]`,
где:
- Обязательные атрибуты<br>
`name` - наименование товара (услуги),<br>
`price` - цена товара (услуги),<br>
- Необязательные атрибуты (можно вообще не указывать)<br>
`description` - описание назначения платежа, которое выводится на странице оплаты
(если не задано, то будет выведено сообщение "Оплата картой на сайте..." с данными сайта и пользователя).


**Режим ввода суммы платежа покупателем (для пожертвований)**<br>
Если при создании кнопки значение суммы указать как `custom`, то для этой кнопки во всплывающем окне будет выводиться
дополнительное поле `Сумма`, в котором посетитель сайта сможет указать своё значение суммы платежа.<br>

Также в данном режиме доступен выбор валюты в момент ввода суммы.
Список разрешённых валют и валюта по умолчанию устанавливаются в настройках плагина.

Пример шорткода для данного режима:<br>
`[concordpay_button name='Product name' price='custom' description='Благотворительный взнос'][/concordpay_button]`

Здесь аттрибут **name** содержит название товара, а **price** - цену товара в валюте, указанной в настройках модуля.

*Модуль протестирован для работы с Drupal 9.3.9, Shortcode 2.0.1 и PHP 7.4.*
