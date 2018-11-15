// This is the js for the default/search.html view.
var app = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings

    var enumerate = function(v) { var k=0; return v.map(function(e) {e._idx = k++;});};

    self.search = function() {
      search_list = [];

      $.getJSON(get_bikes_list_url,
          function(data) {
            data.bikes_list.forEach(function(element) {

                if(element.bike_name.toLowerCase().includes(this.result.toLowerCase())) {
                   search_list.push(element);
                }
                if(element.bike_brand.toLowerCase().includes(this.result.toLowerCase())) {
                   search_list.push(element);
                }
            });
          }
      );
      return search_list;
    };

    self.process_bikes = function() {
        enumerate(self.vue.bikes_list);
    };

    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-search",
        delimiters: ['${', '}'],
        props: ['result'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            search_list: self.search(this.result)
        },
        methods: {
            search: self.search
        }
    });

    return self;
};

var APP = null;

// No, this would evaluate it too soon.
// var APP = app();

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
