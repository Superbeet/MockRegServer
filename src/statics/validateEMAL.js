/**
 * DHTML email validation script. Courtesy of SmartWebby.com (http://www.smartwebby.com/dhtml/)
 */

function echeck(str) {
/*
        var at="@";
		var dot=".";
		var lat=str.indexOf(at);
		var lstr=str.length -1;
		var ldot=str.indexOf(dot);
		if (str.indexOf(at)==-1){
		   return false
		}

		if (str.indexOf(at)==-1 || str.indexOf(at)==0 || str.indexOf(at)==lstr){
		   return false
		}

		if (str.indexOf(dot)==-1 || str.indexOf(dot)==0 || str.indexOf(dot)==lstr){
		    return false
		}

		 if (str.indexOf(at,(lat+1))!=-1){
		    return false
		 }

		 if (str.substring(lat-1,lat)==dot || str.substring(lat+1,lat+2)==dot){
		    return false
		 }

		 if (str.indexOf(dot,(lat+2))==-1){
		    return false
		 }

		 if (str.indexOf(" ")!=-1){
		    return false
		 }
*/

    //'^[^.][^[@:;<>%#,`[:blank:]|]*@[^[@:;<>%#,`[:blank:].|]+[.][^.][^[@:;<>%#,`[:blank:]|]+$''
    //var valid = /^[a-zA-Z0-9_=+][a-zA-Z0-9_-.+=]*@([a-zA-Z0-9-]+\.)+([a-zA-Z0-9]+)$/i.test(str);
    var valid = /^[^\]\\.[@:;<>%#,`\t |][^\]\\[@:;<>%#,`\t |]*@([^\]\\[@:;<>%#,`\t .|]+[.])+[^.0-9][^\]\\[@:;<>%#,`\t 0-9|]+$/i.test(str);
    return valid;
}

function ValidateEMAL(formName,fieldName){//Call this funtion.  Should validate email only.  Will not check for empty content.
	var emailID=eval('document.'+formName+'.'+fieldName);
	if ((emailID.value==null)||(emailID.value=="")){
		return true
	}
	if (echeck(emailID.value)==false){
		return false
	}
	return true
 }
