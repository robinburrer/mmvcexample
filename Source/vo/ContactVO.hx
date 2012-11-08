package vo;

/**
 * ...
 * @author robinburrer
 */
class ContactVO
{
	public var firstName:String;
	public var lastName:String;
	public var thumbURL:String;
	
		
				
	public function new (firstName:String,lastName:String,thumbURL:String  )
	{
		this.firstName = firstName;
		this.lastName = lastName;
		this.thumbURL = thumbURL;		
	}		

}
