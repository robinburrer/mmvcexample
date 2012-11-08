var $hxClasses = $hxClasses || {},$estr = function() { return js.Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function inherit() {}; inherit.prototype = from; var proto = new inherit();
	for (var name in fields) proto[name] = fields[name];
	return proto;
}
var mmvc = mmvc || {}
if(!mmvc.api) mmvc.api = {}
mmvc.api.IContext = $hxClasses["mmvc.api.IContext"] = function() { }
mmvc.api.IContext.__name__ = ["mmvc","api","IContext"];
mmvc.api.IContext.prototype = {
	commandMap: null
	,__class__: mmvc.api.IContext
	,__properties__: {get_commandMap:"get_commandMap"}
}
if(!mmvc.impl) mmvc.impl = {}
mmvc.impl.Context = $hxClasses["mmvc.impl.Context"] = function(contextView,autoStartup) {
	if(autoStartup == null) autoStartup = true;
	this.autoStartup = autoStartup;
	this.set_contextView(contextView);
};
mmvc.impl.Context.__name__ = ["mmvc","impl","Context"];
mmvc.impl.Context.__interfaces__ = [mmvc.api.IContext];
mmvc.impl.Context.prototype = {
	createChildInjector: function() {
		return this.get_injector().createChildInjector();
	}
	,createInjector: function() {
		this.injector = new minject.Injector();
		return this.get_injector();
	}
	,checkAutoStartup: function() {
		if(this.autoStartup && this.contextView != null) this.startup();
	}
	,mapInjections: function() {
		this.get_injector().mapValue(minject.Reflector,this.get_reflector());
		this.get_injector().mapValue(minject.Injector,this.get_injector());
		this.get_injector().mapValue(mmvc.api.IViewContainer,this.contextView);
		this.get_injector().mapValue(mmvc.api.ICommandMap,this.get_commandMap());
		this.get_injector().mapValue(mmvc.api.IMediatorMap,this.get_mediatorMap());
		this.get_injector().mapValue(mmvc.api.IViewMap,this.get_viewMap());
	}
	,get_viewMap: function() {
		if(this.viewMap == null) this.viewMap = new mmvc.base.ViewMap(this.contextView,this.get_injector());
		return this.viewMap;
	}
	,get_mediatorMap: function() {
		if(this.mediatorMap == null) this.mediatorMap = new mmvc.base.MediatorMap(this.contextView,this.createChildInjector(),this.get_reflector());
		return this.mediatorMap;
	}
	,get_commandMap: function() {
		if(this.commandMap == null) this.commandMap = new mmvc.base.CommandMap(this.createChildInjector());
		return this.commandMap;
	}
	,get_reflector: function() {
		if(this.reflector == null) this.reflector = new minject.Reflector();
		return this.reflector;
	}
	,get_injector: function() {
		if(this.injector == null) return this.createInjector();
		return this.injector;
	}
	,set_contextView: function(value) {
		if(this.contextView != value) {
			this.contextView = value;
			this.commandMap = null;
			this.mediatorMap = null;
			this.viewMap = null;
			this.mapInjections();
			this.checkAutoStartup();
		}
		return value;
	}
	,shutdown: function() {
	}
	,startup: function() {
	}
	,viewMap: null
	,reflector: null
	,mediatorMap: null
	,injector: null
	,commandMap: null
	,contextView: null
	,autoStartup: null
	,__class__: mmvc.impl.Context
	,__properties__: {set_contextView:"set_contextView",get_commandMap:"get_commandMap",get_injector:"get_injector",get_mediatorMap:"get_mediatorMap",get_reflector:"get_reflector",get_viewMap:"get_viewMap"}
}
var ApplicationContext = $hxClasses["ApplicationContext"] = function(contextView) {
	mmvc.impl.Context.call(this,contextView);
};
ApplicationContext.__name__ = ["ApplicationContext"];
ApplicationContext.__super__ = mmvc.impl.Context;
ApplicationContext.prototype = $extend(mmvc.impl.Context.prototype,{
	shutdown: function() {
	}
	,startup: function() {
		this.get_commandMap().mapSignalClass(controller.InitSignal,controller.InitCommand);
		this.get_commandMap().mapSignalClass(controller.SelectContactSignal,controller.SelectContactCommand);
		this.get_injector().mapSingleton(model.ContactsModel);
		this.get_injector().mapSingletonOf(service.IGetContactsService,service.DummyGetContactsService);
		this.get_mediatorMap().mapView(view.ContactsList,view.ContactsListMediator);
		this.get_mediatorMap().mapView(view.ThumbnailDisplay,view.ThumbnailDisplayMediator);
		this.get_mediatorMap().mapView(view.AppView,view.AppViewMediator);
	}
	,initSignal: null
	,__class__: ApplicationContext
});
var Hash = $hxClasses["Hash"] = function() {
	this.h = { };
};
Hash.__name__ = ["Hash"];
Hash.prototype = {
	toString: function() {
		var s = new StringBuf();
		s.b += Std.string("{");
		var it = this.keys();
		while( it.hasNext() ) {
			var i = it.next();
			s.b += Std.string(i);
			s.b += Std.string(" => ");
			s.b += Std.string(Std.string(this.get(i)));
			if(it.hasNext()) s.b += Std.string(", ");
		}
		s.b += Std.string("}");
		return s.b;
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref["$" + i];
		}};
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,remove: function(key) {
		key = "$" + key;
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,set: function(key,value) {
		this.h["$" + key] = value;
	}
	,h: null
	,__class__: Hash
}
var HxOverrides = $hxClasses["HxOverrides"] = function() { }
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d < 10?"0" + d:"" + d) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
}
HxOverrides.strDate = function(s) {
	switch(s.length) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k = s.split("-");
		return new Date(k[0],k[1] - 1,k[2],0,0,0);
	case 19:
		var k = s.split(" ");
		var y = k[0].split("-");
		var t = k[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw "Invalid date format : " + s;
	}
}
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
}
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
}
HxOverrides.remove = function(a,obj) {
	var i = 0;
	var l = a.length;
	while(i < l) {
		if(a[i] == obj) {
			a.splice(i,1);
			return true;
		}
		i++;
	}
	return false;
}
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
}
var IntIter = $hxClasses["IntIter"] = function(min,max) {
	this.min = min;
	this.max = max;
};
IntIter.__name__ = ["IntIter"];
IntIter.prototype = {
	next: function() {
		return this.min++;
	}
	,hasNext: function() {
		return this.min < this.max;
	}
	,max: null
	,min: null
	,__class__: IntIter
}
var Lambda = $hxClasses["Lambda"] = function() { }
Lambda.__name__ = ["Lambda"];
Lambda.array = function(it) {
	var a = new Array();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		a.push(i);
	}
	return a;
}
Lambda.list = function(it) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		l.add(i);
	}
	return l;
}
Lambda.map = function(it,f) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(f(x));
	}
	return l;
}
Lambda.mapi = function(it,f) {
	var l = new List();
	var i = 0;
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(f(i++,x));
	}
	return l;
}
Lambda.has = function(it,elt,cmp) {
	if(cmp == null) {
		var $it0 = $iterator(it)();
		while( $it0.hasNext() ) {
			var x = $it0.next();
			if(x == elt) return true;
		}
	} else {
		var $it1 = $iterator(it)();
		while( $it1.hasNext() ) {
			var x = $it1.next();
			if(cmp(x,elt)) return true;
		}
	}
	return false;
}
Lambda.exists = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) return true;
	}
	return false;
}
Lambda.foreach = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(!f(x)) return false;
	}
	return true;
}
Lambda.iter = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		f(x);
	}
}
Lambda.filter = function(it,f) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) l.add(x);
	}
	return l;
}
Lambda.fold = function(it,f,first) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		first = f(x,first);
	}
	return first;
}
Lambda.count = function(it,pred) {
	var n = 0;
	if(pred == null) {
		var $it0 = $iterator(it)();
		while( $it0.hasNext() ) {
			var _ = $it0.next();
			n++;
		}
	} else {
		var $it1 = $iterator(it)();
		while( $it1.hasNext() ) {
			var x = $it1.next();
			if(pred(x)) n++;
		}
	}
	return n;
}
Lambda.empty = function(it) {
	return !$iterator(it)().hasNext();
}
Lambda.indexOf = function(it,v) {
	var i = 0;
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var v2 = $it0.next();
		if(v == v2) return i;
		i++;
	}
	return -1;
}
Lambda.concat = function(a,b) {
	var l = new List();
	var $it0 = $iterator(a)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(x);
	}
	var $it1 = $iterator(b)();
	while( $it1.hasNext() ) {
		var x = $it1.next();
		l.add(x);
	}
	return l;
}
var List = $hxClasses["List"] = function() {
	this.length = 0;
};
List.__name__ = ["List"];
List.prototype = {
	map: function(f) {
		var b = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			b.add(f(v));
		}
		return b;
	}
	,filter: function(f) {
		var l2 = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			if(f(v)) l2.add(v);
		}
		return l2;
	}
	,join: function(sep) {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		while(l != null) {
			if(first) first = false; else s.b += Std.string(sep);
			s.b += Std.string(l[0]);
			l = l[1];
		}
		return s.b;
	}
	,toString: function() {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		s.b += Std.string("{");
		while(l != null) {
			if(first) first = false; else s.b += Std.string(", ");
			s.b += Std.string(Std.string(l[0]));
			l = l[1];
		}
		s.b += Std.string("}");
		return s.b;
	}
	,iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
	,remove: function(v) {
		var prev = null;
		var l = this.h;
		while(l != null) {
			if(l[0] == v) {
				if(prev == null) this.h = l[1]; else prev[1] = l[1];
				if(this.q == l) this.q = prev;
				this.length--;
				return true;
			}
			prev = l;
			l = l[1];
		}
		return false;
	}
	,clear: function() {
		this.h = null;
		this.q = null;
		this.length = 0;
	}
	,isEmpty: function() {
		return this.h == null;
	}
	,pop: function() {
		if(this.h == null) return null;
		var x = this.h[0];
		this.h = this.h[1];
		if(this.h == null) this.q = null;
		this.length--;
		return x;
	}
	,last: function() {
		return this.q == null?null:this.q[0];
	}
	,first: function() {
		return this.h == null?null:this.h[0];
	}
	,push: function(item) {
		var x = [item,this.h];
		this.h = x;
		if(this.q == null) this.q = x;
		this.length++;
	}
	,add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,length: null
	,q: null
	,h: null
	,__class__: List
}
var Main = $hxClasses["Main"] = function() { }
Main.__name__ = ["Main"];
Main.main = function() {
	var view1 = new view.AppView();
	var context = new ApplicationContext(view1);
}
var Reflect = $hxClasses["Reflect"] = function() { }
Reflect.__name__ = ["Reflect"];
Reflect.hasField = function(o,field) {
	return Object.prototype.hasOwnProperty.call(o,field);
}
Reflect.field = function(o,field) {
	var v = null;
	try {
		v = o[field];
	} catch( e ) {
	}
	return v;
}
Reflect.setField = function(o,field,value) {
	o[field] = value;
}
Reflect.getProperty = function(o,field) {
	var tmp;
	return o == null?null:o.__properties__ && (tmp = o.__properties__["get_" + field])?o[tmp]():o[field];
}
Reflect.setProperty = function(o,field,value) {
	var tmp;
	if(o.__properties__ && (tmp = o.__properties__["set_" + field])) o[tmp](value); else o[field] = value;
}
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
}
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
}
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
}
Reflect.compare = function(a,b) {
	return a == b?0:a > b?1:-1;
}
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
}
Reflect.isObject = function(v) {
	if(v == null) return false;
	var t = typeof(v);
	return t == "string" || t == "object" && !v.__enum__ || t == "function" && (v.__name__ || v.__ename__);
}
Reflect.deleteField = function(o,f) {
	if(!Reflect.hasField(o,f)) return false;
	delete(o[f]);
	return true;
}
Reflect.copy = function(o) {
	var o2 = { };
	var _g = 0, _g1 = Reflect.fields(o);
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		o2[f] = Reflect.field(o,f);
	}
	return o2;
}
Reflect.makeVarArgs = function(f) {
	return function() {
		var a = Array.prototype.slice.call(arguments);
		return f(a);
	};
}
var Std = $hxClasses["Std"] = function() { }
Std.__name__ = ["Std"];
Std["is"] = function(v,t) {
	return js.Boot.__instanceof(v,t);
}
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
Std["int"] = function(x) {
	return x | 0;
}
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
}
Std.parseFloat = function(x) {
	return parseFloat(x);
}
Std.random = function(x) {
	return Math.floor(Math.random() * x);
}
var StringBuf = $hxClasses["StringBuf"] = function() {
	this.b = "";
};
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	toString: function() {
		return this.b;
	}
	,addSub: function(s,pos,len) {
		this.b += HxOverrides.substr(s,pos,len);
	}
	,addChar: function(c) {
		this.b += String.fromCharCode(c);
	}
	,add: function(x) {
		this.b += Std.string(x);
	}
	,b: null
	,__class__: StringBuf
}
var ValueType = $hxClasses["ValueType"] = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] }
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
var Type = $hxClasses["Type"] = function() { }
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	return o.__class__;
}
Type.getEnum = function(o) {
	if(o == null) return null;
	return o.__enum__;
}
Type.getSuperClass = function(c) {
	return c.__super__;
}
Type.getClassName = function(c) {
	var a = c.__name__;
	return a.join(".");
}
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
}
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
}
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || !e.__ename__) return null;
	return e;
}
Type.createInstance = function(cl,args) {
	switch(args.length) {
	case 0:
		return new cl();
	case 1:
		return new cl(args[0]);
	case 2:
		return new cl(args[0],args[1]);
	case 3:
		return new cl(args[0],args[1],args[2]);
	case 4:
		return new cl(args[0],args[1],args[2],args[3]);
	case 5:
		return new cl(args[0],args[1],args[2],args[3],args[4]);
	case 6:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
	case 7:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
	case 8:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
	default:
		throw "Too many arguments";
	}
	return null;
}
Type.createEmptyInstance = function(cl) {
	function empty() {}; empty.prototype = cl.prototype;
	return new empty();
}
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw "No such constructor " + constr;
	if(Reflect.isFunction(f)) {
		if(params == null) throw "Constructor " + constr + " need parameters";
		return f.apply(e,params);
	}
	if(params != null && params.length != 0) throw "Constructor " + constr + " does not need parameters";
	return f;
}
Type.createEnumIndex = function(e,index,params) {
	var c = e.__constructs__[index];
	if(c == null) throw index + " is not a valid enum constructor index";
	return Type.createEnum(e,c,params);
}
Type.getInstanceFields = function(c) {
	var a = [];
	for(var i in c.prototype) a.push(i);
	HxOverrides.remove(a,"__class__");
	HxOverrides.remove(a,"__properties__");
	return a;
}
Type.getClassFields = function(c) {
	var a = Reflect.fields(c);
	HxOverrides.remove(a,"__name__");
	HxOverrides.remove(a,"__interfaces__");
	HxOverrides.remove(a,"__properties__");
	HxOverrides.remove(a,"__super__");
	HxOverrides.remove(a,"prototype");
	return a;
}
Type.getEnumConstructs = function(e) {
	var a = e.__constructs__;
	return a.slice();
}
Type["typeof"] = function(v) {
	switch(typeof(v)) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c = v.__class__;
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ || v.__ename__) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
}
Type.enumEq = function(a,b) {
	if(a == b) return true;
	try {
		if(a[0] != b[0]) return false;
		var _g1 = 2, _g = a.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(!Type.enumEq(a[i],b[i])) return false;
		}
		var e = a.__enum__;
		if(e != b.__enum__ || e == null) return false;
	} catch( e ) {
		return false;
	}
	return true;
}
Type.enumConstructor = function(e) {
	return e[0];
}
Type.enumParameters = function(e) {
	return e.slice(2);
}
Type.enumIndex = function(e) {
	return e[1];
}
Type.allEnums = function(e) {
	var all = [];
	var cst = e.__constructs__;
	var _g = 0;
	while(_g < cst.length) {
		var c = cst[_g];
		++_g;
		var v = Reflect.field(e,c);
		if(!Reflect.isFunction(v)) all.push(v);
	}
	return all;
}
mmvc.api.ICommand = $hxClasses["mmvc.api.ICommand"] = function() { }
mmvc.api.ICommand.__name__ = ["mmvc","api","ICommand"];
mmvc.api.ICommand.prototype = {
	execute: null
	,__class__: mmvc.api.ICommand
}
mmvc.impl.Command = $hxClasses["mmvc.impl.Command"] = function() {
};
mmvc.impl.Command.__name__ = ["mmvc","impl","Command"];
mmvc.impl.Command.__interfaces__ = [mmvc.api.ICommand];
mmvc.impl.Command.prototype = {
	execute: function() {
	}
	,mediatorMap: null
	,injector: null
	,commandMap: null
	,contextView: null
	,__class__: mmvc.impl.Command
}
var service = service || {}
service.IResponder = $hxClasses["service.IResponder"] = function() { }
service.IResponder.__name__ = ["service","IResponder"];
service.IResponder.prototype = {
	onFault: null
	,onResult: null
	,__class__: service.IResponder
}
var controller = controller || {}
controller.InitCommand = $hxClasses["controller.InitCommand"] = function() {
	mmvc.impl.Command.call(this);
};
controller.InitCommand.__name__ = ["controller","InitCommand"];
controller.InitCommand.__interfaces__ = [service.IResponder];
controller.InitCommand.__super__ = mmvc.impl.Command;
controller.InitCommand.prototype = $extend(mmvc.impl.Command.prototype,{
	onFault: function(FaultObject) {
	}
	,onResult: function(resultObject) {
		this.contactsModel.setContacts(resultObject);
		this.contactsModel.setSelectedContact(this.contactsModel.getContacts()[0]);
		this.commandMap.release(this);
	}
	,execute: function() {
		this.commandMap.detain(this);
		this.service.getContacts(this);
	}
	,contactsModel: null
	,service: null
	,signal: null
	,__class__: controller.InitCommand
});
var msignal = msignal || {}
msignal.Signal = $hxClasses["msignal.Signal"] = function(valueClasses) {
	if(valueClasses == null) valueClasses = [];
	this.valueClasses = valueClasses;
	this.slots = msignal.SlotList.NIL;
	this.priorityBased = false;
};
msignal.Signal.__name__ = ["msignal","Signal"];
msignal.Signal.prototype = {
	get_numListeners: function() {
		return this.slots.get_length();
	}
	,createSlot: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		return null;
	}
	,registrationPossible: function(listener,once) {
		if(!this.slots.nonEmpty) return true;
		var existingSlot = this.slots.find(listener);
		if(existingSlot == null) return true;
		if(existingSlot.once != once) throw "You cannot addOnce() then add() the same listener without removing the relationship first.";
		return false;
	}
	,registerListener: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		if(this.registrationPossible(listener,once)) {
			var newSlot = this.createSlot(listener,once,priority);
			if(!this.priorityBased && priority != 0) this.priorityBased = true;
			if(!this.priorityBased && priority == 0) this.slots = this.slots.prepend(newSlot); else this.slots = this.slots.insertWithPriority(newSlot);
			return newSlot;
		}
		return this.slots.find(listener);
	}
	,removeAll: function() {
		this.slots = msignal.SlotList.NIL;
	}
	,remove: function(listener) {
		var slot = this.slots.find(listener);
		if(slot == null) return null;
		this.slots = this.slots.filterNot(listener);
		return slot;
	}
	,addOnceWithPriority: function(listener,priority) {
		if(priority == null) priority = 0;
		return this.registerListener(listener,true,priority);
	}
	,addWithPriority: function(listener,priority) {
		if(priority == null) priority = 0;
		return this.registerListener(listener,false,priority);
	}
	,addOnce: function(listener) {
		return this.registerListener(listener,true);
	}
	,add: function(listener) {
		return this.registerListener(listener);
	}
	,priorityBased: null
	,slots: null
	,numListeners: null
	,valueClasses: null
	,__class__: msignal.Signal
	,__properties__: {get_numListeners:"get_numListeners"}
}
msignal.Signal0 = $hxClasses["msignal.Signal0"] = function() {
	msignal.Signal.call(this);
};
msignal.Signal0.__name__ = ["msignal","Signal0"];
msignal.Signal0.__super__ = msignal.Signal;
msignal.Signal0.prototype = $extend(msignal.Signal.prototype,{
	createSlot: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		return new msignal.Slot0(this,listener,once,priority);
	}
	,dispatch: function() {
		var slotsToProcess = this.slots;
		while(slotsToProcess.nonEmpty) {
			slotsToProcess.head.execute();
			slotsToProcess = slotsToProcess.tail;
		}
	}
	,__class__: msignal.Signal0
});
controller.InitSignal = $hxClasses["controller.InitSignal"] = function() {
	msignal.Signal0.call(this);
};
controller.InitSignal.__name__ = ["controller","InitSignal"];
controller.InitSignal.__super__ = msignal.Signal0;
controller.InitSignal.prototype = $extend(msignal.Signal0.prototype,{
	__class__: controller.InitSignal
});
controller.SelectContactCommand = $hxClasses["controller.SelectContactCommand"] = function() {
	mmvc.impl.Command.call(this);
};
controller.SelectContactCommand.__name__ = ["controller","SelectContactCommand"];
controller.SelectContactCommand.__super__ = mmvc.impl.Command;
controller.SelectContactCommand.prototype = $extend(mmvc.impl.Command.prototype,{
	execute: function() {
		this.contactsModel.setSelectedContact(this.selectContactSignal.selectedContact);
	}
	,contactsModel: null
	,selectContactSignal: null
	,__class__: controller.SelectContactCommand
});
controller.SelectContactSignal = $hxClasses["controller.SelectContactSignal"] = function() {
	msignal.Signal0.call(this);
};
controller.SelectContactSignal.__name__ = ["controller","SelectContactSignal"];
controller.SelectContactSignal.__super__ = msignal.Signal0;
controller.SelectContactSignal.prototype = $extend(msignal.Signal0.prototype,{
	selectedContact: null
	,__class__: controller.SelectContactSignal
});
var haxe = haxe || {}
haxe.Log = $hxClasses["haxe.Log"] = function() { }
haxe.Log.__name__ = ["haxe","Log"];
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
}
haxe.Log.clear = function() {
	js.Boot.__clear_trace();
}
haxe.Timer = $hxClasses["haxe.Timer"] = function(time_ms) {
	var me = this;
	this.id = window.setInterval(function() {
		me.run();
	},time_ms);
};
haxe.Timer.__name__ = ["haxe","Timer"];
haxe.Timer.delay = function(f,time_ms) {
	var t = new haxe.Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
}
haxe.Timer.measure = function(f,pos) {
	var t0 = haxe.Timer.stamp();
	var r = f();
	haxe.Log.trace(haxe.Timer.stamp() - t0 + "s",pos);
	return r;
}
haxe.Timer.stamp = function() {
	return new Date().getTime() / 1000;
}
haxe.Timer.prototype = {
	run: function() {
	}
	,stop: function() {
		if(this.id == null) return;
		window.clearInterval(this.id);
		this.id = null;
	}
	,id: null
	,__class__: haxe.Timer
}
if(!haxe.rtti) haxe.rtti = {}
haxe.rtti.CType = $hxClasses["haxe.rtti.CType"] = { __ename__ : ["haxe","rtti","CType"], __constructs__ : ["CUnknown","CEnum","CClass","CTypedef","CFunction","CAnonymous","CDynamic"] }
haxe.rtti.CType.CUnknown = ["CUnknown",0];
haxe.rtti.CType.CUnknown.toString = $estr;
haxe.rtti.CType.CUnknown.__enum__ = haxe.rtti.CType;
haxe.rtti.CType.CEnum = function(name,params) { var $x = ["CEnum",1,name,params]; $x.__enum__ = haxe.rtti.CType; $x.toString = $estr; return $x; }
haxe.rtti.CType.CClass = function(name,params) { var $x = ["CClass",2,name,params]; $x.__enum__ = haxe.rtti.CType; $x.toString = $estr; return $x; }
haxe.rtti.CType.CTypedef = function(name,params) { var $x = ["CTypedef",3,name,params]; $x.__enum__ = haxe.rtti.CType; $x.toString = $estr; return $x; }
haxe.rtti.CType.CFunction = function(args,ret) { var $x = ["CFunction",4,args,ret]; $x.__enum__ = haxe.rtti.CType; $x.toString = $estr; return $x; }
haxe.rtti.CType.CAnonymous = function(fields) { var $x = ["CAnonymous",5,fields]; $x.__enum__ = haxe.rtti.CType; $x.toString = $estr; return $x; }
haxe.rtti.CType.CDynamic = function(t) { var $x = ["CDynamic",6,t]; $x.__enum__ = haxe.rtti.CType; $x.toString = $estr; return $x; }
haxe.rtti.Rights = $hxClasses["haxe.rtti.Rights"] = { __ename__ : ["haxe","rtti","Rights"], __constructs__ : ["RNormal","RNo","RCall","RMethod","RDynamic","RInline"] }
haxe.rtti.Rights.RNormal = ["RNormal",0];
haxe.rtti.Rights.RNormal.toString = $estr;
haxe.rtti.Rights.RNormal.__enum__ = haxe.rtti.Rights;
haxe.rtti.Rights.RNo = ["RNo",1];
haxe.rtti.Rights.RNo.toString = $estr;
haxe.rtti.Rights.RNo.__enum__ = haxe.rtti.Rights;
haxe.rtti.Rights.RCall = function(m) { var $x = ["RCall",2,m]; $x.__enum__ = haxe.rtti.Rights; $x.toString = $estr; return $x; }
haxe.rtti.Rights.RMethod = ["RMethod",3];
haxe.rtti.Rights.RMethod.toString = $estr;
haxe.rtti.Rights.RMethod.__enum__ = haxe.rtti.Rights;
haxe.rtti.Rights.RDynamic = ["RDynamic",4];
haxe.rtti.Rights.RDynamic.toString = $estr;
haxe.rtti.Rights.RDynamic.__enum__ = haxe.rtti.Rights;
haxe.rtti.Rights.RInline = ["RInline",5];
haxe.rtti.Rights.RInline.toString = $estr;
haxe.rtti.Rights.RInline.__enum__ = haxe.rtti.Rights;
haxe.rtti.TypeTree = $hxClasses["haxe.rtti.TypeTree"] = { __ename__ : ["haxe","rtti","TypeTree"], __constructs__ : ["TPackage","TClassdecl","TEnumdecl","TTypedecl"] }
haxe.rtti.TypeTree.TPackage = function(name,full,subs) { var $x = ["TPackage",0,name,full,subs]; $x.__enum__ = haxe.rtti.TypeTree; $x.toString = $estr; return $x; }
haxe.rtti.TypeTree.TClassdecl = function(c) { var $x = ["TClassdecl",1,c]; $x.__enum__ = haxe.rtti.TypeTree; $x.toString = $estr; return $x; }
haxe.rtti.TypeTree.TEnumdecl = function(e) { var $x = ["TEnumdecl",2,e]; $x.__enum__ = haxe.rtti.TypeTree; $x.toString = $estr; return $x; }
haxe.rtti.TypeTree.TTypedecl = function(t) { var $x = ["TTypedecl",3,t]; $x.__enum__ = haxe.rtti.TypeTree; $x.toString = $estr; return $x; }
haxe.rtti.TypeApi = $hxClasses["haxe.rtti.TypeApi"] = function() { }
haxe.rtti.TypeApi.__name__ = ["haxe","rtti","TypeApi"];
haxe.rtti.TypeApi.typeInfos = function(t) {
	var inf;
	var $e = (t);
	switch( $e[1] ) {
	case 1:
		var c = $e[2];
		inf = c;
		break;
	case 2:
		var e = $e[2];
		inf = e;
		break;
	case 3:
		var t1 = $e[2];
		inf = t1;
		break;
	case 0:
		throw "Unexpected Package";
		break;
	}
	return inf;
}
haxe.rtti.TypeApi.isVar = function(t) {
	return (function($this) {
		var $r;
		switch( (t)[1] ) {
		case 4:
			$r = false;
			break;
		default:
			$r = true;
		}
		return $r;
	}(this));
}
haxe.rtti.TypeApi.leq = function(f,l1,l2) {
	var it = l2.iterator();
	var $it0 = l1.iterator();
	while( $it0.hasNext() ) {
		var e1 = $it0.next();
		if(!it.hasNext()) return false;
		var e2 = it.next();
		if(!f(e1,e2)) return false;
	}
	if(it.hasNext()) return false;
	return true;
}
haxe.rtti.TypeApi.rightsEq = function(r1,r2) {
	if(r1 == r2) return true;
	var $e = (r1);
	switch( $e[1] ) {
	case 2:
		var m1 = $e[2];
		var $e = (r2);
		switch( $e[1] ) {
		case 2:
			var m2 = $e[2];
			return m1 == m2;
		default:
		}
		break;
	default:
	}
	return false;
}
haxe.rtti.TypeApi.typeEq = function(t1,t2) {
	var $e = (t1);
	switch( $e[1] ) {
	case 0:
		return t2 == haxe.rtti.CType.CUnknown;
	case 1:
		var params = $e[3], name = $e[2];
		var $e = (t2);
		switch( $e[1] ) {
		case 1:
			var params2 = $e[3], name2 = $e[2];
			return name == name2 && haxe.rtti.TypeApi.leq(haxe.rtti.TypeApi.typeEq,params,params2);
		default:
		}
		break;
	case 2:
		var params = $e[3], name = $e[2];
		var $e = (t2);
		switch( $e[1] ) {
		case 2:
			var params2 = $e[3], name2 = $e[2];
			return name == name2 && haxe.rtti.TypeApi.leq(haxe.rtti.TypeApi.typeEq,params,params2);
		default:
		}
		break;
	case 3:
		var params = $e[3], name = $e[2];
		var $e = (t2);
		switch( $e[1] ) {
		case 3:
			var params2 = $e[3], name2 = $e[2];
			return name == name2 && haxe.rtti.TypeApi.leq(haxe.rtti.TypeApi.typeEq,params,params2);
		default:
		}
		break;
	case 4:
		var ret = $e[3], args = $e[2];
		var $e = (t2);
		switch( $e[1] ) {
		case 4:
			var ret2 = $e[3], args2 = $e[2];
			return haxe.rtti.TypeApi.leq(function(a,b) {
				return a.name == b.name && a.opt == b.opt && haxe.rtti.TypeApi.typeEq(a.t,b.t);
			},args,args2) && haxe.rtti.TypeApi.typeEq(ret,ret2);
		default:
		}
		break;
	case 5:
		var fields = $e[2];
		var $e = (t2);
		switch( $e[1] ) {
		case 5:
			var fields2 = $e[2];
			return haxe.rtti.TypeApi.leq(function(a,b) {
				return a.name == b.name && haxe.rtti.TypeApi.typeEq(a.t,b.t);
			},fields,fields2);
		default:
		}
		break;
	case 6:
		var t = $e[2];
		var $e = (t2);
		switch( $e[1] ) {
		case 6:
			var t21 = $e[2];
			if(t == null != (t21 == null)) return false;
			return t == null || haxe.rtti.TypeApi.typeEq(t,t21);
		default:
		}
		break;
	}
	return false;
}
haxe.rtti.TypeApi.fieldEq = function(f1,f2) {
	if(f1.name != f2.name) return false;
	if(!haxe.rtti.TypeApi.typeEq(f1.type,f2.type)) return false;
	if(f1.isPublic != f2.isPublic) return false;
	if(f1.doc != f2.doc) return false;
	if(!haxe.rtti.TypeApi.rightsEq(f1.get,f2.get)) return false;
	if(!haxe.rtti.TypeApi.rightsEq(f1.set,f2.set)) return false;
	if(f1.params == null != (f2.params == null)) return false;
	if(f1.params != null && f1.params.join(":") != f2.params.join(":")) return false;
	return true;
}
haxe.rtti.TypeApi.constructorEq = function(c1,c2) {
	if(c1.name != c2.name) return false;
	if(c1.doc != c2.doc) return false;
	if(c1.args == null != (c2.args == null)) return false;
	if(c1.args != null && !haxe.rtti.TypeApi.leq(function(a,b) {
		return a.name == b.name && a.opt == b.opt && haxe.rtti.TypeApi.typeEq(a.t,b.t);
	},c1.args,c2.args)) return false;
	return true;
}
haxe.rtti.Meta = $hxClasses["haxe.rtti.Meta"] = function() { }
haxe.rtti.Meta.__name__ = ["haxe","rtti","Meta"];
haxe.rtti.Meta.getType = function(t) {
	var meta = t.__meta__;
	return meta == null || meta.obj == null?{ }:meta.obj;
}
haxe.rtti.Meta.getStatics = function(t) {
	var meta = t.__meta__;
	return meta == null || meta.statics == null?{ }:meta.statics;
}
haxe.rtti.Meta.getFields = function(t) {
	var meta = t.__meta__;
	return meta == null || meta.fields == null?{ }:meta.fields;
}
var js = js || {}
js.Boot = $hxClasses["js.Boot"] = function() { }
js.Boot.__name__ = ["js","Boot"];
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
js.Boot.__trace = function(v,i) {
	var msg = i != null?i.fileName + ":" + i.lineNumber + ": ":"";
	msg += js.Boot.__string_rec(v,"");
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof(console) != "undefined" && console.log != null) console.log(msg);
}
js.Boot.__clear_trace = function() {
	var d = document.getElementById("haxe:trace");
	if(d != null) d.innerHTML = "";
}
js.Boot.isClass = function(o) {
	return o.__name__;
}
js.Boot.isEnum = function(e) {
	return e.__ename__;
}
js.Boot.getClass = function(o) {
	return o.__class__;
}
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2, _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
}
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0, _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
js.Boot.__instanceof = function(o,cl) {
	try {
		if(o instanceof cl) {
			if(cl == Array) return o.__enum__ == null;
			return true;
		}
		if(js.Boot.__interfLoop(o.__class__,cl)) return true;
	} catch( e ) {
		if(cl == null) return false;
	}
	switch(cl) {
	case Int:
		return Math.ceil(o%2147483648.0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return o === true || o === false;
	case String:
		return typeof(o) == "string";
	case Dynamic:
		return true;
	default:
		if(o == null) return false;
		if(cl == Class && o.__name__ != null) return true; else null;
		if(cl == Enum && o.__ename__ != null) return true; else null;
		return o.__enum__ == cl;
	}
}
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
}
js.Lib = $hxClasses["js.Lib"] = function() { }
js.Lib.__name__ = ["js","Lib"];
js.Lib.document = null;
js.Lib.window = null;
js.Lib.debug = function() {
	debugger;
}
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
}
js.Lib.eval = function(code) {
	return eval(code);
}
js.Lib.setErrorHandler = function(f) {
	js.Lib.onerror = f;
}
var mcore = mcore || {}
if(!mcore.data) mcore.data = {}
mcore.data.Dictionary = $hxClasses["mcore.data.Dictionary"] = function(weakKeys) {
	if(weakKeys == null) weakKeys = false;
	this._keys = [];
	this._values = [];
};
mcore.data.Dictionary.__name__ = ["mcore","data","Dictionary"];
mcore.data.Dictionary.prototype = {
	iterator: function() {
		return HxOverrides.iter(this._keys);
	}
	,keys: function() {
		return this._keys;
	}
	,exists: function(key) {
		return this.get(key) != null;
	}
	,'delete': function(key) {
		var _g1 = 0, _g = this._keys.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(this._keys[i] == key) {
				this._keys.splice(i,1);
				this._values.splice(i,1);
				return;
			}
		}
	}
	,get: function(key) {
		var _g1 = 0, _g = this._keys.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(this._keys[i] == key) return this._values[i];
		}
		return null;
	}
	,set: function(key,value) {
		var _g1 = 0, _g = this._keys.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(this._keys[i] == key) {
				this._keys[i] = key;
				this._values[i] = value;
				return;
			}
		}
		this._keys.push(key);
		this._values.push(value);
	}
	,_values: null
	,_keys: null
	,__class__: mcore.data.Dictionary
}
if(!mcore.util) mcore.util = {}
mcore.util.Reflection = $hxClasses["mcore.util.Reflection"] = function() { }
mcore.util.Reflection.__name__ = ["mcore","util","Reflection"];
mcore.util.Reflection.setProperty = function(object,property,value) {
	var hasSetter = object["set_" + property] != null;
	if(hasSetter) Reflect.field(object,"set_" + property).apply(object,[value]); else object[property] = value;
	return value;
}
mcore.util.Reflection.hasProperty = function(object,property) {
	var properties = Type.getInstanceFields(Type.getClass(object));
	return Lambda.has(properties,property);
}
mcore.util.Reflection.getFields = function(object) {
	return (function($this) {
		var $r;
		var $e = (Type["typeof"](object));
		switch( $e[1] ) {
		case 6:
			var c = $e[2];
			$r = Type.getInstanceFields(c);
			break;
		default:
			$r = Reflect.fields(object);
		}
		return $r;
	}(this));
}
mcore.util.Reflection.here = function(info) {
	return info;
}
mcore.util.Reflection.callMethod = function(o,func,args) {
	if(args == null) args = [];
	try {
		return func.apply(o,args);
	} catch( e ) {
		throw "Error calling method " + Type.getClassName(Type.getClass(o)) + "." + Std.string(func) + "(" + args.toString() + ")";
	}
}
mcore.util.Types = $hxClasses["mcore.util.Types"] = function() { }
mcore.util.Types.__name__ = ["mcore","util","Types"];
mcore.util.Types.isSubClassOf = function(object,type) {
	return js.Boot.__instanceof(object,type) && Type.getClass(object) != type;
}
mcore.util.Types.createInstance = function(forClass,args) {
	if(args == null) args = [];
	try {
		return Type.createInstance(forClass,args);
	} catch( e ) {
		throw "Error creating instance of " + Type.getClassName(forClass) + "(" + args.toString() + ")";
	}
}
var minject = minject || {}
minject.InjectionConfig = $hxClasses["minject.InjectionConfig"] = function(request,injectionName) {
	this.request = request;
	this.injectionName = injectionName;
};
minject.InjectionConfig.__name__ = ["minject","InjectionConfig"];
minject.InjectionConfig.prototype = {
	setInjector: function(injector) {
		this.injector = injector;
	}
	,setResult: function(result) {
		if(this.result != null && result != null) haxe.Log.trace("Warning: Injector already has a rule for type \"" + Type.getClassName(this.request) + "\", named \"" + this.injectionName + "\".\nIf you have overwritten this mapping intentionally " + "you can use \"injector.unmap()\" prior to your replacement " + "mapping in order to avoid seeing this message.",{ fileName : "InjectionConfig.hx", lineNumber : 74, className : "minject.InjectionConfig", methodName : "setResult"});
		this.result = result;
	}
	,hasOwnResponse: function() {
		return this.result != null;
	}
	,hasResponse: function(injector) {
		return this.result != null;
	}
	,getResponse: function(injector) {
		if(this.injector != null) injector = this.injector;
		if(this.result != null) return this.result.getResponse(injector);
		var parentConfig = injector.getAncestorMapping(this.request,this.injectionName);
		if(parentConfig != null) return parentConfig.getResponse(injector);
		return null;
	}
	,result: null
	,injector: null
	,injectionName: null
	,request: null
	,__class__: minject.InjectionConfig
}
minject.Injector = $hxClasses["minject.Injector"] = function() {
	this.injectionConfigs = new Hash();
	this.injecteeDescriptions = new minject.ClassHash();
	this.attendedToInjectees = new mcore.data.Dictionary();
};
minject.Injector.__name__ = ["minject","Injector"];
minject.Injector.prototype = {
	getFields: function(type) {
		var meta = { };
		while(type != null) {
			var typeMeta = haxe.rtti.Meta.getFields(type);
			var _g = 0, _g1 = Reflect.fields(typeMeta);
			while(_g < _g1.length) {
				var field = _g1[_g];
				++_g;
				meta[field] = Reflect.field(typeMeta,field);
			}
			type = Type.getSuperClass(type);
		}
		return meta;
	}
	,getClassName: function(forClass) {
		if(forClass == null) return "Dynamic"; else return Type.getClassName(forClass);
	}
	,set_parentInjector: function(value) {
		if(this.parentInjector != null && value == null) this.attendedToInjectees = new mcore.data.Dictionary();
		this.parentInjector = value;
		if(this.parentInjector != null) this.attendedToInjectees = this.parentInjector.attendedToInjectees;
		return this.parentInjector;
	}
	,getConfigurationForRequest: function(forClass,named,traverseAncestors) {
		if(traverseAncestors == null) traverseAncestors = true;
		var requestName = this.getClassName(forClass) + "#" + named;
		if(!this.injectionConfigs.exists(requestName)) {
			if(traverseAncestors && this.parentInjector != null && this.parentInjector.hasMapping(forClass,named)) return this.getAncestorMapping(forClass,named);
			return null;
		}
		return this.injectionConfigs.get(requestName);
	}
	,getInjectionPoints: function(forClass) {
		var typeMeta = haxe.rtti.Meta.getType(forClass);
		if(typeMeta != null && Reflect.hasField(typeMeta,"interface")) throw "Interfaces can't be used as instantiatable classes.";
		var fieldsMeta = this.getFields(forClass);
		var ctorInjectionPoint = null;
		var injectionPoints = [];
		var postConstructMethodPoints = [];
		var _g = 0, _g1 = Reflect.fields(fieldsMeta);
		while(_g < _g1.length) {
			var field = _g1[_g];
			++_g;
			var fieldMeta = Reflect.field(fieldsMeta,field);
			var inject = Reflect.hasField(fieldMeta,"inject");
			var post = Reflect.hasField(fieldMeta,"post");
			var type = Reflect.field(fieldMeta,"type");
			var args = Reflect.field(fieldMeta,"args");
			if(field == "_") {
				if(args.length > 0) ctorInjectionPoint = new minject.point.ConstructorInjectionPoint(fieldMeta,forClass,this);
			} else if(Reflect.hasField(fieldMeta,"args")) {
				if(inject) {
					var injectionPoint = new minject.point.MethodInjectionPoint(fieldMeta,this);
					injectionPoints.push(injectionPoint);
				} else if(post) {
					var injectionPoint = new minject.point.PostConstructInjectionPoint(fieldMeta,this);
					postConstructMethodPoints.push(injectionPoint);
				}
			} else if(type != null) {
				var injectionPoint = new minject.point.PropertyInjectionPoint(fieldMeta,this);
				injectionPoints.push(injectionPoint);
			}
		}
		if(postConstructMethodPoints.length > 0) {
			postConstructMethodPoints.sort(function(a,b) {
				return a.order - b.order;
			});
			var _g = 0;
			while(_g < postConstructMethodPoints.length) {
				var point = postConstructMethodPoints[_g];
				++_g;
				injectionPoints.push(point);
			}
		}
		if(ctorInjectionPoint == null) ctorInjectionPoint = new minject.point.NoParamsConstructorInjectionPoint();
		var injecteeDescription = new minject.InjecteeDescription(ctorInjectionPoint,injectionPoints);
		this.injecteeDescriptions.set(forClass,injecteeDescription);
		return injecteeDescription;
	}
	,getAncestorMapping: function(forClass,named) {
		var parent = this.parentInjector;
		while(parent != null) {
			var parentConfig = parent.getConfigurationForRequest(forClass,named,false);
			if(parentConfig != null && parentConfig.hasOwnResponse()) return parentConfig;
			parent = parent.parentInjector;
		}
		return null;
	}
	,createChildInjector: function() {
		var injector = new minject.Injector();
		injector.set_parentInjector(this);
		return injector;
	}
	,getInstance: function(ofClass,named) {
		if(named == null) named = "";
		var mapping = this.getConfigurationForRequest(ofClass,named);
		if(mapping == null || !mapping.hasResponse(this)) throw "Error while getting mapping response: No mapping defined for class " + this.getClassName(ofClass) + ", named \"" + named + "\"";
		return mapping.getResponse(this);
	}
	,hasMapping: function(forClass,named) {
		if(named == null) named = "";
		var mapping = this.getConfigurationForRequest(forClass,named);
		if(mapping == null) return false;
		return mapping.hasResponse(this);
	}
	,unmap: function(theClass,named) {
		if(named == null) named = "";
		var mapping = this.getConfigurationForRequest(theClass,named);
		if(mapping == null) throw "Error while removing an injector mapping: No mapping defined for class " + this.getClassName(theClass) + ", named \"" + named + "\"";
		mapping.setResult(null);
	}
	,instantiate: function(theClass) {
		var injecteeDescription;
		if(this.injecteeDescriptions.exists(theClass)) injecteeDescription = this.injecteeDescriptions.get(theClass); else injecteeDescription = this.getInjectionPoints(theClass);
		var injectionPoint = injecteeDescription.ctor;
		var instance = injectionPoint.applyInjection(theClass,this);
		this.injectInto(instance);
		return instance;
	}
	,injectInto: function(target) {
		if(this.attendedToInjectees.exists(target)) return;
		this.attendedToInjectees.set(target,true);
		var targetClass = Type.getClass(target);
		var injecteeDescription = null;
		if(this.injecteeDescriptions.exists(targetClass)) injecteeDescription = this.injecteeDescriptions.get(targetClass); else injecteeDescription = this.getInjectionPoints(targetClass);
		if(injecteeDescription == null) return;
		var injectionPoints = injecteeDescription.injectionPoints;
		var length = injectionPoints.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			var injectionPoint = injectionPoints[i];
			injectionPoint.applyInjection(target,this);
		}
	}
	,getMapping: function(forClass,named) {
		if(named == null) named = "";
		var requestName = this.getClassName(forClass) + "#" + named;
		if(this.injectionConfigs.exists(requestName)) return this.injectionConfigs.get(requestName);
		var config = new minject.InjectionConfig(forClass,named);
		this.injectionConfigs.set(requestName,config);
		return config;
	}
	,mapRule: function(whenAskedFor,useRule,named) {
		if(named == null) named = "";
		var config = this.getMapping(whenAskedFor,named);
		config.setResult(new minject.result.InjectOtherRuleResult(useRule));
		return useRule;
	}
	,mapSingletonOf: function(whenAskedFor,useSingletonOf,named) {
		if(named == null) named = "";
		var config = this.getMapping(whenAskedFor,named);
		config.setResult(new minject.result.InjectSingletonResult(useSingletonOf));
		return config;
	}
	,mapSingleton: function(whenAskedFor,named) {
		if(named == null) named = "";
		return this.mapSingletonOf(whenAskedFor,whenAskedFor,named);
	}
	,mapClass: function(whenAskedFor,instantiateClass,named) {
		if(named == null) named = "";
		var config = this.getMapping(whenAskedFor,named);
		config.setResult(new minject.result.InjectClassResult(instantiateClass));
		return config;
	}
	,mapValue: function(whenAskedFor,useValue,named) {
		if(named == null) named = "";
		var config = this.getMapping(whenAskedFor,named);
		config.setResult(new minject.result.InjectValueResult(useValue));
		return config;
	}
	,injecteeDescriptions: null
	,injectionConfigs: null
	,parentInjector: null
	,attendedToInjectees: null
	,__class__: minject.Injector
	,__properties__: {set_parentInjector:"set_parentInjector"}
}
minject.ClassHash = $hxClasses["minject.ClassHash"] = function() {
	this.hash = new Hash();
};
minject.ClassHash.__name__ = ["minject","ClassHash"];
minject.ClassHash.prototype = {
	exists: function(key) {
		return this.hash.exists(Type.getClassName(key));
	}
	,get: function(key) {
		return this.hash.get(Type.getClassName(key));
	}
	,set: function(key,value) {
		this.hash.set(Type.getClassName(key),value);
	}
	,hash: null
	,__class__: minject.ClassHash
}
minject.InjecteeDescription = $hxClasses["minject.InjecteeDescription"] = function(ctor,injectionPoints) {
	this.ctor = ctor;
	this.injectionPoints = injectionPoints;
};
minject.InjecteeDescription.__name__ = ["minject","InjecteeDescription"];
minject.InjecteeDescription.prototype = {
	injectionPoints: null
	,ctor: null
	,__class__: minject.InjecteeDescription
}
minject.Reflector = $hxClasses["minject.Reflector"] = function() {
};
minject.Reflector.__name__ = ["minject","Reflector"];
minject.Reflector.prototype = {
	getFQCN: function(value) {
		var fqcn;
		if(js.Boot.__instanceof(value,String)) return js.Boot.__cast(value , String);
		return Type.getClassName(value);
	}
	,getClass: function(value) {
		if(js.Boot.__instanceof(value,Class)) return value;
		return Type.getClass(value);
	}
	,classExtendsOrImplements: function(classOrClassName,superClass) {
		var actualClass = null;
		if(js.Boot.__instanceof(classOrClassName,Class)) actualClass = js.Boot.__cast(classOrClassName , Class); else if(js.Boot.__instanceof(classOrClassName,String)) try {
			actualClass = Type.resolveClass(js.Boot.__cast(classOrClassName , String));
		} catch( e ) {
			throw "The class name " + Std.string(classOrClassName) + " is not valid because of " + Std.string(e) + "\n" + Std.string(e.getStackTrace());
		}
		if(actualClass == null) throw "The parameter classOrClassName must be a Class or fully qualified class name.";
		var classInstance = Type.createEmptyInstance(actualClass);
		return js.Boot.__instanceof(classInstance,superClass);
	}
	,__class__: minject.Reflector
}
if(!minject.point) minject.point = {}
minject.point.InjectionPoint = $hxClasses["minject.point.InjectionPoint"] = function(meta,injector) {
	this.initializeInjection(meta);
};
minject.point.InjectionPoint.__name__ = ["minject","point","InjectionPoint"];
minject.point.InjectionPoint.prototype = {
	initializeInjection: function(meta) {
	}
	,applyInjection: function(target,injector) {
		return target;
	}
	,__class__: minject.point.InjectionPoint
}
minject.point.MethodInjectionPoint = $hxClasses["minject.point.MethodInjectionPoint"] = function(meta,injector) {
	this.requiredParameters = 0;
	minject.point.InjectionPoint.call(this,meta,injector);
};
minject.point.MethodInjectionPoint.__name__ = ["minject","point","MethodInjectionPoint"];
minject.point.MethodInjectionPoint.__super__ = minject.point.InjectionPoint;
minject.point.MethodInjectionPoint.prototype = $extend(minject.point.InjectionPoint.prototype,{
	gatherParameterValues: function(target,injector) {
		var parameters = [];
		var length = this._parameterInjectionConfigs.length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			var parameterConfig = this._parameterInjectionConfigs[i];
			var config = injector.getMapping(Type.resolveClass(parameterConfig.typeName),parameterConfig.injectionName);
			var injection = config.getResponse(injector);
			if(injection == null) {
				if(i >= this.requiredParameters) break;
				throw "Injector is missing a rule to handle injection into target " + Type.getClassName(Type.getClass(target)) + ". Target dependency: " + Type.getClassName(config.request) + ", method: " + this.methodName + ", parameter: " + (i + 1) + ", named: " + parameterConfig.injectionName;
			}
			parameters[i] = injection;
		}
		return parameters;
	}
	,gatherParameters: function(meta) {
		var nameArgs = meta.inject;
		var args = meta.args;
		if(nameArgs == null) nameArgs = [];
		this._parameterInjectionConfigs = [];
		var i = 0;
		var _g = 0;
		while(_g < args.length) {
			var arg = args[_g];
			++_g;
			var injectionName = "";
			if(i < nameArgs.length) injectionName = nameArgs[i];
			var parameterTypeName = arg.type;
			if(arg.opt) {
				if(parameterTypeName == "Dynamic") throw "Error in method definition of injectee. Required parameters can't have non class type.";
			} else this.requiredParameters++;
			this._parameterInjectionConfigs.push(new minject.point.ParameterInjectionConfig(parameterTypeName,injectionName));
			i++;
		}
	}
	,initializeInjection: function(meta) {
		this.methodName = meta.name[0];
		this.gatherParameters(meta);
	}
	,applyInjection: function(target,injector) {
		var parameters = this.gatherParameterValues(target,injector);
		var method = Reflect.field(target,this.methodName);
		mcore.util.Reflection.callMethod(target,method,parameters);
		return target;
	}
	,requiredParameters: null
	,_parameterInjectionConfigs: null
	,methodName: null
	,__class__: minject.point.MethodInjectionPoint
});
minject.point.ConstructorInjectionPoint = $hxClasses["minject.point.ConstructorInjectionPoint"] = function(meta,forClass,injector) {
	minject.point.MethodInjectionPoint.call(this,meta,injector);
};
minject.point.ConstructorInjectionPoint.__name__ = ["minject","point","ConstructorInjectionPoint"];
minject.point.ConstructorInjectionPoint.__super__ = minject.point.MethodInjectionPoint;
minject.point.ConstructorInjectionPoint.prototype = $extend(minject.point.MethodInjectionPoint.prototype,{
	initializeInjection: function(meta) {
		this.methodName = "new";
		this.gatherParameters(meta);
	}
	,applyInjection: function(target,injector) {
		var ofClass = target;
		var withArgs = this.gatherParameterValues(target,injector);
		return mcore.util.Types.createInstance(ofClass,withArgs);
	}
	,__class__: minject.point.ConstructorInjectionPoint
});
minject.point.ParameterInjectionConfig = $hxClasses["minject.point.ParameterInjectionConfig"] = function(typeName,injectionName) {
	this.typeName = typeName;
	this.injectionName = injectionName;
};
minject.point.ParameterInjectionConfig.__name__ = ["minject","point","ParameterInjectionConfig"];
minject.point.ParameterInjectionConfig.prototype = {
	injectionName: null
	,typeName: null
	,__class__: minject.point.ParameterInjectionConfig
}
minject.point.NoParamsConstructorInjectionPoint = $hxClasses["minject.point.NoParamsConstructorInjectionPoint"] = function() {
	minject.point.InjectionPoint.call(this,null,null);
};
minject.point.NoParamsConstructorInjectionPoint.__name__ = ["minject","point","NoParamsConstructorInjectionPoint"];
minject.point.NoParamsConstructorInjectionPoint.__super__ = minject.point.InjectionPoint;
minject.point.NoParamsConstructorInjectionPoint.prototype = $extend(minject.point.InjectionPoint.prototype,{
	applyInjection: function(target,injector) {
		return mcore.util.Types.createInstance(target,[]);
	}
	,__class__: minject.point.NoParamsConstructorInjectionPoint
});
minject.point.PostConstructInjectionPoint = $hxClasses["minject.point.PostConstructInjectionPoint"] = function(meta,injector) {
	this.order = 0;
	minject.point.InjectionPoint.call(this,meta,injector);
};
minject.point.PostConstructInjectionPoint.__name__ = ["minject","point","PostConstructInjectionPoint"];
minject.point.PostConstructInjectionPoint.__super__ = minject.point.InjectionPoint;
minject.point.PostConstructInjectionPoint.prototype = $extend(minject.point.InjectionPoint.prototype,{
	initializeInjection: function(meta) {
		this.methodName = meta.name[0];
		if(meta.post != null) this.order = meta.post[0];
	}
	,applyInjection: function(target,injector) {
		mcore.util.Reflection.callMethod(target,Reflect.field(target,this.methodName),[]);
		return target;
	}
	,methodName: null
	,order: null
	,__class__: minject.point.PostConstructInjectionPoint
});
minject.point.PropertyInjectionPoint = $hxClasses["minject.point.PropertyInjectionPoint"] = function(meta,injector) {
	minject.point.InjectionPoint.call(this,meta,null);
};
minject.point.PropertyInjectionPoint.__name__ = ["minject","point","PropertyInjectionPoint"];
minject.point.PropertyInjectionPoint.__super__ = minject.point.InjectionPoint;
minject.point.PropertyInjectionPoint.prototype = $extend(minject.point.InjectionPoint.prototype,{
	initializeInjection: function(meta) {
		this.propertyType = meta.type[0];
		this.hasSetter = meta.setter != null;
		if(this.hasSetter) this.propertyName = meta.setter[0]; else this.propertyName = meta.name[0];
		if(meta.inject == null) this.injectionName = ""; else this.injectionName = meta.inject[0];
	}
	,applyInjection: function(target,injector) {
		var injectionConfig = injector.getMapping(Type.resolveClass(this.propertyType),this.injectionName);
		var injection = injectionConfig.getResponse(injector);
		if(injection == null) throw "Injector is missing a rule to handle injection into property \"" + this.propertyName + "\" of object \"" + Std.string(target) + "\". Target dependency: \"" + this.propertyType + "\", named \"" + this.injectionName + "\"";
		if(this.hasSetter) {
			var setter = Reflect.field(target,this.propertyName);
			mcore.util.Reflection.callMethod(target,setter,[injection]);
		} else target[this.propertyName] = injection;
		return target;
	}
	,hasSetter: null
	,injectionName: null
	,propertyType: null
	,propertyName: null
	,__class__: minject.point.PropertyInjectionPoint
});
if(!minject.result) minject.result = {}
minject.result.InjectionResult = $hxClasses["minject.result.InjectionResult"] = function() {
};
minject.result.InjectionResult.__name__ = ["minject","result","InjectionResult"];
minject.result.InjectionResult.prototype = {
	getResponse: function(injector) {
		return null;
	}
	,__class__: minject.result.InjectionResult
}
minject.result.InjectClassResult = $hxClasses["minject.result.InjectClassResult"] = function(responseType) {
	minject.result.InjectionResult.call(this);
	this.responseType = responseType;
};
minject.result.InjectClassResult.__name__ = ["minject","result","InjectClassResult"];
minject.result.InjectClassResult.__super__ = minject.result.InjectionResult;
minject.result.InjectClassResult.prototype = $extend(minject.result.InjectionResult.prototype,{
	getResponse: function(injector) {
		return injector.instantiate(this.responseType);
	}
	,responseType: null
	,__class__: minject.result.InjectClassResult
});
minject.result.InjectOtherRuleResult = $hxClasses["minject.result.InjectOtherRuleResult"] = function(rule) {
	minject.result.InjectionResult.call(this);
	this.rule = rule;
};
minject.result.InjectOtherRuleResult.__name__ = ["minject","result","InjectOtherRuleResult"];
minject.result.InjectOtherRuleResult.__super__ = minject.result.InjectionResult;
minject.result.InjectOtherRuleResult.prototype = $extend(minject.result.InjectionResult.prototype,{
	getResponse: function(injector) {
		return this.rule.getResponse(injector);
	}
	,rule: null
	,__class__: minject.result.InjectOtherRuleResult
});
minject.result.InjectSingletonResult = $hxClasses["minject.result.InjectSingletonResult"] = function(responseType) {
	minject.result.InjectionResult.call(this);
	this.responseType = responseType;
};
minject.result.InjectSingletonResult.__name__ = ["minject","result","InjectSingletonResult"];
minject.result.InjectSingletonResult.__super__ = minject.result.InjectionResult;
minject.result.InjectSingletonResult.prototype = $extend(minject.result.InjectionResult.prototype,{
	createResponse: function(injector) {
		return injector.instantiate(this.responseType);
	}
	,getResponse: function(injector) {
		if(this.response == null) this.response = this.createResponse(injector);
		return this.response;
	}
	,response: null
	,responseType: null
	,__class__: minject.result.InjectSingletonResult
});
minject.result.InjectValueResult = $hxClasses["minject.result.InjectValueResult"] = function(value) {
	minject.result.InjectionResult.call(this);
	this.value = value;
};
minject.result.InjectValueResult.__name__ = ["minject","result","InjectValueResult"];
minject.result.InjectValueResult.__super__ = minject.result.InjectionResult;
minject.result.InjectValueResult.prototype = $extend(minject.result.InjectionResult.prototype,{
	getResponse: function(injector) {
		return this.value;
	}
	,value: null
	,__class__: minject.result.InjectValueResult
});
mmvc.api.ICommandMap = $hxClasses["mmvc.api.ICommandMap"] = function() { }
mmvc.api.ICommandMap.__name__ = ["mmvc","api","ICommandMap"];
mmvc.api.ICommandMap.prototype = {
	release: null
	,detain: null
	,unmapSignalClass: null
	,unmapSignal: null
	,hasSignalCommand: null
	,mapSignalClass: null
	,mapSignal: null
	,__class__: mmvc.api.ICommandMap
}
mmvc.api.IMediator = $hxClasses["mmvc.api.IMediator"] = function() { }
mmvc.api.IMediator.__name__ = ["mmvc","api","IMediator"];
mmvc.api.IMediator.prototype = {
	setViewComponent: null
	,getViewComponent: null
	,onRemove: null
	,preRemove: null
	,onRegister: null
	,preRegister: null
	,__class__: mmvc.api.IMediator
}
mmvc.api.IMediatorMap = $hxClasses["mmvc.api.IMediatorMap"] = function() { }
mmvc.api.IMediatorMap.__name__ = ["mmvc","api","IMediatorMap"];
mmvc.api.IMediatorMap.prototype = {
	enabled: null
	,contextView: null
	,hasMediatorForView: null
	,hasMediator: null
	,hasMapping: null
	,retrieveMediator: null
	,removeMediatorByView: null
	,removeMediator: null
	,registerMediator: null
	,createMediator: null
	,unmapView: null
	,mapView: null
	,__class__: mmvc.api.IMediatorMap
	,__properties__: {set_contextView:"set_contextView",set_enabled:"set_enabled"}
}
mmvc.api.IViewContainer = $hxClasses["mmvc.api.IViewContainer"] = function() { }
mmvc.api.IViewContainer.__name__ = ["mmvc","api","IViewContainer"];
mmvc.api.IViewContainer.prototype = {
	isAdded: null
	,viewRemoved: null
	,viewAdded: null
	,__class__: mmvc.api.IViewContainer
}
mmvc.api.IViewMap = $hxClasses["mmvc.api.IViewMap"] = function() { }
mmvc.api.IViewMap.__name__ = ["mmvc","api","IViewMap"];
mmvc.api.IViewMap.prototype = {
	enabled: null
	,contextView: null
	,hasType: null
	,unmapType: null
	,mapType: null
	,hasPackage: null
	,unmapPackage: null
	,mapPackage: null
	,__class__: mmvc.api.IViewMap
	,__properties__: {set_contextView:"set_contextView",set_enabled:"set_enabled"}
}
if(!mmvc.base) mmvc.base = {}
mmvc.base.CommandMap = $hxClasses["mmvc.base.CommandMap"] = function(injector) {
	this.injector = injector;
	this.signalMap = new mcore.data.Dictionary();
	this.signalClassMap = new mcore.data.Dictionary();
	this.detainedCommands = new mcore.data.Dictionary();
};
mmvc.base.CommandMap.__name__ = ["mmvc","base","CommandMap"];
mmvc.base.CommandMap.__interfaces__ = [mmvc.api.ICommandMap];
mmvc.base.CommandMap.prototype = {
	release: function(command) {
		if(this.detainedCommands.exists(command)) this.detainedCommands["delete"](command);
	}
	,detain: function(command) {
		this.detainedCommands.set(command,true);
	}
	,unmapSignalValues: function(valueClasses,valueObjects) {
		var _g1 = 0, _g = valueClasses.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.injector.unmap(valueClasses[i]);
		}
	}
	,mapSignalValues: function(valueClasses,valueObjects) {
		var _g1 = 0, _g = valueClasses.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.injector.mapValue(valueClasses[i],valueObjects[i]);
		}
	}
	,createCommandInstance: function(commandClass) {
		return this.injector.instantiate(commandClass);
	}
	,routeSignalToCommand: function(signal,valueObjects,commandClass,oneshot) {
		this.mapSignalValues(signal.valueClasses,valueObjects);
		var command = this.createCommandInstance(commandClass);
		this.unmapSignalValues(signal.valueClasses,valueObjects);
		command.execute();
		if(oneshot) this.unmapSignal(signal,commandClass);
	}
	,unmapSignal: function(signal,commandClass) {
		var callbacksByCommandClass = this.signalMap.get(signal);
		if(callbacksByCommandClass == null) return;
		var callbackFunction = callbacksByCommandClass.get(commandClass);
		if(callbackFunction == null) return;
		signal.remove(callbackFunction);
		callbacksByCommandClass["delete"](commandClass);
	}
	,hasSignalCommand: function(signal,commandClass) {
		var callbacksByCommandClass = this.signalMap.get(signal);
		if(callbacksByCommandClass == null) return false;
		var callbackFunction = callbacksByCommandClass.get(commandClass);
		return callbackFunction != null;
	}
	,createSignalClassInstance: function(signalClass) {
		var injectorForSignalInstance = this.injector;
		var signal;
		if(this.injector.hasMapping(minject.Injector)) injectorForSignalInstance = this.injector.getInstance(minject.Injector);
		signal = injectorForSignalInstance.instantiate(signalClass);
		injectorForSignalInstance.mapValue(signalClass,signal);
		this.signalClassMap.set(signalClass,signal);
		return signal;
	}
	,getSignalClassInstance: function(signalClass) {
		if(this.signalClassMap.exists(signalClass)) return js.Boot.__cast(this.signalClassMap.get(signalClass) , msignal.Signal);
		var signal = this.createSignalClassInstance(signalClass);
		this.signalClassMap.set(signalClass,signal);
		return signal;
	}
	,unmapSignalClass: function(signalClass,commandClass) {
		this.unmapSignal(this.getSignalClassInstance(signalClass),commandClass);
		this.injector.unmap(signalClass);
	}
	,mapSignalClass: function(signalClass,commandClass,oneShot) {
		if(oneShot == null) oneShot = false;
		var signal = this.getSignalClassInstance(signalClass);
		this.mapSignal(signal,commandClass,oneShot);
		return signal;
	}
	,mapSignal: function(signal,commandClass,oneShot) {
		if(oneShot == null) oneShot = false;
		if(this.hasSignalCommand(signal,commandClass)) return;
		var signalCommandMap;
		if(this.signalMap.exists(signal)) signalCommandMap = this.signalMap.get(signal); else {
			signalCommandMap = new mcore.data.Dictionary(false);
			this.signalMap.set(signal,signalCommandMap);
		}
		var me = this;
		var callbackFunction = Reflect.makeVarArgs(function(args) {
			me.routeSignalToCommand(signal,args,commandClass,oneShot);
		});
		signalCommandMap.set(commandClass,callbackFunction);
		signal.add(callbackFunction);
	}
	,detainedCommands: null
	,signalClassMap: null
	,signalMap: null
	,injector: null
	,__class__: mmvc.base.CommandMap
}
mmvc.base.ContextError = $hxClasses["mmvc.base.ContextError"] = function(message,id) {
	if(id == null) id = 0;
	if(message == null) message = "";
	this.message = message;
	this.id = id;
};
mmvc.base.ContextError.__name__ = ["mmvc","base","ContextError"];
mmvc.base.ContextError.prototype = {
	id: null
	,message: null
	,__class__: mmvc.base.ContextError
}
mmvc.base.MediatorBase = $hxClasses["mmvc.base.MediatorBase"] = function() {
	this.slots = [];
};
mmvc.base.MediatorBase.__name__ = ["mmvc","base","MediatorBase"];
mmvc.base.MediatorBase.__interfaces__ = [mmvc.api.IMediator];
mmvc.base.MediatorBase.prototype = {
	mediate: function(slot) {
		this.slots.push(slot);
	}
	,setViewComponent: function(viewComponent) {
		this.view = viewComponent;
	}
	,getViewComponent: function() {
		return this.view;
	}
	,onRemove: function() {
		var _g = 0, _g1 = this.slots;
		while(_g < _g1.length) {
			var slot = _g1[_g];
			++_g;
			slot.remove();
		}
	}
	,preRemove: function() {
		this.removed = true;
		this.onRemove();
	}
	,onRegister: function() {
	}
	,preRegister: function() {
		this.removed = false;
		this.onRegister();
	}
	,slots: null
	,removed: null
	,view: null
	,__class__: mmvc.base.MediatorBase
}
mmvc.base.ViewMapBase = $hxClasses["mmvc.base.ViewMapBase"] = function(contextView,injector) {
	this.viewListenerCount = 0;
	this.set_enabled(true);
	this.injector = injector;
	this.set_contextView(contextView);
};
mmvc.base.ViewMapBase.__name__ = ["mmvc","base","ViewMapBase"];
mmvc.base.ViewMapBase.prototype = {
	onViewRemoved: function(view) {
	}
	,onViewAdded: function(view) {
	}
	,removeListeners: function() {
	}
	,addListeners: function() {
	}
	,viewListenerCount: null
	,injector: null
	,set_enabled: function(value) {
		if(value != this.enabled) {
			this.removeListeners();
			this.enabled = value;
			if(this.viewListenerCount > 0) this.addListeners();
		}
		return value;
	}
	,set_contextView: function(value) {
		if(value != this.contextView) {
			this.removeListeners();
			this.contextView = value;
			if(this.viewListenerCount > 0) this.addListeners();
		}
		return this.contextView;
	}
	,enabled: null
	,contextView: null
	,__class__: mmvc.base.ViewMapBase
	,__properties__: {set_contextView:"set_contextView",set_enabled:"set_enabled"}
}
mmvc.base.MediatorMap = $hxClasses["mmvc.base.MediatorMap"] = function(contextView,injector,reflector) {
	mmvc.base.ViewMapBase.call(this,contextView,injector);
	this.reflector = reflector;
	this.mediatorByView = new mcore.data.Dictionary(true);
	this.mappingConfigByView = new mcore.data.Dictionary(true);
	this.mappingConfigByViewClassName = new mcore.data.Dictionary();
	this.mediatorsMarkedForRemoval = new mcore.data.Dictionary();
	this.hasMediatorsMarkedForRemoval = false;
};
mmvc.base.MediatorMap.__name__ = ["mmvc","base","MediatorMap"];
mmvc.base.MediatorMap.__interfaces__ = [mmvc.api.IMediatorMap];
mmvc.base.MediatorMap.__super__ = mmvc.base.ViewMapBase;
mmvc.base.MediatorMap.prototype = $extend(mmvc.base.ViewMapBase.prototype,{
	createMediatorUsing: function(viewComponent,viewClassName,config) {
		var mediator = this.mediatorByView.get(viewComponent);
		if(mediator == null) {
			if(viewClassName == null) viewClassName = Type.getClassName(Type.getClass(viewComponent));
			if(config == null) config = this.mappingConfigByViewClassName.get(viewClassName);
			if(config != null) {
				var _g = 0, _g1 = config.typedViewClasses;
				while(_g < _g1.length) {
					var claxx = _g1[_g];
					++_g;
					this.injector.mapValue(claxx,viewComponent);
				}
				mediator = this.injector.instantiate(config.mediatorClass);
				var _g = 0, _g1 = config.typedViewClasses;
				while(_g < _g1.length) {
					var clazz = _g1[_g];
					++_g;
					this.injector.unmap(clazz);
				}
				this.registerMediator(viewComponent,mediator);
			}
		}
		return mediator;
	}
	,removeMediatorLater: function() {
		var $it0 = this.mediatorsMarkedForRemoval.iterator();
		while( $it0.hasNext() ) {
			var view = $it0.next();
			if(!this.contextView.isAdded(view)) this.removeMediatorByView(view);
			this.mediatorsMarkedForRemoval["delete"](view);
		}
		this.hasMediatorsMarkedForRemoval = false;
	}
	,onViewRemoved: function(view) {
		var config = this.mappingConfigByView.get(view);
		if(config != null && config.autoRemove) this.removeMediatorByView(view);
	}
	,onViewAdded: function(view) {
		if(this.mediatorsMarkedForRemoval.get(view) != null) {
			this.mediatorsMarkedForRemoval["delete"](view);
			return;
		}
		var viewClassName = Type.getClassName(Type.getClass(view));
		var config = this.mappingConfigByViewClassName.get(viewClassName);
		if(config != null && config.autoCreate) this.createMediatorUsing(view,viewClassName,config);
	}
	,removeListeners: function() {
		if(this.contextView != null) {
			this.contextView.viewAdded = null;
			this.contextView.viewRemoved = null;
		}
	}
	,addListeners: function() {
		if(this.contextView != null && this.enabled) {
			this.contextView.viewAdded = $bind(this,this.onViewAdded);
			this.contextView.viewRemoved = $bind(this,this.onViewRemoved);
		}
	}
	,hasMediator: function(mediator) {
		var $it0 = this.mediatorByView.iterator();
		while( $it0.hasNext() ) {
			var key = $it0.next();
			if(this.mediatorByView.get(key) == mediator) return true;
		}
		return false;
	}
	,hasMediatorForView: function(viewComponent) {
		return this.mediatorByView.get(viewComponent) != null;
	}
	,hasMapping: function(viewClassOrName) {
		var viewClassName = this.reflector.getFQCN(viewClassOrName);
		return this.mappingConfigByViewClassName.get(viewClassName) != null;
	}
	,retrieveMediator: function(viewComponent) {
		return this.mediatorByView.get(viewComponent);
	}
	,removeMediatorByView: function(viewComponent) {
		return this.removeMediator(this.retrieveMediator(viewComponent));
	}
	,removeMediator: function(mediator) {
		if(mediator != null) {
			var viewComponent = mediator.getViewComponent();
			this.mediatorByView["delete"](viewComponent);
			this.mappingConfigByView["delete"](viewComponent);
			mediator.preRemove();
			mediator.setViewComponent(null);
		}
		return mediator;
	}
	,registerMediator: function(viewComponent,mediator) {
		this.mediatorByView.set(viewComponent,mediator);
		var mapping = this.mappingConfigByViewClassName.get(Type.getClassName(Type.getClass(viewComponent)));
		this.mappingConfigByView.set(viewComponent,mapping);
		mediator.setViewComponent(viewComponent);
		mediator.preRegister();
	}
	,createMediator: function(viewComponent) {
		return this.createMediatorUsing(viewComponent);
	}
	,unmapView: function(viewClassOrName) {
		var viewClassName = this.reflector.getFQCN(viewClassOrName);
		var config = this.mappingConfigByViewClassName.get(viewClassName);
		if(config != null && (config.autoCreate || config.autoRemove)) {
			this.viewListenerCount--;
			if(this.viewListenerCount == 0) this.removeListeners();
		}
		this.mappingConfigByViewClassName["delete"](viewClassName);
	}
	,mapView: function(viewClassOrName,mediatorClass,injectViewAs,autoCreate,autoRemove) {
		if(autoRemove == null) autoRemove = true;
		if(autoCreate == null) autoCreate = true;
		var viewClassName = this.reflector.getFQCN(viewClassOrName);
		if(this.mappingConfigByViewClassName.get(viewClassName) != null) throw new mmvc.base.ContextError(mmvc.base.ContextError.E_MEDIATORMAP_OVR + " - " + Std.string(mediatorClass));
		if(this.reflector.classExtendsOrImplements(mediatorClass,mmvc.api.IMediator) == false) throw new mmvc.base.ContextError(mmvc.base.ContextError.E_MEDIATORMAP_NOIMPL + " - " + Std.string(mediatorClass));
		var config = new mmvc.base.MappingConfig();
		config.mediatorClass = mediatorClass;
		config.autoCreate = autoCreate;
		config.autoRemove = autoRemove;
		if(injectViewAs) {
			if(js.Boot.__instanceof(injectViewAs,Array)) config.typedViewClasses = (js.Boot.__cast(injectViewAs , Array)).slice(); else if(js.Boot.__instanceof(injectViewAs,Class)) config.typedViewClasses = [injectViewAs];
		} else if(js.Boot.__instanceof(viewClassOrName,Class)) config.typedViewClasses = [viewClassOrName];
		this.mappingConfigByViewClassName.set(viewClassName,config);
		if(autoCreate || autoRemove) {
			this.viewListenerCount++;
			if(this.viewListenerCount == 1) this.addListeners();
		}
		if(autoCreate && this.contextView != null && viewClassName == Type.getClassName(Type.getClass(this.contextView))) this.createMediatorUsing(this.contextView,viewClassName,config);
	}
	,reflector: null
	,hasMediatorsMarkedForRemoval: null
	,mediatorsMarkedForRemoval: null
	,mappingConfigByViewClassName: null
	,mappingConfigByView: null
	,mediatorByView: null
	,__class__: mmvc.base.MediatorMap
});
mmvc.base.MappingConfig = $hxClasses["mmvc.base.MappingConfig"] = function() {
};
mmvc.base.MappingConfig.__name__ = ["mmvc","base","MappingConfig"];
mmvc.base.MappingConfig.prototype = {
	autoRemove: null
	,autoCreate: null
	,typedViewClasses: null
	,mediatorClass: null
	,__class__: mmvc.base.MappingConfig
}
mmvc.base.ViewMap = $hxClasses["mmvc.base.ViewMap"] = function(contextView,injector) {
	mmvc.base.ViewMapBase.call(this,contextView,injector);
	this.mappedPackages = new Array();
	this.mappedTypes = new mcore.data.Dictionary();
	this.injectedViews = new mcore.data.Dictionary(true);
};
mmvc.base.ViewMap.__name__ = ["mmvc","base","ViewMap"];
mmvc.base.ViewMap.__interfaces__ = [mmvc.api.IViewMap];
mmvc.base.ViewMap.__super__ = mmvc.base.ViewMapBase;
mmvc.base.ViewMap.prototype = $extend(mmvc.base.ViewMapBase.prototype,{
	injectInto: function(view) {
		this.injector.injectInto(view);
		this.injectedViews.set(view,true);
	}
	,onViewRemoved: function(view) {
		haxe.Log.trace("TODO",{ fileName : "ViewMap.hx", lineNumber : 187, className : "mmvc.base.ViewMap", methodName : "onViewRemoved"});
	}
	,onViewAdded: function(view) {
		if(this.injectedViews.get(view) != null) return;
		var $it0 = this.mappedTypes.iterator();
		while( $it0.hasNext() ) {
			var type = $it0.next();
			if(js.Boot.__instanceof(view,type)) {
				this.injectInto(view);
				return;
			}
		}
		var len = this.mappedPackages.length;
		if(len > 0) {
			var className = Type.getClassName(Type.getClass(view));
			var _g = 0;
			while(_g < len) {
				var i = _g++;
				var packageName = this.mappedPackages[i];
				if(className.indexOf(packageName) == 0) {
					this.injectInto(view);
					return;
				}
			}
		}
	}
	,removeListeners: function() {
		if(this.contextView != null) {
			this.contextView.viewAdded = null;
			this.contextView.viewRemoved = null;
		}
	}
	,addListeners: function() {
		if(this.contextView != null && this.enabled) {
			this.contextView.viewAdded = $bind(this,this.onViewAdded);
			this.contextView.viewRemoved = $bind(this,this.onViewAdded);
		}
	}
	,injectedViews: null
	,mappedTypes: null
	,mappedPackages: null
	,hasPackage: function(packageName) {
		return Lambda.has(this.mappedPackages,packageName);
	}
	,hasType: function(type) {
		return this.mappedTypes.get(type) != null;
	}
	,unmapType: function(type) {
		var mapping = this.mappedTypes.get(type);
		this.mappedTypes["delete"](type);
		if(mapping != null) {
			this.viewListenerCount--;
			if(this.viewListenerCount == 0) this.removeListeners();
		}
	}
	,mapType: function(type) {
		if(this.mappedTypes.get(type) != null) return;
		this.mappedTypes.set(type,type);
		this.viewListenerCount++;
		if(this.viewListenerCount == 1) this.addListeners();
		if(this.contextView != null && js.Boot.__instanceof(this.contextView,type)) this.injectInto(this.contextView);
	}
	,unmapPackage: function(packageName) {
		var index = Lambda.indexOf(this.mappedPackages,packageName);
		if(index > -1) {
			this.mappedPackages.splice(index,1);
			this.viewListenerCount--;
			if(this.viewListenerCount == 0) this.removeListeners();
		}
	}
	,mapPackage: function(packageName) {
		if(!Lambda.has(this.mappedPackages,packageName)) {
			this.mappedPackages.push(packageName);
			this.viewListenerCount++;
			if(this.viewListenerCount == 1) this.addListeners();
		}
	}
	,__class__: mmvc.base.ViewMap
});
mmvc.impl.Mediator = $hxClasses["mmvc.impl.Mediator"] = function() {
	mmvc.base.MediatorBase.call(this);
};
mmvc.impl.Mediator.__name__ = ["mmvc","impl","Mediator"];
mmvc.impl.Mediator.__super__ = mmvc.base.MediatorBase;
mmvc.impl.Mediator.prototype = $extend(mmvc.base.MediatorBase.prototype,{
	mediatorMap: null
	,contextView: null
	,injector: null
	,__class__: mmvc.impl.Mediator
});
var model = model || {}
model.ContactsModel = $hxClasses["model.ContactsModel"] = function() {
	this.signal = new msignal.Signal2();
};
model.ContactsModel.__name__ = ["model","ContactsModel"];
model.ContactsModel.prototype = {
	setSelectedContact: function(value) {
		this._selectedContact = value;
		this.dispatch(model.ContactsModel.SELECTED_CONTACT_SET,this);
		return this._selectedContact;
	}
	,getSelectedContact: function() {
		return this._selectedContact;
	}
	,_selectedContact: null
	,selectedContact: null
	,getContacts: function() {
		return this._contacts;
	}
	,setContacts: function(value) {
		this._contacts = value;
		this.dispatch(model.ContactsModel.CONTACTS_SET,this);
		return this._contacts;
	}
	,_contacts: null
	,contacts: null
	,dispatch: function(event,model) {
		if(model == null) model = this;
		this.signal.dispatch(event,model);
	}
	,signal: null
	,__class__: model.ContactsModel
	,__properties__: {set_contacts:"setContacts",get_contacts:"getContacts",set_selectedContact:"setSelectedContact",get_selectedContact:"getSelectedContact"}
}
msignal.Signal1 = $hxClasses["msignal.Signal1"] = function(type) {
	msignal.Signal.call(this,[type]);
};
msignal.Signal1.__name__ = ["msignal","Signal1"];
msignal.Signal1.__super__ = msignal.Signal;
msignal.Signal1.prototype = $extend(msignal.Signal.prototype,{
	createSlot: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		return new msignal.Slot1(this,listener,once,priority);
	}
	,dispatch: function(value) {
		var slotsToProcess = this.slots;
		while(slotsToProcess.nonEmpty) {
			slotsToProcess.head.execute(value);
			slotsToProcess = slotsToProcess.tail;
		}
	}
	,__class__: msignal.Signal1
});
msignal.Signal2 = $hxClasses["msignal.Signal2"] = function(type1,type2) {
	msignal.Signal.call(this,[type1,type2]);
};
msignal.Signal2.__name__ = ["msignal","Signal2"];
msignal.Signal2.__super__ = msignal.Signal;
msignal.Signal2.prototype = $extend(msignal.Signal.prototype,{
	createSlot: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		return new msignal.Slot2(this,listener,once,priority);
	}
	,dispatch: function(value1,value2) {
		var slotsToProcess = this.slots;
		while(slotsToProcess.nonEmpty) {
			slotsToProcess.head.execute(value1,value2);
			slotsToProcess = slotsToProcess.tail;
		}
	}
	,__class__: msignal.Signal2
});
msignal.Slot = $hxClasses["msignal.Slot"] = function(signal,listener,once,priority) {
	if(priority == null) priority = 0;
	if(once == null) once = false;
	this.signal = signal;
	this.set_listener(listener);
	this.once = once;
	this.priority = priority;
	this.enabled = true;
};
msignal.Slot.__name__ = ["msignal","Slot"];
msignal.Slot.prototype = {
	set_listener: function(value) {
		if(value == null) throw "listener cannot be null";
		return this.listener = value;
	}
	,remove: function() {
		this.signal.remove(this.listener);
	}
	,signal: null
	,enabled: null
	,priority: null
	,once: null
	,listener: null
	,__class__: msignal.Slot
	,__properties__: {set_listener:"set_listener"}
}
msignal.Slot0 = $hxClasses["msignal.Slot0"] = function(signal,listener,once,priority) {
	if(priority == null) priority = 0;
	if(once == null) once = false;
	msignal.Slot.call(this,signal,listener,once,priority);
};
msignal.Slot0.__name__ = ["msignal","Slot0"];
msignal.Slot0.__super__ = msignal.Slot;
msignal.Slot0.prototype = $extend(msignal.Slot.prototype,{
	execute: function() {
		if(!this.enabled) return;
		if(this.once) this.remove();
		this.listener();
	}
	,__class__: msignal.Slot0
});
msignal.Slot1 = $hxClasses["msignal.Slot1"] = function(signal,listener,once,priority) {
	if(priority == null) priority = 0;
	if(once == null) once = false;
	msignal.Slot.call(this,signal,listener,once,priority);
};
msignal.Slot1.__name__ = ["msignal","Slot1"];
msignal.Slot1.__super__ = msignal.Slot;
msignal.Slot1.prototype = $extend(msignal.Slot.prototype,{
	execute: function(value1) {
		if(!this.enabled) return;
		if(this.once) this.remove();
		if(this.param != null) value1 = this.param;
		this.listener(value1);
	}
	,param: null
	,__class__: msignal.Slot1
});
msignal.Slot2 = $hxClasses["msignal.Slot2"] = function(signal,listener,once,priority) {
	if(priority == null) priority = 0;
	if(once == null) once = false;
	msignal.Slot.call(this,signal,listener,once,priority);
};
msignal.Slot2.__name__ = ["msignal","Slot2"];
msignal.Slot2.__super__ = msignal.Slot;
msignal.Slot2.prototype = $extend(msignal.Slot.prototype,{
	execute: function(value1,value2) {
		if(!this.enabled) return;
		if(this.once) this.remove();
		if(this.param1 != null) value1 = this.param1;
		if(this.param2 != null) value2 = this.param2;
		this.listener(value1,value2);
	}
	,param2: null
	,param1: null
	,__class__: msignal.Slot2
});
msignal.SlotList = $hxClasses["msignal.SlotList"] = function(head,tail) {
	this.nonEmpty = false;
	if(head == null && tail == null) {
		if(msignal.SlotList.NIL != null) throw "Parameters head and tail are null. Use the NIL element instead.";
		this.nonEmpty = false;
	} else if(head == null) throw "Parameter head cannot be null."; else {
		this.head = head;
		this.tail = tail == null?msignal.SlotList.NIL:tail;
		this.nonEmpty = true;
	}
};
msignal.SlotList.__name__ = ["msignal","SlotList"];
msignal.SlotList.NIL = null;
msignal.SlotList.prototype = {
	find: function(listener) {
		if(!this.nonEmpty) return null;
		var p = this;
		while(p.nonEmpty) {
			if(Reflect.compareMethods(p.head.listener,listener)) return p.head;
			p = p.tail;
		}
		return null;
	}
	,contains: function(listener) {
		if(!this.nonEmpty) return false;
		var p = this;
		while(p.nonEmpty) {
			if(Reflect.compareMethods(p.head.listener,listener)) return true;
			p = p.tail;
		}
		return false;
	}
	,filterNot: function(listener) {
		if(!this.nonEmpty || listener == null) return this;
		if(Reflect.compareMethods(this.head.listener,listener)) return this.tail;
		var wholeClone = new msignal.SlotList(this.head);
		var subClone = wholeClone;
		var current = this.tail;
		while(current.nonEmpty) {
			if(Reflect.compareMethods(current.head.listener,listener)) {
				subClone.tail = current.tail;
				return wholeClone;
			}
			subClone = subClone.tail = new msignal.SlotList(current.head);
			current = current.tail;
		}
		return this;
	}
	,insertWithPriority: function(slot) {
		if(!this.nonEmpty) return new msignal.SlotList(slot);
		var priority = slot.priority;
		if(priority > this.head.priority) return this.prepend(slot);
		var wholeClone = new msignal.SlotList(this.head);
		var subClone = wholeClone;
		var current = this.tail;
		while(current.nonEmpty) {
			if(priority > current.head.priority) {
				subClone.tail = current.prepend(slot);
				return wholeClone;
			}
			subClone = subClone.tail = new msignal.SlotList(current.head);
			current = current.tail;
		}
		subClone.tail = new msignal.SlotList(slot);
		return wholeClone;
	}
	,append: function(slot) {
		if(slot == null) return this;
		if(!this.nonEmpty) return new msignal.SlotList(slot);
		if(this.tail == msignal.SlotList.NIL) return new msignal.SlotList(slot).prepend(this.head);
		var wholeClone = new msignal.SlotList(this.head);
		var subClone = wholeClone;
		var current = this.tail;
		while(current.nonEmpty) {
			subClone = subClone.tail = new msignal.SlotList(current.head);
			current = current.tail;
		}
		subClone.tail = new msignal.SlotList(slot);
		return wholeClone;
	}
	,prepend: function(slot) {
		return new msignal.SlotList(slot,this);
	}
	,get_length: function() {
		if(!this.nonEmpty) return 0;
		if(this.tail == msignal.SlotList.NIL) return 1;
		var result = 0;
		var p = this;
		while(p.nonEmpty) {
			++result;
			p = p.tail;
		}
		return result;
	}
	,length: null
	,nonEmpty: null
	,tail: null
	,head: null
	,__class__: msignal.SlotList
	,__properties__: {get_length:"get_length"}
}
service.IGetContactsService = $hxClasses["service.IGetContactsService"] = function() { }
service.IGetContactsService.__name__ = ["service","IGetContactsService"];
service.IGetContactsService.prototype = {
	getContacts: null
	,__class__: service.IGetContactsService
}
service.DummyGetContactsService = $hxClasses["service.DummyGetContactsService"] = function() {
};
service.DummyGetContactsService.__name__ = ["service","DummyGetContactsService"];
service.DummyGetContactsService.__interfaces__ = [service.IGetContactsService];
service.DummyGetContactsService.prototype = {
	getContacts: function(r) {
		var contactsArray = new Array();
		contactsArray.push(new vo.ContactVO("Bart","Simpson","01.png"));
		contactsArray.push(new vo.ContactVO("Maggie","Simpson","02.png"));
		contactsArray.push(new vo.ContactVO("Homer","Simpson","03.png"));
		r.onResult(contactsArray);
	}
	,__class__: service.DummyGetContactsService
}
var view = view || {}
view.View = $hxClasses["view.View"] = function() {
	this.id = "view" + view.View.idCounter++;
	this.index = -1;
	this.className = Type.getClassName(Type.getClass(this)).split(".").pop();
	this.children = [];
	this.signal = new msignal.Signal2();
	this.initialize();
};
view.View.__name__ = ["view","View"];
view.View.prototype = {
	set_index: function(value) {
		if(this.index != value) {
			this.index = value;
			this.update();
		}
		return this.index;
	}
	,update: function() {
	}
	,remove: function() {
	}
	,initialize: function() {
		if(this.tagName == null) this.tagName = "div";
		this.element = js.Lib.document.createElement(this.tagName);
		this.element.setAttribute("id",this.id);
		this.element.className = this.className;
	}
	,removeChild: function(view) {
		var removed = HxOverrides.remove(this.children,view);
		if(removed) {
			var oldIndex = view.index;
			view.remove();
			view.signal.remove($bind(this,this.dispatch));
			view.parent = null;
			view.set_index(-1);
			this.element.removeChild(view.element);
			var _g1 = oldIndex, _g = this.children.length;
			while(_g1 < _g) {
				var i = _g1++;
				var view1 = this.children[i];
				view1.set_index(i);
			}
			this.dispatch("removed",view);
		}
	}
	,addChild: function(view) {
		view.signal.add($bind(this,this.dispatch));
		view.parent = this;
		view.set_index(this.children.length);
		this.children.push(view);
		this.element.appendChild(view.element);
		this.dispatch("added",view);
	}
	,dispatch: function(event,view) {
		if(view == null) view = this;
		this.signal.dispatch(event,view);
	}
	,toString: function() {
		return this.className + "(" + this.id + ")";
	}
	,className: null
	,children: null
	,tagName: null
	,element: null
	,signal: null
	,index: null
	,parent: null
	,id: null
	,__class__: view.View
	,__properties__: {set_index:"set_index"}
}
view.AppView = $hxClasses["view.AppView"] = function() {
	view.View.call(this);
};
view.AppView.__name__ = ["view","AppView"];
view.AppView.__interfaces__ = [mmvc.api.IViewContainer];
view.AppView.__super__ = view.View;
view.AppView.prototype = $extend(view.View.prototype,{
	initialize: function() {
		view.View.prototype.initialize.call(this);
		js.Lib.document.body.appendChild(this.element);
	}
	,dispatch: function(event,view) {
		switch(event) {
		case "added":
			this.viewAdded(view);
			break;
		case "removed":
			this.viewRemoved(view);
			break;
		default:
			view.View.prototype.dispatch.call(this,event,view);
		}
	}
	,drawUI: function() {
		this.element.style.position = "absolute";
		this.element.style.width = "203px";
		this.element.style.height = "102px";
		this.element.style.backgroundColor = "grey";
		var contactsList = new view.ContactsList();
		contactsList.element.style.left = "1px";
		contactsList.element.style.top = "1px";
		this.addChild(contactsList);
		var thumbNailDisplay = new view.ThumbnailDisplay();
		thumbNailDisplay.element.style.left = "102px";
		thumbNailDisplay.element.style.top = "1px";
		this.addChild(thumbNailDisplay);
	}
	,isAdded: function(view) {
		return true;
	}
	,viewRemoved: null
	,viewAdded: null
	,__class__: view.AppView
});
view.AppViewMediator = $hxClasses["view.AppViewMediator"] = function() {
	mmvc.impl.Mediator.call(this);
};
view.AppViewMediator.__name__ = ["view","AppViewMediator"];
view.AppViewMediator.__super__ = mmvc.impl.Mediator;
view.AppViewMediator.prototype = $extend(mmvc.impl.Mediator.prototype,{
	onRemove: function() {
		mmvc.impl.Mediator.prototype.onRemove.call(this);
	}
	,onRegister: function() {
		mmvc.impl.Mediator.prototype.onRegister.call(this);
		this.view.drawUI();
		this.initSignal.dispatch();
	}
	,contactsModel: null
	,initSignal: null
	,__class__: view.AppViewMediator
});
view.ContactsList = $hxClasses["view.ContactsList"] = function() {
	view.View.call(this);
	this.element.style.position = "absolute";
};
view.ContactsList.__name__ = ["view","ContactsList"];
view.ContactsList.__super__ = view.View;
view.ContactsList.prototype = $extend(view.View.prototype,{
	listItemClickHandler: function(event,item) {
		this.clickedData = item.getData();
		this.dispatch(view.ContactsList.ON_ITEM_CLICKED,this);
	}
	,setSelectedVO: function(myVO) {
		var _g1 = 0, _g = this._listItems.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(this._listItems[i].getData() == myVO) this._listItems[i].setSelected(true); else this._listItems[i].setSelected(false);
		}
	}
	,setDataArray: function(data) {
		this._listItems = new Array();
		var _g1 = 0, _g = data.length;
		while(_g1 < _g) {
			var i = _g1++;
			var myVo = data[i];
			var listItem = new view.ListItem(myVo.firstName,myVo);
			listItem.element.style.top = i * 22 + "px";
			listItem.signal.add($bind(this,this.listItemClickHandler));
			this._listItems.push(listItem);
			this.element.appendChild(listItem.element);
		}
	}
	,_listItems: null
	,clickedData: null
	,__class__: view.ContactsList
});
view.ContactsListMediator = $hxClasses["view.ContactsListMediator"] = function() {
	mmvc.impl.Mediator.call(this);
};
view.ContactsListMediator.__name__ = ["view","ContactsListMediator"];
view.ContactsListMediator.__super__ = mmvc.impl.Mediator;
view.ContactsListMediator.prototype = $extend(mmvc.impl.Mediator.prototype,{
	viewItemSelectedHandler: function(event,myView) {
		this.selectContactSignal.selectedContact = this.view.clickedData;
		this.selectContactSignal.dispatch();
	}
	,contactsModelChangeHandler: function(event,model1) {
		switch(event) {
		case model.ContactsModel.CONTACTS_SET:
			this.view.setDataArray(model1.getContacts());
			break;
		case model.ContactsModel.SELECTED_CONTACT_SET:
			this.view.setSelectedVO(model1.getSelectedContact());
			break;
		}
	}
	,onRegister: function() {
		mmvc.impl.Mediator.prototype.onRegister.call(this);
		this.contactsModel.signal.add($bind(this,this.contactsModelChangeHandler));
		this.view.signal.add($bind(this,this.viewItemSelectedHandler));
	}
	,selectContactSignal: null
	,contactsModel: null
	,__class__: view.ContactsListMediator
});
view.ListItem = $hxClasses["view.ListItem"] = function(labelText,data) {
	var _g = this;
	this._data = data;
	this.signal = new msignal.Signal2();
	this.element = js.Lib.document.createElement("Div");
	this.element.style.position = "absolute";
	this.element.style.width = "100px";
	this.element.style.height = "20px";
	this.element.style.backgroundColor = "white";
	this.textField = js.Lib.document.createElement("Div");
	this.element.appendChild(this.textField);
	this.textField.innerHTML = labelText;
	this.element.onclick = function(e) {
		_g.signal.dispatch(view.ListItem.ON_CLICK,_g);
	};
};
view.ListItem.__name__ = ["view","ListItem"];
view.ListItem.prototype = {
	getData: function() {
		return this._data;
	}
	,setSelected: function(value) {
		this._selected = value;
		if(this._selected) this.element.style.backgroundColor = "#CCCCCC"; else this.element.style.backgroundColor = "white";
		return this._selected;
	}
	,getSelected: function() {
		return this._selected;
	}
	,_selected: null
	,selected: null
	,_data: null
	,data: null
	,_lableText: null
	,textField: null
	,element: null
	,signal: null
	,__class__: view.ListItem
	,__properties__: {get_data:"getData",set_selected:"setSelected",get_selected:"getSelected"}
}
view.ThumbnailDisplay = $hxClasses["view.ThumbnailDisplay"] = function() {
	view.View.call(this);
	this.drawUI();
};
view.ThumbnailDisplay.__name__ = ["view","ThumbnailDisplay"];
view.ThumbnailDisplay.__super__ = view.View;
view.ThumbnailDisplay.prototype = $extend(view.View.prototype,{
	setSrc: function(value) {
		this.image.src = value;
		return value;
	}
	,src: null
	,drawUI: function() {
		this.element.style.position = "absolute";
		this.image = js.Lib.document.createElement("img");
		this.image.style.width = "100px";
		this.image.style.height = "100px";
		this.element.appendChild(this.image);
	}
	,image: null
	,__class__: view.ThumbnailDisplay
	,__properties__: $extend(view.View.prototype.__properties__,{set_src:"setSrc"})
});
view.ThumbnailDisplayMediator = $hxClasses["view.ThumbnailDisplayMediator"] = function() {
	mmvc.impl.Mediator.call(this);
};
view.ThumbnailDisplayMediator.__name__ = ["view","ThumbnailDisplayMediator"];
view.ThumbnailDisplayMediator.__super__ = mmvc.impl.Mediator;
view.ThumbnailDisplayMediator.prototype = $extend(mmvc.impl.Mediator.prototype,{
	contactsModelChangeHandler: function(event,model1) {
		if(event == model.ContactsModel.SELECTED_CONTACT_SET) this.view.setSrc("images/" + this.contactsModel.getSelectedContact().thumbURL);
	}
	,onRegister: function() {
		mmvc.impl.Mediator.prototype.onRegister.call(this);
		this.contactsModel.signal.add($bind(this,this.contactsModelChangeHandler));
	}
	,contactsModel: null
	,__class__: view.ThumbnailDisplayMediator
});
var vo = vo || {}
vo.ContactVO = $hxClasses["vo.ContactVO"] = function(firstName,lastName,thumbURL) {
	this.firstName = firstName;
	this.lastName = lastName;
	this.thumbURL = thumbURL;
};
vo.ContactVO.__name__ = ["vo","ContactVO"];
vo.ContactVO.prototype = {
	thumbURL: null
	,lastName: null
	,firstName: null
	,__class__: vo.ContactVO
}
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; };
var $_;
function $bind(o,m) { var f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; return f; };
if(Array.prototype.indexOf) HxOverrides.remove = function(a,o) {
	var i = a.indexOf(o);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
}; else null;
Math.__name__ = ["Math"];
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
$hxClasses.Math = Math;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i) {
	return isNaN(i);
};
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = ["String"];
Array.prototype.__class__ = $hxClasses.Array = Array;
Array.__name__ = ["Array"];
Date.prototype.__class__ = $hxClasses.Date = Date;
Date.__name__ = ["Date"];
var Int = $hxClasses.Int = { __name__ : ["Int"]};
var Dynamic = $hxClasses.Dynamic = { __name__ : ["Dynamic"]};
var Float = $hxClasses.Float = Number;
Float.__name__ = ["Float"];
var Bool = $hxClasses.Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = $hxClasses.Class = { __name__ : ["Class"]};
var Enum = { };
var Void = $hxClasses.Void = { __ename__ : ["Void"]};
if(typeof document != "undefined") js.Lib.document = document;
if(typeof window != "undefined") {
	js.Lib.window = window;
	js.Lib.window.onerror = function(msg,url,line) {
		var f = js.Lib.onerror;
		if(f == null) return false;
		return f(msg,[url + ":" + line]);
	};
}
msignal.SlotList.NIL = new msignal.SlotList(null,null);
mmvc.api.IContext.__meta__ = { obj : { 'interface' : null}};
ApplicationContext.__meta__ = { fields : { initSignal : { name : ["initSignal"], type : ["controller.InitSignal"], inject : null}}};
mmvc.api.ICommand.__meta__ = { obj : { 'interface' : null}};
mmvc.impl.Command.__meta__ = { fields : { mediatorMap : { name : ["mediatorMap"], type : ["mmvc.api.IMediatorMap"], inject : null}, injector : { name : ["injector"], type : ["minject.Injector"], inject : null}, commandMap : { name : ["commandMap"], type : ["mmvc.api.ICommandMap"], inject : null}, contextView : { name : ["contextView"], type : ["mmvc.api.IViewContainer"], inject : null}}};
service.IResponder.__meta__ = { obj : { 'interface' : null}};
controller.InitCommand.__meta__ = { fields : { contactsModel : { name : ["contactsModel"], type : ["model.ContactsModel"], inject : null}, service : { name : ["service"], type : ["service.IGetContactsService"], inject : null}, signal : { name : ["signal"], type : ["controller.InitSignal"], inject : null}}};
msignal.Signal.__meta__ = { fields : { createSlot : { IgnoreCover : null}}};
controller.SelectContactCommand.__meta__ = { fields : { contactsModel : { name : ["contactsModel"], type : ["model.ContactsModel"], inject : null}, selectContactSignal : { name : ["selectContactSignal"], type : ["controller.SelectContactSignal"], inject : null}}};
js.Lib.onerror = null;
minject.point.InjectionPoint.__meta__ = { fields : { initializeInjection : { IgnoreCover : null}, applyInjection : { IgnoreCover : null}}};
minject.result.InjectionResult.__meta__ = { fields : { getResponse : { IgnoreCover : null}}};
mmvc.api.ICommandMap.__meta__ = { obj : { 'interface' : null}};
mmvc.api.IMediator.__meta__ = { obj : { 'interface' : null}};
mmvc.api.IMediatorMap.__meta__ = { obj : { 'interface' : null}};
mmvc.api.IViewContainer.__meta__ = { obj : { 'interface' : null}};
mmvc.api.IViewMap.__meta__ = { obj : { 'interface' : null}};
mmvc.base.ContextError.E_COMMANDMAP_NOIMPL = "Command Class does not implement an execute() method";
mmvc.base.ContextError.E_COMMANDMAP_OVR = "Cannot overwrite map";
mmvc.base.ContextError.E_MEDIATORMAP_NOIMPL = "Mediator Class does not implement IMediator";
mmvc.base.ContextError.E_MEDIATORMAP_OVR = "Mediator Class has already been mapped to a View Class in this context";
mmvc.base.ContextError.E_EVENTMAP_NOSNOOPING = "Listening to the context eventDispatcher is not enabled for this EventMap";
mmvc.base.ContextError.E_CONTEXT_INJECTOR = "The ContextBase does not specify a concrete Injector. Please override the injector getter in your concrete or abstract Context.";
mmvc.base.ContextError.E_CONTEXT_REFLECTOR = "The ContextBase does not specify a concrete Reflector. Please override the reflector getter in your concrete or abstract Context.";
mmvc.impl.Mediator.__meta__ = { fields : { mediatorMap : { name : ["mediatorMap"], type : ["mmvc.api.IMediatorMap"], inject : null}, contextView : { name : ["contextView"], type : ["mmvc.api.IViewContainer"], inject : null}, injector : { name : ["injector"], type : ["minject.Injector"], inject : null}}};
model.ContactsModel.CONTACTS_SET = "CONTACTS_SET";
model.ContactsModel.SELECTED_CONTACT_SET = "SELECTED_CONTACT_SET";
service.IGetContactsService.__meta__ = { obj : { 'interface' : null}};
view.View.ADDED = "added";
view.View.REMOVED = "removed";
view.View.ACTIONED = "actioned";
view.View.idCounter = 0;
view.AppView.ON_CLICK = "ON_CLICK";
view.AppViewMediator.__meta__ = { fields : { contactsModel : { name : ["contactsModel"], type : ["model.ContactsModel"], inject : null}, initSignal : { name : ["initSignal"], type : ["controller.InitSignal"], inject : null}}};
view.ContactsList.ON_ITEM_CLICKED = "ON_ITEM_CLICKED";
view.ContactsListMediator.__meta__ = { fields : { selectContactSignal : { name : ["selectContactSignal"], type : ["controller.SelectContactSignal"], inject : null}, contactsModel : { name : ["contactsModel"], type : ["model.ContactsModel"], inject : null}}};
view.ListItem.ON_CLICK = "ON_CLICK";
view.ThumbnailDisplayMediator.__meta__ = { fields : { contactsModel : { name : ["contactsModel"], type : ["model.ContactsModel"], inject : null}}};
Main.main();

//@ sourceMappingURL=MmvcExample.js.map