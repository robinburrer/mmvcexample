package service;

/**
 * ...
 * @author robinburrer
 */
interface IResponder
{
	function onResult(resultObject:Dynamic):Void;
	function onFault(FaultObject:Dynamic):Void;

}
