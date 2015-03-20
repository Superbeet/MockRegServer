function list_from_arrays( VisibleArray, ValueArray, ListName, FormName ){
  if (FormName == null) {
    FormName = "forms[0]"
  }else{
    FormName = "forms["+FormName+"]";
  }
  ShortName = eval("document."+FormName+"." + ListName)
  if (VisibleArray.length != ValueArray.length){
    alert ("Visible and Value arrays are not of equal size");
  }else{
    ShortName.options.length=0;
     for (i=0; i<ValueArray.length; i++) {
       ShortName.options[i]  = new Option(VisibleArray[i], ValueArray[i]);
     }
  }
}

function list_from_assoc_arrays( Assoc_Array, ListName, FormName ){
  //uses an associative array for create dropdowns
  if (FormName == null) {
    FormName = "forms[0]"
  }else{
    FormName = "forms['"+FormName+"']";
  }
  ShortName = eval("document."+FormName+"." + ListName)
  ShortName.options.length=0;
  var i=0;
  for (var assoc_name in Assoc_Array) {
    ShortName.options[i] = new Option(assoc_name, Assoc_Array[assoc_name]);
    i++;
  }
}