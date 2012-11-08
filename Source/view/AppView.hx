package view ;

import mmvc.api.IViewContainer;

import js.Lib;
/**
 * ...
 * @author robinburrer
 */
class AppView extends View, implements IViewContainer
{
	public var viewAdded:Dynamic -> Void;
	public var viewRemoved:Dynamic -> Void;	
	
	
	
	public static var ON_CLICK:String = "ON_CLICK";
	
	public function new () 
	{
		
		super ();		
	
	
		
	}	
	
	
	
	/**
	Required by IViewContainer
	*/
	public function isAdded(view:Dynamic):Bool
	{
		return true;
	}	
	
	
	public function drawUI()
	{		
		element.style.position = "absolute";
		element.style.width =  "203px";		
		element.style.height = "102px";
		element.style.backgroundColor = "grey";
	
	
		var contactsList:ContactsList = new ContactsList();
		contactsList.element.style.left ="1px";
		contactsList.element.style.top ="1px";
		addChild(contactsList);
		
		var thumbNailDisplay:ThumbnailDisplay = new ThumbnailDisplay();
		thumbNailDisplay.element.style.left ="102px";
		thumbNailDisplay.element.style.top ="1px";
		addChild(thumbNailDisplay);
	
		
		
	}
	
	override public function dispatch(event:String, view:View)
	{
		switch(event)
		{
			case View.ADDED:
			{
				viewAdded(view);
			}
			case View.REMOVED:
			{
				viewRemoved(view);
			}
			default:
			{
				super.dispatch(event, view);
			}
		}
	}
	
	override function initialize()
	{
		super.initialize();
	
		// adds the app div to the document
		js.Lib.document.body.appendChild(element);
		
	
	}

}
