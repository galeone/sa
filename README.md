sa - Simple AJAX
================

The aim of sa is to provide a lightweight library to easy make AJAX requests.

Learning by examples
====================

## Instantiate the AJAX object

```javascript
var ajax = null;
try {
  ajax = new AJAX();
} catch(e) {
  // handle error (XMLHttpRequest object not supported)
}
```

## GET request

```javascript
ajax.get('/somepage?parmeter=wat&who=yello',function(data) {
  // handle completed get request
},
function(statusCode) { // Handle failure
  console.log(statusCode);
});
```

## POST request
```javascript
ajax.post('/somepage', function(data) {
  // Handle completed post request
}, function(statusCode) { // Handle failure
  console.log(statusCode);
}, parameters);
```

## GET Request returning JSON

```javascript
ajax.getJSON('/somepage?parmeter=wat&who=yello',function(data) {
  // Handle json return object, like:
  console.log(data.field1, data.field2);
}, function(statusCode) { // Handle failure
  console.log(statusCode);
});
```


## Generic request

You can build your own request.
```javascript
ajax.request({
url: '/wow',
  type: 'post',
  dataType: 'json',
  data: {wow: 'amazing', 'param2': 1},
  success: function(json) {
    alert(json.responseField2);
  },
  failure: function(statusCode) {
    alert("Request failed with status code: " + statusCode);
  }
});
```
In the example above we do a POST request to /wow and we expect to obtain a JSON object in respose.

We could specify JSON or XML for the expected format of the response. Empty field means HTML.

## Parameters
As you can see from the examples, you can use JSON object or a literal string to pass parameters.

To specify other parameters in `AJAX.request` you have to follow the definition below.
```javascript
//define generic ajax request parameter
{
  type: '',
  url: '',
  data: '',
  dataType: '',
  success: function(data){},
  failure: function(errorCode){}
};
```

With:

+ type = get|post
+ url = whatever you want
+ data: string|JSON
+ dataType: "JSON"|"XML"|""
+ success = function(data) {}
+ failure = function(errorCode) {}

## License

sa is licensed under the terms of MIT licence.
