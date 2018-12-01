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
                Vue.set(self.vue.bike, '_id', id);
            }
        );
    };

    self.add_post = function (id) {
        
        console.log(id);

        var b = self.vue.bike[id];
        // We disable the button, to prevent double submission.
        $.web2py.disableElement($("#add-post"));
        var sent_title = self.vue.form_title; // Makes a copy 
        var sent_content = self.vue.form_content; // 
        $.post(add_post_url,
            // Data we are sending.
            {
                bike_id: id,
                post_title: self.vue.form_title,
                post_content: self.vue.form_content
            },
            // What do we do when the post succeeds?
            function (data) {
                // Re-enable the button.
                $.web2py.enableElement($("#add-post"));
                // Clears the form.
                self.vue.form_title = "";
                self.vue.form_content = "";
                // Adds the post to the list of posts. 
                var new_post = {
                    bike_id: id,
                    id: data.post_id,
                    post_title: sent_title,
                    post_content: sent_content,
                    is_author: true
                };
                self.vue.post_list.unshift(new_post);
                // We re-enumerate the array.
                self.process_posts();
                self.vue.show_form = false;
                self.process_reviews();
            });
        // If you put code here, it is run BEFORE the call comes back.
    };

    self.add_reply = function(post_idx) {
        var p = self.vue.post_list[post_idx];
        $.web2py.disableElement($("#add-reply"));
        var sent_content = self.vue.reply_content;
        $.post(add_reply_url, {
            post_id: p.id,
            reply_content: self.vue.reply_content
        }, function(data) {
            self.vue.reply_content = "";
            var new_reply = {
                id: data.reply_id,
                post_id: p.id,
                reply_content: sent_content,
                reply_author: data.reply_author,
                is_author: true
            };
            self.vue.reply_list.unshift(new_reply);
            p._show_reply_form = false;
            self.process_replies();
            self.show_reply(post_idx);
        })

    }

    self.edit_post = function(post_idx, post_titlex, post_contentx) {
        $.web2py.disableElement($("#edit-post"));
        var p = self.vue.post_list[post_idx];
        //Make a copy
        var sent_title = post_titlex;
        var sent_content = post_contentx;
        $.post(edit_post_url, {
            //Send data to api
            post_title : post_titlex,
            post_content : post_contentx,
            post_id : p.id
        }, function(data) {
            if(data == "ok") {
                p.post_title = sent_title;
                p.post_content= sent_content;
                is_author= true
                p._editing = false;
            }
        });
    };

    self.edit_reply = function(reply_idx, reply_contentx) {
        $.web2py.disableElement($("#edit-reply"));
        var r = self.vue.reply_list[reply_idx];
        console.log(reply_contentx);
        var sent_content = reply_contentx;
        $.post(edit_reply_url, {
            reply_id: r.id,
            reply_content: reply_contentx
        }, function(data) {
            if(data == "ok") {
                r.reply_content = sent_content,
                is_author = true,
                r._editing = false;
            }
        })
    }

    self.get_posts = function(id) {
        $.getJSON(get_post_list_url,
            {
                bike_id: id
            },
            function(data) {
                // I am assuming here that the server gives me a nice list
                // of posts, all ready for display.
                console.log("just received my post_list!");
                self.vue.post_list = data.post_list;
                console.log(self.vue.post_list);
                // Post-processing.
                self.process_posts();
                // self.process_reviews();
            }
        );
    };

    self.get_replies = function() {
        $.getJSON(get_replies_url, function(data) {
            self.vue.reply_list = data.reply_list;
            self.process_replies();
            console.log(self.vue.reply_list);
        })
    }

    self.get_thumbs = function() {
        $.getJSON(get_thumbs_url, function(data) {
            self.vue.thumb_list = data.thumb_list;
            console.log(self.vue.thumb_list);
        })
    };

    self.get_reply = function(post_idx) {
        var p = self.vue.post_list[post_idx];
        var this_reply_list = [];
        self.vue.reply_list.forEach(function(e) {
            if(e.post_id == p.id) {
                this_reply_list.push(e);
            }
        });

        p._reply_list = this_reply_list;
        console.log("this is p._reply_list:");
        console.log(p._reply_list);
    };

    self.get_reviews = function(id){
        var this_review_list = [];
        console.log(id);
        console.log(self.vue.post_list);
        self.vue.post_list.forEach(function(e) {
            console.log(e.bike_id);
            if(e.bike_id == id) {
                this_review_list.push(e);
            }
        });

        self.vue.review_list = this_review_list;
        console.log(self.vue.review_list);
    };

    self.process_reviews = function() {
        
        enumerate(self.vue.review_list);
        self.vue.post_list.map(function (e) { 
            Vue.set(e, '_review_list', []);
        });
    };

    self.process_posts = function() {
        // This function is used to post-process posts, after the list has been modified
        // or after we have gotten new posts. 
        // We add the _idx attribute to the posts. 
        enumerate(self.vue.post_list);
        // We initialize the smile status to match the like. 

        self.vue.post_list.map(function (e) {
            // I need to use Vue.set here, because I am adding a new watched attribute
            // to an object.  See https://vuejs.org/v2/guide/list.html#Object-Change-Detection-Caveats
            // The code below is commented out, as we don't have smiles any more. 
            // Replace it with the appropriate code for thumbs. 
            // // Did I like it? 
            // // If I do e._smile = e.like, then Vue won't see the changes to e._smile . 
            // Vue.set(e, '_smile', e.like); 

            Vue.set(e, '_thumb_up', e.thumb == 'u' ? true : false);
            Vue.set(e, '_thumb_down', e.thumb == 'd' ? true : false);
            Vue.set(e, '_gray_up', false);
            Vue.set(e, '_gray_down', false);
            Vue.set(e, '_editing', false);
            Vue.set(e, '_show_reply', false);
            Vue.set(e, '_show_reply_form', false);
            Vue.set(e, '_reply_list', []);
        });
    };

    self.process_replies = function() {
        enumerate(self.vue.reply_list);
        self.vue.reply_list.map(function (e) {
            Vue.set(e, '_editing', false);
        });
    };

    self.calculate_thumbs = function(post_idx) {
        var totalUpvote = 0;
        var totalDownvote = 0;
        var total;

        self.vue.thumb_list.forEach(function(e) {
            if(e.post_id == post_idx) {
                if(e.thumb_state == 'u') {
                    totalUpvote++;
                }
                if(e.thumb_state == 'd') {
                    totalDownvote++;
                }
            }
        });

        total = totalUpvote - totalDownvote;
        return total;
    }

    self.thumb_up_mouseover = function(post_idx) {
        var p = self.vue.post_list[post_idx];
        if (p.thumb == "d") {
            p._thumb_up = true;
            p._thumb_down = false;
            p._gray_down = false;
            p._gray_up = true;
        }
        else if (p.thumb == "u") {
            p._thumb_up = true;
            p._gray_up = false;
            p._gray_down= true;
      
        } 
        else {
            p._thumb_up= true;
            p._gray_up = true;
        }
    };

    self.thumb_up_mouseout = function(post_idx) {
        var p = self.vue.post_list[post_idx];
        if (p.thumb == "d") {
            p._thumb_down = true;
            p._thumb_up = false;
            p._gray_up = false;
        } 
        else if (p.thumb == "u") {
            p._thumb_up = true;
            p._gray_up = false;
            p._gray_down= false;
          } else {
            p._thumb_up = false;
            p._gray_up = false;
            p._gray_down= false;
          }
    }

    self.thumb_down_mouseover = function(post_idx) {
        var p = self.vue.post_list[post_idx];
        if (p.thumb == "u") {
            p._thumb_down = true;
            p._thumb_up = false;
            p._gray_up = false;
            p._gray_down = true;
        } 
        else if (p.thumb == "d") {
            p._thumb_down = true;
            p._gray_down = false;
            p._gray_up= true;
        } 
        else {
            p._thumb_down = true;
            p._gray_down = true;
        }
    };

    self.thumb_down_mouseout = function(post_idx) {
        var p = self.vue.post_list[post_idx];
        if (p.thumb == "u") {
            p._thumb_up = true;
            p._thumb_down = false;
            p._gray_down = false;
          } else if (p.thumb == "d") {
            p._thumb_down= true;
            p._gray_down = false;
            p._gray_up = false;
          } else {
            p._thumb_down = false;
            p._gray_down = false;
            p._gray_up = false;
          }
    }


    self.thumb_up_click = function(post_idx) {
        var p = self.vue.post_list[post_idx];
        
        //post the change back to server
        $.post(set_thumb_url, {
            post_id: p.id,
            thumb_state: p.thumb == 'u' ? null : 'u' 
        });
        p.thumb = p.thumb == 'u' ? null : 'u';
        p._gray_up = false;
        p._thumb_up = true;
        self.get_thumbs();
        self.get_thumbs();
    }

    //Pass which thumb for click?
    self.thumb_down_click = function(post_idx) {
        var p = self.vue.post_list[post_idx];

        //post the change back to server
        $.post(set_thumb_url, {
            post_id: p.id,
            thumb_state: p.thumb == 'd' ? null : 'd',
        });

        p.thumb = p.thumb == 'd' ? null : 'd';
        p._gray_down = false;
        p._thumb_down = true;
        self.get_thumbs();
        self.get_thumbs();
    }

    self.show_add_form = function() {
        self.vue.show_form = true;
    }

    self.show_edit_form = function(post_idx) {
        var p = self.vue.post_list[post_idx];
        p._editing = true;
    }

    self.show_edit_reply_form = function(reply_idx) {
        var r = self.vue.reply_list[reply_idx];
        r._editing = true;
    }

    self.cancel_edit = function(post_idx) {
        var p = self.vue.post_list[post_idx];
        p._editing = false;
    }

    self.show_reply = function(post_idx) {
        var p = self.vue.post_list[post_idx];
        p._show_reply = true;
        self.get_reply(post_idx);
    }

    self.hide_reply = function(post_idx) {
        var p = self.vue.post_list[post_idx];
        p._show_reply = false;
    }

    self.show_add_reply_form = function(post_idx) {
        var p = self.vue.post_list[post_idx];
        p._show_reply_form = true;
        console.log("show_add_reply_form " + self.vue.show_reply_form );
    }

    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-review",
        delimiters: ['${', '}'],
        props: ['id'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            bike: {},
            is_logged_in: is_logged_in,
            form_title: "",
            form_content: "",
            reply_content: "",
            post_list: [],
            reivew_list: [],
            thumb_list: [],
            reply_list: [],
            show_form: false,
            show_reply_form: false
        },
        methods: {
            get_bike: self.get_bike,
            get_reviews: self.get_reviews,
            add_post: self.add_post,
            add_reply: self.add_reply,
            edit_post: self.edit_post,
            edit_reply: self.edit_reply,
            get_reply: self.get_reply,
            get_replies: self.get_replies,
            cancel_edit: self.cancel_edit,
            thumb_up_mouseover: self.thumb_up_mouseover,
            thumb_up_mouseout: self.thumb_up_mouseout,
            thumb_down_mouseover: self.thumb_down_mouseover,
            thumb_down_mouseout: self.thumb_down_mouseout,
            thumb_up_click: self.thumb_up_click,
            thumb_down_click: self.thumb_down_click,
            show_thumbs: self.show_thumbs,
            hide_thumbs: self.show_thumbs,
            get_thumbs: self.get_thumbs,
            show_add_form: self.show_add_form,
            show_add_reply_form: self.show_add_reply_form,
            show_edit_form: self.show_edit_form,
            show_edit_reply_form: self.show_edit_reply_form,
            show_reply: self.show_reply,
            hide_reply: self.hide_reply,
            calculate_thumbs: self.calculate_thumbs,
        }
    });

    if (is_logged_in) {
        $("#add_post").show();
    }

    self.get_posts();

    self.get_thumbs();

    self.get_replies();

    self.get_bike(this.id);

    self.get_reviews(this.id);

    return self;
};


var APP = null;

// No, this would evaluate it too soon.
// var APP = app();

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
