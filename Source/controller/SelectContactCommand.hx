package controller;
import mmvc.impl.Command.Command;
import vo.ContactVO;
import model.ContactsModel;
/**
 * ...
 * @author robinburrer
 */
class SelectContactCommand extends Command
{
	@inject 	
	public var selectContactSignal:SelectContactSignal;
	
	
	@inject 	
	public var contactsModel:ContactsModel;
	
	
	public function new ()
	{
		super();
		
		
	}		
	
	public override function execute():Void
	{
		contactsModel.selectedContact = selectContactSignal.selectedContact;

	
	}
	

}
