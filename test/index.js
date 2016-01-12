var should = require('chai').should();
var Weeks = require('../weeks');
var moment = require('moment');
var tk = require('timekeeper');


describe('Weeks', function() {
  describe('#values', function() {
    var weeks;

    beforeEach(function() {
      weeks = Weeks();
    });

    var rangesDataSet = [
      {
        name: 'should return right days per week based on start date',
        args: [2, new Date('2015-11-17T05:00:00.000Z')],
        expect: [
          new Date('2015-11-17T05:00:00.000Z'),
          new Date('2015-11-24T05:00:00.000Z')
        ]
      },
      {
        name: 'should return right days per week based on start date over multiple months',
        args: [5, new Date('2015-11-15T05:00:00.000Z')],
        expect: [
          new Date('2015-11-15T05:00:00.000Z'),
          new Date('2015-11-22T05:00:00.000Z'),
          new Date('2015-11-29T05:00:00.000Z'),
          new Date('2015-12-06T05:00:00.000Z'),
          new Date('2015-12-13T05:00:00.000Z')
        ]
      }
    ];

    rangesDataSet.forEach(function(test) {
      it(test.name, function() {
        var actual = weeks.starting(test.args[1]).get(test.args[0]).values();

        actual.should.deep.equal(test.expect);
      });
    });

    it('should give me weeks based on today', function() {
      var actual = weeks.get(2).values();

      var date = new Date();

      tk.freeze(date);

      var firstDate = moment(date);
      var secondDate = moment(date);

      var expect = [firstDate.toDate(), secondDate.day(secondDate.day() + 7).toDate()];

      actual.should.deep.equal(expect);
    });
  });

  describe('#map', function() {
    beforeEach(function() {
      weeks = Weeks();
    });

    it('should return the right months including weeks that cross over with callable', function() {
      var expect = [
        '16 - 21 DE NOVIEMBRE',
        '23 - 28 DE NOVIEMBRE',
        '30 NOV. - 5 DICIEMBRE',
        '7 - 12 DE DICIEMBRE',
        '14 - 19 DE DICIEMBRE'
      ];

      function formattedWeeks(momentDay) {
        var mondayOfWeek = momentDay.clone().day(1);
        var saturdayOfWeek = momentDay.clone().day(6);

        var formatted = '';

        // are both dates in the same month?
        var saturday = saturdayOfWeek.date();
        var monday = mondayOfWeek.date();
        var month = saturdayOfWeek.format('MMMM');

        if (mondayOfWeek.get('month') === saturdayOfWeek.get('month')) {
          // format [monday day] - [saturday day] DE [FULL Month Name]
          formatted = `${monday} - ${saturday} ${this.ofPreposition()} ${month}`.toUpperCase();
          // add to buffer array
          return formatted;
          // else
        } else {
          // format [monday day] [abbreviated month] - [saturday day] [FULL month name]
          var abbreviatedMonth = mondayOfWeek.format('MMM');

          formatted = `${monday} ${abbreviatedMonth} - ${saturday} ${month}`.toUpperCase();
          // add to buffer array
          return formatted;
        }
      }

      var actual = weeks.withLocale('es').starting(new Date('11/15/2015')).get(5).mapped(formattedWeeks);

      actual.should.deep.equal(expect);
    });
  });

  describe('#mapPartial', function() {
    it('should map a partial');
    // weeks.formattedWeeks = weeks.mapPartial(formattedWeeks;
  });

  describe('#weeks', function() {
    it('should expect parameters to be set', function() {
      Weeks().get.bind(null).should.throw(Error);
      Weeks().get.bind(null, null, new Date).should.throw(Error);
    });

    it('should expect startDate to be a Date object', function() {
      Weeks().starting.bind(null, "not a Date object").should.throw(Error);
    });
  });
});