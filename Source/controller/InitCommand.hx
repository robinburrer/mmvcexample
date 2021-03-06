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
class InitCommand extends Command implements IResponder 
{
	
	// the signal
	//@inject	
	//public var signal:InitSignal;
	
	
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
