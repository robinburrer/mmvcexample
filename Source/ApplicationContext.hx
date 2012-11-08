package ;

/**
 * ...
 * @author robinburrer
 */
import mmvc.api.IViewContainer;

import view.AppView;
import view.AppViewMediator;
import view.ContactsList;
import view.ContactsListMediator;
import view.ThumbnailDisplay;
import view.ThumbnailDisplayMediator;

import controller.InitCommand;
import controller.InitSignal;
import controller.SelectContactSignal;
import controller.SelectContactCommand;

import service.IGetContactsService;
import service.DummyGetContactsService;


import model.ContactsModel;


class ApplicationContext extends mmvc.impl.Context
{

	@inject public var initSignal:InitSignal;
	

	public function new(?contextView:IViewContainer=null)
	{
		super(contextView);
	}

	/**
	Overrides startup to configure all context commands, models and mediators
	@see mmvc.impl.Context
	*/
	override public function startup()
	{
	
		
	
		// signal command mapping
		commandMap.mapSignalClass(InitSignal, InitCommand);	
		commandMap.mapSignalClass(SelectContactSignal, SelectContactCommand);				
		
		// model
		injector.mapSingleton(ContactsModel);		
		
		// service 
		injector.mapSingletonOf(IGetContactsService,DummyGetContactsService);
		
		
		// view mediator mapping		
		mediatorMap.mapView(ContactsList, ContactsListMediator);
		mediatorMap.mapView(ThumbnailDisplay, ThumbnailDisplayMediator);
		
		mediatorMap.mapView(AppView, AppViewMediator);
	
		

		
		
	}

	/**
	Overrides shutdown to remove/cleanup mappings
	@see mmvc.impl.Context
	*/
	override public function shutdown()
	{
		
	}
}