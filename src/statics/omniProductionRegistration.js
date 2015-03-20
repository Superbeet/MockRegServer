/*
Form Error
When there is error filling out a form. eg missing a field
Call this function and pass the error.
If there are multiple errors pass the entire string.
*/
function prodRegFormError(error) {
	try
	{
		window.document.omn_prodRegError(error);//This function is put in the document object via Ensighten
	}
	catch(error)
	{	}
}
		
/* 
When there is a successful product registration call this fucntion.
productFamily: pass the product family (one level below super family)
*/
		
function successfulProdRegistration(productFamily) {
	try
	{
		window.document.omn_prodRegSuccess(productFamily);//This function is put in the document object via Ensighten
	}
	catch(error)
	{	}
}