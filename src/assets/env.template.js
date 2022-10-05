(function(window) {
    window.env = window.env || {};
  
    // Environment variables
    window["env"]["API_ROOT"] = "http://${API_URL}:${API_URL_PORT}/";
    window["env"]["debug"] = "${DEBUG}";
  })(this);