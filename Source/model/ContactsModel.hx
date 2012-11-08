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
