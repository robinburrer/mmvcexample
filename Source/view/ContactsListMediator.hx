package view ;
import mmvc.impl.Mediator.Mediator;
import model.ContactsModel;



import controller.SelectContactSignal;
import vo.ContactVO;
/**

 * ...
 * @author robinburrer
 */
class ContactsListMediator extends Mediator<ContactsList>
{
	@inject 
	public var contactsModel:ContactsModel;
	
	@inject 	
	public var selectContactSignal:SelectContactSignal;

	
	
	public function new () 
	{
		super();	
	
		
		
	}	
	
	override function onRegister()
	{
		super.onRegister();
	
		//view.drawUI();
		contactsModel.signal.add(contactsModelChangeHandler);
	
		
		view.signal.add(viewItemSelectedHandler);
		
		
		
	}	
	
	
	private function contactsModelChangeHandler(event:String, model:ContactsModel)
	{

		switch (event)
		{
			case ContactsModel.CONTACTS_SET:
			view.setDataArray(model.contacts);
			
			case ContactsModel.SELECTED_CONTACT_SET:
			view.setSelectedVO(model.selectedContact);
			
		
		}
	}
	
	
	
	private function viewItemSelectedHandler(event:String, myView:View):Void
	{
		
		// the propper way would be to tigger a signal which than would be mapped to a "selectContactCommand"
		// I just modify the model directly though
		//contactsModel.selectedContact = view.clickedData;
		
		selectContactSignal.selectedContact = view.clickedData;
		selectContactSignal.dispatch();
		
		
	}

}
