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
import mmvc.api.IViewContainer;
import vo.ContactVO;
import js.Lib;
/**
 * ...
 * @author robinburrer
 */
 
//class ContactsListView extends DataView<ContactsListView>
//class ContactsList extends View, implements IViewContainer
class ContactsList extends View
{
	// event	
	public static var ON_ITEM_CLICKED:String = "ON_ITEM_CLICKED";
	
	public var clickedData:ContactVO;
	
	// ui
	private var _listItems:Array<ListItem>;

	public function new ()
	{	
		
		super();
		element.style.position = "absolute";	
	}

	
	
	// api
	public function setDataArray(data:Array<Dynamic>):Void
	{
		_listItems = new Array<ListItem>();
	
		for( i in 0...data.length )
		{
			
			var myVo:ContactVO = data[i];
			var listItem:ListItem = new ListItem(myVo.firstName, myVo);
		
			listItem.element.style.top = i * 22 + "px";
			
			listItem.signal.add(listItemClickHandler);
			
			_listItems.push(listItem);
			element.appendChild(listItem.element);
			
		}
	
	}
	
	
	//
	public function setSelectedVO(myVO:Dynamic):Void
	{
		for( i in 0..._listItems.length )
		{
			if (_listItems[i].data == myVO)
			{
				_listItems[i].selected = true;
			}
			else
			{
				_listItems[i].selected = false;
			}
		
		}
	
	
	
	}
	
	
	

	
	
	public function listItemClickHandler(event:String, item:ListItem):Void
	{
	
	
		
		clickedData = item.data;		
		this.dispatch(ON_ITEM_CLICKED,this);
	
	}
	
	
	

	
	

	

}

