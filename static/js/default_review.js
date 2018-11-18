// This is the js for the default/search.html view.
var app = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings

    var enumerate = function(v) { var k=0; return v.map(function(e) {e._idx = k++;});};


    self.get_bike = function(id) {
        // var id = self.vue.bike_id;
        console.log("bike id check " + id);
        $.post(get_bike_url, {
            //send bike_id to backend
            bike_id: id
        }, function(data) {
                console.log(data.bike);
                self.vue.bike = data.bike;
                Vue.set(self.vue.bike, '_name', data.bike.bike_name);
                Vue.set(self.vue.bike, '_brand', data.bike.bike_brand);
                Vue.set(self.vue.bike, '_desc', data.bike.bike_desc);
                Vue.set(self.vue.bike, '_img', data.bike.bike_img_url);
            }
        );
    };

    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-review",
        delimiters: ['${', '}'],
        props: ['id'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            bike: {},
        },
        methods: {
            get_bike: self.get_bike,
        }
    });

    self.get_bike(this.id);

    return self;
};


var APP = null;

// No, this would evaluate it too soon.
// var APP = app();

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
