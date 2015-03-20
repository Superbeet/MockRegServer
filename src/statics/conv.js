/* automatically fire if we have the global variables set */

if( typeof _m360px !== "undefined" && _m360px.length > 2) {
	_firePixel();
} 

function _firePixel(_mmpx) {

	if( typeof _mmpx !== 'undefined') {
		_m360px = _mmpx;
	}

	// default domain
	var page_url = location.href;
	var page_domain = 'c2.magnify360.com';


    var url_prefix = (("https:" === document.location.protocol) ? "https://" : "http://") + page_domain + "/conv";
    var delim = (url_prefix.indexOf("?") >= 0 ? "&" : "?");
    
	/* defaults */
	_num_items = 1;
	_zipcode = null;
	_country = 'US';
	
	var _params = '';
	
	/* required fields */
	for (x in _m360px) {
		switch (_m360px[x][0]) {
			case '_setAccount':
				_client_id = _m360px[x][1];
			break;
			case '_trackRevenue':
				_total_value = _m360px[x][1];
				_params = _params+'&total_value='+escape(_total_value);
			break;
			case '_trackProduct':
				_product_cat = _m360px[x][1];
				_params = _params+'&product_cat='+escape(_product_cat);
			break;
			case '_trackOrderID':
				_order_id = _m360px[x][1];
				_params = _params+'&order_id='+escape(_order_id);
			break;
			case '_trackCartItems':
				_num_items = _m360px[x][1];
				_params = _params+'&num_items='+escape(_num_items);
			break;
			case '_trackZipCode':
				_zipcode = _m360px[x][1];
				_params = _params+'&zip_code='+escape(_zipcode);
			break;
			case '_trackCountry':
				_country = _m360px[x][1];
				_params = _params+'&country_code='+escape(_country);
			break;
			case '_setVisitor':
				_visitor_id = _m360px[x][1];
				_params = _params+'&visitor_id='+_visitor_id;
			break;
			case '_setRemoteVisitor':
				_remote_visitor = _m360px[x][1];
				_params = _params+'&remote_db_id='+_remote_visitor;
			break;
		}
	}

	/* this met the minimum for a transaction tracking */
	if(typeof _client_id !== "undefined" && typeof _total_value !== "undefined" && typeof _product_cat !== "undefined") {
	
		_params = _params+'&client_id='+_client_id;
		
		/* if visitor or remotevisitor are not provided, read it from the cookie */
		if(typeof _remote_visitor === "undefined" && typeof _visitor_id === "undefined") {
			_visitor_id = m360_get_cookie('visitor_hash_' + _client_id);
			if (typeof _visitor_id === 'undefined') {
				/* dbg('visitor_id not found in 1st party cookie, trying 3rd party cookie');  */
				_visitor_id = m360_get_3rd_cookie('visitor_hash_' + _client_id);
			}

			/* add what we found to the params */
		}

		if(typeof _remote_visitor === "undefined" && typeof _visitor_id !== "undefined") {
			_params = _params + '&visitor_id='+_visitor_id;
		}


		/* prepare the URL */		
	    var url = url_prefix + delim + 'img=1' + _params + "&page_url=" + escape(page_url);

		/* now fire it */
	    var img = new Image();
		img.src = url;

		/* execute piggyback always */
        execute_piggyback_pixel();
		
		_m360px.push(['_setAccount', _client_id]);
				
	} else{
		dbg('insuffient required parameters');
	}
		

  /* firing piggyback function */
  function execute_piggyback_pixel() {

    // launch Piggyback Pixel script
    var script_url = (("https:" === document.location.protocol) ? "https://" : "http://") + page_domain + "/piggyback.js";
    m360PiggybackConfig = {};
    m360PiggybackConfig.client_id = _client_id;
    m360PiggybackConfig.visitor_id = _visitor_id;
    m360PiggybackConfig.domain = page_domain;

    /* dbg(m360PiggybackConfig); */

    var head= document.getElementsByTagName('head')[0];
    var script= document.createElement('script');
    script.type= 'text/javascript';
    script.defer = 'defer';
    script.src = script_url;
    head.appendChild(script);

  };



}


  /* debug functions */
  function log(type, desc) {
    if (typeof(window.console) === 'object') {
      window.console.log(type + ": " + desc);
      if (typeof(desc) !== 'string') {
        window.console.dir(desc);
      }
    }
  };

  function dbg(message) {
    log('m360 Conversion Debug:', message);
  };


/* this is for piggyback cookie handling */
var m360_cookie_jsonp = (function(){

  var counter = 0, head, query, namex, window = this;

  var load = function (url) {
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
  };

  var jsonp = function (url, params, callback) {
    query = "?";
    params = params || {};
    for ( namey in params ) {
      if ( params.hasOwnProperty(namey) ) {
        query += namey + "=" + params[namey] + "&";
      }
    }
    counter++;
    var jsonp_var = "m360_cookie_json_" + counter;
    window[ jsonp_var ] = function(data){
      callback(data);
      window[ jsonp_var ] = null;
      try {
        delete window[ jsonp_var ];
      } catch (e) {}
    };

    load(url + query + "jsoncallback=" + jsonp_var);
    return jsonp_var;
  };

  return {
    get:jsonp
  };

}());



   var _m360px = _m360px || [];


var addTrans = function (client_id, order_id, num_items, total_value, country_code, zipcode, lifetime_value, product_cat) {


  if (client_id > 0) {
     _m360px.push(['_setAccount', client_id]);
  }

  if (order_id.length > 0) {
  	_m360px.push(['_trackOrderID', order_id]);
  }

  if (num_items > 0) {
 	_m360px.push(['_trackCartItems', num_items]);  
  }

  if (total_value > -1) {
	_m360px.push(['_trackRevenue', total_value]);
  } else {
    _m360px.push(['_trackRevenue', '100']);
  }

  if (zipcode === null) {
  	_m360px.push(['_trackZipCode', zipcode]);
  }

  if (country_code.length > 0) {
  	_m360px.push(['_trackCountry', country_code]);
  }

  if (product_cat.length > 0) {
  	_m360px.push(['_trackProduct', product_cat]);
  }

  /* fire it! */
  _firePixel(_m360px);
  
  
  return {
    // DEPRECATED: setDomain, left for backwards compatibility
    setDomain: function (str) {
    },
    
    submitTrans: function () {

    }
  }

}



// get cookie helper function
function m360_get_cookie(cookie_name) {
		var search = cookie_name + "=";
		var returnvalue = "";
		if (document.cookie.length > 0) {
			offset = document.cookie.indexOf(search);
			// if cookie exists
			if (offset !== -1) {
				offset += search.length;
				// set index of beginning of value
				end = document.cookie.indexOf(";", offset);
				// set index of end of cookie value
				if (end === -1) {
					end = document.cookie.length;
				}
				returnvalue = unescape(document.cookie.substring(offset, end));
			}
		}
		return returnvalue;
	};
	
	
function m360_get_3rd_cookie(cookie_name) {
		var tgt = (("https:" === document.location.protocol) ? "https://" : "http://") + "c2.magnify360.com/cook";
		var request_object = {
			'name': cookie_name
		};
		var data = '';
		m360_cookie_jsonp.get(tgt, request_object, data);
		return data.content;
	};

