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

