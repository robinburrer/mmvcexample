/*
Copyright (c) Burrer UI design and development

Permission is hereby granted, free of charge, to any person obtaining a copy of 
this software and associated documentation files (the "Software"), to deal in 
the Software without restriction, including without limitation the rights to 
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies 
of the Software, and to permit persons to whom the Software is furnished to do 
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all 
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
SOFTWARE.
*/

package model;
import msignal.Signal;
import vo.ContactVO;
/**
 * ...
 * @author robinburrer
 */
 
 
class ContactsModel
{
	
	
	// use msignal to dispatch  model change "events"
	public var signal(default, null):Signal2<String, ContactsModel>;
	
	public function new () 
	{		
		signal = new Signal2<String, ContactsModel>();
	}	
	
	
	public function dispatch(event:String, model:ContactsModel)
	{
		if(model == null) model = this;
			
		signal.dispatch(event, model);
	
		
	}
	//
	
	
	
	// contacts property
	public static var CONTACTS_SET:String = "CONTACTS_SET";
	
	public var contacts(getContacts, setContacts):Array<ContactVO>;	
	
	private var _contacts:Array<ContactVO>;
	
	private function setContacts(value:Array<ContactVO>):Array<ContactVO>
	{
	
		_contacts = value;
	
		this.dispatch(CONTACTS_SET,this);
		
		return _contacts;
	
	}
	
	private function getContacts():Array<ContactVO>
	{
		return _contacts;
	}
	
	
	// selected conact property
	public static var SELECTED_CONTACT_SET:String = "SELECTED_CONTACT_SET";
	
	public var selectedContact(getSelectedContact,setSelectedContact):ContactVO;
	
	private var _selectedContact:ContactVO;
	
	private function getSelectedContact():ContactVO
	{
		return _selectedContact;
	}
	
	private function setSelectedContact(value:ContactVO):ContactVO
	{
		_selectedContact = value;
		dispatch(SELECTED_CONTACT_SET,this);
		return _selectedContact;
	}
	
	
	
	
		

}
