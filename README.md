[![Build Status](https://travis-ci.org/2upmedia/weeks.svg)](https://travis-ci.org/2upmedia/weeks)

# Weeks 

Expressive API for working with weeks. Uses the wonderful moments library.

## Features
- Get weeks based on a day and amount. Returns Date objects based on the day of the start date.
- Mapping callables to each week to transform values. Example, returning Date ranges in as a string (Feb 2 - 5) 
- Supports basic internationalization
- Mapped partial functions

## Usages

```javascript
var Weeks = require("weeks");

weeks = Weeks();

// [ [Date: ...], [Date: ...] ] 2 weeks starting from today
weeks.get(2).values(); 

// gets every week in 2016 with the day based off of the start date
weeks.starting(new Date('1/1/2016')).get(52).values(); 

function mondays(momentDay) {
    return momentDay.day(1).toDate();
}

// get the Mondays for the this and the following week
weeks.get(2).mapped(mondays);
weeks.mondays = weeks.mapPartial(mondays);
weeks.get(2).mondays();

weeks.withLocale('es').starting(new Date('11/15/2015')).get(5).mapped(mondays);
```