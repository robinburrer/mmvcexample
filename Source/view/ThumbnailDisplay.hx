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
import js.html.ImageElement;

/**
 * ...
 * @author robinburrer
 */
class ThumbnailDisplay extends View
{
	
	
	private var image:ImageElement;
	
	public function new () 
	{
		super();
		

		
	}	


	
	// important the drawUI method should always be triggered by the mediator 
	public  function drawUI():Void
	{
		element.style.position = "absolute";
	
		image =  js.Browser.document.createImageElement();
		
		image.style.width = "100px";
		image.style.height = "100px";
		
		element.appendChild(image);
		
		
	}
	
	
	
	
	//
	public var src(null,set):String;
	
	private function set_src(value:String):String
	{
		image.src = value;
		return value;
	}
	

}
