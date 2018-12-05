// This is the js for the default/search.html view.
var app = function() {
  var self = {};

  Vue.config.silent = false; // show all warnings

  var enumerate = function(v) {
    var k = 0;
    return v.map(function(e) {
      e._idx = k++;
    });
  };

  self.open_uploader = function() {
    $("div#uploader_div").show();
    self.vue.is_uploading = true;
    self.get_image();
  };

  self.close_uploader = function() {
    $("div#uploader_div").hide();
    self.vue.is_uploading = false;
    $("input#file_input").val("");
    self.get_image(); // This clears the file choice once uploaded.
  };

  self.upload_file = function(event) {
    // Reads the file.
    var input = event.target;
    var file = input.files[0];
    if (file) {
      var reader = new FileReader();

      reader.addEventListener(
        "load",
        function() {
          // An image can be represented as a data URL.
          // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
          // Here, we set the data URL of the image contained in the file to an image in the
          // HTML, causing the display of the file image.
          self.vue.img_url = reader.result;
          $.post(image_post_url, {
            image_url: reader.result
            // blog_post_id: 1 // Placeholder for more useful info.
          });
        },
        false
      );
      // Reads the file as a data URL. This triggers above event handler.
      reader.readAsDataURL(file);
    }
  };

  self.upload_complete = function(get_url) {
    // Hides the uploader div.
    self.vue.show_img = true;
    self.close_uploader();
    console.log("The file was uploaded; it is now available at " + get_url);
    // TODO: The file is uploaded.  Now you have to insert the get_url into the database, etc.
  };

  self.get_image = function() {
    console.log("Getting user profile pic");
    $.getJSON(
      image_get_url,
      {
        // blog_post_id: 1
      },
      function(data) {
        // self.vue.received_image = data.image_str;
        //ADDING IN A TEST VARIABEL
        self.vue.image_list = data.image_list;
        console.log(self.vue.image_list);
      }
    );
  };

  self.get_user_list = function() {
    console.log("Getting user reviews");

    if (!is_logged_in) {
      return;
    }

    $.getJSON(get_user_list_url, function(data) {
      self.vue.user_review_list = data.user_review_list;
      console.log(self.vue.user_review_list);
    });
  };

  // Complete as needed.
  self.vue = new Vue({
    el: "#vue-profile",
    delimiters: ["${", "}"],
    unsafeDelimiters: ["!{", "}"],
    data: {
      is_logged_in: is_logged_in,
      user_review_list: [],
      image_list: [], //MIGHT NEED TO GET RID OF THIS
      is_uploading: false,
      img_url: null,
      received_image: null,
      show_img: false,
      self_page: true
    },
    methods: {
      get_user_list: self.get_user_list,
      open_uploader: self.open_uploader,
      close_uploader: self.close_uploader,
      upload_file: self.upload_file,
      get_image: self.get_image
    }
  });

  // If we are logged in, shows the form to add posts.
  if (is_logged_in) {
    $("#add_post").show();
  }

  self.get_user_list();
  self.get_image();
  $("#vue-profile").show();

  return self;
};

var APP = null;

// No, this would evaluate it too soon.
// var APP = app();

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function() {
  APP = app();
});
