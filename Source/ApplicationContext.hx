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

package;

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

import controller.NotiContactsSet;
import controller.NotiSelectedContactSet;


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

		// notification signals
		injector.mapSingleton(NotiContactsSet);			
		injector.mapSingleton(NotiSelectedContactSet);
		
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