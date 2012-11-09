package service;
import vo.ContactVO;
/**
 * ...
 * @author robinburrer
 */
class DummyGetContactsService implements IGetContactsService
{
	
	public function new ()
	{	
		
		
	}	
	
	public  function getContacts(r:IResponder):Void		
	{
		var contactsArray:Array<ContactVO> = new Array<ContactVO>();
		contactsArray.push(new ContactVO("Homer", "Simpson", "03.png"));
		contactsArray.push(new ContactVO("Maggie", "Simpson", "02.png"));
		contactsArray.push(new ContactVO("Bart", "Simpson", "01.png"));
		
	
	
		r.onResult(contactsArray);
	}

}
