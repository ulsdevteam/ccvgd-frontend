(function(window) {
    window.env = window.env || {};
  
    // Environment variables
    window["env"]["API_ROOT"] = "${API_URL}";
    window["env"]["debug"] = "${DEBUG}";
  })(this);
