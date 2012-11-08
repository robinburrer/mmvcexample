package view;
import mmvc.impl.Mediator.Mediator;
import model.ContactsModel;

/**
 * ...
 * @author robinburrer
 */
class ThumbnailDisplayMediator extends Mediator<ThumbnailDisplay>
{
	
	
	
	@inject
	public var contactsModel:ContactsModel;
	
	
	
	public function new () 
	{
		super();
		
		
	}	
	
		
	public override function onRegister():Void
	{
		super.onRegister();
		contactsModel.signal.add(contactsModelChangeHandler);
	}			




	private function contactsModelChangeHandler(event:String, model:ContactsModel):Void
	{
		if (event == ContactsModel.SELECTED_CONTACT_SET)
		{
			
			view.src = "images/" + contactsModel.selectedContact.thumbURL;
		}
	
	
	}
}
