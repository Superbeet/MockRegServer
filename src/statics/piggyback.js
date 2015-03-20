(function () {

  var m360Piggyback = {};
  
  m360Piggyback.util = function () {
  
    var log = function (type, desc) {
      if (typeof(window.console) === 'object' && window.console.firebug) {
        window.console.log(type + ": " + desc);
        if (typeof(desc) !== 'string') {
          window.console.dir(desc);
        }
      }
    };
  
    return {
      debug: function (message) {
        log('m360 Piggyback Conversion Debug:', message);
      },
      get_cookie: function (c_name) {
        if (document.cookie.length > 0) {
          var begin = document.cookie.indexOf(c_name + "=");
          if (begin != -1) {
            begin += c_name.length + 1;
            var end = document.cookie.indexOf(";", begin);
            if (end == -1) {
              end = document.cookie.length;
            }
            return unescape(document.cookie.substring(begin, end));
          }
        }
        return null;
      },
      // eval code in global (window) context
      global_eval: function (src) {
        // for IE
        if (window.execScript) {
          window.execScript(src);
          return;
        }
        var fn = function() {
          window.eval.call(window,src);
        };
        fn();
      }
    };
  
  }();

  var m360_jsonp = (function(){
    var counter = 0, head, query, key, window = this;
    function load(url) {
      var script = document.createElement('script'), done = false;
      script.src = url;
      script.async = true;
 
      script.onload = script.onreadystatechange = function() {
        if ( !done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") ) {
          done = true;
          script.onload = script.onreadystatechange = null;
          if ( script && script.parentNode ) {
            script.parentNode.removeChild( script );
          }
        }
      };
      if ( !head ) {
        head = document.getElementsByTagName('head')[0];
      }
      head.appendChild( script );
    }
    function jsonp(url, params, callback) {
      query = "?";
      params = params || {};
      for ( key in params ) {
        if ( params.hasOwnProperty(key) ) {
          query += key + "=" + params[key] + "&";
        }
      }
      var jsonp = "json_conversion_" + (++counter);
      window[ jsonp ] = function(data){
        callback(data);
        window[ jsonp ] = null;
        try {
          delete window[ jsonp ];
        } catch (e) {}
      };
 
      load(url + query + "jsoncallback=" + jsonp);
      return jsonp;
    }
    return {
      get:jsonp
    };
  }());
  
  m360Piggyback.init = function () {

    var debug = m360Piggyback.util.debug;

    debug('Starting...');

    var domain = m360PiggybackConfig.domain || false;
    var cluster = m360PiggybackConfig.cluster || 2;
    var client_id = m360PiggybackConfig.client_id || false;
    var visitor_id = m360PiggybackConfig.visitor_id || false;
    var pixel_type = 'conversion';

    if (domain === false) {
      debug('no domain');
      return false;
    }

    if (client_id === false) {
      debug('no client_id');
      return false;
    }

    if (typeof(m360_piggyback_conversion_pixel_fired) == 'undefined') {
      m360_piggyback_conversion_pixel_fired = [];
    }

    if (typeof(m360_piggyback_conversion_pixel_fired[client_id]) == 'undefined') {
      m360_piggyback_conversion_pixel_fired[client_id] = true; 
      debug('piggyback pixel firing');
    } else {
      if (m360_piggyback_conversion_pixel_fired[client_id] === true) {
        debug('piggyback conversion pixel cannot be fired more than once on a page');
        return false;
      }
    }

    if (!visitor_id || parseInt(visitor_id) === 0 || visitor_id === '') {
      debug('no visitor_id passed in config, checking cookie');
      visitor_id = m360Piggyback.util.get_cookie('visitor_hash_' + client_id);
      if (visitor_id === null) {
        debug('no visitor_id in cookie, stopping piggyback request'); 
        return false;
      }
    }

    // debug('client_id: ' + client_id);
    // debug('visitor_id: ' + visitor_id);
    // debug('domain: ' + domain);
    // debug('cluster: ' + cluster);

    // jsonp request here
    var url = (("https:" == document.location.protocol) ? "https://" : "http://") + domain + "/piggyback";

    debug('url: ' + url);

    var request_object = {
      'client_id': client_id,
      'visitor_id': visitor_id,
      'pixel_type': pixel_type,
      'cluster': cluster
    };
    // debug(request_object);

    m360_jsonp.get(url, request_object, function (data) {
      debug('Appending...');

      var container_id = 'm360-piggyback-' + pixel_type;

      var body = document.getElementsByTagName('body')[0];
      var pixel_container = document.createElement('div');
      pixel_container.id = container_id;
      body.appendChild(pixel_container);

      // override document.write
      debug('Override document.write');
      var ___writeold = document.write;
      var ___writelnold = document.writeln;
      document.getElementById(container_id).innerHTML = '';
      document.write = function (str) {
        document.getElementById(container_id).innerHTML += str;
      };
      document.writeln = function (str) {
        document.getElementById(container_id).innerHTML += str;
      };
      document.write('&zwnj;'); // hack for IE

      // place html from response on page
      debug('Inserting content');
      document.getElementById(container_id).innerHTML = data;

      // eval all javascript code between script tags in target div
      var el = document.getElementById(container_id);
      var els = el.getElementsByTagName('script');
      debug('Total script elements: ' + els.length);
      for (var i = 0; i < els.length; ++i) {
        try {
          if (els[i].src !== '') {
            var script_url = els[i].src;
            debug('(' + (i+1) + ') Executing: ' + script_url);
            var head= document.getElementsByTagName('head')[0];
            var script= document.createElement('script');
            script.type= 'text/javascript';
            script.defer = 'defer';
            script.src = script_url;
            head.appendChild(script);
            // TODO wait for load here?

          } else {
            debug('(' + (i+1) + ') Executing inline script'); 
            m360Piggyback.util.global_eval(els[i].innerHTML);
          }
        } catch (e) {
          debug('Error');
          debug(e);
        }
      }

      // restore old document.write
      // m360Piggyback.util.debug('Restore document.write');
      // document.write = ___writeold;
      // document.writeln = ___writelnold;

      m360Piggyback.util.debug('Done.');
    });

  } ();

})();
