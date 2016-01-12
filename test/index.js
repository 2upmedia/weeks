var should = require('chai').should();
var Weeks = require('../weeks');
var moment = require('moment');


describe('Weeks', function() {
  describe('#values', function() {
    var weeks;

    beforeEach(function() {
      weeks = Weeks();
    });

    var rangesDataSet = [
      {
        name: 'should return right days per week based on start date',
        args: [2, new Date('11/17/2015')],
        expect: [
          new Date('2015-11-17T05:00:00.000Z'),
          new Date('2015-11-24T05:00:00.000Z')
        ]
      },
      {
        name: 'should return right days per week based on start date over multiple months',
        args: [5, new Date('11/15/2015')],
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
        var actual = weeks.get.apply(weeks, test.args).values();

        actual.should.deep.equal(test.expect);
      });
    });

    it('should give me weeks based on today', function() {
      var actual = weeks.get(2).values();

      var firstDate = moment(new Date());
      var secondDate = moment(new Date());

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

      function format(momentDay) {
        var mondayOfWeek = momentDay.clone().day(1);
        // get saturday Date
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

      var actual = weeks.locale('es').get(5, new Date('11/15/2015')).map(format);

      actual.should.deep.equal(expect);
    });
  })

  describe('#weeks', function() {
    it('should expect parameters to be set', function() {
      Weeks().get.bind(null).should.throw(Error);
      Weeks().get.bind(null, null, new Date).should.throw(Error);
    });

    it('should expect startDate to be a Date object', function() {
      Weeks().get.bind(null, 2, "not a Date object").should.throw(Error);
    });
  });
});