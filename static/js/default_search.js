// This is the js for the default/search.html view.
var app = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings

    var enumerate = function(v) { var k=0; return v.map(function(e) {e._idx = k++;});};


    self.get_bikes = function() {
        $.getJSON(get_bikes_list_url,
            function(data) {
                self.vue.bikes_list = data.bikes_list;
                self.process_bikes();
            }
        );
    };

    self.search = function(str) {
        alert(str);
        var query = str;
        search_list = [];
        self.vue.bikes_list.forEach(function(element) {
            if(element.bike_name.toLowerCase().includes(query)) {
               search_list.push(element);
            }
            if(element.bike_brand.toLowerCase().includes(query)) {
               search_list.push(element);
            }
        });
        self.vue.search_list = search_list;
    };

    self.process_bikes = function() {
        enumerate(self.vue.bikes_list);
        self.vue.post_list.map(function (e) {
        });
    };

    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-search",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            bikes_list: [],
            search_list: [],
        },
        methods: {
            get_bikes: self.get_bikes,
            search: self.search
        }
    });

    self.get_bikes();

    return self;
};

var APP = null;

// No, this would evaluate it too soon.
// var APP = app();

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
