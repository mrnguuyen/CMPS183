// This is the js for the default/index.html view.
var app = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings

    // Extends an array
    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };

    // Enumerates an array.
    var enumerate = function(v) { var k=0; return v.map(function(e) {e._idx = k++;});};

    self.add_post = function () {
        // We disable the button, to prevent double submission.
        $.web2py.disableElement($("#add-post"));
        var sent_title = self.vue.form_title; // Makes a copy
        var sent_content = self.vue.form_content; //
        $.post(add_post_url,
            // Data we are sending.
            {
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
                    id: data.post_id,
                    post_title: sent_title,
                    post_content: sent_content
                };
                self.vue.post_list.unshift(new_post);
                // We re-enumerate the array.
                self.get_posts();
                self.vue.show_form = false;
                self.vue.show_add = true;
            });
        // If you put code here, it is run BEFORE the call comes back.
    };

    self.get_thumbs = function() {
      $.getJSON(get_thumb_state_list_url,
          function(data) {
              // I am assuming here that the server gives me a nice list
              // of posts, all ready for display.
              self.vue.thumb_state_list = data.thumb_state_list;
              // Post-processing.
              self.process_thumbs();
              console.log("I got my thumbs list");
          }
      );
    }

    self.get_posts = function() {
        $.getJSON(get_post_list_url,
            function(data) {
                // I am assuming here that the server gives me a nice list
                // of posts, all ready for display.
                self.vue.post_list = data.post_list;
                // Post-processing.
                self.process_posts();
                console.log("I got my posts list");
            }
        );
    };

    self.process_posts = function() {
        enumerate(self.vue.post_list);
        self.vue.post_list.map(function (e) {
            Vue.set(e, '_thumb_up', e.thumb_state == 'u' ? true : false);
            Vue.set(e, '_thumb_down', e.thumb_state == 'd' ? true : false);
        });
    };

    self.process_thumbs = function() {
        //enumerate(self.vue.thumb_state_list);
        self.vue.thumb_state_list.map(function (e) {
        });
    };

    var upvote = false;
    var downvote = false;
    // Smile change code.
    self.thumb_up_mouseover = function (post_idx) {
        // When we mouse over something, the face has to assume the opposite
        // of the current state, to indicate the effect.
        var p = self.vue.post_list[post_idx];
        p._thumb_up = !upvote;

        if(p.thumb_state == 'd')
        {
          p._thumb_up = true;
          p._thumb_down = false;
        }
        else if(p.thumb_state == '')
        {
          p._thumb_up = true;
          p._thumb_down = false;
        }
    };

    self.thumb_down_mouseover = function (post_idx) {
        // When we mouse over something, the face has to assume the opposite
        // of the current state, to indicate the effect.
        var p = self.vue.post_list[post_idx];
        p._thumb_down = !downvote;
        if(p.thumb_state == 'u')
        {
            p._thumb_up = false;
            p._thumb_down = true;
        }
        else if(p.thumb_state == '')
        {
          p._thumb_up = false;
          p._thumb_down = true;
        }
    };

    self.thumb_up_mouseout = function (post_idx) {
        // The like and smile status coincide again.
        var p = self.vue.post_list[post_idx];

        if(p.thumb_state == 'u')
          return;
        p._thumb_up = upvote;
        if(p.thumb_state == 'd')
        {
            p._thumb_down = !downvote;
        }
    };

    self.thumb_down_mouseout = function (post_idx) {
        // The like and smile status coincide again.
        var p = self.vue.post_list[post_idx];
        if(p.thumb_state == 'd')
          return;
        p._thumb_down = downvote;
        if(p.thumb_state == 'u')
        {
            p._thumb_up = !upvote;
        }
    };

    self.thumb_up_click = function (post_idx) {
        // The like status is toggled; the UI is not changed.
        var p = self.vue.post_list[post_idx];
        p._thump_up = !upvote;
        // We need to post back the change to the server.
        $.post(set_thumb_url, {
            post_id: p.id,
            thumb_state: p.thumb_state == 'u' ? '' : 'u'
        }); // Nothing to do upon completion.
        self.get_thumbs();
        p.thumb_state = p.thumb_state == 'u' ? '' : 'u';
        if(p.thumb_state == 'u')
        {
          p._thumb_down = false;
          p._thumb_up = true;
        }
        else if(p.thumb_state == '')
        {
          p._thumb_down = false;
          p._thumb_up = false;
        }
    };

    self.thumb_down_click = function (post_idx) {
        // The like status is toggled; the UI is not changed.
        var p = self.vue.post_list[post_idx];
        p._thump_down = !downvote;
        // We need to post back the change to the server.

        $.post(set_thumb_url, {
            post_id: p.id,
            thumb_state: p.thumb_state == 'd' ? '' : 'd'
        }); // Nothing to do upon completion.
        self.get_thumbs();
        p.thumb_state = p.thumb_state == 'd' ? '' : 'd';
        if(p.thumb_state == 'd')
        {
          p._thumb_down = true;
          p._thumb_up = false;
        }
        else if(p.thumb_state == '')
        {
          p._thumb_down = false;
          p._thumb_up = false;
        }
        //self.thumb_up_mouseover(post_idx);
        //self.thumb_up_mouseout(post_idx);
        //self.thumb_down_mouseover(post_idx);
        //self.thumb_down_mouseout(post_idx);
    };

    self.load_thumb = function (post_idx) {

      var uCount = 0;
      var dCount = 0;
      self.vue.thumb_state_list.forEach(function(element) {
        if (element.post_id == post_idx)
        {
            if(element.thumb_state == 'u') {
              uCount++;
            }
            else if(element.thumb_state == 'd') {
              dCount++;
            }
        }
      });
      return uCount - dCount;
    };

    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            form_title: "",
            form_content: "",
            post_list: [],
            thumb_state_list: [],
            show_add: true,
            show_form: false,
            is_logged_in: is_logged_in
        },
        methods: {
            add_post: self.add_post,
            // Likers.
            thumb_up_mouseover: self.thumb_up_mouseover,
            thumb_up_mouseout: self.thumb_up_mouseout,
            thumb_up_click: self.thumb_up_click,

            thumb_down_mouseover: self.thumb_down_mouseover,
            thumb_down_mouseout: self.thumb_down_mouseout,
            thumb_down_click: self.thumb_down_click,

            load_thumb: self.load_thumb,
            get_thumbs: self.get_thumbs,
        }

    });

    // If we are logged in, shows the form to add posts.
    if (is_logged_in) {
        $("#add_post").show();
    }

    // Gets the posts.
    self.get_posts();
    self.get_thumbs();

    return self;
};

var APP = null;

// No, this would evaluate it too soon.
// var APP = app();

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
