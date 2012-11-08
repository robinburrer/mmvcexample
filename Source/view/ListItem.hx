package view;
import js.Dom.HtmlDom;
import msignal.Signal;
/**
 * ...
 * @author robinburrer
 */
class ListItem
{
	public static var ON_CLICK:String = "ON_CLICK";

	
	public var signal(default, null):Signal2<String, ListItem>;


	public var element:HtmlDom; 
	
	private var textField:HtmlDom;
	
	
	private var _lableText:String;
	
	
	public var data(getData, null):Dynamic;
	private var _data:Dynamic;
	
	
	
	// selected property
	public var selected(getSelected, setSelected):Bool;
	
	private var _selected:Bool;
	
	
	private function getSelected():Bool
	{
		return _selected;
	}
	
	private function setSelected(value:Bool):Bool
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
	
	
	
	
	
	private function getData():Dynamic
	{	
		return _data;	
	}

	
	
	public function new (labelText:String, data:Dynamic)
	{
	
		this._data = data;
		signal = new Signal2<String, ListItem>();
	
	
		element = js.Lib.document.createElement("Div");
		element.style.position = "absolute";
		element.style.width =  "100px";		
		element.style.height = "20px";
		element.style.backgroundColor = "white";		
		textField = js.Lib.document.createElement("Div");
		element.appendChild(textField);
		textField.innerHTML = labelText;
		
		element.onclick = function (e)
		{
			signal.dispatch(ON_CLICK,this);
			
		}
	}		

}
