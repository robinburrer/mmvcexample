package view;
import mmvc.impl.Mediator.Mediator;
import controller.InitSignal;
import model.ContactsModel;



/**
 * ...
 * @author robinburrer
 */
class AppViewMediator extends Mediator<AppView>
{	

	@inject 
	public var initSignal:InitSignal;
	
	
	@inject 
	public var contactsModel:ContactsModel;
	
	
	public function new ()
	{	
		super();		
	}		
	
	override function onRegister()
	{
		super.onRegister();
		
		view.drawUI();
						
		// fire the init signal
		initSignal.dispatch();
	
	}



	/**
	@see mmvc.impl.Mediator
	*/
	override public function onRemove():Void
	{
		super.onRemove();
	}

}
