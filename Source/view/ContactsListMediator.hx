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
