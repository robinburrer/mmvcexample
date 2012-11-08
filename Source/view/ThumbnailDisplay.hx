package view;
import js.Dom.Image;
import js.Dom.HtmlDom;
/**
 * ...
 * @author robinburrer
 */
class ThumbnailDisplay extends View
{
	
	
	private var image:Image;
	
	public function new () 
	{
		super();
		
		drawUI();
		
	}		
	
	
	private function drawUI():Void
	{
		element.style.position = "absolute";

	
		image = cast js.Lib.document.createElement("img");
		
		image.style.width = "100px";
		image.style.height = "100px";
		
		element.appendChild(image);
		
		
	}
	
	
	
	
	//
	public var src(null,setSrc):String;
	
	private function setSrc(value:String):String
	{
		image.src = value;
		return value;
	}
	

}
