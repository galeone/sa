// Copyright Paolo Galeone - 2014 - Licensed under MIT License

// Define namespace
var AJAX = function(CORS){
  var xhr = false;
  
  //Closure - init XHR object on AJAX object creation
  (function() {
    var _xhr,
    activeXoptions = ["Microsoft.XmlHttp", "MSXML4.XmlHttp", "MSXML3.XmlHttp", "MSXML2.XmlHttp", "MSXML.XmlHttp"];

    try { 
      _xhr = new XMLHttpRequest(); 
    } 
    catch (e) { }

    if ( ! _xhr ) {
      var created = false; 
      for ( var i = 0 ; i < activeXoptions.length && !created ; i++ ) {
        try {
          _xhr = new ActiveXObject( activeXoptions[i] );
          created = true;
        } 
        catch (e) { } 
      }
    }

    if( ! _xhr ) {
      throw new XHRException("Your browser does not support XmlHttpRequestObject." +
          "Please update it.");
    }
    
    xhr = _xhr;
  })();
  
  // define private functions, used to make request handling smarter
  var _smartQueryString = function(parameters) {
    if(typeof(parameters) == 'string') {
      return parameters;
    }
    
    if(typeof(parameters) == 'object') {
      //Translate JSON object to a query string
      // { foo:bar, what:yellow} becomes: foo=bar&what=yellow
      var str = '';
      for(var key in parameters) {
          str += key + '=' + encodeURIComponent(parameters[key]) + '&';
      }
      
      if(str === '') {
        return false;
      }
      
      return str.slice(0, str.length - 1);
    }
    
    return false;
  };
  
  // Generic request
  var _request = function(req) {
    //abort after 30 seconds of delay in response
    var timeout = setTimeout(function() { xhr.abort();}, 30000);
    //Handle CORS
    req.url = typeof(CORS) == 'undefined' ? "//" + document.domain + req.url : req.url;
    console.log("log from _request, req.url = ", req.url);
    xhr.onreadystatechange = function() {
          //console.log("log from xhr.onreadystatechange", xhr.responseText);
          //console.log(xhr.readyState, xhr.status);
      if (xhr.readyState == 4 && xhr.status == 200) {
        if(typeof(req.success) == 'function') {
          clearTimeout(timeout);
          req.success( req.dataType && req.dataType.toUpperCase() == 'JSON' ?
              JSON.parse(xhr.responseText) :
              req.dataType && req.dataType.toUpperCase() == 'XML' ?
              xhr.responseXML :
              xhr.responseText);
        }
      } else {
        if(xhr.readyState == 4) { //call error function only when request has completed
          console.log("uhm, failing, but... ", xhr.responseText.length);
          //console.log("sa: ", req);
          if(xhr.responseText.length > 0){
            //fix some shit in FF31 and previous with local files
            clearTimeout(timeout);
            req.success( req.dataType && req.dataType.toUpperCase() == 'JSON' ?
              JSON.parse(xhr.responseText) :
              req.dataType.toUpperCase() == 'XML' ? xhr.responseXML :
              xhr.responseText);
            return;
          }
          if(typeof(req.failure) == 'function') {
            clearTimeout(timeout);
            req.failure(xhr.status);
          }
        }
      }
    };
    
    if(req.type.toLowerCase() == 'get') {
      xhr.open("GET", req.url, true);
      // Set header so the called script knows that it's an XMLHttpRequest
      xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      xhr.send();
    } else if(req.type.toLowerCase() == 'post') {
      req.data = _smartQueryString(req.data);
      xhr.open("POST", req.url , true);
      // Set header so the called script knows that it's an XMLHttpRequest
      xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
      xhr.send(req.data ? req.data : '');
    } else {
      throw new XHRException('Invalid (or unhandled) request type');
    }
  }; // _request
  
  return {
    setProgress: function(progress_function){
      xhr.onprogress = progress_function;
    },

    // generic request
    request: function(req) {
      _request(req);
    },
    
    // get request (shortcut for request)
    get: function(url, success, failure) {
      _request({
        type: 'GET',
        url: url,
        success: success,
        failure: failure
      });
    },
    // get json
    getJSON: function(url, success, failure) {
      _request({
        type: 'GET',
        url: url,
        success: success,
        failure: failure,
        dataType: 'JSON'
      });
    },
    // post request (shortcut for request)
    post: function(url, success, failure, parameters) {
      _request({
          type: 'POST',
          url: url,
          success: success,
          failure: failure,
          data: parameters
      });
    }
  };
};
