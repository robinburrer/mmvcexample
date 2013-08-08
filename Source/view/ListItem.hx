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

package view;
import js.html.DivElement ;

import msignal.Signal;
/**
 * ...
 * @author robinburrer
 */
class ListItem
{
	public static var ON_CLICK:String = "ON_CLICK";

	
	public var signal(default, null):Signal2<String, ListItem>;


	public var element:DivElement; 
	
	private var textField:DivElement;
	
	
	private var _lableText:String;
	
	
	public var data(get, null):Dynamic;
	private var _data:Dynamic;

	private function get_data():Dynamic
	{	
		return _data;	
	}
	
	
	
	// selected property
	public var selected(get, set):Bool;
	
	private var _selected:Bool;
	
	
	private function get_selected():Bool
	{
		return _selected;
	}
	
	private function set_selected(value:Bool):Bool
	{
		_selected = value;
		if (_selected)
		{
			element.style.backgroundColor = "#CCCCCC";
		}
		else
		{
			element.style.backgroundColor = "white";
		}
		
		return _selected;
	}
	
	
	
	
	
	

	
	
	public function new (labelText:String, data:Dynamic)
	{
	
		this._data = data;
		signal = new Signal2<String, ListItem>();
	
	
		element = js.Browser.document.createDivElement();
		element.style.position = "absolute";
		element.style.width =  "100px";		
		element.style.height = "20px";
		element.style.backgroundColor = "white";		
		textField = js.Browser.document.createDivElement();
		element.appendChild(textField);
		textField.innerHTML = labelText;
		
		element.onclick = function (e)
		{
			signal.dispatch(ON_CLICK,this);
			
		}
	}		

}
