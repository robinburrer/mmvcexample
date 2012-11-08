

import view.AppView;
import view.ContactsList;
import js.Dom.HtmlDom;
class Main
{
	/**
	Instanciates the main ApplicationView and the ApplicationContext.
	This will trigger the ApplicationViewMediator and kick the application off.
	*/
	public static function main()
	{
		//var view = new AppView();
		//var view2:ContactsList = new ContactsList ();
		var view = new AppView();
		
		var context:ApplicationContext = new ApplicationContext(view);
		
	}
}