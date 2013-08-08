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
import vo.ContactVO;
import controller.NotiContactsSet;
/**
 * ...
 * @author robinburrer
 */
 
 
class ContactsModel
{
	
	
	
	// contacts property

	@inject 
	public var notiContactsSet:NotiContactsSet;
		
	public var contacts(get, set):Array<ContactVO>;	
	
	private var _contacts:Array<ContactVO>;
	
	private function set_contacts(value:Array<ContactVO>):Array<ContactVO>
	{
	
		_contacts = value;
		notiContactsSet.contacts = _contacts;
		notiContactsSet.dispatch();
		
		return _contacts;
	
	}
	
	private function get_contacts():Array<ContactVO>
	{
		return _contacts;
	}
	
	


	// selected conact property
	@inject 
	public var notiSelectedContactSet:controller.NotiSelectedContactSet;

	
	public var selectedContact(get,set):ContactVO;
	
	private var _selectedContact:ContactVO;
	
	private function get_selectedContact():ContactVO
	{
		return _selectedContact;
	}
	
	private function set_selectedContact(value:ContactVO):ContactVO
	{
		_selectedContact = value;
		notiSelectedContactSet.selectedContact = _selectedContact;
		notiSelectedContactSet.dispatch();
		return _selectedContact;
	}
	
	
	
	
		

}
