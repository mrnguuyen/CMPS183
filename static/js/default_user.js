// This is the js for the default/search.html view.
var app = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings

    var enumerate = function(v) { var k=0; return v.map(function(e) {e._idx = k++;});};

    self.get_user_list = function() {
        console.log("Getting user reviews");

        if(!is_logged_in) { return; }

        $.getJSON(get_user_list_url,
            function(data) {
                self.vue.user_review_list = data.user_review_list;
                console.log(self.vue.user_review_list);
            }
        );
        
    };

    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-profile",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            is_logged_in: is_logged_in,
            user_review_list: []
        },
        methods: {
            get_user_list: self.get_user_list
        }
    });

    // If we are logged in, shows the form to add posts.
    if (is_logged_in) {
        $("#add_post").show();
    }

    self.get_user_list();

    return self;
};


var APP = null;

// No, this would evaluate it too soon.
// var APP = app();

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});