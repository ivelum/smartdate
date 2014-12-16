Smartdate.js
============

Smartdate.js is a lightweight (<3KB minified) dependency-free library for
displaying date and time in users' timezones, in human-friendly format.
Datetime string is updated dynamically without page reload. This is
fast, tested with hundreds of date objects on a single page.

Supported Languages: English, Russian.

Browser compatibility: tested in IE8+, Chrome, Firefox, Safari and Opera.


Example output
--------------

Examples of what your users will see (text will be updated dynamically as
time goes by):

English:

* less than a minute ago
* 12 min ago
* today at 1:07 am
* yesterday at 9:40 pm
* Dec 3, 2014

Russian:

* менее 1 мин назад
* 12 мин назад
* сегодня в 01:07
* вчера в 21:40
* 3 дек 2014

Datetime tags can also have a title attribute with full date time string in
user timezone and locale (displayed on mouse over). This is a configurable
option, turned on by default.


Installation
------------

Download smartdate.js or smartdate.min.js from this repository, or install
with Bower::

    bower install smartdate


Usage
-----

Smartdate.js looks for tags of pre-defined type and class on your page,
gets Unix timestamp (in seconds) from them and replaces tag contents to
date time string.

Add as many datetimes to your page as needed in the following format:

.. code:: html

    <span class="smartdate" data-timestamp="1418734998"></span>

Initialize Smartdate.js (once per page, no matter how many datetimes you added):

.. code:: html

    <script src="/smartdate.js"></script>
    <script>
      smartdate.init();
    </script>

or, if you're using RequireJS:

.. code:: html

    <script>
      require(['smartdate'], function(smartdate) {
        smartdate.init();
      });
    </script>

When .init() is called, smartdate updates all datetime tags on the page
and schedules itself to update them every 5 seconds (configurable).


Configuration options
---------------------

smartdate.init() takes an optional parameter, object with configuration options.
For example, if you'd like to switch language to Russian, initialize smartdate
as following:

.. code:: javascript

    smartdate.init({
      language: 'ru'
    });

All configuration options:

* language - 'en' or 'ru'. Default is 'en';
* fullMonthNames - true or false, default is false. Use full or short month
  names;
* tagName - tag type to look for. Default is 'span';
* className - tag class to look for. Default is 'smartdate';
* timestampAttr - name of 'data-' attribute in which unix timestamps are
  stored. Default is 'timestamp', so full attribute name is 'data-timestamp';
* addTitle - true or false, default is true. Tells smartdate to add title
  attribute with full datetime string in users' locale;
* updateInterval - interval in milliseconds, how often should smartdate update
  datetime tags. Default is 5000 (5 seconds). Set it to null if you'd like
  to disable auto-update.

Low-level API
-------------

* smartdate.render()

If you update your page contents dynamically with JavaScript, you may want
to update datetime strings right after you updated date tags on the
page. In such case call smartdate.render() - this is exactly the same function
which smartdate.init() uses internally to update everything.

Report bugs
-----------

Report issues to the project's `Issues Tracking`_ on Github.

.. _`Issues Tracking`: https://github.com/ivelum/smartdate/issues

