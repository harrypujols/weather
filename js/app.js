new Vue({
  el: '#app',

  data: {
    url: 'http://api.wunderground.com/api/',
    lat: '40.71',
    lon: '-74.01',
    appid: '09d7033777846fa8',
    current: {},
    forecast: {},
    clock: '00:00:00',
    weekday: new Date().getDay(),
    month: new Date().getMonth(),
    date: new Date().getDate(),
    prefs: {},
    pm: false,
    expand: false
  },

  ready: function() {
    this.settings()
    this.geolocation()
    this.parsedate()
  },

  watch: {
    lat: function() {
      this.update()
      this.time()
    },

    'prefs.fahrenheit': function() {
      localStorage.setItem('preferences', JSON.stringify(this.prefs))
    },

    'prefs.hour12': function() {
      localStorage.setItem('preferences', JSON.stringify(this.prefs))
    },

    'current.icon_url': function(result) {
      if( result.indexOf('nt') >= 0 && this.current.icon == 'clear' ) {
        this.current.icon = 'moon'
      }
    }
  },

  filters: {
    rounded: function(val) {
      return typeof val == 'undefined' ? 0 : val.toFixed(0)
    }
  },

  methods: {
    update: function() {
      this.$http({
        url: this.url + this.appid + '/conditions/q/' + this.lat + ',' + this.lon + '.json',
        method: 'GET'
     }).then(function (result) {
        this.current = result.data.current_observation
      }, function (response) {
        console.log('fail')
      }),

      this.$http({
        url: this.url + this.appid + '/forecast/q/' + this.lat + ',' + this.lon + '.json',
        method: 'GET'
     }).then(function (result) {
        this.forecast = result.data.forecast.simpleforecast.forecastday
      }, function (response) {
        console.log('fail')
      })
    },

    geolocation: function() {
      var that = this
      navigator.geolocation.getCurrentPosition( function(position) {
        that.lat = position.coords.latitude.toFixed(2)
        that.lon = position.coords.longitude.toFixed(2)
      })
    },

    time: function() {
      var today = new Date()
      var h = today.getHours()
      var m = today.getMinutes()
      var s = today.getSeconds()
      m = this.parsetime(m)
      s = this.parsetime(s)

      if (h >= 12) {
        this.pm = true
      }

      if (this.prefs.hour12) {
        h = h % 12 || 12
      }

      this.clock = h + ":" + m + ":" + s
      var t = setTimeout(this.time, 500)
    },

    parsetime: function(i) {
      if (i < 10) {i = "0" + i}
      return i
    },

    parsedate: function() {
      switch (this.weekday) {
          case 0:
              this.weekday = "Sun"
              break
          case 1:
              this.weekday = "Mon"
              break
          case 2:
              this.weekday = "Tue"
              break;
          case 3:
              this.weekday = "Wed"
              break;
          case 4:
              this.weekday = "Thu"
              break;
          case 5:
              this.weekday = "Fri"
              break;
          case 6:
              this.weekday = "Sat"
              break;
      }

      switch (this.month) {
          case 0:
              this.month = "Jan"
              break
          case 1:
              this.month = "Feb"
              break
          case 2:
              this.month = "Mar"
              break
          case 3:
              this.month = "Apr"
              break
          case 4:
              this.month = "May"
              break
          case 5:
              this.month = "Jun"
              break
          case 6:
              this.month = "Jul"
              break
          case 7:
              this.month = "Aug"
              break
          case 8:
              this.month = "Sep"
              break
          case 9:
              this.month = "Oct"
              break
          case 10:
              this.month = "Nov"
              break
          case 11:
              this.month = "Dec"
              break
      }
    },

    settings: function() {
      var result = localStorage.getItem('preferences')
      this.prefs = JSON.parse(result)
      if (this.prefs == null) {
        this.prefs = { hour12: true, fahrenheit: true }
      }
    }
  }

});
