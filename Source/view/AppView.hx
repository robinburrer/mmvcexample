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
