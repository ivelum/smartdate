# smartdate.js

smartdate.js is a lightweight (<4KB minified) dependency-free library
for displaying date and time in users' timezones, in human-friendly
format. Datetime string is updated dynamically without page reload. This
is fast, tested with hundreds of date objects on a single page.

Supported Languages: English, Russian.

Browser compatibility: tested in IE8+, Chrome, Firefox, Safari and
Opera.

## Example output

Examples of what your users could see:

English:

- Dec 7, 2014
- tomorrow at 6:42 am
- today at 3:14 pm
- in 2 min
- in less than a minute
- less than a minute ago
- 12 min ago
- today at 1:07 am
- yesterday at 9:40 pm
- Dec 3, 2014

Russian:

- 7 дек 2014
- завтра в 06:42
- сегодня в 15:14
- через 2 мин
- в течение минуты
- менее 1 мин назад
- 12 мин назад
- сегодня в 01:07
- вчера в 21:40
- 3 дек 2014

Text is updated dynamically as time goes by:
> in 2 min -> in 1 min -> in less than a minute -> less than a minute ago -> ... 

Datetime tags can also have a title attribute with full date time string
in user timezone and locale (displayed on mouse over). This is a
configurable option, turned on by default.

## Installation

Download smartdate.js or smartdate.min.js from this repository, or
install with Bower:

```sh
bower install smartdate
```

or, if you're using npm:

```sh
npm install smartdate
```

## Usage

smartdate.js looks for tags of pre-defined type and class on your page,
gets Unix timestamp (in seconds) from them and replaces tag contents to
date time string.

Add as many datetimes to your page as needed in the following format:

```html
<span class="smartdate" data-timestamp="1418734998"></span>
```

Initialize smartdate.js by calling smartdate.init(). This needs to be
done only once, no matter how many datetime tags you added. The best
place for this code is the end of the page, below all datetime tags:

```html
<script src="/smartdate.js"></script>
<script>
  smartdate.init();
</script>
```

or, if you're using RequireJS:

```html
<script>
  require(['smartdate'], function(smartdate) {
    smartdate.init();
  });
</script>
```

When .init() is called, smartdate updates all datetime tags on the page
and schedules itself to update them every 5 seconds (configurable).

## Configuration options

smartdate.init() takes an optional parameter, object with configuration
options. For example, if you'd like to switch language to Russian,
initialize smartdate as following:

```js
smartdate.init({
  language: 'ru'
});
```

All configuration options:

- **language** - 'en' or 'ru'. Default is 'en';
- **mode** - 'auto', 'date', 'past' or 'future'. Default is 'auto'. Defines how
  smartdate renders datetime text. 
    * *auto* - use human-friendly time string for nearest date and time, 
      from yesterday to tomorrow, like shown on examples above. Use date, 
      if date is outside of yesterday <-> tomorrow interval;
    * *date* -  always show dates, even for nearest date and time; 
    * *past* - prevent future dates from being shown. If the date is in the 
      future, 'less than a minute ago' will be shown (or its equivalent in 
      Russian). This could be helpful to deal with inaccurate clock on user
      machines. For example, if your app shows timestamps for article comments,
      and user clock is behind server clock by 5 minutes, the most recent 
      comments could be shown for her as coming from future - 'in 5 min', and
      this could be confusing. Set mode to 'past' to fix this.
    * *future* - opposite to *past*, prevents past dates from being shown. If 
      the date is in the past, 'in less than a minute' will be shown (or its 
      equivalent in Russian).
- **fullMonthNames** - *true* or *false*, default is *false*. Use full or short
  month names;
- **capitalize** - *true* or *false*, default is *false*. Tells smartdate to
  capitalize produced date strings;
- **tagName** - tag type to look for. Default is 'span';
- **className** - tag class to look for. Default is 'smartdate';
- **addTitle** - true or false, default is true. Tells smartdate to add
  title attribute with full datetime string in users' locale;
- **updateInterval** - interval in milliseconds, how often should smartdate 
  update datetime tags. Default is 5000 (5 seconds). Set it to null if you'd 
  like to disable auto-update.
  
## API

```js
smartdate.init()
// or
smartdate.init(paramsObj)
```

Inititalize smartdate. Takes an optional parameter, object with configuration
options. It basically does the following:
  1. performs parameters configuration using .setup(); 
  2. immediately renders all date tags found on the page using .render() method;
  3. schedules .render() to run every updateInterval milliseconds (optional). 
See Usage and Configuration options above for details.

```js
smartdate.setup(paramsObj)
```

Configure smartdate. See Configuration options above for details.

```js
smartdate.format(date)
```

Returns string representation of a date using current format and language 
settings. Input can be an instance of Date object or unix timestamp in seconds.

```js
smartdate.render()
```

If you update your page contents dynamically with JavaScript, you may want
to update datetime strings right after you updated date tags on the page. 
In such case call .render() - this is exactly the same function which .init() 
uses internally to update everything.

## Report bugs

Report issues to the project's [Issues Tracking on Github](https://github.com/ivelum/smartdate/issues).
