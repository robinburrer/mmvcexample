package controller;
import mmvc.impl.Command.Command;
import js.Lib;
import service.IResponder;
import service.IGetContactsService;
import model.ContactsModel;
/**
 * ...
 * @author robinburrer
 */
class InitCommand extends Command, implements IResponder 
{
	
	// the signal
	@inject	
	public var signal:InitSignal;
	
	
	// service 
	@inject
	public var service:IGetContactsService;
	
	//model
	@inject
	public var contactsModel:ContactsModel;
	
	
	
	public function new () 
	{
		super();				
	}	
	
	
	override public function execute():Void
	{
		//js.Lib.alert("Init Commandexecute");
		commandMap.detain(this);
		service.getContacts(this);
		
	}
	
	
	
	// IResponder implementation
	public function onResult(resultObject:Dynamic):Void
	{	
		
		contactsModel.contacts = resultObject;
		contactsModel.selectedContact = contactsModel.contacts[0];
		
		commandMap.release(this);
	}
	
	public function onFault(FaultObject:Dynamic):Void
	{
	
	}
	
		
							

}
