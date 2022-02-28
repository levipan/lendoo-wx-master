module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1595492076959, function(require, module, exports) {


var AV = require('./core');
var useAdatpers = require('./use-adapters');

module.exports = useAdatpers(AV);
}, function(modId) {var map = {"./core":1595492076960,"./use-adapters":1595492076996}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1595492076960, function(require, module, exports) {


module.exports = require('../index');
}, function(modId) { var map = {"../index":1595492076961}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1595492076961, function(require, module, exports) {


var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*!
 * LeanCloud JavaScript SDK
 * https://leancloud.cn
 *
 * Copyright 2016 LeanCloud.cn, Inc.
 * The LeanCloud JavaScript SDK is freely distributable under the MIT license.
 */
var _ = require('underscore');

var AV = require('./av');

AV._ = _;
AV.version = require('./version');
AV.Promise = _promise2.default;
AV.localStorage = require('./localstorage');
AV.Cache = require('./cache');
AV.Error = require('./error');

require('./init');
require('./event')(AV);
require('./geopoint')(AV);
require('./acl')(AV);
require('./op')(AV);
require('./relation')(AV);
require('./file')(AV);
require('./object')(AV);
require('./role')(AV);
require('./user')(AV);
require('./query')(AV);
require('./live-query')(AV);
require('./captcha')(AV);
require('./cloudfunction')(AV);
require('./push')(AV);
require('./status')(AV);
require('./search')(AV);
require('./insight')(AV);

AV.Conversation = require('./conversation');
require('./leaderboard');
module.exports = AV;

/**
 * Options to controll the authentication for an operation
 * @typedef {Object} AuthOptions
 * @property {String} [sessionToken] Specify a user to excute the operation as.
 * @property {AV.User} [user] Specify a user to excute the operation as. The user must have _sessionToken. This option will be ignored if sessionToken option provided.
 * @property {Boolean} [useMasterKey] Indicates whether masterKey is used for this operation. Only valid when masterKey is set.
 */
}, function(modId) { var map = {"./av":1595492076962,"./version":1595492076964,"./localstorage":1595492076966,"./cache":1595492076967,"./error":1595492076968,"./init":1595492076969,"./event":1595492076972,"./geopoint":1595492076973,"./acl":1595492076974,"./op":1595492076975,"./relation":1595492076976,"./file":1595492076977,"./object":1595492076983,"./role":1595492076984,"./user":1595492076985,"./query":1595492076986,"./live-query":1595492076987,"./captcha":1595492076988,"./cloudfunction":1595492076989,"./push":1595492076990,"./status":1595492076991,"./search":1595492076992,"./insight":1595492076993,"./conversation":1595492076994,"./leaderboard":1595492076995}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1595492076962, function(require, module, exports) {


var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require('underscore');
var uuid = require('uuid/v4');
var debug = require('debug');

var _require = require('./utils'),
    inherits = _require.inherits,
    parseDate = _require.parseDate;

var version = require('./version');

var _require2 = require('./adapter'),
    setAdapters = _require2.setAdapters,
    adapterManager = _require2.adapterManager;

var AV = global.AV || {};

// All internal configuration items
AV._config = {
  serverURLs: {},
  useMasterKey: false,
  production: null,
  realtime: null,
  requestTimeout: null
};

var initialUserAgent = 'LeanCloud-JS-SDK/' + version;

// configs shared by all AV instances
AV._sharedConfig = {
  userAgent: initialUserAgent,
  liveQueryRealtime: null
};

adapterManager.on('platformInfo', function (platformInfo) {
  var ua = initialUserAgent;
  if (platformInfo) {
    if (platformInfo.userAgent) {
      ua = platformInfo.userAgent;
    } else {
      var comments = platformInfo.name;
      if (platformInfo.version) {
        comments += '/' + platformInfo.version;
      }
      if (platformInfo.extra) {
        comments += '; ' + platformInfo.extra;
      }
      ua += ' (' + comments + ')';
    }
  }
  AV._sharedConfig.userAgent = ua;
});

/**
 * Contains all AV API classes and functions.
 * @namespace AV
 */

/**
 * Returns prefix for localStorage keys used by this instance of AV.
 * @param {String} path The relative suffix to append to it.
 *     null or undefined is treated as the empty string.
 * @return {String} The full key name.
 * @private
 */
AV._getAVPath = function (path) {
  if (!AV.applicationId) {
    throw new Error('You need to call AV.initialize before using AV.');
  }
  if (!path) {
    path = '';
  }
  if (!_.isString(path)) {
    throw new Error("Tried to get a localStorage path that wasn't a String.");
  }
  if (path[0] === '/') {
    path = path.substring(1);
  }
  return 'AV/' + AV.applicationId + '/' + path;
};

/**
 * Returns the unique string for this app on this machine.
 * Gets reset when localStorage is cleared.
 * @private
 */
AV._installationId = null;
AV._getInstallationId = function () {
  // See if it's cached in RAM.
  if (AV._installationId) {
    return _promise2.default.resolve(AV._installationId);
  }

  // Try to get it from localStorage.
  var path = AV._getAVPath('installationId');
  return AV.localStorage.getItemAsync(path).then(function (_installationId) {
    AV._installationId = _installationId;
    if (!AV._installationId) {
      // It wasn't in localStorage, so create a new one.
      AV._installationId = _installationId = uuid();
      return AV.localStorage.setItemAsync(path, _installationId).then(function () {
        return _installationId;
      });
    }
    return _installationId;
  });
};

AV._subscriptionId = null;
AV._refreshSubscriptionId = function () {
  var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : AV._getAVPath('subscriptionId');

  var subscriptionId = AV._subscriptionId = uuid();
  return AV.localStorage.setItemAsync(path, subscriptionId).then(function () {
    return subscriptionId;
  });
};
AV._getSubscriptionId = function () {
  // See if it's cached in RAM.
  if (AV._subscriptionId) {
    return _promise2.default.resolve(AV._subscriptionId);
  }

  // Try to get it from localStorage.
  var path = AV._getAVPath('subscriptionId');
  return AV.localStorage.getItemAsync(path).then(function (_subscriptionId) {
    AV._subscriptionId = _subscriptionId;
    if (!AV._subscriptionId) {
      // It wasn't in localStorage, so create a new one.
      _subscriptionId = AV._refreshSubscriptionId(path);
    }
    return _subscriptionId;
  });
};

AV._parseDate = parseDate;

// A self-propagating extend function.
AV._extend = function (protoProps, classProps) {
  var child = inherits(this, protoProps, classProps);
  child.extend = this.extend;
  return child;
};

/**
 * Converts a value in a AV Object into the appropriate representation.
 * This is the JS equivalent of Java's AV.maybeReferenceAndEncode(Object)
 * if seenObjects is falsey. Otherwise any AV.Objects not in
 * seenObjects will be fully embedded rather than encoded
 * as a pointer.  This array will be used to prevent going into an infinite
 * loop because we have circular references.  If <seenObjects>
 * is set, then none of the AV Objects that are serialized can be dirty.
 * @private
 */
AV._encode = function (value, seenObjects, disallowObjects) {
  var full = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

  if (value instanceof AV.Object) {
    if (disallowObjects) {
      throw new Error('AV.Objects not allowed here');
    }
    if (!seenObjects || _.include(seenObjects, value) || !value._hasData) {
      return value._toPointer();
    }
    return value._toFullJSON(seenObjects.concat(value), full);
  }
  if (value instanceof AV.ACL) {
    return value.toJSON();
  }
  if (_.isDate(value)) {
    return full ? { __type: 'Date', iso: value.toJSON() } : value.toJSON();
  }
  if (value instanceof AV.GeoPoint) {
    return value.toJSON();
  }
  if (_.isArray(value)) {
    return _.map(value, function (x) {
      return AV._encode(x, seenObjects, disallowObjects, full);
    });
  }
  if (_.isRegExp(value)) {
    return value.source;
  }
  if (value instanceof AV.Relation) {
    return value.toJSON();
  }
  if (value instanceof AV.Op) {
    return value.toJSON();
  }
  if (value instanceof AV.File) {
    if (!value.url() && !value.id) {
      throw new Error('Tried to save an object containing an unsaved file.');
    }
    return value._toFullJSON(seenObjects, full);
  }
  if (_.isObject(value)) {
    return _.mapObject(value, function (v, k) {
      return AV._encode(v, seenObjects, disallowObjects, full);
    });
  }
  return value;
};

/**
 * The inverse function of AV._encode.
 * @private
 */
AV._decode = function (value, key) {
  if (!_.isObject(value) || _.isDate(value)) {
    return value;
  }
  if (_.isArray(value)) {
    return _.map(value, function (v) {
      return AV._decode(v);
    });
  }
  if (value instanceof AV.Object) {
    return value;
  }
  if (value instanceof AV.File) {
    return value;
  }
  if (value instanceof AV.Op) {
    return value;
  }
  if (value instanceof AV.GeoPoint) {
    return value;
  }
  if (value instanceof AV.ACL) {
    return value;
  }
  if (key === 'ACL') {
    return new AV.ACL(value);
  }
  if (value.__op) {
    return AV.Op._decode(value);
  }
  var className;
  if (value.__type === 'Pointer') {
    className = value.className;
    var pointer = AV.Object._create(className);
    if ((0, _keys2.default)(value).length > 3) {
      var v = _.clone(value);
      delete v.__type;
      delete v.className;
      pointer._finishFetch(v, true);
    } else {
      pointer._finishFetch({ objectId: value.objectId }, false);
    }
    return pointer;
  }
  if (value.__type === 'Object') {
    // It's an Object included in a query result.
    className = value.className;
    var _v = _.clone(value);
    delete _v.__type;
    delete _v.className;
    var object = AV.Object._create(className);
    object._finishFetch(_v, true);
    return object;
  }
  if (value.__type === 'Date') {
    return AV._parseDate(value.iso);
  }
  if (value.__type === 'GeoPoint') {
    return new AV.GeoPoint({
      latitude: value.latitude,
      longitude: value.longitude
    });
  }
  if (value.__type === 'Relation') {
    if (!key) throw new Error('key missing decoding a Relation');
    var relation = new AV.Relation(null, key);
    relation.targetClassName = value.className;
    return relation;
  }
  if (value.__type === 'File') {
    var file = new AV.File(value.name);
    var _v2 = _.clone(value);
    delete _v2.__type;
    file._finishFetch(_v2);
    return file;
  }
  return _.mapObject(value, AV._decode);
};

/**
 * The inverse function of {@link AV.Object#toFullJSON}.
 * @since 3.0.0
 * @method
 * @param {Object}
 * return {AV.Object|AV.File|any}
 */
AV.parseJSON = AV._decode;

/**
 * Similar to JSON.parse, except that AV internal types will be used if possible.
 * Inverse to {@link AV.stringify}
 * @since 3.14.0
 * @param {string} text the string to parse.
 * @return {AV.Object|AV.File|any}
 */
AV.parse = function (text) {
  return AV.parseJSON(JSON.parse(text));
};
/**
 * Serialize a target containing AV.Object, similar to JSON.stringify.
 * Inverse to {@link AV.parse}
 * @since 3.14.0
 * @return {string}
 */
AV.stringify = function (target) {
  return (0, _stringify2.default)(AV._encode(target, [], false, true));
};

AV._encodeObjectOrArray = function (value) {
  var encodeAVObject = function encodeAVObject(object) {
    if (object && object._toFullJSON) {
      object = object._toFullJSON([]);
    }

    return _.mapObject(object, function (value) {
      return AV._encode(value, []);
    });
  };

  if (_.isArray(value)) {
    return value.map(function (object) {
      return encodeAVObject(object);
    });
  } else {
    return encodeAVObject(value);
  }
};

AV._arrayEach = _.each;

/**
 * Does a deep traversal of every item in object, calling func on every one.
 * @param {Object} object The object or array to traverse deeply.
 * @param {Function} func The function to call for every item. It will
 *     be passed the item as an argument. If it returns a truthy value, that
 *     value will replace the item in its parent container.
 * @returns {} the result of calling func on the top-level object itself.
 * @private
 */
AV._traverse = function (object, func, seen) {
  if (object instanceof AV.Object) {
    seen = seen || [];
    if (_.indexOf(seen, object) >= 0) {
      // We've already visited this object in this call.
      return;
    }
    seen.push(object);
    AV._traverse(object.attributes, func, seen);
    return func(object);
  }
  if (object instanceof AV.Relation || object instanceof AV.File) {
    // Nothing needs to be done, but we don't want to recurse into the
    // object's parent infinitely, so we catch this case.
    return func(object);
  }
  if (_.isArray(object)) {
    _.each(object, function (child, index) {
      var newChild = AV._traverse(child, func, seen);
      if (newChild) {
        object[index] = newChild;
      }
    });
    return func(object);
  }
  if (_.isObject(object)) {
    AV._each(object, function (child, key) {
      var newChild = AV._traverse(child, func, seen);
      if (newChild) {
        object[key] = newChild;
      }
    });
    return func(object);
  }
  return func(object);
};

/**
 * This is like _.each, except:
 * * it doesn't work for so-called array-like objects,
 * * it does work for dictionaries with a "length" attribute.
 * @private
 */
AV._objectEach = AV._each = function (obj, callback) {
  if (_.isObject(obj)) {
    _.each(_.keys(obj), function (key) {
      callback(obj[key], key);
    });
  } else {
    _.each(obj, callback);
  }
};

/**
 * @namespace
 * @since 3.14.0
 */
AV.debug = {
  /**
   * Enable debug
   */
  enable: function enable() {
    var namespaces = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'leancloud*';
    return debug.enable(namespaces);
  },
  /**
   * Disable debug
   */
  disable: debug.disable
};

/**
 * Specify Adapters
 * @since 4.4.0
 * @function
 * @param {Adapters} newAdapters See {@link https://url.leanapp.cn/adapter-type-definitions @leancloud/adapter-types} for detailed definitions.
 */
AV.setAdapters = setAdapters;

module.exports = AV;
}, function(modId) { var map = {"./utils":1595492076963,"./version":1595492076964,"./adapter":1595492076965}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1595492076963, function(require, module, exports) {


var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require('underscore');

// Helper function to check null or undefined.
var isNullOrUndefined = function isNullOrUndefined(x) {
  return _.isNull(x) || _.isUndefined(x);
};

var ensureArray = function ensureArray(target) {
  if (_.isArray(target)) {
    return target;
  }
  if (target === undefined || target === null) {
    return [];
  }
  return [target];
};

var transformFetchOptions = function transformFetchOptions() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      keys = _ref.keys,
      include = _ref.include,
      includeACL = _ref.includeACL;

  var fetchOptions = {};
  if (keys) {
    fetchOptions.keys = ensureArray(keys).join(',');
  }
  if (include) {
    fetchOptions.include = ensureArray(include).join(',');
  }
  if (includeACL) {
    fetchOptions.returnACL = includeACL;
  }
  return fetchOptions;
};

var getSessionToken = function getSessionToken(authOptions) {
  if (authOptions.sessionToken) {
    return authOptions.sessionToken;
  }
  if (authOptions.user && typeof authOptions.user.getSessionToken === 'function') {
    return authOptions.user.getSessionToken();
  }
};

var tap = function tap(interceptor) {
  return function (value) {
    return interceptor(value), value;
  };
};

// Shared empty constructor function to aid in prototype-chain creation.
var EmptyConstructor = function EmptyConstructor() {};

// Helper function to correctly set up the prototype chain, for subclasses.
// Similar to `goog.inherits`, but uses a hash of prototype properties and
// class properties to be extended.
var inherits = function inherits(parent, protoProps, staticProps) {
  var child;

  // The constructor function for the new subclass is either defined by you
  // (the "constructor" property in your `extend` definition), or defaulted
  // by us to simply call the parent's constructor.
  if (protoProps && protoProps.hasOwnProperty('constructor')) {
    child = protoProps.constructor;
  } else {
    /** @ignore */
    child = function child() {
      parent.apply(this, arguments);
    };
  }

  // Inherit class (static) properties from parent.
  _.extend(child, parent);

  // Set the prototype chain to inherit from `parent`, without calling
  // `parent`'s constructor function.
  EmptyConstructor.prototype = parent.prototype;
  child.prototype = new EmptyConstructor();

  // Add prototype properties (instance properties) to the subclass,
  // if supplied.
  if (protoProps) {
    _.extend(child.prototype, protoProps);
  }

  // Add static properties to the constructor function, if supplied.
  if (staticProps) {
    _.extend(child, staticProps);
  }

  // Correctly set child's `prototype.constructor`.
  child.prototype.constructor = child;

  // Set a convenience property in case the parent's prototype is
  // needed later.
  child.__super__ = parent.prototype;

  return child;
};

var parseDate = function parseDate(iso8601) {
  return new Date(iso8601);
};

var setValue = function setValue(target, key, value) {
  // '.' is not allowed in Class keys, escaping is not in concern now.
  var segs = key.split('.');
  var lastSeg = segs.pop();
  var currentTarget = target;
  segs.forEach(function (seg) {
    if (currentTarget[seg] === undefined) currentTarget[seg] = {};
    currentTarget = currentTarget[seg];
  });
  currentTarget[lastSeg] = value;
  return target;
};

var findValue = function findValue(target, key) {
  var segs = key.split('.');
  var firstSeg = segs[0];
  var lastSeg = segs.pop();
  var currentTarget = target;
  for (var i = 0; i < segs.length; i++) {
    currentTarget = currentTarget[segs[i]];
    if (currentTarget === undefined) {
      return [undefined, undefined, lastSeg];
    }
  }
  var value = currentTarget[lastSeg];
  return [value, currentTarget, lastSeg, firstSeg];
};

var isPlainObject = function isPlainObject(obj) {
  return _.isObject(obj) && (0, _getPrototypeOf2.default)(obj) === Object.prototype;
};

var continueWhile = function continueWhile(predicate, asyncFunction) {
  if (predicate()) {
    return asyncFunction().then(function () {
      return continueWhile(predicate, asyncFunction);
    });
  }
  return _promise2.default.resolve();
};

module.exports = {
  isNullOrUndefined: isNullOrUndefined,
  ensureArray: ensureArray,
  transformFetchOptions: transformFetchOptions,
  getSessionToken: getSessionToken,
  tap: tap,
  inherits: inherits,
  parseDate: parseDate,
  setValue: setValue,
  findValue: findValue,
  isPlainObject: isPlainObject,
  continueWhile: continueWhile
};
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1595492076964, function(require, module, exports) {


module.exports = '4.6.1';
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1595492076965, function(require, module, exports) {


var _ = require('underscore');
var EventEmitter = require('eventemitter3');

var _require = require('./utils'),
    inherits = _require.inherits;

var AdapterManager = inherits(EventEmitter, {
  constructor: function constructor() {
    EventEmitter.apply(this);
    this._adapters = {};
  },
  getAdapter: function getAdapter(name) {
    var adapter = this._adapters[name];
    if (adapter === undefined) {
      throw new Error(name + ' adapter is not configured');
    }
    return adapter;
  },
  setAdapters: function setAdapters(newAdapters) {
    var _this = this;

    _.extend(this._adapters, newAdapters);
    _.keys(newAdapters).forEach(function (name) {
      return _this.emit(name, newAdapters[name]);
    });
  }
});

var adapterManager = new AdapterManager();

module.exports = {
  getAdapter: adapterManager.getAdapter.bind(adapterManager),
  setAdapters: adapterManager.setAdapters.bind(adapterManager),
  adapterManager: adapterManager
};
}, function(modId) { var map = {"./utils":1595492076963}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1595492076966, function(require, module, exports) {


var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require('./adapter'),
    getAdapter = _require.getAdapter;

var syncApiNames = ['getItem', 'setItem', 'removeItem', 'clear'];

var localStorage = {
  get async() {
    return getAdapter('storage').async;
  }
};

// wrap sync apis with async ones.
syncApiNames.forEach(function (apiName) {
  localStorage[apiName + 'Async'] = function () {
    var storage = getAdapter('storage');
    return _promise2.default.resolve(storage[apiName].apply(storage, arguments));
  };

  localStorage[apiName] = function () {
    var storage = getAdapter('storage');
    if (!storage.async) {
      return storage[apiName].apply(storage, arguments);
    }
    var error = new Error('Synchronous API [' + apiName + '] is not available in this runtime.');
    error.code = 'SYNC_API_NOT_AVAILABLE';
    throw error;
  };
});

module.exports = localStorage;
}, function(modId) { var map = {"./adapter":1595492076965}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1595492076967, function(require, module, exports) {


var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var storage = require('./localstorage');
var AV = require('./av');

var removeAsync = exports.removeAsync = storage.removeItemAsync.bind(storage);

var getCacheData = function getCacheData(cacheData, key) {
  try {
    cacheData = JSON.parse(cacheData);
  } catch (e) {
    return null;
  }
  if (cacheData) {
    var expired = cacheData.expiredAt && cacheData.expiredAt < Date.now();
    if (!expired) {
      return cacheData.value;
    }
    return removeAsync(key).then(function () {
      return null;
    });
  }
  return null;
};

exports.getAsync = function (key) {
  key = 'AV/' + AV.applicationId + '/' + key;
  return storage.getItemAsync(key).then(function (cache) {
    return getCacheData(cache, key);
  });
};

exports.setAsync = function (key, value, ttl) {
  var cache = { value: value };
  if (typeof ttl === 'number') {
    cache.expiredAt = Date.now() + ttl;
  }
  return storage.setItemAsync('AV/' + AV.applicationId + '/' + key, (0, _stringify2.default)(cache));
};
}, function(modId) { var map = {"./localstorage":1595492076966,"./av":1595492076962}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1595492076968, function(require, module, exports) {


var _ = require('underscore');

/**
 * @class AV.Error
 */

function AVError(code, message) {
  var error = new Error(message);
  error.code = code;
  return error;
}

_.extend(AVError,
/** @lends AV.Error */{
  /**
   * Error code indicating some error other than those enumerated here.
   * @constant
   */
  OTHER_CAUSE: -1,

  /**
   * Error code indicating that something has gone wrong with the server.
   * If you get this error code, it is AV's fault. Contact us at
   * https://avoscloud.com/help
   * @constant
   */
  INTERNAL_SERVER_ERROR: 1,

  /**
   * Error code indicating the connection to the AV servers failed.
   * @constant
   */
  CONNECTION_FAILED: 100,

  /**
   * Error code indicating the specified object doesn't exist.
   * @constant
   */
  OBJECT_NOT_FOUND: 101,

  /**
   * Error code indicating you tried to query with a datatype that doesn't
   * support it, like exact matching an array or object.
   * @constant
   */
  INVALID_QUERY: 102,

  /**
   * Error code indicating a missing or invalid classname. Classnames are
   * case-sensitive. They must start with a letter, and a-zA-Z0-9_ are the
   * only valid characters.
   * @constant
   */
  INVALID_CLASS_NAME: 103,

  /**
   * Error code indicating an unspecified object id.
   * @constant
   */
  MISSING_OBJECT_ID: 104,

  /**
   * Error code indicating an invalid key name. Keys are case-sensitive. They
   * must start with a letter, and a-zA-Z0-9_ are the only valid characters.
   * @constant
   */
  INVALID_KEY_NAME: 105,

  /**
   * Error code indicating a malformed pointer. You should not see this unless
   * you have been mucking about changing internal AV code.
   * @constant
   */
  INVALID_POINTER: 106,

  /**
   * Error code indicating that badly formed JSON was received upstream. This
   * either indicates you have done something unusual with modifying how
   * things encode to JSON, or the network is failing badly.
   * @constant
   */
  INVALID_JSON: 107,

  /**
   * Error code indicating that the feature you tried to access is only
   * available internally for testing purposes.
   * @constant
   */
  COMMAND_UNAVAILABLE: 108,

  /**
   * You must call AV.initialize before using the AV library.
   * @constant
   */
  NOT_INITIALIZED: 109,

  /**
   * Error code indicating that a field was set to an inconsistent type.
   * @constant
   */
  INCORRECT_TYPE: 111,

  /**
   * Error code indicating an invalid channel name. A channel name is either
   * an empty string (the broadcast channel) or contains only a-zA-Z0-9_
   * characters.
   * @constant
   */
  INVALID_CHANNEL_NAME: 112,

  /**
   * Error code indicating that push is misconfigured.
   * @constant
   */
  PUSH_MISCONFIGURED: 115,

  /**
   * Error code indicating that the object is too large.
   * @constant
   */
  OBJECT_TOO_LARGE: 116,

  /**
   * Error code indicating that the operation isn't allowed for clients.
   * @constant
   */
  OPERATION_FORBIDDEN: 119,

  /**
   * Error code indicating the result was not found in the cache.
   * @constant
   */
  CACHE_MISS: 120,

  /**
   * Error code indicating that an invalid key was used in a nested
   * JSONObject.
   * @constant
   */
  INVALID_NESTED_KEY: 121,

  /**
   * Error code indicating that an invalid filename was used for AVFile.
   * A valid file name contains only a-zA-Z0-9_. characters and is between 1
   * and 128 characters.
   * @constant
   */
  INVALID_FILE_NAME: 122,

  /**
   * Error code indicating an invalid ACL was provided.
   * @constant
   */
  INVALID_ACL: 123,

  /**
   * Error code indicating that the request timed out on the server. Typically
   * this indicates that the request is too expensive to run.
   * @constant
   */
  TIMEOUT: 124,

  /**
   * Error code indicating that the email address was invalid.
   * @constant
   */
  INVALID_EMAIL_ADDRESS: 125,

  /**
   * Error code indicating a missing content type.
   * @constant
   */
  MISSING_CONTENT_TYPE: 126,

  /**
   * Error code indicating a missing content length.
   * @constant
   */
  MISSING_CONTENT_LENGTH: 127,

  /**
   * Error code indicating an invalid content length.
   * @constant
   */
  INVALID_CONTENT_LENGTH: 128,

  /**
   * Error code indicating a file that was too large.
   * @constant
   */
  FILE_TOO_LARGE: 129,

  /**
   * Error code indicating an error saving a file.
   * @constant
   */
  FILE_SAVE_ERROR: 130,

  /**
   * Error code indicating an error deleting a file.
   * @constant
   */
  FILE_DELETE_ERROR: 153,

  /**
   * Error code indicating that a unique field was given a value that is
   * already taken.
   * @constant
   */
  DUPLICATE_VALUE: 137,

  /**
   * Error code indicating that a role's name is invalid.
   * @constant
   */
  INVALID_ROLE_NAME: 139,

  /**
   * Error code indicating that an application quota was exceeded.  Upgrade to
   * resolve.
   * @constant
   */
  EXCEEDED_QUOTA: 140,

  /**
   * Error code indicating that a Cloud Code script failed.
   * @constant
   */
  SCRIPT_FAILED: 141,

  /**
   * Error code indicating that a Cloud Code validation failed.
   * @constant
   */
  VALIDATION_ERROR: 142,

  /**
   * Error code indicating that invalid image data was provided.
   * @constant
   */
  INVALID_IMAGE_DATA: 150,

  /**
   * Error code indicating an unsaved file.
   * @constant
   */
  UNSAVED_FILE_ERROR: 151,

  /**
   * Error code indicating an invalid push time.
   */
  INVALID_PUSH_TIME_ERROR: 152,

  /**
   * Error code indicating that the username is missing or empty.
   * @constant
   */
  USERNAME_MISSING: 200,

  /**
   * Error code indicating that the password is missing or empty.
   * @constant
   */
  PASSWORD_MISSING: 201,

  /**
   * Error code indicating that the username has already been taken.
   * @constant
   */
  USERNAME_TAKEN: 202,

  /**
   * Error code indicating that the email has already been taken.
   * @constant
   */
  EMAIL_TAKEN: 203,

  /**
   * Error code indicating that the email is missing, but must be specified.
   * @constant
   */
  EMAIL_MISSING: 204,

  /**
   * Error code indicating that a user with the specified email was not found.
   * @constant
   */
  EMAIL_NOT_FOUND: 205,

  /**
   * Error code indicating that a user object without a valid session could
   * not be altered.
   * @constant
   */
  SESSION_MISSING: 206,

  /**
   * Error code indicating that a user can only be created through signup.
   * @constant
   */
  MUST_CREATE_USER_THROUGH_SIGNUP: 207,

  /**
   * Error code indicating that an an account being linked is already linked
   * to another user.
   * @constant
   */
  ACCOUNT_ALREADY_LINKED: 208,

  /**
   * Error code indicating that a user cannot be linked to an account because
   * that account's id could not be found.
   * @constant
   */
  LINKED_ID_MISSING: 250,

  /**
   * Error code indicating that a user with a linked (e.g. Facebook) account
   * has an invalid session.
   * @constant
   */
  INVALID_LINKED_SESSION: 251,

  /**
   * Error code indicating that a service being linked (e.g. Facebook or
   * Twitter) is unsupported.
   * @constant
   */
  UNSUPPORTED_SERVICE: 252,
  /**
   * Error code indicating a real error code is unavailable because
   * we had to use an XDomainRequest object to allow CORS requests in
   * Internet Explorer, which strips the body from HTTP responses that have
   * a non-2XX status code.
   * @constant
   */
  X_DOMAIN_REQUEST: 602
});

module.exports = AVError;
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1595492076969, function(require, module, exports) {


var _defineProperty = require('babel-runtime/core-js/object/define-property');

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AV = require('./av');
var AppRouter = require('./app-router');

var _require = require('./utils'),
    isNullOrUndefined = _require.isNullOrUndefined;

var _require2 = require('underscore'),
    extend = _require2.extend,
    isObject = _require2.isObject,
    isEmpty = _require2.isEmpty;

var isCNApp = function isCNApp(appId) {
  return appId.slice(-9) !== '-MdYXbMMI';
};

var fillServerURLs = function fillServerURLs(url) {
  return {
    push: url,
    stats: url,
    engine: url,
    api: url,
    rtm: url
  };
};

function getDefaultServerURLs(appId) {
  if (isCNApp(appId)) {
    return {};
  }
  var id = appId.slice(0, 8).toLowerCase();
  var domain = 'lncldglobal.com';
  return {
    push: 'https://' + id + '.push.' + domain,
    stats: 'https://' + id + '.stats.' + domain,
    engine: 'https://' + id + '.engine.' + domain,
    api: 'https://' + id + '.api.' + domain,
    rtm: 'https://' + id + '.rtm.' + domain
  };
}

var _disableAppRouter = false;
var _initialized = false;

/**
 * URLs for services
 * @typedef {Object} ServerURLs
 * @property {String} [api] serverURL for API service
 * @property {String} [engine] serverURL for engine service
 * @property {String} [stats] serverURL for stats service
 * @property {String} [push] serverURL for push service
 * @property {String} [rtm] serverURL for LiveQuery service
 */

/**
 * Call this method first to set up your authentication tokens for AV.
 * You can get your app keys from the LeanCloud dashboard on http://leancloud.cn .
 * @function AV.init
 * @param {Object} options
 * @param {String} options.appId application id
 * @param {String} options.appKey application key
 * @param {String} [options.masterKey] application master key
 * @param {Boolean} [options.production]
 * @param {String|ServerURLs} [options.serverURL] URLs for services. if a string was given, it will be applied for all services.
 * @param {Boolean} [options.disableCurrentUser]
 */
AV.init = function init(options) {
  if (!isObject(options)) {
    return AV.init({
      appId: options,
      appKey: arguments.length <= 1 ? undefined : arguments[1],
      masterKey: arguments.length <= 2 ? undefined : arguments[2]
    });
  }
  var appId = options.appId,
      appKey = options.appKey,
      masterKey = options.masterKey,
      hookKey = options.hookKey,
      serverURL = options.serverURL,
      _options$serverURLs = options.serverURLs,
      serverURLs = _options$serverURLs === undefined ? serverURL : _options$serverURLs,
      disableCurrentUser = options.disableCurrentUser,
      production = options.production,
      realtime = options.realtime;

  if (_initialized) console.warn('Initializing LeanCloud Storage SDK which has already been initialized. Reinitializing the SDK might cause problems like unexpected cross-app data writing and invalid relations.');
  if (!appId) throw new TypeError('appId must be a string');
  if (!appKey) throw new TypeError('appKey must be a string');
  if ('NODE_JS' !== 'NODE_JS' && masterKey) console.warn('MasterKey is not supposed to be used at client side.');
  if (isCNApp(appId)) {
    if (!serverURLs && isEmpty(AV._config.serverURLs)) {
      throw new TypeError('serverURL option is required for apps from CN region');
    }
  }
  if (appId !== AV._config.applicationId) {
    // overwrite all keys when reinitializing as a new app
    AV._config.masterKey = masterKey;
    AV._config.hookKey = hookKey;
  } else {
    if (masterKey) AV._config.masterKey = masterKey;
    if (hookKey) AV._config.hookKey = hookKey;
  }
  AV._config.applicationId = appId;
  AV._config.applicationKey = appKey;
  AV.setProduction(production);
  if (typeof disableCurrentUser !== 'undefined') AV._config.disableCurrentUser = disableCurrentUser;
  var disableAppRouter = _disableAppRouter || typeof serverURLs !== 'undefined';
  if (!disableAppRouter) {
    AV._appRouter = new AppRouter(AV);
  }
  AV._setServerURLs(extend({}, getDefaultServerURLs(appId), AV._config.serverURLs, typeof serverURLs === 'string' ? fillServerURLs(serverURLs) : serverURLs), disableAppRouter);
  if (realtime) {
    AV._config.realtime = realtime;
  } else if (AV._sharedConfig.liveQueryRealtime) {
    var _AV$_config$serverURL = AV._config.serverURLs,
        api = _AV$_config$serverURL.api,
        rtm = _AV$_config$serverURL.rtm;

    AV._config.realtime = new AV._sharedConfig.liveQueryRealtime({
      appId: appId,
      appKey: appKey,
      server: {
        api: api,
        RTMRouter: rtm
      }
    });
  }
  _initialized = true;
};

// If we're running in node.js, allow using the master key.
if ('NODE_JS' === 'NODE_JS') {
  AV.Cloud = AV.Cloud || {};
  /**
   * Switches the LeanCloud SDK to using the Master key.  The Master key grants
   * priveleged access to the data in LeanCloud and can be used to bypass ACLs and
   * other restrictions that are applied to the client SDKs.
   * <p><strong><em>Available in Cloud Code and Node.js only.</em></strong>
   * </p>
   */
  AV.Cloud.useMasterKey = function () {
    AV._config.useMasterKey = true;
  };
}

/**
 * Call this method to set production environment variable.
 * @function AV.setProduction
 * @param {Boolean} production True is production environment,and
 *  it's true by default.
 */
AV.setProduction = function (production) {
  if (!isNullOrUndefined(production)) {
    AV._config.production = production ? 1 : 0;
  } else {
    // change to default value
    AV._config.production = null;
  }
};

AV._setServerURLs = function (urls) {
  var disableAppRouter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  if (typeof urls !== 'string') {
    extend(AV._config.serverURLs, urls);
  } else {
    AV._config.serverURLs = fillServerURLs(urls);
  }
  if (disableAppRouter) {
    if (AV._appRouter) {
      AV._appRouter.disable();
    } else {
      _disableAppRouter = true;
    }
  }
};
/**
 * Set server URLs for services.
 * @function AV.setServerURL
 * @since 4.3.0
 * @param {String|ServerURLs} urls URLs for services. if a string was given, it will be applied for all services.
 * You can also set them when initializing SDK with `options.serverURL`
 */
AV.setServerURL = function (urls) {
  return AV._setServerURLs(urls);
};
AV.setServerURLs = AV.setServerURL;

AV.keepErrorRawMessage = function (value) {
  AV._sharedConfig.keepErrorRawMessage = value;
};

/**
 * Set a deadline for requests to complete.
 * Note that file upload requests are not affected.
 * @function AV.setRequestTimeout
 * @since 3.6.0
 * @param {number} ms
 */
AV.setRequestTimeout = function (ms) {
  AV._config.requestTimeout = ms;
};

// backword compatible
AV.initialize = AV.init;

var defineConfig = function defineConfig(property) {
  return (0, _defineProperty2.default)(AV, property, {
    get: function get() {
      return AV._config[property];
    },
    set: function set(value) {
      AV._config[property] = value;
    }
  });
};

['applicationId', 'applicationKey', 'masterKey', 'hookKey'].forEach(defineConfig);
}, function(modId) { var map = {"./av":1595492076962,"./app-router":1595492076970,"./utils":1595492076963}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1595492076970, function(require, module, exports) {


var ajax = require('./utils/ajax');
var Cache = require('./cache');

function AppRouter(AV) {
  var _this = this;

  this.AV = AV;
  this.lockedUntil = 0;
  Cache.getAsync('serverURLs').then(function (data) {
    if (_this.disabled) return;
    if (!data) return _this.lock(0);
    var serverURLs = data.serverURLs,
        lockedUntil = data.lockedUntil;

    _this.AV._setServerURLs(serverURLs, false);
    _this.lockedUntil = lockedUntil;
  }).catch(function () {
    return _this.lock(0);
  });
}

AppRouter.prototype.disable = function disable() {
  this.disabled = true;
};
AppRouter.prototype.lock = function lock(ttl) {
  this.lockedUntil = Date.now() + ttl;
};
AppRouter.prototype.refresh = function refresh() {
  var _this2 = this;

  if (this.disabled) return;
  if (Date.now() < this.lockedUntil) return;
  this.lock(10);
  var url = 'https://app-router.com/2/route';
  return ajax({
    method: 'get',
    url: url,
    query: {
      appId: this.AV.applicationId
    }
  }).then(function (servers) {
    if (_this2.disabled) return;
    var ttl = servers.ttl;
    if (!ttl) throw new Error('missing ttl');
    ttl = ttl * 1000;
    var protocal = 'https://';
    var serverURLs = {
      push: protocal + servers.push_server,
      stats: protocal + servers.stats_server,
      engine: protocal + servers.engine_server,
      api: protocal + servers.api_server
    };
    _this2.AV._setServerURLs(serverURLs, false);
    _this2.lock(ttl);
    return Cache.setAsync('serverURLs', {
      serverURLs: serverURLs,
      lockedUntil: _this2.lockedUntil
    }, ttl);
  }).catch(function (error) {
    // bypass all errors
    console.warn('refresh server URLs failed: ' + error.message);
    _this2.lock(600);
  });
};

module.exports = AppRouter;
}, function(modId) { var map = {"./utils/ajax":1595492076971,"./cache":1595492076967}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1595492076971, function(require, module, exports) {


var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require('underscore');

var _require = require('promise-timeout'),
    timeout = _require.timeout;

var debug = require('debug');
var debugRequest = debug('leancloud:request');
var debugRequestError = debug('leancloud:request:error');

var _require2 = require('../adapter'),
    getAdapter = _require2.getAdapter;

var requestsCount = 0;

var ajax = function ajax(_ref) {
  var method = _ref.method,
      url = _ref.url,
      query = _ref.query,
      data = _ref.data,
      _ref$headers = _ref.headers,
      headers = _ref$headers === undefined ? {} : _ref$headers,
      time = _ref.timeout,
      onprogress = _ref.onprogress;

  if (query) {
    var queryString = (0, _keys2.default)(query).map(function (key) {
      var value = query[key];
      if (value === undefined) return undefined;
      var v = (typeof value === 'undefined' ? 'undefined' : (0, _typeof3.default)(value)) === 'object' ? (0, _stringify2.default)(value) : value;
      return encodeURIComponent(key) + '=' + encodeURIComponent(v);
    }).filter(function (qs) {
      return qs;
    }).join('&');
    url = url + '?' + queryString;
  }

  var count = requestsCount++;
  debugRequest('request(%d) %s %s %o %o %o', count, method, url, query, data, headers);

  var request = getAdapter('request');
  var promise = request(url, { method: method, headers: headers, data: data, onprogress: onprogress }).then(function (response) {
    debugRequest('response(%d) %d %O %o', count, response.status, response.data || response.text, response.header);
    if (response.ok === false) {
      var error = new Error();
      error.response = response;
      throw error;
    }
    return response.data;
  }).catch(function (error) {
    if (error.response) {
      if (!debug.enabled('leancloud:request')) {
        debugRequestError('request(%d) %s %s %o %o %o', count, method, url, query, data, headers);
      }
      debugRequestError('response(%d) %d %O %o', count, error.response.status, error.response.data || error.response.text, error.response.header);
      error.statusCode = error.response.status;
      error.responseText = error.response.text;
      error.response = error.response.data;
    }
    throw error;
  });
  return time ? timeout(promise, time) : promise;
};

module.exports = ajax;
}, function(modId) { var map = {"../adapter":1595492076965}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1595492076972, function(require, module, exports) {


var _ = require('underscore');

module.exports = function (AV) {
  var eventSplitter = /\s+/;
  var slice = Array.prototype.slice;

  /**
   * @class
   *
   * <p>AV.Events is a fork of Backbone's Events module, provided for your
   * convenience.</p>
   *
   * <p>A module that can be mixed in to any object in order to provide
   * it with custom events. You may bind callback functions to an event
   * with `on`, or remove these functions with `off`.
   * Triggering an event fires all callbacks in the order that `on` was
   * called.
   *
   * @private
   * @example
   * var object = {};
   * _.extend(object, AV.Events);
   * object.on('expand', function(){ alert('expanded'); });
   * object.trigger('expand');</pre></p>
   *
   */
  AV.Events = {
    /**
     * Bind one or more space separated events, `events`, to a `callback`
     * function. Passing `"all"` will bind the callback to all events fired.
     */
    on: function on(events, callback, context) {
      var calls, event, node, tail, list;
      if (!callback) {
        return this;
      }
      events = events.split(eventSplitter);
      calls = this._callbacks || (this._callbacks = {});

      // Create an immutable callback list, allowing traversal during
      // modification.  The tail is an empty object that will always be used
      // as the next node.
      event = events.shift();
      while (event) {
        list = calls[event];
        node = list ? list.tail : {};
        node.next = tail = {};
        node.context = context;
        node.callback = callback;
        calls[event] = { tail: tail, next: list ? list.next : node };
        event = events.shift();
      }

      return this;
    },

    /**
     * Remove one or many callbacks. If `context` is null, removes all callbacks
     * with that function. If `callback` is null, removes all callbacks for the
     * event. If `events` is null, removes all bound callbacks for all events.
     */
    off: function off(events, callback, context) {
      var event, calls, node, tail, cb, ctx;

      // No events, or removing *all* events.
      if (!(calls = this._callbacks)) {
        return;
      }
      if (!(events || callback || context)) {
        delete this._callbacks;
        return this;
      }

      // Loop through the listed events and contexts, splicing them out of the
      // linked list of callbacks if appropriate.
      events = events ? events.split(eventSplitter) : _.keys(calls);
      event = events.shift();
      while (event) {
        node = calls[event];
        delete calls[event];
        if (!node || !(callback || context)) {
          continue;
        }
        // Create a new list, omitting the indicated callbacks.
        tail = node.tail;
        node = node.next;
        while (node !== tail) {
          cb = node.callback;
          ctx = node.context;
          if (callback && cb !== callback || context && ctx !== context) {
            this.on(event, cb, ctx);
          }
          node = node.next;
        }
        event = events.shift();
      }

      return this;
    },

    /**
     * Trigger one or many events, firing all bound callbacks. Callbacks are
     * passed the same arguments as `trigger` is, apart from the event name
     * (unless you're listening on `"all"`, which will cause your callback to
     * receive the true name of the event as the first argument).
     */
    trigger: function trigger(events) {
      var event, node, calls, tail, args, all, rest;
      if (!(calls = this._callbacks)) {
        return this;
      }
      all = calls.all;
      events = events.split(eventSplitter);
      rest = slice.call(arguments, 1);

      // For each event, walk through the linked list of callbacks twice,
      // first to trigger the event, then to trigger any `"all"` callbacks.
      event = events.shift();
      while (event) {
        node = calls[event];
        if (node) {
          tail = node.tail;
          while ((node = node.next) !== tail) {
            node.callback.apply(node.context || this, rest);
          }
        }
        node = all;
        if (node) {
          tail = node.tail;
          args = [event].concat(rest);
          while ((node = node.next) !== tail) {
            node.callback.apply(node.context || this, args);
          }
        }
        event = events.shift();
      }

      return this;
    }
  };

  /**
   * @function
   */
  AV.Events.bind = AV.Events.on;

  /**
   * @function
   */
  AV.Events.unbind = AV.Events.off;
};
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1595492076973, function(require, module, exports) {


var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require('underscore');

/*global navigator: false */
module.exports = function (AV) {
  /**
   * Creates a new GeoPoint with any of the following forms:<br>
   * @example
   * new GeoPoint(otherGeoPoint)
   * new GeoPoint(30, 30)
   * new GeoPoint([30, 30])
   * new GeoPoint({latitude: 30, longitude: 30})
   * new GeoPoint()  // defaults to (0, 0)
   * @class
   *
   * <p>Represents a latitude / longitude point that may be associated
   * with a key in a AVObject or used as a reference point for geo queries.
   * This allows proximity-based queries on the key.</p>
   *
   * <p>Only one key in a class may contain a GeoPoint.</p>
   *
   * <p>Example:<pre>
   *   var point = new AV.GeoPoint(30.0, -20.0);
   *   var object = new AV.Object("PlaceObject");
   *   object.set("location", point);
   *   object.save();</pre></p>
   */
  AV.GeoPoint = function (arg1, arg2) {
    if (_.isArray(arg1)) {
      AV.GeoPoint._validate(arg1[0], arg1[1]);
      this.latitude = arg1[0];
      this.longitude = arg1[1];
    } else if (_.isObject(arg1)) {
      AV.GeoPoint._validate(arg1.latitude, arg1.longitude);
      this.latitude = arg1.latitude;
      this.longitude = arg1.longitude;
    } else if (_.isNumber(arg1) && _.isNumber(arg2)) {
      AV.GeoPoint._validate(arg1, arg2);
      this.latitude = arg1;
      this.longitude = arg2;
    } else {
      this.latitude = 0;
      this.longitude = 0;
    }

    // Add properties so that anyone using Webkit or Mozilla will get an error
    // if they try to set values that are out of bounds.
    var self = this;
    if (this.__defineGetter__ && this.__defineSetter__) {
      // Use _latitude and _longitude to actually store the values, and add
      // getters and setters for latitude and longitude.
      this._latitude = this.latitude;
      this._longitude = this.longitude;
      this.__defineGetter__('latitude', function () {
        return self._latitude;
      });
      this.__defineGetter__('longitude', function () {
        return self._longitude;
      });
      this.__defineSetter__('latitude', function (val) {
        AV.GeoPoint._validate(val, self.longitude);
        self._latitude = val;
      });
      this.__defineSetter__('longitude', function (val) {
        AV.GeoPoint._validate(self.latitude, val);
        self._longitude = val;
      });
    }
  };

  /**
   * @lends AV.GeoPoint.prototype
   * @property {float} latitude North-south portion of the coordinate, in range
   *   [-90, 90].  Throws an exception if set out of range in a modern browser.
   * @property {float} longitude East-west portion of the coordinate, in range
   *   [-180, 180].  Throws if set out of range in a modern browser.
   */

  /**
   * Throws an exception if the given lat-long is out of bounds.
   * @private
   */
  AV.GeoPoint._validate = function (latitude, longitude) {
    if (latitude < -90.0) {
      throw new Error('AV.GeoPoint latitude ' + latitude + ' < -90.0.');
    }
    if (latitude > 90.0) {
      throw new Error('AV.GeoPoint latitude ' + latitude + ' > 90.0.');
    }
    if (longitude < -180.0) {
      throw new Error('AV.GeoPoint longitude ' + longitude + ' < -180.0.');
    }
    if (longitude > 180.0) {
      throw new Error('AV.GeoPoint longitude ' + longitude + ' > 180.0.');
    }
  };

  /**
   * Creates a GeoPoint with the user's current location, if available.
   * @return {Promise.<AV.GeoPoint>}
   */
  AV.GeoPoint.current = function () {
    return new _promise2.default(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(function (location) {
        resolve(new AV.GeoPoint({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        }));
      }, reject);
    });
  };

  _.extend(AV.GeoPoint.prototype,
  /** @lends AV.GeoPoint.prototype */{
    /**
     * Returns a JSON representation of the GeoPoint, suitable for AV.
     * @return {Object}
     */
    toJSON: function toJSON() {
      AV.GeoPoint._validate(this.latitude, this.longitude);
      return {
        __type: 'GeoPoint',
        latitude: this.latitude,
        longitude: this.longitude
      };
    },

    /**
     * Returns the distance from this GeoPoint to another in radians.
     * @param {AV.GeoPoint} point the other AV.GeoPoint.
     * @return {Number}
     */
    radiansTo: function radiansTo(point) {
      var d2r = Math.PI / 180.0;
      var lat1rad = this.latitude * d2r;
      var long1rad = this.longitude * d2r;
      var lat2rad = point.latitude * d2r;
      var long2rad = point.longitude * d2r;
      var deltaLat = lat1rad - lat2rad;
      var deltaLong = long1rad - long2rad;
      var sinDeltaLatDiv2 = Math.sin(deltaLat / 2);
      var sinDeltaLongDiv2 = Math.sin(deltaLong / 2);
      // Square of half the straight line chord distance between both points.
      var a = sinDeltaLatDiv2 * sinDeltaLatDiv2 + Math.cos(lat1rad) * Math.cos(lat2rad) * sinDeltaLongDiv2 * sinDeltaLongDiv2;
      a = Math.min(1.0, a);
      return 2 * Math.asin(Math.sqrt(a));
    },

    /**
     * Returns the distance from this GeoPoint to another in kilometers.
     * @param {AV.GeoPoint} point the other AV.GeoPoint.
     * @return {Number}
     */
    kilometersTo: function kilometersTo(point) {
      return this.radiansTo(point) * 6371.0;
    },

    /**
     * Returns the distance from this GeoPoint to another in miles.
     * @param {AV.GeoPoint} point the other AV.GeoPoint.
     * @return {Number}
     */
    milesTo: function milesTo(point) {
      return this.radiansTo(point) * 3958.8;
    }
  });
};
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1595492076974, function(require, module, exports) {


var _ = require('underscore');

module.exports = function (AV) {
  var PUBLIC_KEY = '*';

  /**
   * Creates a new ACL.
   * If no argument is given, the ACL has no permissions for anyone.
   * If the argument is a AV.User, the ACL will have read and write
   *   permission for only that user.
   * If the argument is any other JSON object, that object will be interpretted
   *   as a serialized ACL created with toJSON().
   * @see AV.Object#setACL
   * @class
   *
   * <p>An ACL, or Access Control List can be added to any
   * <code>AV.Object</code> to restrict access to only a subset of users
   * of your application.</p>
   */
  AV.ACL = function (arg1) {
    var self = this;
    self.permissionsById = {};
    if (_.isObject(arg1)) {
      if (arg1 instanceof AV.User) {
        self.setReadAccess(arg1, true);
        self.setWriteAccess(arg1, true);
      } else {
        if (_.isFunction(arg1)) {
          throw new Error('AV.ACL() called with a function.  Did you forget ()?');
        }
        AV._objectEach(arg1, function (accessList, userId) {
          if (!_.isString(userId)) {
            throw new Error('Tried to create an ACL with an invalid userId.');
          }
          self.permissionsById[userId] = {};
          AV._objectEach(accessList, function (allowed, permission) {
            if (permission !== 'read' && permission !== 'write') {
              throw new Error('Tried to create an ACL with an invalid permission type.');
            }
            if (!_.isBoolean(allowed)) {
              throw new Error('Tried to create an ACL with an invalid permission value.');
            }
            self.permissionsById[userId][permission] = allowed;
          });
        });
      }
    }
  };

  /**
   * Returns a JSON-encoded version of the ACL.
   * @return {Object}
   */
  AV.ACL.prototype.toJSON = function () {
    return _.clone(this.permissionsById);
  };

  AV.ACL.prototype._setAccess = function (accessType, userId, allowed) {
    if (userId instanceof AV.User) {
      userId = userId.id;
    } else if (userId instanceof AV.Role) {
      userId = 'role:' + userId.getName();
    }
    if (!_.isString(userId)) {
      throw new Error('userId must be a string.');
    }
    if (!_.isBoolean(allowed)) {
      throw new Error('allowed must be either true or false.');
    }
    var permissions = this.permissionsById[userId];
    if (!permissions) {
      if (!allowed) {
        // The user already doesn't have this permission, so no action needed.
        return;
      } else {
        permissions = {};
        this.permissionsById[userId] = permissions;
      }
    }

    if (allowed) {
      this.permissionsById[userId][accessType] = true;
    } else {
      delete permissions[accessType];
      if (_.isEmpty(permissions)) {
        delete this.permissionsById[userId];
      }
    }
  };

  AV.ACL.prototype._getAccess = function (accessType, userId) {
    if (userId instanceof AV.User) {
      userId = userId.id;
    } else if (userId instanceof AV.Role) {
      userId = 'role:' + userId.getName();
    }
    var permissions = this.permissionsById[userId];
    if (!permissions) {
      return false;
    }
    return permissions[accessType] ? true : false;
  };

  /**
   * Set whether the given user is allowed to read this object.
   * @param userId An instance of AV.User or its objectId.
   * @param {Boolean} allowed Whether that user should have read access.
   */
  AV.ACL.prototype.setReadAccess = function (userId, allowed) {
    this._setAccess('read', userId, allowed);
  };

  /**
   * Get whether the given user id is *explicitly* allowed to read this object.
   * Even if this returns false, the user may still be able to access it if
   * getPublicReadAccess returns true or a role that the user belongs to has
   * write access.
   * @param userId An instance of AV.User or its objectId, or a AV.Role.
   * @return {Boolean}
   */
  AV.ACL.prototype.getReadAccess = function (userId) {
    return this._getAccess('read', userId);
  };

  /**
   * Set whether the given user id is allowed to write this object.
   * @param userId An instance of AV.User or its objectId, or a AV.Role..
   * @param {Boolean} allowed Whether that user should have write access.
   */
  AV.ACL.prototype.setWriteAccess = function (userId, allowed) {
    this._setAccess('write', userId, allowed);
  };

  /**
   * Get whether the given user id is *explicitly* allowed to write this object.
   * Even if this returns false, the user may still be able to write it if
   * getPublicWriteAccess returns true or a role that the user belongs to has
   * write access.
   * @param userId An instance of AV.User or its objectId, or a AV.Role.
   * @return {Boolean}
   */
  AV.ACL.prototype.getWriteAccess = function (userId) {
    return this._getAccess('write', userId);
  };

  /**
   * Set whether the public is allowed to read this object.
   * @param {Boolean} allowed
   */
  AV.ACL.prototype.setPublicReadAccess = function (allowed) {
    this.setReadAccess(PUBLIC_KEY, allowed);
  };

  /**
   * Get whether the public is allowed to read this object.
   * @return {Boolean}
   */
  AV.ACL.prototype.getPublicReadAccess = function () {
    return this.getReadAccess(PUBLIC_KEY);
  };

  /**
   * Set whether the public is allowed to write this object.
   * @param {Boolean} allowed
   */
  AV.ACL.prototype.setPublicWriteAccess = function (allowed) {
    this.setWriteAccess(PUBLIC_KEY, allowed);
  };

  /**
   * Get whether the public is allowed to write this object.
   * @return {Boolean}
   */
  AV.ACL.prototype.getPublicWriteAccess = function () {
    return this.getWriteAccess(PUBLIC_KEY);
  };

  /**
   * Get whether users belonging to the given role are allowed
   * to read this object. Even if this returns false, the role may
   * still be able to write it if a parent role has read access.
   *
   * @param role The name of the role, or a AV.Role object.
   * @return {Boolean} true if the role has read access. false otherwise.
   * @throws {String} If role is neither a AV.Role nor a String.
   */
  AV.ACL.prototype.getRoleReadAccess = function (role) {
    if (role instanceof AV.Role) {
      // Normalize to the String name
      role = role.getName();
    }
    if (_.isString(role)) {
      return this.getReadAccess('role:' + role);
    }
    throw new Error('role must be a AV.Role or a String');
  };

  /**
   * Get whether users belonging to the given role are allowed
   * to write this object. Even if this returns false, the role may
   * still be able to write it if a parent role has write access.
   *
   * @param role The name of the role, or a AV.Role object.
   * @return {Boolean} true if the role has write access. false otherwise.
   * @throws {String} If role is neither a AV.Role nor a String.
   */
  AV.ACL.prototype.getRoleWriteAccess = function (role) {
    if (role instanceof AV.Role) {
      // Normalize to the String name
      role = role.getName();
    }
    if (_.isString(role)) {
      return this.getWriteAccess('role:' + role);
    }
    throw new Error('role must be a AV.Role or a String');
  };

  /**
   * Set whether users belonging to the given role are allowed
   * to read this object.
   *
   * @param role The name of the role, or a AV.Role object.
   * @param {Boolean} allowed Whether the given role can read this object.
   * @throws {String} If role is neither a AV.Role nor a String.
   */
  AV.ACL.prototype.setRoleReadAccess = function (role, allowed) {
    if (role instanceof AV.Role) {
      // Normalize to the String name
      role = role.getName();
    }
    if (_.isString(role)) {
      this.setReadAccess('role:' + role, allowed);
      return;
    }
    throw new Error('role must be a AV.Role or a String');
  };

  /**
   * Set whether users belonging to the given role are allowed
   * to write this object.
   *
   * @param role The name of the role, or a AV.Role object.
   * @param {Boolean} allowed Whether the given role can write this object.
   * @throws {String} If role is neither a AV.Role nor a String.
   */
  AV.ACL.prototype.setRoleWriteAccess = function (role, allowed) {
    if (role instanceof AV.Role) {
      // Normalize to the String name
      role = role.getName();
    }
    if (_.isString(role)) {
      this.setWriteAccess('role:' + role, allowed);
      return;
    }
    throw new Error('role must be a AV.Role or a String');
  };
};
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1595492076975, function(require, module, exports) {


var _ = require('underscore');

module.exports = function (AV) {
  /**
   * @private
   * @class
   * A AV.Op is an atomic operation that can be applied to a field in a
   * AV.Object. For example, calling <code>object.set("foo", "bar")</code>
   * is an example of a AV.Op.Set. Calling <code>object.unset("foo")</code>
   * is a AV.Op.Unset. These operations are stored in a AV.Object and
   * sent to the server as part of <code>object.save()</code> operations.
   * Instances of AV.Op should be immutable.
   *
   * You should not create subclasses of AV.Op or instantiate AV.Op
   * directly.
   */
  AV.Op = function () {
    this._initialize.apply(this, arguments);
  };

  _.extend(AV.Op.prototype,
  /** @lends AV.Op.prototype */{
    _initialize: function _initialize() {}
  });

  _.extend(AV.Op, {
    /**
     * To create a new Op, call AV.Op._extend();
     * @private
     */
    _extend: AV._extend,

    // A map of __op string to decoder function.
    _opDecoderMap: {},

    /**
     * Registers a function to convert a json object with an __op field into an
     * instance of a subclass of AV.Op.
     * @private
     */
    _registerDecoder: function _registerDecoder(opName, decoder) {
      AV.Op._opDecoderMap[opName] = decoder;
    },

    /**
     * Converts a json object into an instance of a subclass of AV.Op.
     * @private
     */
    _decode: function _decode(json) {
      var decoder = AV.Op._opDecoderMap[json.__op];
      if (decoder) {
        return decoder(json);
      } else {
        return undefined;
      }
    }
  });

  /*
   * Add a handler for Batch ops.
   */
  AV.Op._registerDecoder('Batch', function (json) {
    var op = null;
    AV._arrayEach(json.ops, function (nextOp) {
      nextOp = AV.Op._decode(nextOp);
      op = nextOp._mergeWithPrevious(op);
    });
    return op;
  });

  /**
   * @private
   * @class
   * A Set operation indicates that either the field was changed using
   * AV.Object.set, or it is a mutable container that was detected as being
   * changed.
   */
  AV.Op.Set = AV.Op._extend(
  /** @lends AV.Op.Set.prototype */{
    _initialize: function _initialize(value) {
      this._value = value;
    },

    /**
     * Returns the new value of this field after the set.
     */
    value: function value() {
      return this._value;
    },

    /**
     * Returns a JSON version of the operation suitable for sending to AV.
     * @return {Object}
     */
    toJSON: function toJSON() {
      return AV._encode(this.value());
    },

    _mergeWithPrevious: function _mergeWithPrevious(previous) {
      return this;
    },

    _estimate: function _estimate(oldValue) {
      return this.value();
    }
  });

  /**
   * A sentinel value that is returned by AV.Op.Unset._estimate to
   * indicate the field should be deleted. Basically, if you find _UNSET as a
   * value in your object, you should remove that key.
   */
  AV.Op._UNSET = {};

  /**
   * @private
   * @class
   * An Unset operation indicates that this field has been deleted from the
   * object.
   */
  AV.Op.Unset = AV.Op._extend(
  /** @lends AV.Op.Unset.prototype */{
    /**
     * Returns a JSON version of the operation suitable for sending to AV.
     * @return {Object}
     */
    toJSON: function toJSON() {
      return { __op: 'Delete' };
    },

    _mergeWithPrevious: function _mergeWithPrevious(previous) {
      return this;
    },

    _estimate: function _estimate(oldValue) {
      return AV.Op._UNSET;
    }
  });

  AV.Op._registerDecoder('Delete', function (json) {
    return new AV.Op.Unset();
  });

  /**
   * @private
   * @class
   * An Increment is an atomic operation where the numeric value for the field
   * will be increased by a given amount.
   */
  AV.Op.Increment = AV.Op._extend(
  /** @lends AV.Op.Increment.prototype */{
    _initialize: function _initialize(amount) {
      this._amount = amount;
    },

    /**
     * Returns the amount to increment by.
     * @return {Number} the amount to increment by.
     */
    amount: function amount() {
      return this._amount;
    },

    /**
     * Returns a JSON version of the operation suitable for sending to AV.
     * @return {Object}
     */
    toJSON: function toJSON() {
      return { __op: 'Increment', amount: this._amount };
    },

    _mergeWithPrevious: function _mergeWithPrevious(previous) {
      if (!previous) {
        return this;
      } else if (previous instanceof AV.Op.Unset) {
        return new AV.Op.Set(this.amount());
      } else if (previous instanceof AV.Op.Set) {
        return new AV.Op.Set(previous.value() + this.amount());
      } else if (previous instanceof AV.Op.Increment) {
        return new AV.Op.Increment(this.amount() + previous.amount());
      } else {
        throw new Error('Op is invalid after previous op.');
      }
    },

    _estimate: function _estimate(oldValue) {
      if (!oldValue) {
        return this.amount();
      }
      return oldValue + this.amount();
    }
  });

  AV.Op._registerDecoder('Increment', function (json) {
    return new AV.Op.Increment(json.amount);
  });

  /**
   * @private
   * @class
   * BitAnd is an atomic operation where the given value will be bit and to the
   * value than is stored in this field.
   */
  AV.Op.BitAnd = AV.Op._extend(
  /** @lends AV.Op.BitAnd.prototype */{
    _initialize: function _initialize(value) {
      this._value = value;
    },
    value: function value() {
      return this._value;
    },


    /**
     * Returns a JSON version of the operation suitable for sending to AV.
     * @return {Object}
     */
    toJSON: function toJSON() {
      return { __op: 'BitAnd', value: this.value() };
    },
    _mergeWithPrevious: function _mergeWithPrevious(previous) {
      if (!previous) {
        return this;
      } else if (previous instanceof AV.Op.Unset) {
        return new AV.Op.Set(0);
      } else if (previous instanceof AV.Op.Set) {
        return new AV.Op.Set(previous.value() & this.value());
      } else {
        throw new Error('Op is invalid after previous op.');
      }
    },
    _estimate: function _estimate(oldValue) {
      return oldValue & this.value();
    }
  });

  AV.Op._registerDecoder('BitAnd', function (json) {
    return new AV.Op.BitAnd(json.value);
  });

  /**
   * @private
   * @class
   * BitOr is an atomic operation where the given value will be bit and to the
   * value than is stored in this field.
   */
  AV.Op.BitOr = AV.Op._extend(
  /** @lends AV.Op.BitOr.prototype */{
    _initialize: function _initialize(value) {
      this._value = value;
    },
    value: function value() {
      return this._value;
    },


    /**
     * Returns a JSON version of the operation suitable for sending to AV.
     * @return {Object}
     */
    toJSON: function toJSON() {
      return { __op: 'BitOr', value: this.value() };
    },
    _mergeWithPrevious: function _mergeWithPrevious(previous) {
      if (!previous) {
        return this;
      } else if (previous instanceof AV.Op.Unset) {
        return new AV.Op.Set(this.value());
      } else if (previous instanceof AV.Op.Set) {
        return new AV.Op.Set(previous.value() | this.value());
      } else {
        throw new Error('Op is invalid after previous op.');
      }
    },
    _estimate: function _estimate(oldValue) {
      return oldValue | this.value();
    }
  });

  AV.Op._registerDecoder('BitOr', function (json) {
    return new AV.Op.BitOr(json.value);
  });

  /**
   * @private
   * @class
   * BitXor is an atomic operation where the given value will be bit and to the
   * value than is stored in this field.
   */
  AV.Op.BitXor = AV.Op._extend(
  /** @lends AV.Op.BitXor.prototype */{
    _initialize: function _initialize(value) {
      this._value = value;
    },
    value: function value() {
      return this._value;
    },


    /**
     * Returns a JSON version of the operation suitable for sending to AV.
     * @return {Object}
     */
    toJSON: function toJSON() {
      return { __op: 'BitXor', value: this.value() };
    },
    _mergeWithPrevious: function _mergeWithPrevious(previous) {
      if (!previous) {
        return this;
      } else if (previous instanceof AV.Op.Unset) {
        return new AV.Op.Set(this.value());
      } else if (previous instanceof AV.Op.Set) {
        return new AV.Op.Set(previous.value() ^ this.value());
      } else {
        throw new Error('Op is invalid after previous op.');
      }
    },
    _estimate: function _estimate(oldValue) {
      return oldValue ^ this.value();
    }
  });

  AV.Op._registerDecoder('BitXor', function (json) {
    return new AV.Op.BitXor(json.value);
  });

  /**
   * @private
   * @class
   * Add is an atomic operation where the given objects will be appended to the
   * array that is stored in this field.
   */
  AV.Op.Add = AV.Op._extend(
  /** @lends AV.Op.Add.prototype */{
    _initialize: function _initialize(objects) {
      this._objects = objects;
    },

    /**
     * Returns the objects to be added to the array.
     * @return {Array} The objects to be added to the array.
     */
    objects: function objects() {
      return this._objects;
    },

    /**
     * Returns a JSON version of the operation suitable for sending to AV.
     * @return {Object}
     */
    toJSON: function toJSON() {
      return { __op: 'Add', objects: AV._encode(this.objects()) };
    },

    _mergeWithPrevious: function _mergeWithPrevious(previous) {
      if (!previous) {
        return this;
      } else if (previous instanceof AV.Op.Unset) {
        return new AV.Op.Set(this.objects());
      } else if (previous instanceof AV.Op.Set) {
        return new AV.Op.Set(this._estimate(previous.value()));
      } else if (previous instanceof AV.Op.Add) {
        return new AV.Op.Add(previous.objects().concat(this.objects()));
      } else {
        throw new Error('Op is invalid after previous op.');
      }
    },

    _estimate: function _estimate(oldValue) {
      if (!oldValue) {
        return _.clone(this.objects());
      } else {
        return oldValue.concat(this.objects());
      }
    }
  });

  AV.Op._registerDecoder('Add', function (json) {
    return new AV.Op.Add(AV._decode(json.objects));
  });

  /**
   * @private
   * @class
   * AddUnique is an atomic operation where the given items will be appended to
   * the array that is stored in this field only if they were not already
   * present in the array.
   */
  AV.Op.AddUnique = AV.Op._extend(
  /** @lends AV.Op.AddUnique.prototype */{
    _initialize: function _initialize(objects) {
      this._objects = _.uniq(objects);
    },

    /**
     * Returns the objects to be added to the array.
     * @return {Array} The objects to be added to the array.
     */
    objects: function objects() {
      return this._objects;
    },

    /**
     * Returns a JSON version of the operation suitable for sending to AV.
     * @return {Object}
     */
    toJSON: function toJSON() {
      return { __op: 'AddUnique', objects: AV._encode(this.objects()) };
    },

    _mergeWithPrevious: function _mergeWithPrevious(previous) {
      if (!previous) {
        return this;
      } else if (previous instanceof AV.Op.Unset) {
        return new AV.Op.Set(this.objects());
      } else if (previous instanceof AV.Op.Set) {
        return new AV.Op.Set(this._estimate(previous.value()));
      } else if (previous instanceof AV.Op.AddUnique) {
        return new AV.Op.AddUnique(this._estimate(previous.objects()));
      } else {
        throw new Error('Op is invalid after previous op.');
      }
    },

    _estimate: function _estimate(oldValue) {
      if (!oldValue) {
        return _.clone(this.objects());
      } else {
        // We can't just take the _.uniq(_.union(...)) of oldValue and
        // this.objects, because the uniqueness may not apply to oldValue
        // (especially if the oldValue was set via .set())
        var newValue = _.clone(oldValue);
        AV._arrayEach(this.objects(), function (obj) {
          if (obj instanceof AV.Object && obj.id) {
            var matchingObj = _.find(newValue, function (anObj) {
              return anObj instanceof AV.Object && anObj.id === obj.id;
            });
            if (!matchingObj) {
              newValue.push(obj);
            } else {
              var index = _.indexOf(newValue, matchingObj);
              newValue[index] = obj;
            }
          } else if (!_.contains(newValue, obj)) {
            newValue.push(obj);
          }
        });
        return newValue;
      }
    }
  });

  AV.Op._registerDecoder('AddUnique', function (json) {
    return new AV.Op.AddUnique(AV._decode(json.objects));
  });

  /**
   * @private
   * @class
   * Remove is an atomic operation where the given objects will be removed from
   * the array that is stored in this field.
   */
  AV.Op.Remove = AV.Op._extend(
  /** @lends AV.Op.Remove.prototype */{
    _initialize: function _initialize(objects) {
      this._objects = _.uniq(objects);
    },

    /**
     * Returns the objects to be removed from the array.
     * @return {Array} The objects to be removed from the array.
     */
    objects: function objects() {
      return this._objects;
    },

    /**
     * Returns a JSON version of the operation suitable for sending to AV.
     * @return {Object}
     */
    toJSON: function toJSON() {
      return { __op: 'Remove', objects: AV._encode(this.objects()) };
    },

    _mergeWithPrevious: function _mergeWithPrevious(previous) {
      if (!previous) {
        return this;
      } else if (previous instanceof AV.Op.Unset) {
        return previous;
      } else if (previous instanceof AV.Op.Set) {
        return new AV.Op.Set(this._estimate(previous.value()));
      } else if (previous instanceof AV.Op.Remove) {
        return new AV.Op.Remove(_.union(previous.objects(), this.objects()));
      } else {
        throw new Error('Op is invalid after previous op.');
      }
    },

    _estimate: function _estimate(oldValue) {
      if (!oldValue) {
        return [];
      } else {
        var newValue = _.difference(oldValue, this.objects());
        // If there are saved AV Objects being removed, also remove them.
        AV._arrayEach(this.objects(), function (obj) {
          if (obj instanceof AV.Object && obj.id) {
            newValue = _.reject(newValue, function (other) {
              return other instanceof AV.Object && other.id === obj.id;
            });
          }
        });
        return newValue;
      }
    }
  });

  AV.Op._registerDecoder('Remove', function (json) {
    return new AV.Op.Remove(AV._decode(json.objects));
  });

  /**
   * @private
   * @class
   * A Relation operation indicates that the field is an instance of
   * AV.Relation, and objects are being added to, or removed from, that
   * relation.
   */
  AV.Op.Relation = AV.Op._extend(
  /** @lends AV.Op.Relation.prototype */{
    _initialize: function _initialize(adds, removes) {
      this._targetClassName = null;

      var self = this;

      var pointerToId = function pointerToId(object) {
        if (object instanceof AV.Object) {
          if (!object.id) {
            throw new Error("You can't add an unsaved AV.Object to a relation.");
          }
          if (!self._targetClassName) {
            self._targetClassName = object.className;
          }
          if (self._targetClassName !== object.className) {
            throw new Error('Tried to create a AV.Relation with 2 different types: ' + self._targetClassName + ' and ' + object.className + '.');
          }
          return object.id;
        }
        return object;
      };

      this.relationsToAdd = _.uniq(_.map(adds, pointerToId));
      this.relationsToRemove = _.uniq(_.map(removes, pointerToId));
    },

    /**
     * Returns an array of unfetched AV.Object that are being added to the
     * relation.
     * @return {Array}
     */
    added: function added() {
      var self = this;
      return _.map(this.relationsToAdd, function (objectId) {
        var object = AV.Object._create(self._targetClassName);
        object.id = objectId;
        return object;
      });
    },

    /**
     * Returns an array of unfetched AV.Object that are being removed from
     * the relation.
     * @return {Array}
     */
    removed: function removed() {
      var self = this;
      return _.map(this.relationsToRemove, function (objectId) {
        var object = AV.Object._create(self._targetClassName);
        object.id = objectId;
        return object;
      });
    },

    /**
     * Returns a JSON version of the operation suitable for sending to AV.
     * @return {Object}
     */
    toJSON: function toJSON() {
      var adds = null;
      var removes = null;
      var self = this;
      var idToPointer = function idToPointer(id) {
        return {
          __type: 'Pointer',
          className: self._targetClassName,
          objectId: id
        };
      };
      var pointers = null;
      if (this.relationsToAdd.length > 0) {
        pointers = _.map(this.relationsToAdd, idToPointer);
        adds = { __op: 'AddRelation', objects: pointers };
      }

      if (this.relationsToRemove.length > 0) {
        pointers = _.map(this.relationsToRemove, idToPointer);
        removes = { __op: 'RemoveRelation', objects: pointers };
      }

      if (adds && removes) {
        return { __op: 'Batch', ops: [adds, removes] };
      }

      return adds || removes || {};
    },

    _mergeWithPrevious: function _mergeWithPrevious(previous) {
      if (!previous) {
        return this;
      } else if (previous instanceof AV.Op.Unset) {
        throw new Error("You can't modify a relation after deleting it.");
      } else if (previous instanceof AV.Op.Relation) {
        if (previous._targetClassName && previous._targetClassName !== this._targetClassName) {
          throw new Error('Related object must be of class ' + previous._targetClassName + ', but ' + this._targetClassName + ' was passed in.');
        }
        var newAdd = _.union(_.difference(previous.relationsToAdd, this.relationsToRemove), this.relationsToAdd);
        var newRemove = _.union(_.difference(previous.relationsToRemove, this.relationsToAdd), this.relationsToRemove);

        var newRelation = new AV.Op.Relation(newAdd, newRemove);
        newRelation._targetClassName = this._targetClassName;
        return newRelation;
      } else {
        throw new Error('Op is invalid after previous op.');
      }
    },

    _estimate: function _estimate(oldValue, object, key) {
      if (!oldValue) {
        var relation = new AV.Relation(object, key);
        relation.targetClassName = this._targetClassName;
      } else if (oldValue instanceof AV.Relation) {
        if (this._targetClassName) {
          if (oldValue.targetClassName) {
            if (oldValue.targetClassName !== this._targetClassName) {
              throw new Error('Related object must be a ' + oldValue.targetClassName + ', but a ' + this._targetClassName + ' was passed in.');
            }
          } else {
            oldValue.targetClassName = this._targetClassName;
          }
        }
        return oldValue;
      } else {
        throw new Error('Op is invalid after previous op.');
      }
    }
  });

  AV.Op._registerDecoder('AddRelation', function (json) {
    return new AV.Op.Relation(AV._decode(json.objects), []);
  });
  AV.Op._registerDecoder('RemoveRelation', function (json) {
    return new AV.Op.Relation([], AV._decode(json.objects));
  });
};
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1595492076976, function(require, module, exports) {


var _ = require('underscore');

module.exports = function (AV) {
  /**
   * Creates a new Relation for the given parent object and key. This
   * constructor should rarely be used directly, but rather created by
   * {@link AV.Object#relation}.
   * @param {AV.Object} parent The parent of this relation.
   * @param {String} key The key for this relation on the parent.
   * @see AV.Object#relation
   * @class
   *
   * <p>
   * A class that is used to access all of the children of a many-to-many
   * relationship.  Each instance of AV.Relation is associated with a
   * particular parent object and key.
   * </p>
   */
  AV.Relation = function (parent, key) {
    if (!_.isString(key)) {
      throw new TypeError('key must be a string');
    }
    this.parent = parent;
    this.key = key;
    this.targetClassName = null;
  };

  /**
   * Creates a query that can be used to query the parent objects in this relation.
   * @param {String} parentClass The parent class or name.
   * @param {String} relationKey The relation field key in parent.
   * @param {AV.Object} child The child object.
   * @return {AV.Query}
   */
  AV.Relation.reverseQuery = function (parentClass, relationKey, child) {
    var query = new AV.Query(parentClass);
    query.equalTo(relationKey, child._toPointer());
    return query;
  };

  _.extend(AV.Relation.prototype,
  /** @lends AV.Relation.prototype */{
    /**
     * Makes sure that this relation has the right parent and key.
     * @private
     */
    _ensureParentAndKey: function _ensureParentAndKey(parent, key) {
      this.parent = this.parent || parent;
      this.key = this.key || key;
      if (this.parent !== parent) {
        throw new Error('Internal Error. Relation retrieved from two different Objects.');
      }
      if (this.key !== key) {
        throw new Error('Internal Error. Relation retrieved from two different keys.');
      }
    },

    /**
     * Adds a AV.Object or an array of AV.Objects to the relation.
     * @param {AV.Object|AV.Object[]} objects The item or items to add.
     */
    add: function add(objects) {
      if (!_.isArray(objects)) {
        objects = [objects];
      }

      var change = new AV.Op.Relation(objects, []);
      this.parent.set(this.key, change);
      this.targetClassName = change._targetClassName;
    },

    /**
     * Removes a AV.Object or an array of AV.Objects from this relation.
     * @param {AV.Object|AV.Object[]} objects The item or items to remove.
     */
    remove: function remove(objects) {
      if (!_.isArray(objects)) {
        objects = [objects];
      }

      var change = new AV.Op.Relation([], objects);
      this.parent.set(this.key, change);
      this.targetClassName = change._targetClassName;
    },

    /**
     * Returns a JSON version of the object suitable for saving to disk.
     * @return {Object}
     */
    toJSON: function toJSON() {
      return { __type: 'Relation', className: this.targetClassName };
    },

    /**
     * Returns a AV.Query that is limited to objects in this
     * relation.
     * @return {AV.Query}
     */
    query: function query() {
      var targetClass;
      var query;
      if (!this.targetClassName) {
        targetClass = AV.Object._getSubclass(this.parent.className);
        query = new AV.Query(targetClass);
        query._defaultParams.redirectClassNameForKey = this.key;
      } else {
        targetClass = AV.Object._getSubclass(this.targetClassName);
        query = new AV.Query(targetClass);
      }
      query._addCondition('$relatedTo', 'object', this.parent._toPointer());
      query._addCondition('$relatedTo', 'key', this.key);

      return query;
    }
  });
};
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1595492076977, function(require, module, exports) {


var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require('underscore');
var cos = require('./uploader/cos');
var qiniu = require('./uploader/qiniu');
var s3 = require('./uploader/s3');
var AVError = require('./error');
var AVRequest = require('./request')._request;

var _require = require('./utils'),
    tap = _require.tap,
    transformFetchOptions = _require.transformFetchOptions;

var debug = require('debug')('leancloud:file');
var parseBase64 = require('./utils/parse-base64');

module.exports = function (AV) {
  var hexOctet = function hexOctet() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  };

  // port from browserify path module
  // since react-native packager won't shim node modules.
  var extname = function extname(path) {
    if (!_.isString(path)) return '';
    return path.match(/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/)[4];
  };

  var b64Digit = function b64Digit(number) {
    if (number < 26) {
      return String.fromCharCode(65 + number);
    }
    if (number < 52) {
      return String.fromCharCode(97 + (number - 26));
    }
    if (number < 62) {
      return String.fromCharCode(48 + (number - 52));
    }
    if (number === 62) {
      return '+';
    }
    if (number === 63) {
      return '/';
    }
    throw new Error('Tried to encode large digit ' + number + ' in base64.');
  };

  var encodeBase64 = function encodeBase64(array) {
    var chunks = [];
    chunks.length = Math.ceil(array.length / 3);
    _.times(chunks.length, function (i) {
      var b1 = array[i * 3];
      var b2 = array[i * 3 + 1] || 0;
      var b3 = array[i * 3 + 2] || 0;

      var has2 = i * 3 + 1 < array.length;
      var has3 = i * 3 + 2 < array.length;

      chunks[i] = [b64Digit(b1 >> 2 & 0x3f), b64Digit(b1 << 4 & 0x30 | b2 >> 4 & 0x0f), has2 ? b64Digit(b2 << 2 & 0x3c | b3 >> 6 & 0x03) : '=', has3 ? b64Digit(b3 & 0x3f) : '='].join('');
    });
    return chunks.join('');
  };

  /**
   * An AV.File is a local representation of a file that is saved to the AV
   * cloud.
   * @param name {String} The file's name. This will change to a unique value
   *     once the file has finished saving.
   * @param data {Array} The data for the file, as either:
   *     1. an Array of byte value Numbers, or
   *     2. an Object like { base64: "..." } with a base64-encoded String.
   *     3. a Blob(File) selected with a file upload control.
   *     4. a Buffer in Node.js runtime.
   *     5. a Stream in Node.js runtime.
   *
   *        For example:<pre>
   * var fileUploadControl = $("#profilePhotoFileUpload")[0];
   * if (fileUploadControl.files.length > 0) {
   *   var file = fileUploadControl.files[0];
   *   var name = "photo.jpg";
   *   var file = new AV.File(name, file);
   *   file.save().then(function() {
   *     // The file has been saved to AV.
   *   }, function(error) {
   *     // The file either could not be read, or could not be saved to AV.
   *   });
   * }</pre>
   *
   * @class
   * @param [mimeType] {String} Content-Type header to use for the file. If
   *     this is omitted, the content type will be inferred from the name's
   *     extension.
   */
  AV.File = function (name, data, mimeType) {
    this.attributes = {
      name: name,
      url: '',
      metaData: {},
      // 用来存储转换后要上传的 base64 String
      base64: ''
    };

    if (_.isString(data)) {
      throw new TypeError('Creating an AV.File from a String is not yet supported.');
    }
    if (_.isArray(data)) {
      this.attributes.metaData.size = data.length;
      data = { base64: encodeBase64(data) };
    }

    this._extName = '';
    this._data = data;
    this._uploadHeaders = {};

    if (data && data.blob && typeof data.blob.uri === 'string') {
      this._extName = extname(data.blob.uri);
    }

    if (typeof Blob !== 'undefined' && data instanceof Blob) {
      if (data.size) {
        this.attributes.metaData.size = data.size;
      }
      if (data.name) {
        this._extName = extname(data.name);
      }
    }

    /* NODE-ONLY:start */
    if (data instanceof require('stream') && data.path) {
      this._extName = extname(data.path);
    }
    if (Buffer.isBuffer(data)) {
      this.attributes.metaData.size = data.length;
    }
    /* NODE-ONLY:end */

    var owner = void 0;
    if (data && data.owner) {
      owner = data.owner;
    } else if (!AV._config.disableCurrentUser) {
      try {
        owner = AV.User.current();
      } catch (error) {
        if ('SYNC_API_NOT_AVAILABLE' !== error.code) {
          throw error;
        }
      }
    }

    this.attributes.metaData.owner = owner ? owner.id : 'unknown';

    this.set('mime_type', mimeType);
  };

  /**
   * Creates a fresh AV.File object with exists url for saving to AVOS Cloud.
   * @param {String} name the file name
   * @param {String} url the file url.
   * @param {Object} [metaData] the file metadata object.
   * @param {String} [type] Content-Type header to use for the file. If
   *     this is omitted, the content type will be inferred from the name's
   *     extension.
   * @return {AV.File} the file object
   */
  AV.File.withURL = function (name, url, metaData, type) {
    if (!name || !url) {
      throw new Error('Please provide file name and url');
    }
    var file = new AV.File(name, null, type);
    //copy metaData properties to file.
    if (metaData) {
      for (var prop in metaData) {
        if (!file.attributes.metaData[prop]) file.attributes.metaData[prop] = metaData[prop];
      }
    }
    file.attributes.url = url;
    //Mark the file is from external source.
    file.attributes.metaData.__source = 'external';
    return file;
  };

  /**
   * Creates a file object with exists objectId.
   * @param {String} objectId The objectId string
   * @return {AV.File} the file object
   */
  AV.File.createWithoutData = function (objectId) {
    var file = new AV.File();
    file.id = objectId;
    return file;
  };

  _.extend(AV.File.prototype,
  /** @lends AV.File.prototype */{
    className: '_File',

    _toFullJSON: function _toFullJSON(seenObjects) {
      var _this = this;

      var full = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      var json = _.clone(this.attributes);
      AV._objectEach(json, function (val, key) {
        json[key] = AV._encode(val, seenObjects, undefined, full);
      });
      AV._objectEach(this._operations, function (val, key) {
        json[key] = val;
      });

      if (_.has(this, 'id')) {
        json.objectId = this.id;
      }
      _(['createdAt', 'updatedAt']).each(function (key) {
        if (_.has(_this, key)) {
          var val = _this[key];
          json[key] = _.isDate(val) ? val.toJSON() : val;
        }
      });
      if (full) {
        json.__type = 'File';
      }
      return json;
    },


    /**
     * Returns a JSON version of the file with meta data.
     * Inverse to {@link AV.parseJSON}
     * @since 3.0.0
     * @return {Object}
     */
    toFullJSON: function toFullJSON() {
      var seenObjects = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      return this._toFullJSON(seenObjects);
    },


    /**
     * Returns a JSON version of the object.
     * @return {Object}
     */
    toJSON: function toJSON(key, holder) {
      var seenObjects = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [this];

      return this._toFullJSON(seenObjects, false);
    },


    /**
     * Gets a Pointer referencing this file.
     * @private
     */
    _toPointer: function _toPointer() {
      return {
        __type: 'Pointer',
        className: this.className,
        objectId: this.id
      };
    },


    /**
     * Returns the ACL for this file.
     * @returns {AV.ACL} An instance of AV.ACL.
     */
    getACL: function getACL() {
      return this._acl;
    },


    /**
     * Sets the ACL to be used for this file.
     * @param {AV.ACL} acl An instance of AV.ACL.
     */
    setACL: function setACL(acl) {
      if (!(acl instanceof AV.ACL)) {
        return new AVError(AVError.OTHER_CAUSE, 'ACL must be a AV.ACL.');
      }
      this._acl = acl;
      return this;
    },


    /**
     * Gets the name of the file. Before save is called, this is the filename
     * given by the user. After save is called, that name gets prefixed with a
     * unique identifier.
     */
    name: function name() {
      return this.get('name');
    },


    /**
     * Gets the url of the file. It is only available after you save the file or
     * after you get the file from a AV.Object.
     * @return {String}
     */
    url: function url() {
      return this.get('url');
    },


    /**
     * Gets the attributs of the file object.
     * @param {String} The attribute name which want to get.
     * @returns {Any}
     */
    get: function get(attrName) {
      switch (attrName) {
        case 'objectId':
          return this.id;
        case 'url':
        case 'name':
        case 'mime_type':
        case 'metaData':
        case 'createdAt':
        case 'updatedAt':
          return this.attributes[attrName];
        default:
          return this.attributes.metaData[attrName];
      }
    },


    /**
     * Set the metaData of the file object.
     * @param {Object} Object is an key value Object for setting metaData.
     * @param {String} attr is an optional metadata key.
     * @param {Object} value is an optional metadata value.
     * @returns {String|Number|Array|Object}
     */
    set: function set() {
      var _this2 = this;

      var set = function set(attrName, value) {
        switch (attrName) {
          case 'name':
          case 'url':
          case 'mime_type':
          case 'base64':
          case 'metaData':
            _this2.attributes[attrName] = value;
            break;
          default:
            // File 并非一个 AVObject，不能完全自定义其他属性，所以只能都放在 metaData 上面
            _this2.attributes.metaData[attrName] = value;
            break;
        }
      };

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      switch (args.length) {
        case 1:
          // 传入一个 Object
          for (var k in args[0]) {
            set(k, args[0][k]);
          }
          break;
        case 2:
          set(args[0], args[1]);
          break;
      }
      return this;
    },


    /**
     * Set a header for the upload request.
     * For more infomation, go to https://url.leanapp.cn/avfile-upload-headers
     *
     * @param {String} key header key
     * @param {String} value header value
     * @return {AV.File} this
     */
    setUploadHeader: function setUploadHeader(key, value) {
      this._uploadHeaders[key] = value;
      return this;
    },


    /**
     * <p>Returns the file's metadata JSON object if no arguments is given.Returns the
     * metadata value if a key is given.Set metadata value if key and value are both given.</p>
     * <p><pre>
     *  var metadata = file.metaData(); //Get metadata JSON object.
     *  var size = file.metaData('size');  // Get the size metadata value.
     *  file.metaData('format', 'jpeg'); //set metadata attribute and value.
     *</pre></p>
     * @return {Object} The file's metadata JSON object.
     * @param {String} attr an optional metadata key.
     * @param {Object} value an optional metadata value.
     **/
    metaData: function metaData(attr, value) {
      if (attr && value) {
        this.attributes.metaData[attr] = value;
        return this;
      } else if (attr && !value) {
        return this.attributes.metaData[attr];
      } else {
        return this.attributes.metaData;
      }
    },


    /**
     * 如果文件是图片，获取图片的缩略图URL。可以传入宽度、高度、质量、格式等参数。
     * @return {String} 缩略图URL
     * @param {Number} width 宽度，单位：像素
     * @param {Number} heigth 高度，单位：像素
     * @param {Number} quality 质量，1-100的数字，默认100
     * @param {Number} scaleToFit 是否将图片自适应大小。默认为true。
     * @param {String} fmt 格式，默认为png，也可以为jpeg,gif等格式。
     */

    thumbnailURL: function thumbnailURL(width, height) {
      var quality = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 100;
      var scaleToFit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
      var fmt = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'png';

      var url = this.attributes.url;
      if (!url) {
        throw new Error('Invalid url.');
      }
      if (!width || !height || width <= 0 || height <= 0) {
        throw new Error('Invalid width or height value.');
      }
      if (quality <= 0 || quality > 100) {
        throw new Error('Invalid quality value.');
      }
      var mode = scaleToFit ? 2 : 1;
      return url + '?imageView/' + mode + '/w/' + width + '/h/' + height + '/q/' + quality + '/format/' + fmt;
    },


    /**
     * Returns the file's size.
     * @return {Number} The file's size in bytes.
     **/
    size: function size() {
      return this.metaData().size;
    },


    /**
     * Returns the file's owner.
     * @return {String} The file's owner id.
     */
    ownerId: function ownerId() {
      return this.metaData().owner;
    },


    /**
     * Destroy the file.
     * @param {AuthOptions} options
     * @return {Promise} A promise that is fulfilled when the destroy
     *     completes.
     */
    destroy: function destroy(options) {
      if (!this.id) {
        return _promise2.default.reject(new Error('The file id does not eixst.'));
      }
      var request = AVRequest('files', null, this.id, 'DELETE', null, options);
      return request;
    },


    /**
     * Request Qiniu upload token
     * @param {string} type
     * @return {Promise} Resolved with the response
     * @private
     */
    _fileToken: function _fileToken(type, authOptions) {
      var name = this.attributes.name;

      var extName = extname(name);
      if (!extName && this._extName) {
        name += this._extName;
        extName = this._extName;
      }
      // Create 16-bits uuid as qiniu key.
      var key = hexOctet() + hexOctet() + hexOctet() + hexOctet() + hexOctet() + extName;
      var data = {
        key: key,
        name: name,
        keep_file_name: authOptions.keepFileName,
        ACL: this._acl,
        mime_type: type,
        metaData: this.attributes.metaData
      };
      this._qiniu_key = key;
      return AVRequest('fileTokens', null, null, 'POST', data, authOptions);
    },


    /**
     * @callback UploadProgressCallback
     * @param {XMLHttpRequestProgressEvent} event - The progress event with 'loaded' and 'total' attributes
     */
    /**
     * Saves the file to the AV cloud.
     * @param {AuthOptions} [options] AuthOptions plus:
     * @param {UploadProgressCallback} [options.onprogress] 文件上传进度，在 Node.js 中无效，回调参数说明详见 {@link UploadProgressCallback}。
     * @param {boolean} [options.keepFileName = false] 保留下载文件的文件名。
     * @return {Promise} Promise that is resolved when the save finishes.
     */
    save: function save() {
      var _this3 = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (this.id) {
        throw new Error('File is already saved.');
      }
      if (!this._previousSave) {
        if (this._data) {
          var mimeType = this.get('mime_type');
          this._previousSave = this._fileToken(mimeType, options).then(function (uploadInfo) {
            if (uploadInfo.mime_type) {
              mimeType = uploadInfo.mime_type;
              _this3.set('mime_type', mimeType);
            }
            _this3._token = uploadInfo.token;
            return _promise2.default.resolve().then(function () {
              var data = _this3._data;
              if (data && data.base64) {
                return parseBase64(data.base64, mimeType);
              }
              if (data && data.blob) {
                if (!data.blob.type && mimeType) {
                  data.blob.type = mimeType;
                }
                if (!data.blob.name) {
                  data.blob.name = _this3.get('name');
                }
                return data.blob;
              }
              if (typeof Blob !== 'undefined' && data instanceof Blob) {
                return data;
              }
              /* NODE-ONLY:start */
              if (data instanceof require('stream')) {
                return data;
              }
              if (Buffer.isBuffer(data)) {
                return data;
              }
              /* NODE-ONLY:end */
              throw new TypeError('malformed file data');
            }).then(function (data) {
              var _options = _.extend({}, options);
              // filter out download progress events
              if (options.onprogress) {
                _options.onprogress = function (event) {
                  if (event.direction === 'download') return;
                  return options.onprogress(event);
                };
              }
              switch (uploadInfo.provider) {
                case 's3':
                  return s3(uploadInfo, data, _this3, _options);
                case 'qcloud':
                  return cos(uploadInfo, data, _this3, _options);
                case 'qiniu':
                default:
                  return qiniu(uploadInfo, data, _this3, _options);
              }
            }).then(tap(function () {
              return _this3._callback(true);
            }), function (error) {
              _this3._callback(false);
              throw error;
            });
          });
        } else if (this.attributes.url && this.attributes.metaData.__source === 'external') {
          // external link file.
          var data = {
            name: this.attributes.name,
            ACL: this._acl,
            metaData: this.attributes.metaData,
            mime_type: this.mimeType,
            url: this.attributes.url
          };
          this._previousSave = AVRequest('files', this.attributes.name, null, 'post', data, options).then(function (response) {
            _this3.attributes.name = response.name;
            _this3.attributes.url = response.url;
            _this3.id = response.objectId;
            if (response.size) {
              _this3.attributes.metaData.size = response.size;
            }
            return _this3;
          });
        }
      }
      return this._previousSave;
    },
    _callback: function _callback(success) {
      AVRequest('fileCallback', null, null, 'post', {
        token: this._token,
        result: success
      }).catch(debug);
      delete this._token;
      delete this._data;
    },


    /**
     * fetch the file from server. If the server's representation of the
     * model differs from its current attributes, they will be overriden,
     * @param {Object} fetchOptions Optional options to set 'keys',
     *      'include' and 'includeACL' option.
     * @param {AuthOptions} options
     * @return {Promise} A promise that is fulfilled when the fetch
     *     completes.
     */
    fetch: function fetch(fetchOptions, options) {
      var request = AVRequest('files', null, this.id, 'GET', transformFetchOptions(fetchOptions), options);
      return request.then(this._finishFetch.bind(this));
    },
    _finishFetch: function _finishFetch(response) {
      var value = AV.Object.prototype.parse(response);
      value.attributes = {
        name: value.name,
        url: value.url,
        mime_type: value.mime_type,
        bucket: value.bucket
      };
      value.attributes.metaData = value.metaData || {};
      value.id = value.objectId;
      // clean
      delete value.objectId;
      delete value.metaData;
      delete value.url;
      delete value.name;
      delete value.mime_type;
      delete value.bucket;
      _.extend(this, value);
      return this;
    }
  });
};
}, function(modId) { var map = {"./uploader/cos":1595492076978,"./uploader/qiniu":1595492076979,"./uploader/s3":1595492076980,"./error":1595492076968,"./request":1595492076981,"./utils":1595492076963,"./utils/parse-base64":1595492076982}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1595492076978, function(require, module, exports) {


var _require = require('../adapter'),
    getAdapter = _require.getAdapter;

var debug = require('debug')('cos');

module.exports = function (uploadInfo, data, file) {
  var saveOptions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  file.attributes.url = uploadInfo.url;
  file._bucket = uploadInfo.bucket;
  file.id = uploadInfo.objectId;
  var url = uploadInfo.upload_url + '?sign=' + encodeURIComponent(uploadInfo.token);
  var fileFormData = {
    field: 'fileContent',
    data: data,
    name: file.attributes.name
  };
  var options = {
    headers: file._uploadHeaders,
    data: {
      op: 'upload'
    },
    onprogress: saveOptions.onprogress
  };
  debug('url: %s, file: %o, options: %o', url, fileFormData, options);
  var upload = getAdapter('upload');
  return upload(url, fileFormData, options).then(function (response) {
    debug(response.status, response.data);
    if (response.ok === false) {
      var error = new Error(response.status);
      error.response = response;
      throw error;
    }
    return file;
  }, function (error) {
    var response = error.response;

    if (response) {
      debug(response.status, response.data);
      error.statusCode = response.status;
      error.response = response.data;
    }
    throw error;
  });
};
}, function(modId) { var map = {"../adapter":1595492076965}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1595492076979, function(require, module, exports) {


var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require('../adapter'),
    getAdapter = _require.getAdapter;

var debug = require('debug')('leancloud:qiniu');

module.exports = function (uploadInfo, data, file) {
  var saveOptions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  file.attributes.url = uploadInfo.url;
  file._bucket = uploadInfo.bucket;
  file.id = uploadInfo.objectId;
  // Get the uptoken to upload files to qiniu.
  var uptoken = uploadInfo.token;
  var url = uploadInfo.upload_url || 'https://upload.qiniup.com';
  var fileFormData = {
    field: 'file',
    data: data,
    name: file.attributes.name
  };
  var options = {
    headers: file._uploadHeaders,
    data: {
      name: file.attributes.name,
      key: uploadInfo.key || file._qiniu_key,
      token: uptoken
    },
    onprogress: saveOptions.onprogress
  };
  debug('url: %s, file: %o, options: %o', url, fileFormData, options);
  var upload = getAdapter('upload');
  return upload(url, fileFormData, options).then(function (response) {
    debug(response.status, response.data);
    if (response.ok === false) {
      var message = response.status;
      if (response.data) {
        if (response.data.error) {
          message = response.data.error;
        } else {
          message = (0, _stringify2.default)(response.data);
        }
      }
      var error = new Error(message);
      error.response = response;
      throw error;
    }
    return file;
  }, function (error) {
    var response = error.response;

    if (response) {
      debug(response.status, response.data);
      error.statusCode = response.status;
      error.response = response.data;
    }
    throw error;
  });
};
}, function(modId) { var map = {"../adapter":1595492076965}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1595492076980, function(require, module, exports) {


var _ = require('underscore');
var ajax = require('../utils/ajax');

module.exports = function upload(uploadInfo, data, file) {
  var saveOptions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  file.attributes.url = uploadInfo.url;
  file._bucket = uploadInfo.bucket;
  file.id = uploadInfo.objectId;

  /* NODE-ONLY:start */
  if (data instanceof require('stream')) {
    // data.pipe(req);
    throw new TypeError('Saving an AV.File from a Stream to S3 is not yet supported');
  }
  /* NODE-ONLY:end */

  return ajax({
    url: uploadInfo.upload_url,
    method: 'PUT',
    data: data,
    headers: _.extend({
      'Content-Type': file.get('mime_type'),
      'Cache-Control': 'public, max-age=31536000'
    }, file._uploadHeaders),
    onprogress: saveOptions.onprogress
  }).then(function () {
    return file;
  });
};
}, function(modId) { var map = {"../utils/ajax":1595492076971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1595492076981, function(require, module, exports) {


var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require('underscore');
var md5 = require('md5');

var _require = require('underscore'),
    extend = _require.extend;

var AV = require('./av');

var _require2 = require('./utils'),
    getSessionToken = _require2.getSessionToken;

var ajax = require('./utils/ajax');

// 计算 X-LC-Sign 的签名方法
var sign = function sign(key, isMasterKey) {
  var now = new Date().getTime();
  var signature = md5(now + key);
  if (isMasterKey) {
    return signature + ',' + now + ',master';
  }
  return signature + ',' + now;
};

var setAppKey = function setAppKey(headers, signKey) {
  if (signKey) {
    headers['X-LC-Sign'] = sign(AV.applicationKey);
  } else {
    headers['X-LC-Key'] = AV.applicationKey;
  }
};

var setHeaders = function setHeaders() {
  var authOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var signKey = arguments[1];

  var headers = {
    'X-LC-Id': AV.applicationId,
    'Content-Type': 'application/json;charset=UTF-8'
  };
  var useMasterKey = false;
  if (typeof authOptions.useMasterKey === 'boolean') {
    useMasterKey = authOptions.useMasterKey;
  } else if (typeof AV._config.useMasterKey === 'boolean') {
    useMasterKey = AV._config.useMasterKey;
  }
  if (useMasterKey) {
    if (AV.masterKey) {
      if (signKey) {
        headers['X-LC-Sign'] = sign(AV.masterKey, true);
      } else {
        headers['X-LC-Key'] = AV.masterKey + ',master';
      }
    } else {
      console.warn('masterKey is not set, fall back to use appKey');
      setAppKey(headers, signKey);
    }
  } else {
    setAppKey(headers, signKey);
  }
  if (AV.hookKey) {
    headers['X-LC-Hook-Key'] = AV.hookKey;
  }
  if (AV._config.production !== null) {
    headers['X-LC-Prod'] = String(AV._config.production);
  }
  headers['NODE_JS' === 'NODE_JS' ? 'User-Agent' : 'X-LC-UA'] = AV._sharedConfig.userAgent;

  return _promise2.default.resolve().then(function () {
    // Pass the session token
    var sessionToken = getSessionToken(authOptions);
    if (sessionToken) {
      headers['X-LC-Session'] = sessionToken;
    } else if (!AV._config.disableCurrentUser) {
      return AV.User.currentAsync().then(function (currentUser) {
        if (currentUser && currentUser._sessionToken) {
          headers['X-LC-Session'] = currentUser._sessionToken;
        }
        return headers;
      });
    }
    return headers;
  });
};

var createApiUrl = function createApiUrl(_ref) {
  var _ref$service = _ref.service,
      service = _ref$service === undefined ? 'api' : _ref$service,
      _ref$version = _ref.version,
      version = _ref$version === undefined ? '1.1' : _ref$version,
      path = _ref.path;

  var apiURL = AV._config.serverURLs[service];

  if (!apiURL) throw new Error('undefined server URL for ' + service);

  if (apiURL.charAt(apiURL.length - 1) !== '/') {
    apiURL += '/';
  }
  apiURL += version;
  if (path) {
    apiURL += path;
  }

  return apiURL;
};

/**
 * Low level REST API client. Call REST endpoints with authorization headers.
 * @function AV.request
 * @since 3.0.0
 * @param {Object} options
 * @param {String} options.method HTTP method
 * @param {String} options.path endpoint path, e.g. `/classes/Test/55759577e4b029ae6015ac20`
 * @param {Object} [options.query] query string dict
 * @param {Object} [options.data] HTTP body
 * @param {AuthOptions} [options.authOptions]
 * @param {String} [options.service = 'api']
 * @param {String} [options.version = '1.1']
 */
var request = function request(_ref2) {
  var service = _ref2.service,
      version = _ref2.version,
      method = _ref2.method,
      path = _ref2.path,
      query = _ref2.query,
      data = _ref2.data,
      authOptions = _ref2.authOptions,
      _ref2$signKey = _ref2.signKey,
      signKey = _ref2$signKey === undefined ? true : _ref2$signKey;

  if (!(AV.applicationId && (AV.applicationKey || AV.masterKey))) {
    throw new Error('Not initialized');
  }
  if (AV._appRouter) {
    AV._appRouter.refresh();
  }
  var timeout = AV._config.requestTimeout;

  var url = createApiUrl({ service: service, path: path, version: version });
  return setHeaders(authOptions, signKey).then(function (headers) {
    return ajax({ method: method, url: url, query: query, data: data, headers: headers, timeout: timeout }).catch(function (error) {
      var errorJSON = {
        code: error.code || -1,
        error: error.message || error.responseText
      };
      if (error.response && error.response.code) {
        errorJSON = error.response;
      } else if (error.responseText) {
        try {
          errorJSON = JSON.parse(error.responseText);
        } catch (e) {
          // If we fail to parse the error text, that's okay.
        }
      }
      errorJSON.rawMessage = errorJSON.rawMessage || errorJSON.error;
      if (!AV._sharedConfig.keepErrorRawMessage) {
        errorJSON.error += ' [' + (error.statusCode || 'N/A') + ' ' + method + ' ' + url + ']';
      }
      // Transform the error into an instance of AVError by trying to parse
      // the error string as JSON.
      var err = new Error(errorJSON.error);
      delete errorJSON.error;
      throw _.extend(err, errorJSON);
    });
  });
};

// lagecy request
var _request = function _request(route, className, objectId, method, data, authOptions, query) {
  var path = '';
  if (route) path += '/' + route;
  if (className) path += '/' + className;
  if (objectId) path += '/' + objectId;
  // for migeration
  if (data && data._fetchWhenSave) throw new Error('_fetchWhenSave should be in the query');
  if (data && data._where) throw new Error('_where should be in the query');
  if (method && method.toLowerCase() === 'get') {
    query = extend({}, query, data);
    data = null;
  }
  return request({
    method: method,
    path: path,
    query: query,
    data: data,
    authOptions: authOptions
  });
};

AV.request = request;

module.exports = {
  _request: _request,
  request: request
};
}, function(modId) { var map = {"./av":1595492076962,"./utils":1595492076963,"./utils/ajax":1595492076971}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1595492076982, function(require, module, exports) {


var dataURLToBlob = function dataURLToBlob(base64) {
  // 兼容 dataURL
  if (base64.split(',')[0] && base64.split(',')[0].indexOf('base64') >= 0) {
    base64 = base64.split(',')[1];
  }
  return new Buffer(base64, 'base64');
};

module.exports = dataURLToBlob;
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1595492076983, function(require, module, exports) {


var _getOwnPropertyDescriptor = require('babel-runtime/core-js/object/get-own-property-descriptor');

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require('underscore');
var AVError = require('./error');

var _require = require('./request'),
    _request = _require._request;

var _require2 = require('./utils'),
    isNullOrUndefined = _require2.isNullOrUndefined,
    ensureArray = _require2.ensureArray,
    transformFetchOptions = _require2.transformFetchOptions,
    setValue = _require2.setValue,
    findValue = _require2.findValue,
    isPlainObject = _require2.isPlainObject,
    continueWhile = _require2.continueWhile;

var recursiveToPointer = function recursiveToPointer(value) {
  if (_.isArray(value)) return value.map(recursiveToPointer);
  if (isPlainObject(value)) return _.mapObject(value, recursiveToPointer);
  if (_.isObject(value) && value._toPointer) return value._toPointer();
  return value;
};

var RESERVED_KEYS = ['objectId', 'createdAt', 'updatedAt'];
var checkReservedKey = function checkReservedKey(key) {
  if (RESERVED_KEYS.indexOf(key) !== -1) {
    throw new Error('key[' + key + '] is reserved');
  }
};

var handleBatchResults = function handleBatchResults(results) {
  var firstError = _.find(results, function (result) {
    return result instanceof Error;
  });
  if (!firstError) {
    return results;
  }
  var error = new AVError(firstError.code, firstError.message);
  error.results = results;
  throw error;
};

// Helper function to get a value from a Backbone object as a property
// or as a function.
function getValue(object, prop) {
  if (!(object && object[prop])) {
    return null;
  }
  return _.isFunction(object[prop]) ? object[prop]() : object[prop];
}

// AV.Object is analogous to the Java AVObject.
// It also implements the same interface as a Backbone model.

module.exports = function (AV) {
  /**
   * Creates a new model with defined attributes. A client id (cid) is
   * automatically generated and assigned for you.
   *
   * <p>You won't normally call this method directly.  It is recommended that
   * you use a subclass of <code>AV.Object</code> instead, created by calling
   * <code>extend</code>.</p>
   *
   * <p>However, if you don't want to use a subclass, or aren't sure which
   * subclass is appropriate, you can use this form:<pre>
   *     var object = new AV.Object("ClassName");
   * </pre>
   * That is basically equivalent to:<pre>
   *     var MyClass = AV.Object.extend("ClassName");
   *     var object = new MyClass();
   * </pre></p>
   *
   * @param {Object} attributes The initial set of data to store in the object.
   * @param {Object} options A set of Backbone-like options for creating the
   *     object.  The only option currently supported is "collection".
   * @see AV.Object.extend
   *
   * @class
   *
   * <p>The fundamental unit of AV data, which implements the Backbone Model
   * interface.</p>
   */
  AV.Object = function (attributes, options) {
    // Allow new AV.Object("ClassName") as a shortcut to _create.
    if (_.isString(attributes)) {
      return AV.Object._create.apply(this, arguments);
    }

    attributes = attributes || {};
    if (options && options.parse) {
      attributes = this.parse(attributes);
      attributes = this._mergeMagicFields(attributes);
    }
    var defaults = getValue(this, 'defaults');
    if (defaults) {
      attributes = _.extend({}, defaults, attributes);
    }
    if (options && options.collection) {
      this.collection = options.collection;
    }

    this._serverData = {}; // The last known data for this object from cloud.
    this._opSetQueue = [{}]; // List of sets of changes to the data.
    this._flags = {};
    this.attributes = {}; // The best estimate of this's current data.

    this._hashedJSON = {}; // Hash of values of containers at last save.
    this._escapedAttributes = {};
    this.cid = _.uniqueId('c');
    this.changed = {};
    this._silent = {};
    this._pending = {};
    this.set(attributes, { silent: true });
    this.changed = {};
    this._silent = {};
    this._pending = {};
    this._hasData = true;
    this._previousAttributes = _.clone(this.attributes);
    this.initialize.apply(this, arguments);
  };

  /**
   * @lends AV.Object.prototype
   * @property {String} id The objectId of the AV Object.
   */

  /**
   * Saves the given list of AV.Object.
   * If any error is encountered, stops and calls the error handler.
   *
   * @example
   * AV.Object.saveAll([object1, object2, ...]).then(function(list) {
   *   // All the objects were saved.
   * }, function(error) {
   *   // An error occurred while saving one of the objects.
   * });
   *
   * @param {Array} list A list of <code>AV.Object</code>.
   */
  AV.Object.saveAll = function (list, options) {
    return AV.Object._deepSaveAsync(list, null, options);
  };

  /**
   * Fetch the given list of AV.Object.
   *
   * @param {AV.Object[]} objects A list of <code>AV.Object</code>
   * @param {AuthOptions} options
   * @return {Promise.<AV.Object[]>} The given list of <code>AV.Object</code>, updated
   */

  AV.Object.fetchAll = function (objects, options) {
    return _promise2.default.resolve().then(function () {
      return _request('batch', null, null, 'POST', {
        requests: _.map(objects, function (object) {
          if (!object.className) throw new Error('object must have className to fetch');
          if (!object.id) throw new Error('object must have id to fetch');
          if (object.dirty()) throw new Error('object is modified but not saved');
          return {
            method: 'GET',
            path: '/1.1/classes/' + object.className + '/' + object.id
          };
        })
      }, options);
    }).then(function (response) {
      var results = _.map(objects, function (object, i) {
        if (response[i].success) {
          var fetchedAttrs = object.parse(response[i].success);
          object._cleanupUnsetKeys(fetchedAttrs);
          object._finishFetch(fetchedAttrs);
          return object;
        }
        if (response[i].success === null) {
          return new AVError(AVError.OBJECT_NOT_FOUND, 'Object not found.');
        }
        return new AVError(response[i].error.code, response[i].error.error);
      });
      return handleBatchResults(results);
    });
  };

  // Attach all inheritable methods to the AV.Object prototype.
  _.extend(AV.Object.prototype, AV.Events,
  /** @lends AV.Object.prototype */{
    _fetchWhenSave: false,

    /**
     * Initialize is an empty function by default. Override it with your own
     * initialization logic.
     */
    initialize: function initialize() {},

    /**
     * Set whether to enable fetchWhenSave option when updating object.
     * When set true, SDK would fetch the latest object after saving.
     * Default is false.
     *
     * @deprecated use AV.Object#save with options.fetchWhenSave instead
     * @param {boolean} enable  true to enable fetchWhenSave option.
     */
    fetchWhenSave: function fetchWhenSave(enable) {
      console.warn('AV.Object#fetchWhenSave is deprecated, use AV.Object#save with options.fetchWhenSave instead.');
      if (!_.isBoolean(enable)) {
        throw new Error('Expect boolean value for fetchWhenSave');
      }
      this._fetchWhenSave = enable;
    },

    /**
     * Returns the object's objectId.
     * @return {String} the objectId.
     */
    getObjectId: function getObjectId() {
      return this.id;
    },

    /**
     * Returns the object's createdAt attribute.
     * @return {Date}
     */
    getCreatedAt: function getCreatedAt() {
      return this.createdAt;
    },

    /**
     * Returns the object's updatedAt attribute.
     * @return {Date}
     */
    getUpdatedAt: function getUpdatedAt() {
      return this.updatedAt;
    },

    /**
     * Returns a JSON version of the object.
     * @return {Object}
     */
    toJSON: function toJSON(key, holder) {
      var seenObjects = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

      return this._toFullJSON(seenObjects, false);
    },

    /**
     * Returns a JSON version of the object with meta data.
     * Inverse to {@link AV.parseJSON}
     * @since 3.0.0
     * @return {Object}
     */
    toFullJSON: function toFullJSON() {
      var seenObjects = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      return this._toFullJSON(seenObjects);
    },


    _toFullJSON: function _toFullJSON(seenObjects) {
      var _this = this;

      var full = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      var json = _.clone(this.attributes);
      if (_.isArray(seenObjects)) {
        var newSeenObjects = seenObjects.concat(this);
      }
      AV._objectEach(json, function (val, key) {
        json[key] = AV._encode(val, newSeenObjects, undefined, full);
      });
      AV._objectEach(this._operations, function (val, key) {
        json[key] = val;
      });

      if (_.has(this, 'id')) {
        json.objectId = this.id;
      }
      _(['createdAt', 'updatedAt']).each(function (key) {
        if (_.has(_this, key)) {
          var val = _this[key];
          json[key] = _.isDate(val) ? val.toJSON() : val;
        }
      });
      if (full) {
        json.__type = 'Object';
        if (_.isArray(seenObjects) && seenObjects.length) json.__type = 'Pointer';
        json.className = this.className;
      }
      return json;
    },

    /**
     * Updates _hashedJSON to reflect the current state of this object.
     * Adds any changed hash values to the set of pending changes.
     * @private
     */
    _refreshCache: function _refreshCache() {
      var self = this;
      if (self._refreshingCache) {
        return;
      }
      self._refreshingCache = true;
      AV._objectEach(this.attributes, function (value, key) {
        if (value instanceof AV.Object) {
          value._refreshCache();
        } else if (_.isObject(value)) {
          if (self._resetCacheForKey(key)) {
            self.set(key, new AV.Op.Set(value), { silent: true });
          }
        }
      });
      delete self._refreshingCache;
    },

    /**
     * Returns true if this object has been modified since its last
     * save/refresh.  If an attribute is specified, it returns true only if that
     * particular attribute has been modified since the last save/refresh.
     * @param {String} attr An attribute name (optional).
     * @return {Boolean}
     */
    dirty: function dirty(attr) {
      this._refreshCache();

      var currentChanges = _.last(this._opSetQueue);

      if (attr) {
        return currentChanges[attr] ? true : false;
      }
      if (!this.id) {
        return true;
      }
      if (_.keys(currentChanges).length > 0) {
        return true;
      }
      return false;
    },

    /**
     * Returns the keys of the modified attribute since its last save/refresh.
     * @return {String[]}
     */
    dirtyKeys: function dirtyKeys() {
      this._refreshCache();
      var currentChanges = _.last(this._opSetQueue);
      return _.keys(currentChanges);
    },

    /**
     * Gets a Pointer referencing this Object.
     * @private
     */
    _toPointer: function _toPointer() {
      // if (!this.id) {
      //   throw new Error("Can't serialize an unsaved AV.Object");
      // }
      return {
        __type: 'Pointer',
        className: this.className,
        objectId: this.id
      };
    },

    /**
     * Gets the value of an attribute.
     * @param {String} attr The string name of an attribute.
     */
    get: function get(attr) {
      switch (attr) {
        case 'objectId':
          return this.id;
        case 'createdAt':
        case 'updatedAt':
          return this[attr];
        default:
          return this.attributes[attr];
      }
    },

    /**
     * Gets a relation on the given class for the attribute.
     * @param {String} attr The attribute to get the relation for.
     * @return {AV.Relation}
     */
    relation: function relation(attr) {
      var value = this.get(attr);
      if (value) {
        if (!(value instanceof AV.Relation)) {
          throw new Error('Called relation() on non-relation field ' + attr);
        }
        value._ensureParentAndKey(this, attr);
        return value;
      } else {
        return new AV.Relation(this, attr);
      }
    },

    /**
     * Gets the HTML-escaped value of an attribute.
     */
    escape: function escape(attr) {
      var html = this._escapedAttributes[attr];
      if (html) {
        return html;
      }
      var val = this.attributes[attr];
      var escaped;
      if (isNullOrUndefined(val)) {
        escaped = '';
      } else {
        escaped = _.escape(val.toString());
      }
      this._escapedAttributes[attr] = escaped;
      return escaped;
    },

    /**
     * Returns <code>true</code> if the attribute contains a value that is not
     * null or undefined.
     * @param {String} attr The string name of the attribute.
     * @return {Boolean}
     */
    has: function has(attr) {
      return !isNullOrUndefined(this.attributes[attr]);
    },

    /**
     * Pulls "special" fields like objectId, createdAt, etc. out of attrs
     * and puts them on "this" directly.  Removes them from attrs.
     * @param attrs - A dictionary with the data for this AV.Object.
     * @private
     */
    _mergeMagicFields: function _mergeMagicFields(attrs) {
      // Check for changes of magic fields.
      var model = this;
      var specialFields = ['objectId', 'createdAt', 'updatedAt'];
      AV._arrayEach(specialFields, function (attr) {
        if (attrs[attr]) {
          if (attr === 'objectId') {
            model.id = attrs[attr];
          } else if ((attr === 'createdAt' || attr === 'updatedAt') && !_.isDate(attrs[attr])) {
            model[attr] = AV._parseDate(attrs[attr]);
          } else {
            model[attr] = attrs[attr];
          }
          delete attrs[attr];
        }
      });
      return attrs;
    },

    /**
     * Returns the json to be sent to the server.
     * @private
     */
    _startSave: function _startSave() {
      this._opSetQueue.push({});
    },

    /**
     * Called when a save fails because of an error. Any changes that were part
     * of the save need to be merged with changes made after the save. This
     * might throw an exception is you do conflicting operations. For example,
     * if you do:
     *   object.set("foo", "bar");
     *   object.set("invalid field name", "baz");
     *   object.save();
     *   object.increment("foo");
     * then this will throw when the save fails and the client tries to merge
     * "bar" with the +1.
     * @private
     */
    _cancelSave: function _cancelSave() {
      var failedChanges = _.first(this._opSetQueue);
      this._opSetQueue = _.rest(this._opSetQueue);
      var nextChanges = _.first(this._opSetQueue);
      AV._objectEach(failedChanges, function (op, key) {
        var op1 = failedChanges[key];
        var op2 = nextChanges[key];
        if (op1 && op2) {
          nextChanges[key] = op2._mergeWithPrevious(op1);
        } else if (op1) {
          nextChanges[key] = op1;
        }
      });
      this._saving = this._saving - 1;
    },

    /**
     * Called when a save completes successfully. This merges the changes that
     * were saved into the known server data, and overrides it with any data
     * sent directly from the server.
     * @private
     */
    _finishSave: function _finishSave(serverData) {
      // Grab a copy of any object referenced by this object. These instances
      // may have already been fetched, and we don't want to lose their data.
      // Note that doing it like this means we will unify separate copies of the
      // same object, but that's a risk we have to take.
      var fetchedObjects = {};
      AV._traverse(this.attributes, function (object) {
        if (object instanceof AV.Object && object.id && object._hasData) {
          fetchedObjects[object.id] = object;
        }
      });

      var savedChanges = _.first(this._opSetQueue);
      this._opSetQueue = _.rest(this._opSetQueue);
      this._applyOpSet(savedChanges, this._serverData);
      this._mergeMagicFields(serverData);
      var self = this;
      AV._objectEach(serverData, function (value, key) {
        self._serverData[key] = AV._decode(value, key);

        // Look for any objects that might have become unfetched and fix them
        // by replacing their values with the previously observed values.
        var fetched = AV._traverse(self._serverData[key], function (object) {
          if (object instanceof AV.Object && fetchedObjects[object.id]) {
            return fetchedObjects[object.id];
          }
        });
        if (fetched) {
          self._serverData[key] = fetched;
        }
      });
      this._rebuildAllEstimatedData();
      var opSetQueue = this._opSetQueue.map(_.clone);
      this._refreshCache();
      this._opSetQueue = opSetQueue;
      this._saving = this._saving - 1;
    },

    /**
     * Called when a fetch or login is complete to set the known server data to
     * the given object.
     * @private
     */
    _finishFetch: function _finishFetch(serverData, hasData) {
      // Clear out any changes the user might have made previously.
      this._opSetQueue = [{}];

      // Bring in all the new server data.
      this._mergeMagicFields(serverData);
      var self = this;
      AV._objectEach(serverData, function (value, key) {
        self._serverData[key] = AV._decode(value, key);
      });

      // Refresh the attributes.
      this._rebuildAllEstimatedData();

      // Clear out the cache of mutable containers.
      this._refreshCache();
      this._opSetQueue = [{}];

      this._hasData = hasData;
    },

    /**
     * Applies the set of AV.Op in opSet to the object target.
     * @private
     */
    _applyOpSet: function _applyOpSet(opSet, target) {
      var self = this;
      AV._objectEach(opSet, function (change, key) {
        var _findValue = findValue(target, key),
            _findValue2 = (0, _slicedToArray3.default)(_findValue, 3),
            value = _findValue2[0],
            actualTarget = _findValue2[1],
            actualKey = _findValue2[2];

        setValue(target, key, change._estimate(value, self, key));
        if (actualTarget && actualTarget[actualKey] === AV.Op._UNSET) {
          delete actualTarget[actualKey];
        }
      });
    },

    /**
     * Replaces the cached value for key with the current value.
     * Returns true if the new value is different than the old value.
     * @private
     */
    _resetCacheForKey: function _resetCacheForKey(key) {
      var value = this.attributes[key];
      if (_.isObject(value) && !(value instanceof AV.Object) && !(value instanceof AV.File)) {
        var json = (0, _stringify2.default)(recursiveToPointer(value));
        if (this._hashedJSON[key] !== json) {
          var wasSet = !!this._hashedJSON[key];
          this._hashedJSON[key] = json;
          return wasSet;
        }
      }
      return false;
    },

    /**
     * Populates attributes[key] by starting with the last known data from the
     * server, and applying all of the local changes that have been made to that
     * key since then.
     * @private
     */
    _rebuildEstimatedDataForKey: function _rebuildEstimatedDataForKey(key) {
      var self = this;
      delete this.attributes[key];
      if (this._serverData[key]) {
        this.attributes[key] = this._serverData[key];
      }
      AV._arrayEach(this._opSetQueue, function (opSet) {
        var op = opSet[key];
        if (op) {
          var _findValue3 = findValue(self.attributes, key),
              _findValue4 = (0, _slicedToArray3.default)(_findValue3, 4),
              value = _findValue4[0],
              actualTarget = _findValue4[1],
              actualKey = _findValue4[2],
              firstKey = _findValue4[3];

          setValue(self.attributes, key, op._estimate(value, self, key));
          if (actualTarget && actualTarget[actualKey] === AV.Op._UNSET) {
            delete actualTarget[actualKey];
          }
          self._resetCacheForKey(firstKey);
        }
      });
    },

    /**
     * Populates attributes by starting with the last known data from the
     * server, and applying all of the local changes that have been made since
     * then.
     * @private
     */
    _rebuildAllEstimatedData: function _rebuildAllEstimatedData() {
      var self = this;

      var previousAttributes = _.clone(this.attributes);

      this.attributes = _.clone(this._serverData);
      AV._arrayEach(this._opSetQueue, function (opSet) {
        self._applyOpSet(opSet, self.attributes);
        AV._objectEach(opSet, function (op, key) {
          self._resetCacheForKey(key);
        });
      });

      // Trigger change events for anything that changed because of the fetch.
      AV._objectEach(previousAttributes, function (oldValue, key) {
        if (self.attributes[key] !== oldValue) {
          self.trigger('change:' + key, self, self.attributes[key], {});
        }
      });
      AV._objectEach(this.attributes, function (newValue, key) {
        if (!_.has(previousAttributes, key)) {
          self.trigger('change:' + key, self, newValue, {});
        }
      });
    },

    /**
     * Sets a hash of model attributes on the object, firing
     * <code>"change"</code> unless you choose to silence it.
     *
     * <p>You can call it with an object containing keys and values, or with one
     * key and value.  For example:</p>
     *
     * @example
     * gameTurn.set({
     *   player: player1,
     *   diceRoll: 2
     * });
     *
     * game.set("currentPlayer", player2);
     *
     * game.set("finished", true);
     *
     * @param {String} key The key to set.
     * @param {Any} value The value to give it.
     * @param {Object} [options]
     * @param {Boolean} [options.silent]
     * @return {AV.Object} self if succeeded, throws if the value is not valid.
     * @see AV.Object#validate
     */
    set: function set(key, value, options) {
      var attrs;
      if (_.isObject(key) || isNullOrUndefined(key)) {
        attrs = _.mapObject(key, function (v, k) {
          checkReservedKey(k);
          return AV._decode(v, k);
        });
        options = value;
      } else {
        attrs = {};
        checkReservedKey(key);
        attrs[key] = AV._decode(value, key);
      }

      // Extract attributes and options.
      options = options || {};
      if (!attrs) {
        return this;
      }
      if (attrs instanceof AV.Object) {
        attrs = attrs.attributes;
      }

      // If the unset option is used, every attribute should be a Unset.
      if (options.unset) {
        AV._objectEach(attrs, function (unused_value, key) {
          attrs[key] = new AV.Op.Unset();
        });
      }

      // Apply all the attributes to get the estimated values.
      var dataToValidate = _.clone(attrs);
      var self = this;
      AV._objectEach(dataToValidate, function (value, key) {
        if (value instanceof AV.Op) {
          dataToValidate[key] = value._estimate(self.attributes[key], self, key);
          if (dataToValidate[key] === AV.Op._UNSET) {
            delete dataToValidate[key];
          }
        }
      });

      // Run validation.
      this._validate(attrs, options);

      options.changes = {};
      var escaped = this._escapedAttributes;

      // Update attributes.
      AV._arrayEach(_.keys(attrs), function (attr) {
        var val = attrs[attr];

        // If this is a relation object we need to set the parent correctly,
        // since the location where it was parsed does not have access to
        // this object.
        if (val instanceof AV.Relation) {
          val.parent = self;
        }

        if (!(val instanceof AV.Op)) {
          val = new AV.Op.Set(val);
        }

        // See if this change will actually have any effect.
        var isRealChange = true;
        if (val instanceof AV.Op.Set && _.isEqual(self.attributes[attr], val.value)) {
          isRealChange = false;
        }

        if (isRealChange) {
          delete escaped[attr];
          if (options.silent) {
            self._silent[attr] = true;
          } else {
            options.changes[attr] = true;
          }
        }

        var currentChanges = _.last(self._opSetQueue);
        currentChanges[attr] = val._mergeWithPrevious(currentChanges[attr]);
        self._rebuildEstimatedDataForKey(attr);

        if (isRealChange) {
          self.changed[attr] = self.attributes[attr];
          if (!options.silent) {
            self._pending[attr] = true;
          }
        } else {
          delete self.changed[attr];
          delete self._pending[attr];
        }
      });

      if (!options.silent) {
        this.change(options);
      }
      return this;
    },

    /**
     * Remove an attribute from the model, firing <code>"change"</code> unless
     * you choose to silence it. This is a noop if the attribute doesn't
     * exist.
     * @param key {String} The key.
     */
    unset: function unset(attr, options) {
      options = options || {};
      options.unset = true;
      return this.set(attr, null, options);
    },

    /**
     * Atomically increments the value of the given attribute the next time the
     * object is saved. If no amount is specified, 1 is used by default.
     *
     * @param key {String} The key.
     * @param amount {Number} The amount to increment by.
     */
    increment: function increment(attr, amount) {
      if (_.isUndefined(amount) || _.isNull(amount)) {
        amount = 1;
      }
      return this.set(attr, new AV.Op.Increment(amount));
    },

    /**
     * Atomically add an object to the end of the array associated with a given
     * key.
     * @param key {String} The key.
     * @param item {} The item to add.
     */
    add: function add(attr, item) {
      return this.set(attr, new AV.Op.Add(ensureArray(item)));
    },

    /**
     * Atomically add an object to the array associated with a given key, only
     * if it is not already present in the array. The position of the insert is
     * not guaranteed.
     *
     * @param key {String} The key.
     * @param item {} The object to add.
     */
    addUnique: function addUnique(attr, item) {
      return this.set(attr, new AV.Op.AddUnique(ensureArray(item)));
    },

    /**
     * Atomically remove all instances of an object from the array associated
     * with a given key.
     *
     * @param key {String} The key.
     * @param item {} The object to remove.
     */
    remove: function remove(attr, item) {
      return this.set(attr, new AV.Op.Remove(ensureArray(item)));
    },

    /**
     * Atomically apply a "bit and" operation on the value associated with a
     * given key.
     *
     * @param key {String} The key.
     * @param value {Number} The value to apply.
     */
    bitAnd: function bitAnd(attr, value) {
      return this.set(attr, new AV.Op.BitAnd(value));
    },


    /**
     * Atomically apply a "bit or" operation on the value associated with a
     * given key.
     *
     * @param key {String} The key.
     * @param value {Number} The value to apply.
     */
    bitOr: function bitOr(attr, value) {
      return this.set(attr, new AV.Op.BitOr(value));
    },


    /**
     * Atomically apply a "bit xor" operation on the value associated with a
     * given key.
     *
     * @param key {String} The key.
     * @param value {Number} The value to apply.
     */
    bitXor: function bitXor(attr, value) {
      return this.set(attr, new AV.Op.BitXor(value));
    },


    /**
     * Returns an instance of a subclass of AV.Op describing what kind of
     * modification has been performed on this field since the last time it was
     * saved. For example, after calling object.increment("x"), calling
     * object.op("x") would return an instance of AV.Op.Increment.
     *
     * @param key {String} The key.
     * @returns {AV.Op} The operation, or undefined if none.
     */
    op: function op(attr) {
      return _.last(this._opSetQueue)[attr];
    },

    /**
     * Clear all attributes on the model, firing <code>"change"</code> unless
     * you choose to silence it.
     */
    clear: function clear(options) {
      options = options || {};
      options.unset = true;
      var keysToClear = _.extend(this.attributes, this._operations);
      return this.set(keysToClear, options);
    },

    /**
     * Clears any (or specific) changes to the model made since the last save.
     * @param {string|string[]} [keys] specify keys to revert.
     */
    revert: function revert(keys) {
      var lastOp = _.last(this._opSetQueue);
      var _keys = ensureArray(keys || _.keys(lastOp));
      _keys.forEach(function (key) {
        delete lastOp[key];
      });
      this._rebuildAllEstimatedData();
      return this;
    },


    /**
     * Returns a JSON-encoded set of operations to be sent with the next save
     * request.
     * @private
     */
    _getSaveJSON: function _getSaveJSON() {
      var json = _.clone(_.first(this._opSetQueue));
      AV._objectEach(json, function (op, key) {
        json[key] = op.toJSON();
      });
      return json;
    },

    /**
     * Returns true if this object can be serialized for saving.
     * @private
     */
    _canBeSerialized: function _canBeSerialized() {
      return AV.Object._canBeSerializedAsValue(this.attributes);
    },

    /**
     * Fetch the model from the server. If the server's representation of the
     * model differs from its current attributes, they will be overriden,
     * triggering a <code>"change"</code> event.
     * @param {Object} fetchOptions Optional options to set 'keys',
     *      'include' and 'includeACL' option.
     * @param {AuthOptions} options
     * @return {Promise} A promise that is fulfilled when the fetch
     *     completes.
     */
    fetch: function fetch() {
      var fetchOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var options = arguments[1];

      var self = this;
      var request = _request('classes', this.className, this.id, 'GET', transformFetchOptions(fetchOptions), options);
      return request.then(function (response) {
        var fetchedAttrs = self.parse(response);
        self._cleanupUnsetKeys(fetchedAttrs, fetchOptions.keys ? ensureArray(fetchOptions.keys).join(',').split(',') : undefined);
        self._finishFetch(fetchedAttrs, true);
        return self;
      });
    },

    _cleanupUnsetKeys: function _cleanupUnsetKeys(fetchedAttrs) {
      var _this2 = this;

      var fetchedKeys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _.keys(this._serverData);

      _.forEach(fetchedKeys, function (key) {
        if (fetchedAttrs[key] === undefined) delete _this2._serverData[key];
      });
    },


    /**
     * Set a hash of model attributes, and save the model to the server.
     * updatedAt will be updated when the request returns.
     * You can either call it as:<pre>
     *   object.save();</pre>
     * or<pre>
     *   object.save(null, options);</pre>
     * or<pre>
     *   object.save(attrs, options);</pre>
     * or<pre>
     *   object.save(key, value, options);</pre>
     *
     * @example
     * gameTurn.save({
     *   player: "Jake Cutter",
     *   diceRoll: 2
     * }).then(function(gameTurnAgain) {
     *   // The save was successful.
     * }, function(error) {
     *   // The save failed.  Error is an instance of AVError.
     * });
     *
     * @param {AuthOptions} options AuthOptions plus:
     * @param {Boolean} options.fetchWhenSave fetch and update object after save succeeded
     * @param {AV.Query} options.query Save object only when it matches the query
     * @return {Promise} A promise that is fulfilled when the save
     *     completes.
     * @see AVError
     */
    save: function save(arg1, arg2, arg3) {
      var attrs, current, options;
      if (_.isObject(arg1) || isNullOrUndefined(arg1)) {
        attrs = arg1;
        options = arg2;
      } else {
        attrs = {};
        attrs[arg1] = arg2;
        options = arg3;
      }

      options = _.clone(options) || {};
      if (options.wait) {
        current = _.clone(this.attributes);
      }

      var setOptions = _.clone(options) || {};
      if (setOptions.wait) {
        setOptions.silent = true;
      }
      if (attrs) {
        this.set(attrs, setOptions);
      }

      var model = this;

      var unsavedChildren = [];
      var unsavedFiles = [];
      AV.Object._findUnsavedChildren(model, unsavedChildren, unsavedFiles);
      if (unsavedChildren.length + unsavedFiles.length > 1) {
        return AV.Object._deepSaveAsync(this, model, options);
      }

      this._startSave();
      this._saving = (this._saving || 0) + 1;

      this._allPreviousSaves = this._allPreviousSaves || _promise2.default.resolve();
      this._allPreviousSaves = this._allPreviousSaves.catch(function (e) {}).then(function () {
        var method = model.id ? 'PUT' : 'POST';

        var json = model._getSaveJSON();
        var query = {};

        if (model._fetchWhenSave || options.fetchWhenSave) {
          query['new'] = 'true';
        }
        // user login option
        if (options._failOnNotExist) {
          query.failOnNotExist = 'true';
        }

        if (options.query) {
          var queryParams;
          if (typeof options.query._getParams === 'function') {
            queryParams = options.query._getParams();
            if (queryParams) {
              query.where = queryParams.where;
            }
          }
          if (!query.where) {
            var error = new Error('options.query is not an AV.Query');
            throw error;
          }
        }

        _.extend(json, model._flags);

        var route = 'classes';
        var className = model.className;
        if (model.className === '_User' && !model.id) {
          // Special-case user sign-up.
          route = 'users';
          className = null;
        }
        //hook makeRequest in options.
        var makeRequest = options._makeRequest || _request;
        var requestPromise = makeRequest(route, className, model.id, method, json, options, query);

        requestPromise = requestPromise.then(function (resp) {
          var serverAttrs = model.parse(resp);
          if (options.wait) {
            serverAttrs = _.extend(attrs || {}, serverAttrs);
          }
          model._finishSave(serverAttrs);
          if (options.wait) {
            model.set(current, setOptions);
          }
          return model;
        }, function (error) {
          model._cancelSave();
          throw error;
        });

        return requestPromise;
      });
      return this._allPreviousSaves;
    },

    /**
     * Destroy this model on the server if it was already persisted.
     * Optimistically removes the model from its collection, if it has one.
     * @param {AuthOptions} options AuthOptions plus:
     * @param {Boolean} [options.wait] wait for the server to respond
     * before removal.
     *
     * @return {Promise} A promise that is fulfilled when the destroy
     *     completes.
     */
    destroy: function destroy(options) {
      options = options || {};
      var model = this;

      var triggerDestroy = function triggerDestroy() {
        model.trigger('destroy', model, model.collection, options);
      };

      if (!this.id) {
        return triggerDestroy();
      }

      if (!options.wait) {
        triggerDestroy();
      }

      var request = _request('classes', this.className, this.id, 'DELETE', this._flags, options);
      return request.then(function () {
        if (options.wait) {
          triggerDestroy();
        }
        return model;
      });
    },

    /**
     * Converts a response into the hash of attributes to be set on the model.
     * @ignore
     */
    parse: function parse(resp) {
      var output = _.clone(resp);
      _(['createdAt', 'updatedAt']).each(function (key) {
        if (output[key]) {
          output[key] = AV._parseDate(output[key]);
        }
      });
      if (output.createdAt && !output.updatedAt) {
        output.updatedAt = output.createdAt;
      }
      return output;
    },

    /**
     * Creates a new model with identical attributes to this one.
     * @return {AV.Object}
     */
    clone: function clone() {
      return new this.constructor(this.attributes);
    },

    /**
     * Returns true if this object has never been saved to AV.
     * @return {Boolean}
     */
    isNew: function isNew() {
      return !this.id;
    },

    /**
     * Call this method to manually fire a `"change"` event for this model and
     * a `"change:attribute"` event for each changed attribute.
     * Calling this will cause all objects observing the model to update.
     */
    change: function change(options) {
      options = options || {};
      var changing = this._changing;
      this._changing = true;

      // Silent changes become pending changes.
      var self = this;
      AV._objectEach(this._silent, function (attr) {
        self._pending[attr] = true;
      });

      // Silent changes are triggered.
      var changes = _.extend({}, options.changes, this._silent);
      this._silent = {};
      AV._objectEach(changes, function (unused_value, attr) {
        self.trigger('change:' + attr, self, self.get(attr), options);
      });
      if (changing) {
        return this;
      }

      // This is to get around lint not letting us make a function in a loop.
      var deleteChanged = function deleteChanged(value, attr) {
        if (!self._pending[attr] && !self._silent[attr]) {
          delete self.changed[attr];
        }
      };

      // Continue firing `"change"` events while there are pending changes.
      while (!_.isEmpty(this._pending)) {
        this._pending = {};
        this.trigger('change', this, options);
        // Pending and silent changes still remain.
        AV._objectEach(this.changed, deleteChanged);
        self._previousAttributes = _.clone(this.attributes);
      }

      this._changing = false;
      return this;
    },

    /**
     * Gets the previous value of an attribute, recorded at the time the last
     * <code>"change"</code> event was fired.
     * @param {String} attr Name of the attribute to get.
     */
    previous: function previous(attr) {
      if (!arguments.length || !this._previousAttributes) {
        return null;
      }
      return this._previousAttributes[attr];
    },

    /**
     * Gets all of the attributes of the model at the time of the previous
     * <code>"change"</code> event.
     * @return {Object}
     */
    previousAttributes: function previousAttributes() {
      return _.clone(this._previousAttributes);
    },

    /**
     * Checks if the model is currently in a valid state. It's only possible to
     * get into an *invalid* state if you're using silent changes.
     * @return {Boolean}
     */
    isValid: function isValid() {
      try {
        this.validate(this.attributes);
      } catch (error) {
        return false;
      }
      return true;
    },

    /**
     * You should not call this function directly unless you subclass
     * <code>AV.Object</code>, in which case you can override this method
     * to provide additional validation on <code>set</code> and
     * <code>save</code>.  Your implementation should throw an Error if
     * the attrs is invalid
     *
     * @param {Object} attrs The current data to validate.
     * @see AV.Object#set
     */
    validate: function validate(attrs) {
      if (_.has(attrs, 'ACL') && !(attrs.ACL instanceof AV.ACL)) {
        throw new AVError(AVError.OTHER_CAUSE, 'ACL must be a AV.ACL.');
      }
    },

    /**
     * Run validation against a set of incoming attributes, returning `true`
     * if all is well. If a specific `error` callback has been passed,
     * call that instead of firing the general `"error"` event.
     * @private
     */
    _validate: function _validate(attrs, options) {
      if (options.silent || !this.validate) {
        return;
      }
      attrs = _.extend({}, this.attributes, attrs);
      this.validate(attrs);
    },

    /**
     * Returns the ACL for this object.
     * @returns {AV.ACL} An instance of AV.ACL.
     * @see AV.Object#get
     */
    getACL: function getACL() {
      return this.get('ACL');
    },

    /**
     * Sets the ACL to be used for this object.
     * @param {AV.ACL} acl An instance of AV.ACL.
     * @param {Object} options Optional Backbone-like options object to be
     *     passed in to set.
     * @return {AV.Object} self
     * @see AV.Object#set
     */
    setACL: function setACL(acl, options) {
      return this.set('ACL', acl, options);
    },

    disableBeforeHook: function disableBeforeHook() {
      this.ignoreHook('beforeSave');
      this.ignoreHook('beforeUpdate');
      this.ignoreHook('beforeDelete');
    },

    disableAfterHook: function disableAfterHook() {
      this.ignoreHook('afterSave');
      this.ignoreHook('afterUpdate');
      this.ignoreHook('afterDelete');
    },

    ignoreHook: function ignoreHook(hookName) {
      if (!_.contains(['beforeSave', 'afterSave', 'beforeUpdate', 'afterUpdate', 'beforeDelete', 'afterDelete'], hookName)) {
        throw new Error('Unsupported hookName: ' + hookName);
      }

      if (!AV.hookKey) {
        throw new Error('ignoreHook required hookKey');
      }

      if (!this._flags.__ignore_hooks) {
        this._flags.__ignore_hooks = [];
      }

      this._flags.__ignore_hooks.push(hookName);
    }
  });

  /**
   * Creates an instance of a subclass of AV.Object for the give classname
   * and id.
   * @param  {String|Function} class the className or a subclass of AV.Object.
   * @param {String} id The object id of this model.
   * @return {AV.Object} A new subclass instance of AV.Object.
   */
  AV.Object.createWithoutData = function (klass, id, hasData) {
    var _klass = void 0;
    if (_.isString(klass)) {
      _klass = AV.Object._getSubclass(klass);
    } else if (klass.prototype && klass.prototype instanceof AV.Object) {
      _klass = klass;
    } else {
      throw new Error('class must be a string or a subclass of AV.Object.');
    }
    var object = new _klass();
    object.id = id;
    object._hasData = hasData;
    return object;
  };
  /**
   * Delete objects in batch.
   * @param {AV.Object[]} objects The <code>AV.Object</code> array to be deleted.
   * @param {AuthOptions} options
   * @return {Promise} A promise that is fulfilled when the save
   *     completes.
   */
  AV.Object.destroyAll = function (objects) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (!objects || objects.length === 0) {
      return _promise2.default.resolve();
    }
    var objectsByClassNameAndFlags = _.groupBy(objects, function (object) {
      return (0, _stringify2.default)({
        className: object.className,
        flags: object._flags
      });
    });
    var body = {
      requests: _.map(objectsByClassNameAndFlags, function (objects) {
        var ids = _.map(objects, 'id').join(',');
        return {
          method: 'DELETE',
          path: '/1.1/classes/' + objects[0].className + '/' + ids,
          body: objects[0]._flags
        };
      })
    };
    return _request('batch', null, null, 'POST', body, options).then(function (response) {
      var firstError = _.find(response, function (result) {
        return !result.success;
      });
      if (firstError) throw new AVError(firstError.error.code, firstError.error.error);
      return undefined;
    });
  };

  /**
   * Returns the appropriate subclass for making new instances of the given
   * className string.
   * @private
   */
  AV.Object._getSubclass = function (className) {
    if (!_.isString(className)) {
      throw new Error('AV.Object._getSubclass requires a string argument.');
    }
    var ObjectClass = AV.Object._classMap[className];
    if (!ObjectClass) {
      ObjectClass = AV.Object.extend(className);
      AV.Object._classMap[className] = ObjectClass;
    }
    return ObjectClass;
  };

  /**
   * Creates an instance of a subclass of AV.Object for the given classname.
   * @private
   */
  AV.Object._create = function (className, attributes, options) {
    var ObjectClass = AV.Object._getSubclass(className);
    return new ObjectClass(attributes, options);
  };

  // Set up a map of className to class so that we can create new instances of
  // AV Objects from JSON automatically.
  AV.Object._classMap = {};

  AV.Object._extend = AV._extend;

  /**
   * Creates a new model with defined attributes,
   * It's the same with
   * <pre>
   *   new AV.Object(attributes, options);
   *  </pre>
   * @param {Object} attributes The initial set of data to store in the object.
   * @param {Object} options A set of Backbone-like options for creating the
   *     object.  The only option currently supported is "collection".
   * @return {AV.Object}
   * @since v0.4.4
   * @see AV.Object
   * @see AV.Object.extend
   */
  AV.Object['new'] = function (attributes, options) {
    return new AV.Object(attributes, options);
  };

  /**
   * Creates a new subclass of AV.Object for the given AV class name.
   *
   * <p>Every extension of a AV class will inherit from the most recent
   * previous extension of that class. When a AV.Object is automatically
   * created by parsing JSON, it will use the most recent extension of that
   * class.</p>
   *
   * @example
   * var MyClass = AV.Object.extend("MyClass", {
   *     // Instance properties
   * }, {
   *     // Class properties
   * });
   *
   * @param {String} className The name of the AV class backing this model.
   * @param {Object} protoProps Instance properties to add to instances of the
   *     class returned from this method.
   * @param {Object} classProps Class properties to add the class returned from
   *     this method.
   * @return {Class} A new subclass of AV.Object.
   */
  AV.Object.extend = function (className, protoProps, classProps) {
    // Handle the case with only two args.
    if (!_.isString(className)) {
      if (className && _.has(className, 'className')) {
        return AV.Object.extend(className.className, className, protoProps);
      } else {
        throw new Error("AV.Object.extend's first argument should be the className.");
      }
    }

    // If someone tries to subclass "User", coerce it to the right type.
    if (className === 'User') {
      className = '_User';
    }

    var NewClassObject = null;
    if (_.has(AV.Object._classMap, className)) {
      var OldClassObject = AV.Object._classMap[className];
      // This new subclass has been told to extend both from "this" and from
      // OldClassObject. This is multiple inheritance, which isn't supported.
      // For now, let's just pick one.
      if (protoProps || classProps) {
        NewClassObject = OldClassObject._extend(protoProps, classProps);
      } else {
        return OldClassObject;
      }
    } else {
      protoProps = protoProps || {};
      protoProps._className = className;
      NewClassObject = this._extend(protoProps, classProps);
    }
    // Extending a subclass should reuse the classname automatically.
    NewClassObject.extend = function (arg0) {
      if (_.isString(arg0) || arg0 && _.has(arg0, 'className')) {
        return AV.Object.extend.apply(NewClassObject, arguments);
      }
      var newArguments = [className].concat(_.toArray(arguments));
      return AV.Object.extend.apply(NewClassObject, newArguments);
    };
    // Add the query property descriptor.
    Object.defineProperty(NewClassObject, 'query', (0, _getOwnPropertyDescriptor2.default)(AV.Object, 'query'));
    NewClassObject['new'] = function (attributes, options) {
      return new NewClassObject(attributes, options);
    };
    AV.Object._classMap[className] = NewClassObject;
    return NewClassObject;
  };

  // ES6 class syntax support
  Object.defineProperty(AV.Object.prototype, 'className', {
    get: function get() {
      var className = this._className || this.constructor._LCClassName || this.constructor.name;
      // If someone tries to subclass "User", coerce it to the right type.
      if (className === 'User') {
        return '_User';
      }
      return className;
    }
  });

  /**
   * Register a class.
   * If a subclass of <code>AV.Object</code> is defined with your own implement
   * rather then <code>AV.Object.extend</code>, the subclass must be registered.
   * @param {Function} klass A subclass of <code>AV.Object</code>
   * @param {String} [name] Specify the name of the class. Useful when the class might be uglified.
   * @example
   * class Person extend AV.Object {}
   * AV.Object.register(Person);
   */
  AV.Object.register = function (klass, name) {
    if (!(klass.prototype instanceof AV.Object)) {
      throw new Error('registered class is not a subclass of AV.Object');
    }
    var className = name || klass.name;
    if (!className.length) {
      throw new Error('registered class must be named');
    }
    if (name) {
      klass._LCClassName = name;
    }
    AV.Object._classMap[className] = klass;
  };

  /**
   * Get a new Query of the current class
   * @name query
   * @memberof AV.Object
   * @type AV.Query
   * @readonly
   * @since v3.1.0
   * @example
   * const Post = AV.Object.extend('Post');
   * Post.query.equalTo('author', 'leancloud').find().then();
   */
  Object.defineProperty(AV.Object, 'query', {
    get: function get() {
      return new AV.Query(this.prototype.className);
    }
  });

  AV.Object._findUnsavedChildren = function (objects, children, files) {
    AV._traverse(objects, function (object) {
      if (object instanceof AV.Object) {
        if (object.dirty()) {
          children.push(object);
        }
        return;
      }

      if (object instanceof AV.File) {
        if (!object.id) {
          files.push(object);
        }
        return;
      }
    });
  };

  AV.Object._canBeSerializedAsValue = function (object) {
    var canBeSerializedAsValue = true;

    if (object instanceof AV.Object || object instanceof AV.File) {
      canBeSerializedAsValue = !!object.id;
    } else if (_.isArray(object)) {
      AV._arrayEach(object, function (child) {
        if (!AV.Object._canBeSerializedAsValue(child)) {
          canBeSerializedAsValue = false;
        }
      });
    } else if (_.isObject(object)) {
      AV._objectEach(object, function (child) {
        if (!AV.Object._canBeSerializedAsValue(child)) {
          canBeSerializedAsValue = false;
        }
      });
    }

    return canBeSerializedAsValue;
  };

  AV.Object._deepSaveAsync = function (object, model, options) {
    var unsavedChildren = [];
    var unsavedFiles = [];
    AV.Object._findUnsavedChildren(object, unsavedChildren, unsavedFiles);

    var promise = _promise2.default.resolve();
    _.each(unsavedFiles, function (file) {
      promise = promise.then(function () {
        return file.save();
      });
    });

    var objects = _.uniq(unsavedChildren);
    var remaining = _.uniq(objects);

    return promise.then(function () {
      return continueWhile(function () {
        return remaining.length > 0;
      }, function () {
        // Gather up all the objects that can be saved in this batch.
        var batch = [];
        var newRemaining = [];
        AV._arrayEach(remaining, function (object) {
          // Limit batches to 20 objects.
          if (batch.length > 20) {
            newRemaining.push(object);
            return;
          }

          if (object._canBeSerialized()) {
            batch.push(object);
          } else {
            newRemaining.push(object);
          }
        });
        remaining = newRemaining;

        // If we can't save any objects, there must be a circular reference.
        if (batch.length === 0) {
          return _promise2.default.reject(new AVError(AVError.OTHER_CAUSE, 'Tried to save a batch with a cycle.'));
        }

        // Reserve a spot in every object's save queue.
        var readyToStart = _promise2.default.resolve(_.map(batch, function (object) {
          return object._allPreviousSaves || _promise2.default.resolve();
        }));

        // Save a single batch, whether previous saves succeeded or failed.
        var bathSavePromise = readyToStart.then(function () {
          return _request('batch', null, null, 'POST', {
            requests: _.map(batch, function (object) {
              var method = object.id ? 'PUT' : 'POST';

              var json = object._getSaveJSON();

              _.extend(json, object._flags);

              var route = 'classes';
              var className = object.className;
              var path = '/' + route + '/' + className;
              if (object.className === '_User' && !object.id) {
                // Special-case user sign-up.
                path = '/users';
              }

              var path = '/1.1' + path;
              if (object.id) {
                path = path + '/' + object.id;
              }

              object._startSave();

              return {
                method: method,
                path: path,
                body: json
              };
            })
          }, options).then(function (response) {
            var results = _.map(batch, function (object, i) {
              if (response[i].success) {
                object._finishSave(object.parse(response[i].success));
                return object;
              }
              object._cancelSave();
              return new AVError(response[i].error.code, response[i].error.error);
            });
            return handleBatchResults(results);
          });
        });
        AV._arrayEach(batch, function (object) {
          object._allPreviousSaves = bathSavePromise;
        });
        return bathSavePromise;
      });
    }).then(function () {
      return object;
    });
  };
};
}, function(modId) { var map = {"./error":1595492076968,"./request":1595492076981,"./utils":1595492076963}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1595492076984, function(require, module, exports) {


var _ = require('underscore');
var AVError = require('./error');

module.exports = function (AV) {
  AV.Role = AV.Object.extend('_Role',
  /** @lends AV.Role.prototype */{
    // Instance Methods

    /**
     * Represents a Role on the AV server. Roles represent groupings of
     * Users for the purposes of granting permissions (e.g. specifying an ACL
     * for an Object). Roles are specified by their sets of child users and
     * child roles, all of which are granted any permissions that the parent
     * role has.
     *
     * <p>Roles must have a name (which cannot be changed after creation of the
     * role), and must specify an ACL.</p>
     * An AV.Role is a local representation of a role persisted to the AV
     * cloud.
     * @class AV.Role
     * @param {String} name The name of the Role to create.
     * @param {AV.ACL} acl The ACL for this role.
     */
    constructor: function constructor(name, acl) {
      if (_.isString(name)) {
        AV.Object.prototype.constructor.call(this, null, null);
        this.setName(name);
      } else {
        AV.Object.prototype.constructor.call(this, name, acl);
      }
      if (acl) {
        if (!(acl instanceof AV.ACL)) {
          throw new TypeError('acl must be an instance of AV.ACL');
        } else {
          this.setACL(acl);
        }
      }
    },

    /**
     * Gets the name of the role.  You can alternatively call role.get("name")
     *
     * @return {String} the name of the role.
     */
    getName: function getName() {
      return this.get('name');
    },

    /**
     * Sets the name for a role. This value must be set before the role has
     * been saved to the server, and cannot be set once the role has been
     * saved.
     *
     * <p>
     *   A role's name can only contain alphanumeric characters, _, -, and
     *   spaces.
     * </p>
     *
     * <p>This is equivalent to calling role.set("name", name)</p>
     *
     * @param {String} name The name of the role.
     */
    setName: function setName(name, options) {
      return this.set('name', name, options);
    },

    /**
     * Gets the AV.Relation for the AV.Users that are direct
     * children of this role. These users are granted any privileges that this
     * role has been granted (e.g. read or write access through ACLs). You can
     * add or remove users from the role through this relation.
     *
     * <p>This is equivalent to calling role.relation("users")</p>
     *
     * @return {AV.Relation} the relation for the users belonging to this
     *     role.
     */
    getUsers: function getUsers() {
      return this.relation('users');
    },

    /**
     * Gets the AV.Relation for the AV.Roles that are direct
     * children of this role. These roles' users are granted any privileges that
     * this role has been granted (e.g. read or write access through ACLs). You
     * can add or remove child roles from this role through this relation.
     *
     * <p>This is equivalent to calling role.relation("roles")</p>
     *
     * @return {AV.Relation} the relation for the roles belonging to this
     *     role.
     */
    getRoles: function getRoles() {
      return this.relation('roles');
    },

    /**
     * @ignore
     */
    validate: function validate(attrs, options) {
      if ('name' in attrs && attrs.name !== this.getName()) {
        var newName = attrs.name;
        if (this.id && this.id !== attrs.objectId) {
          // Check to see if the objectId being set matches this.id.
          // This happens during a fetch -- the id is set before calling fetch.
          // Let the name be set in this case.
          return new AVError(AVError.OTHER_CAUSE, "A role's name can only be set before it has been saved.");
        }
        if (!_.isString(newName)) {
          return new AVError(AVError.OTHER_CAUSE, "A role's name must be a String.");
        }
        if (!/^[0-9a-zA-Z\-_ ]+$/.test(newName)) {
          return new AVError(AVError.OTHER_CAUSE, "A role's name can only contain alphanumeric characters, _," + ' -, and spaces.');
        }
      }
      if (AV.Object.prototype.validate) {
        return AV.Object.prototype.validate.call(this, attrs, options);
      }
      return false;
    }
  });
};
}, function(modId) { var map = {"./error":1595492076968}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1595492076985, function(require, module, exports) {


var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require('underscore');
var uuid = require('uuid/v4');
var AVError = require('./error');

var _require = require('./request'),
    AVRequest = _require._request,
    request = _require.request;

var _require2 = require('./adapter'),
    getAdapter = _require2.getAdapter;

var PLATFORM_ANONYMOUS = 'anonymous';
var PLATFORM_QQAPP = 'lc_qqapp';

var mergeUnionDataIntoAuthData = function mergeUnionDataIntoAuthData() {
  var defaultUnionIdPlatform = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'weixin';
  return function (authData, unionId) {
    var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref$unionIdPlatform = _ref.unionIdPlatform,
        unionIdPlatform = _ref$unionIdPlatform === undefined ? defaultUnionIdPlatform : _ref$unionIdPlatform,
        _ref$asMainAccount = _ref.asMainAccount,
        asMainAccount = _ref$asMainAccount === undefined ? false : _ref$asMainAccount;

    if (typeof unionId !== 'string') throw new AVError(AVError.OTHER_CAUSE, 'unionId is not a string');
    if (typeof unionIdPlatform !== 'string') throw new AVError(AVError.OTHER_CAUSE, 'unionIdPlatform is not a string');

    return _.extend({}, authData, {
      platform: unionIdPlatform,
      unionid: unionId,
      main_account: Boolean(asMainAccount)
    });
  };
};

module.exports = function (AV) {
  /**
   * @class
   *
   * <p>An AV.User object is a local representation of a user persisted to the
   * LeanCloud server. This class is a subclass of an AV.Object, and retains the
   * same functionality of an AV.Object, but also extends it with various
   * user specific methods, like authentication, signing up, and validation of
   * uniqueness.</p>
   */
  AV.User = AV.Object.extend('_User',
  /** @lends AV.User.prototype */{
    // Instance Variables
    _isCurrentUser: false,

    // Instance Methods

    /**
     * Internal method to handle special fields in a _User response.
     * @private
     */
    _mergeMagicFields: function _mergeMagicFields(attrs) {
      if (attrs.sessionToken) {
        this._sessionToken = attrs.sessionToken;
        delete attrs.sessionToken;
      }
      return AV.User.__super__._mergeMagicFields.call(this, attrs);
    },

    /**
     * Removes null values from authData (which exist temporarily for
     * unlinking)
     * @private
     */
    _cleanupAuthData: function _cleanupAuthData() {
      if (!this.isCurrent()) {
        return;
      }
      var authData = this.get('authData');
      if (!authData) {
        return;
      }
      AV._objectEach(this.get('authData'), function (value, key) {
        if (!authData[key]) {
          delete authData[key];
        }
      });
    },

    /**
     * Synchronizes authData for all providers.
     * @private
     */
    _synchronizeAllAuthData: function _synchronizeAllAuthData() {
      var authData = this.get('authData');
      if (!authData) {
        return;
      }

      var self = this;
      AV._objectEach(this.get('authData'), function (value, key) {
        self._synchronizeAuthData(key);
      });
    },

    /**
     * Synchronizes auth data for a provider (e.g. puts the access token in the
     * right place to be used by the Facebook SDK).
     * @private
     */
    _synchronizeAuthData: function _synchronizeAuthData(provider) {
      if (!this.isCurrent()) {
        return;
      }
      var authType;
      if (_.isString(provider)) {
        authType = provider;
        provider = AV.User._authProviders[authType];
      } else {
        authType = provider.getAuthType();
      }
      var authData = this.get('authData');
      if (!authData || !provider) {
        return;
      }
      var success = provider.restoreAuthentication(authData[authType]);
      if (!success) {
        this.dissociateAuthData(provider);
      }
    },

    _handleSaveResult: function _handleSaveResult(makeCurrent) {
      // Clean up and synchronize the authData object, removing any unset values
      if (makeCurrent && !AV._config.disableCurrentUser) {
        this._isCurrentUser = true;
      }
      this._cleanupAuthData();
      this._synchronizeAllAuthData();
      // Don't keep the password around.
      delete this._serverData.password;
      this._rebuildEstimatedDataForKey('password');
      this._refreshCache();
      if ((makeCurrent || this.isCurrent()) && !AV._config.disableCurrentUser) {
        // Some old version of leanengine-node-sdk will overwrite
        // AV.User._saveCurrentUser which returns no Promise.
        // So we need a Promise wrapper.
        return _promise2.default.resolve(AV.User._saveCurrentUser(this));
      } else {
        return _promise2.default.resolve();
      }
    },

    /**
     * Unlike in the Android/iOS SDKs, logInWith is unnecessary, since you can
     * call linkWith on the user (even if it doesn't exist yet on the server).
     * @private
     */
    _linkWith: function _linkWith(provider, data) {
      var _this = this;

      var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          _ref2$failOnNotExist = _ref2.failOnNotExist,
          failOnNotExist = _ref2$failOnNotExist === undefined ? false : _ref2$failOnNotExist;

      var authType;
      if (_.isString(provider)) {
        authType = provider;
        provider = AV.User._authProviders[provider];
      } else {
        authType = provider.getAuthType();
      }
      if (data) {
        return this.save({ authData: (0, _defineProperty3.default)({}, authType, data) }, {
          fetchWhenSave: !!this.get('authData'),
          _failOnNotExist: failOnNotExist
        }).then(function (model) {
          return model._handleSaveResult(true).then(function () {
            return model;
          });
        });
      } else {
        return provider.authenticate().then(function (result) {
          return _this._linkWith(provider, result);
        });
      }
    },

    /**
     * Associate the user with a third party authData.
     * @since 3.3.0
     * @param {Object} authData The response json data returned from third party token, maybe like { openid: 'abc123', access_token: '123abc', expires_in: 1382686496 }
     * @param {string} platform Available platform for sign up.
     * @return {Promise<AV.User>} A promise that is fulfilled with the user when completed.
     * @example user.associateWithAuthData({
     *   openid: 'abc123',
     *   access_token: '123abc',
     *   expires_in: 1382686496
     * }, 'weixin').then(function(user) {
     *   //Access user here
     * }).catch(function(error) {
     *   //console.error("error: ", error);
     * });
     */
    associateWithAuthData: function associateWithAuthData(authData, platform) {
      return this._linkWith(platform, authData);
    },


    /**
     * Associate the user with a third party authData and unionId.
     * @since 3.5.0
     * @param {Object} authData The response json data returned from third party token, maybe like { openid: 'abc123', access_token: '123abc', expires_in: 1382686496 }
     * @param {string} platform Available platform for sign up.
     * @param {string} unionId
     * @param {Object} [unionLoginOptions]
     * @param {string} [unionLoginOptions.unionIdPlatform = 'weixin'] unionId platform
     * @param {boolean} [unionLoginOptions.asMainAccount = false] If true, the unionId will be associated with the user.
     * @return {Promise<AV.User>} A promise that is fulfilled with the user when completed.
     * @example user.associateWithAuthDataAndUnionId({
     *   openid: 'abc123',
     *   access_token: '123abc',
     *   expires_in: 1382686496
     * }, 'weixin', 'union123', {
     *   unionIdPlatform: 'weixin',
     *   asMainAccount: true,
     * }).then(function(user) {
     *   //Access user here
     * }).catch(function(error) {
     *   //console.error("error: ", error);
     * });
     */
    associateWithAuthDataAndUnionId: function associateWithAuthDataAndUnionId(authData, platform, unionId, unionOptions) {
      return this._linkWith(platform, mergeUnionDataIntoAuthData()(authData, unionId, unionOptions));
    },


    /**
     * Associate the user with the identity of the current mini-app.
     * @since 4.6.0
     * @param {Object} authInfo
     * @param {Object} [option]
     * @param {Boolean} [option.failOnNotExist] If true, the login request will fail when no user matches this authInfo.authData exists.
     * @return {Promise<AV.User>}
     */
    associateWithMiniApp: function associateWithMiniApp(authInfo, option) {
      var _this2 = this;

      if (authInfo === undefined) {
        var getAuthInfo = getAdapter('getAuthInfo');
        return getAuthInfo().then(function (authInfo) {
          return _this2._linkWith(authInfo.provider, authInfo.authData, option);
        });
      }
      return this._linkWith(authInfo.provider, authInfo.authData, option);
    },


    /**
     * 将用户与 QQ 小程序用户进行关联。适用于为已经在用户系统中存在的用户关联当前使用 QQ 小程序的微信帐号。
     * 仅在 QQ 小程序中可用。
     *
     * @deprecated Please use {@link AV.User#associateWithMiniApp}
     * @since 4.2.0
     * @param {Object} [options]
     * @param {boolean} [options.preferUnionId = false] 如果服务端在登录时获取到了用户的 UnionId，是否将 UnionId 保存在用户账号中。
     * @param {string} [options.unionIdPlatform = 'qq'] (only take effect when preferUnionId) unionId platform
     * @param {boolean} [options.asMainAccount = true] (only take effect when preferUnionId) If true, the unionId will be associated with the user.
     * @return {Promise<AV.User>}
     */
    associateWithQQApp: function associateWithQQApp() {
      var _this3 = this;

      var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref3$preferUnionId = _ref3.preferUnionId,
          preferUnionId = _ref3$preferUnionId === undefined ? false : _ref3$preferUnionId,
          _ref3$unionIdPlatform = _ref3.unionIdPlatform,
          unionIdPlatform = _ref3$unionIdPlatform === undefined ? 'qq' : _ref3$unionIdPlatform,
          _ref3$asMainAccount = _ref3.asMainAccount,
          asMainAccount = _ref3$asMainAccount === undefined ? true : _ref3$asMainAccount;

      var getAuthInfo = getAdapter('getAuthInfo');
      return getAuthInfo({
        preferUnionId: preferUnionId,
        asMainAccount: asMainAccount,
        platform: unionIdPlatform
      }).then(function (authInfo) {
        authInfo.provider = PLATFORM_QQAPP;
        return _this3.associateWithMiniApp(authInfo);
      });
    },


    /**
     * 将用户与微信小程序用户进行关联。适用于为已经在用户系统中存在的用户关联当前使用微信小程序的微信帐号。
     * 仅在微信小程序中可用。
     *
     * @deprecated Please use {@link AV.User#associateWithMiniApp}
     * @since 3.13.0
     * @param {Object} [options]
     * @param {boolean} [options.preferUnionId = false] 当用户满足 {@link https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/union-id.html 获取 UnionId 的条件} 时，是否将 UnionId 保存在用户账号中。
     * @param {string} [options.unionIdPlatform = 'weixin'] (only take effect when preferUnionId) unionId platform
     * @param {boolean} [options.asMainAccount = true] (only take effect when preferUnionId) If true, the unionId will be associated with the user.
     * @return {Promise<AV.User>}
     */
    associateWithWeapp: function associateWithWeapp() {
      var _this4 = this;

      var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref4$preferUnionId = _ref4.preferUnionId,
          preferUnionId = _ref4$preferUnionId === undefined ? false : _ref4$preferUnionId,
          _ref4$unionIdPlatform = _ref4.unionIdPlatform,
          unionIdPlatform = _ref4$unionIdPlatform === undefined ? 'weixin' : _ref4$unionIdPlatform,
          _ref4$asMainAccount = _ref4.asMainAccount,
          asMainAccount = _ref4$asMainAccount === undefined ? true : _ref4$asMainAccount;

      var getAuthInfo = getAdapter('getAuthInfo');
      return getAuthInfo({
        preferUnionId: preferUnionId,
        asMainAccount: asMainAccount,
        platform: unionIdPlatform
      }).then(function (authInfo) {
        return _this4.associateWithMiniApp(authInfo);
      });
    },


    /**
     * @deprecated renamed to {@link AV.User#associateWithWeapp}
     * @return {Promise<AV.User>}
     */
    linkWithWeapp: function linkWithWeapp(options) {
      console.warn('DEPRECATED: User#linkWithWeapp 已废弃，请使用 User#associateWithWeapp 代替');
      return this.associateWithWeapp(options);
    },


    /**
     * 将用户与 QQ 小程序用户进行关联。适用于为已经在用户系统中存在的用户关联当前使用 QQ 小程序的 QQ 帐号。
     * 仅在 QQ 小程序中可用。
     *
     * @deprecated Please use {@link AV.User#associateWithMiniApp}
     * @since 4.2.0
     * @param {string} unionId
     * @param {Object} [unionOptions]
     * @param {string} [unionOptions.unionIdPlatform = 'qq'] unionId platform
     * @param {boolean} [unionOptions.asMainAccount = false] If true, the unionId will be associated with the user.
     * @return {Promise<AV.User>}
     */
    associateWithQQAppWithUnionId: function associateWithQQAppWithUnionId(unionId) {
      var _this5 = this;

      var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref5$unionIdPlatform = _ref5.unionIdPlatform,
          unionIdPlatform = _ref5$unionIdPlatform === undefined ? 'qq' : _ref5$unionIdPlatform,
          _ref5$asMainAccount = _ref5.asMainAccount,
          asMainAccount = _ref5$asMainAccount === undefined ? false : _ref5$asMainAccount;

      var getAuthInfo = getAdapter('getAuthInfo');
      return getAuthInfo({ platform: unionIdPlatform }).then(function (authInfo) {
        authInfo = AV.User.mergeUnionId(authInfo, unionId, { asMainAccount: asMainAccount });
        authInfo.provider = PLATFORM_QQAPP;
        return _this5.associateWithMiniApp(authInfo);
      });
    },


    /**
     * 将用户与微信小程序用户进行关联。适用于为已经在用户系统中存在的用户关联当前使用微信小程序的微信帐号。
     * 仅在微信小程序中可用。
     *
     * @deprecated Please use {@link AV.User#associateWithMiniApp}
     * @since 3.13.0
     * @param {string} unionId
     * @param {Object} [unionOptions]
     * @param {string} [unionOptions.unionIdPlatform = 'weixin'] unionId platform
     * @param {boolean} [unionOptions.asMainAccount = false] If true, the unionId will be associated with the user.
     * @return {Promise<AV.User>}
     */
    associateWithWeappWithUnionId: function associateWithWeappWithUnionId(unionId) {
      var _this6 = this;

      var _ref6 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref6$unionIdPlatform = _ref6.unionIdPlatform,
          unionIdPlatform = _ref6$unionIdPlatform === undefined ? 'weixin' : _ref6$unionIdPlatform,
          _ref6$asMainAccount = _ref6.asMainAccount,
          asMainAccount = _ref6$asMainAccount === undefined ? false : _ref6$asMainAccount;

      var getAuthInfo = getAdapter('getAuthInfo');
      return getAuthInfo({ platform: unionIdPlatform }).then(function (authInfo) {
        authInfo = AV.User.mergeUnionId(authInfo, unionId, { asMainAccount: asMainAccount });
        return _this6.associateWithMiniApp(authInfo);
      });
    },


    /**
     * Unlinks a user from a service.
     * @param {string} platform
     * @return {Promise<AV.User>}
     * @since 3.3.0
     */
    dissociateAuthData: function dissociateAuthData(provider) {
      this.unset('authData.' + provider);
      return this.save().then(function (model) {
        return model._handleSaveResult(true).then(function () {
          return model;
        });
      });
    },


    /**
     * @private
     * @deprecated
     */
    _unlinkFrom: function _unlinkFrom(provider) {
      console.warn('DEPRECATED: User#_unlinkFrom 已废弃，请使用 User#dissociateAuthData 代替');
      return this.dissociateAuthData(provider);
    },


    /**
     * Checks whether a user is linked to a service.
     * @private
     */
    _isLinked: function _isLinked(provider) {
      var authType;
      if (_.isString(provider)) {
        authType = provider;
      } else {
        authType = provider.getAuthType();
      }
      var authData = this.get('authData') || {};
      return !!authData[authType];
    },

    /**
     * Checks whether a user is anonymous.
     * @since 3.9.0
     * @return {boolean}
     */
    isAnonymous: function isAnonymous() {
      return this._isLinked(PLATFORM_ANONYMOUS);
    },


    logOut: function logOut() {
      this._logOutWithAll();
      this._isCurrentUser = false;
    },

    /**
     * Deauthenticates all providers.
     * @private
     */
    _logOutWithAll: function _logOutWithAll() {
      var authData = this.get('authData');
      if (!authData) {
        return;
      }
      var self = this;
      AV._objectEach(this.get('authData'), function (value, key) {
        self._logOutWith(key);
      });
    },

    /**
     * Deauthenticates a single provider (e.g. removing access tokens from the
     * Facebook SDK).
     * @private
     */
    _logOutWith: function _logOutWith(provider) {
      if (!this.isCurrent()) {
        return;
      }
      if (_.isString(provider)) {
        provider = AV.User._authProviders[provider];
      }
      if (provider && provider.deauthenticate) {
        provider.deauthenticate();
      }
    },

    /**
     * Signs up a new user. You should call this instead of save for
     * new AV.Users. This will create a new AV.User on the server, and
     * also persist the session on disk so that you can access the user using
     * <code>current</code>.
     *
     * <p>A username and password must be set before calling signUp.</p>
     *
     * @param {Object} attrs Extra fields to set on the new user, or null.
     * @param {AuthOptions} options
     * @return {Promise} A promise that is fulfilled when the signup
     *     finishes.
     * @see AV.User.signUp
     */
    signUp: function signUp(attrs, options) {
      var error;

      var username = attrs && attrs.username || this.get('username');
      if (!username || username === '') {
        error = new AVError(AVError.OTHER_CAUSE, 'Cannot sign up user with an empty name.');
        throw error;
      }

      var password = attrs && attrs.password || this.get('password');
      if (!password || password === '') {
        error = new AVError(AVError.OTHER_CAUSE, 'Cannot sign up user with an empty password.');
        throw error;
      }

      return this.save(attrs, options).then(function (model) {
        if (model.isAnonymous()) {
          model.unset('authData.' + PLATFORM_ANONYMOUS);
          model._opSetQueue = [{}];
        }
        return model._handleSaveResult(true).then(function () {
          return model;
        });
      });
    },

    /**
     * Signs up a new user with mobile phone and sms code.
     * You should call this instead of save for
     * new AV.Users. This will create a new AV.User on the server, and
     * also persist the session on disk so that you can access the user using
     * <code>current</code>.
     *
     * <p>A username and password must be set before calling signUp.</p>
     *
     * @param {Object} attrs Extra fields to set on the new user, or null.
     * @param {AuthOptions} options
     * @return {Promise} A promise that is fulfilled when the signup
     *     finishes.
     * @see AV.User.signUpOrlogInWithMobilePhone
     * @see AV.Cloud.requestSmsCode
     */
    signUpOrlogInWithMobilePhone: function signUpOrlogInWithMobilePhone(attrs) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var error;

      var mobilePhoneNumber = attrs && attrs.mobilePhoneNumber || this.get('mobilePhoneNumber');
      if (!mobilePhoneNumber || mobilePhoneNumber === '') {
        error = new AVError(AVError.OTHER_CAUSE, 'Cannot sign up or login user by mobilePhoneNumber ' + 'with an empty mobilePhoneNumber.');
        throw error;
      }

      var smsCode = attrs && attrs.smsCode || this.get('smsCode');
      if (!smsCode || smsCode === '') {
        error = new AVError(AVError.OTHER_CAUSE, 'Cannot sign up or login user by mobilePhoneNumber  ' + 'with an empty smsCode.');
        throw error;
      }

      options._makeRequest = function (route, className, id, method, json) {
        return AVRequest('usersByMobilePhone', null, null, 'POST', json);
      };
      return this.save(attrs, options).then(function (model) {
        delete model.attributes.smsCode;
        delete model._serverData.smsCode;
        return model._handleSaveResult(true).then(function () {
          return model;
        });
      });
    },

    /**
     * The same with {@link AV.User.loginWithAuthData}, except that you can set attributes before login.
     * @since 3.7.0
     */
    loginWithAuthData: function loginWithAuthData(authData, platform, options) {
      return this._linkWith(platform, authData, options);
    },


    /**
     * The same with {@link AV.User.loginWithAuthDataAndUnionId}, except that you can set attributes before login.
     * @since 3.7.0
     */
    loginWithAuthDataAndUnionId: function loginWithAuthDataAndUnionId(authData, platform, unionId, unionLoginOptions) {
      return this.loginWithAuthData(mergeUnionDataIntoAuthData()(authData, unionId, unionLoginOptions), platform, unionLoginOptions);
    },


    /**
     * The same with {@link AV.User.loginWithWeapp}, except that you can set attributes before login.
     * @deprecated please use {@link AV.User#loginWithMiniApp}
     * @since 3.7.0
     * @param {Object} [options]
     * @param {boolean} [options.failOnNotExist] If true, the login request will fail when no user matches this authData exists.
     * @param {boolean} [options.preferUnionId] 当用户满足 {@link https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/union-id.html 获取 UnionId 的条件} 时，是否使用 UnionId 登录。（since 3.13.0）
     * @param {string} [options.unionIdPlatform = 'weixin'] (only take effect when preferUnionId) unionId platform
     * @param {boolean} [options.asMainAccount = true] (only take effect when preferUnionId) If true, the unionId will be associated with the user.
     * @return {Promise<AV.User>}
     */
    loginWithWeapp: function loginWithWeapp() {
      var _this7 = this;

      var _ref7 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref7$preferUnionId = _ref7.preferUnionId,
          preferUnionId = _ref7$preferUnionId === undefined ? false : _ref7$preferUnionId,
          _ref7$unionIdPlatform = _ref7.unionIdPlatform,
          unionIdPlatform = _ref7$unionIdPlatform === undefined ? 'weixin' : _ref7$unionIdPlatform,
          _ref7$asMainAccount = _ref7.asMainAccount,
          asMainAccount = _ref7$asMainAccount === undefined ? true : _ref7$asMainAccount,
          _ref7$failOnNotExist = _ref7.failOnNotExist,
          failOnNotExist = _ref7$failOnNotExist === undefined ? false : _ref7$failOnNotExist;

      var getAuthInfo = getAdapter('getAuthInfo');
      return getAuthInfo({
        preferUnionId: preferUnionId,
        asMainAccount: asMainAccount,
        platform: unionIdPlatform
      }).then(function (authInfo) {
        return _this7.loginWithMiniApp(authInfo, { failOnNotExist: failOnNotExist });
      });
    },


    /**
     * The same with {@link AV.User.loginWithWeappWithUnionId}, except that you can set attributes before login.
     * @deprecated please use {@link AV.User#loginWithMiniApp}
     * @since 3.13.0
     */
    loginWithWeappWithUnionId: function loginWithWeappWithUnionId(unionId) {
      var _this8 = this;

      var _ref8 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref8$unionIdPlatform = _ref8.unionIdPlatform,
          unionIdPlatform = _ref8$unionIdPlatform === undefined ? 'weixin' : _ref8$unionIdPlatform,
          _ref8$asMainAccount = _ref8.asMainAccount,
          asMainAccount = _ref8$asMainAccount === undefined ? false : _ref8$asMainAccount,
          _ref8$failOnNotExist = _ref8.failOnNotExist,
          failOnNotExist = _ref8$failOnNotExist === undefined ? false : _ref8$failOnNotExist;

      var getAuthInfo = getAdapter('getAuthInfo');
      return getAuthInfo({ platform: unionIdPlatform }).then(function (authInfo) {
        authInfo = AV.User.mergeUnionId(authInfo, unionId, { asMainAccount: asMainAccount });
        return _this8.loginWithMiniApp(authInfo, { failOnNotExist: failOnNotExist });
      });
    },


    /**
     * The same with {@link AV.User.loginWithQQApp}, except that you can set attributes before login.
     * @deprecated please use {@link AV.User#loginWithMiniApp}
     * @since 4.2.0
     * @param {Object} [options]
     * @param {boolean} [options.failOnNotExist] If true, the login request will fail when no user matches this authData exists.
     * @param {boolean} [options.preferUnionId] 如果服务端在登录时获取到了用户的 UnionId，是否将 UnionId 保存在用户账号中。
     * @param {string} [options.unionIdPlatform = 'qq'] (only take effect when preferUnionId) unionId platform
     * @param {boolean} [options.asMainAccount = true] (only take effect when preferUnionId) If true, the unionId will be associated with the user.
     */
    loginWithQQApp: function loginWithQQApp() {
      var _this9 = this;

      var _ref9 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref9$preferUnionId = _ref9.preferUnionId,
          preferUnionId = _ref9$preferUnionId === undefined ? false : _ref9$preferUnionId,
          _ref9$unionIdPlatform = _ref9.unionIdPlatform,
          unionIdPlatform = _ref9$unionIdPlatform === undefined ? 'qq' : _ref9$unionIdPlatform,
          _ref9$asMainAccount = _ref9.asMainAccount,
          asMainAccount = _ref9$asMainAccount === undefined ? true : _ref9$asMainAccount,
          _ref9$failOnNotExist = _ref9.failOnNotExist,
          failOnNotExist = _ref9$failOnNotExist === undefined ? false : _ref9$failOnNotExist;

      var getAuthInfo = getAdapter('getAuthInfo');
      return getAuthInfo({
        preferUnionId: preferUnionId,
        asMainAccount: asMainAccount,
        platform: unionIdPlatform
      }).then(function (authInfo) {
        authInfo.provider = PLATFORM_QQAPP;
        return _this9.loginWithMiniApp(authInfo, { failOnNotExist: failOnNotExist });
      });
    },


    /**
     * The same with {@link AV.User.loginWithQQAppWithUnionId}, except that you can set attributes before login.
     * @deprecated please use {@link AV.User#loginWithMiniApp}
     * @since 4.2.0
     */
    loginWithQQAppWithUnionId: function loginWithQQAppWithUnionId(unionId) {
      var _this10 = this;

      var _ref10 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref10$unionIdPlatfor = _ref10.unionIdPlatform,
          unionIdPlatform = _ref10$unionIdPlatfor === undefined ? 'qq' : _ref10$unionIdPlatfor,
          _ref10$asMainAccount = _ref10.asMainAccount,
          asMainAccount = _ref10$asMainAccount === undefined ? false : _ref10$asMainAccount,
          _ref10$failOnNotExist = _ref10.failOnNotExist,
          failOnNotExist = _ref10$failOnNotExist === undefined ? false : _ref10$failOnNotExist;

      var getAuthInfo = getAdapter('getAuthInfo');
      return getAuthInfo({ platform: unionIdPlatform }).then(function (authInfo) {
        authInfo = AV.User.mergeUnionId(authInfo, unionId, { asMainAccount: asMainAccount });
        authInfo.provider = PLATFORM_QQAPP;
        return _this10.loginWithMiniApp(authInfo, { failOnNotExist: failOnNotExist });
      });
    },


    /**
     * The same with {@link AV.User.loginWithMiniApp}, except that you can set attributes before login.
     * @since 4.6.0
     */
    loginWithMiniApp: function loginWithMiniApp(authInfo, option) {
      var _this11 = this;

      if (authInfo === undefined) {
        var getAuthInfo = getAdapter('getAuthInfo');
        return getAuthInfo().then(function (authInfo) {
          return _this11.loginWithAuthData(authInfo.authData, authInfo.provider, option);
        });
      }
      return this.loginWithAuthData(authInfo.authData, authInfo.provider, option);
    },


    /**
     * Logs in a AV.User. On success, this saves the session to localStorage,
     * so you can retrieve the currently logged in user using
     * <code>current</code>.
     *
     * <p>A username and password must be set before calling logIn.</p>
     *
     * @see AV.User.logIn
     * @return {Promise} A promise that is fulfilled with the user when
     *     the login is complete.
     */
    logIn: function logIn() {
      var model = this;
      var request = AVRequest('login', null, null, 'POST', this.toJSON());
      return request.then(function (resp) {
        var serverAttrs = model.parse(resp);
        model._finishFetch(serverAttrs);
        return model._handleSaveResult(true).then(function () {
          if (!serverAttrs.smsCode) delete model.attributes['smsCode'];
          return model;
        });
      });
    },
    /**
     * @see AV.Object#save
     */
    save: function save(arg1, arg2, arg3) {
      var attrs, options;
      if (_.isObject(arg1) || _.isNull(arg1) || _.isUndefined(arg1)) {
        attrs = arg1;
        options = arg2;
      } else {
        attrs = {};
        attrs[arg1] = arg2;
        options = arg3;
      }
      options = options || {};

      return AV.Object.prototype.save.call(this, attrs, options).then(function (model) {
        return model._handleSaveResult(false).then(function () {
          return model;
        });
      });
    },

    /**
     * Follow a user
     * @since 0.3.0
     * @param {Object | AV.User | String} options if an AV.User or string is given, it will be used as the target user.
     * @param {AV.User | String} options.user The target user or user's objectId to follow.
     * @param {Object} [options.attributes] key-value attributes dictionary to be used as
     *  conditions of followerQuery/followeeQuery.
     * @param {AuthOptions} [authOptions]
     */
    follow: function follow(options, authOptions) {
      if (!this.id) {
        throw new Error('Please signin.');
      }
      var user = void 0;
      var attributes = void 0;
      if (options.user) {
        user = options.user;
        attributes = options.attributes;
      } else {
        user = options;
      }
      var userObjectId = _.isString(user) ? user : user.id;
      if (!userObjectId) {
        throw new Error('Invalid target user.');
      }
      var route = 'users/' + this.id + '/friendship/' + userObjectId;
      var request = AVRequest(route, null, null, 'POST', AV._encode(attributes), authOptions);
      return request;
    },

    /**
     * Unfollow a user.
     * @since 0.3.0
     * @param {Object | AV.User | String} options if an AV.User or string is given, it will be used as the target user.
     * @param {AV.User | String} options.user The target user or user's objectId to unfollow.
     * @param {AuthOptions} [authOptions]
     */
    unfollow: function unfollow(options, authOptions) {
      if (!this.id) {
        throw new Error('Please signin.');
      }
      var user = void 0;
      if (options.user) {
        user = options.user;
      } else {
        user = options;
      }
      var userObjectId = _.isString(user) ? user : user.id;
      if (!userObjectId) {
        throw new Error('Invalid target user.');
      }
      var route = 'users/' + this.id + '/friendship/' + userObjectId;
      var request = AVRequest(route, null, null, 'DELETE', null, authOptions);
      return request;
    },

    /**
     *Create a follower query to query the user's followers.
     * @since 0.3.0
     * @see AV.User#followerQuery
     */
    followerQuery: function followerQuery() {
      return AV.User.followerQuery(this.id);
    },

    /**
     *Create a followee query to query the user's followees.
     * @since 0.3.0
     * @see AV.User#followeeQuery
     */
    followeeQuery: function followeeQuery() {
      return AV.User.followeeQuery(this.id);
    },

    /**
     * @see AV.Object#fetch
     */
    fetch: function fetch(fetchOptions, options) {
      return AV.Object.prototype.fetch.call(this, fetchOptions, options).then(function (model) {
        return model._handleSaveResult(false).then(function () {
          return model;
        });
      });
    },

    /**
     * Update user's new password safely based on old password.
     * @param {String} oldPassword the old password.
     * @param {String} newPassword the new password.
     * @param {AuthOptions} options
     */
    updatePassword: function updatePassword(oldPassword, newPassword, options) {
      var _this12 = this;

      var route = 'users/' + this.id + '/updatePassword';
      var params = {
        old_password: oldPassword,
        new_password: newPassword
      };
      var request = AVRequest(route, null, null, 'PUT', params, options);
      return request.then(function (resp) {
        _this12._finishFetch(_this12.parse(resp));
        return _this12._handleSaveResult(true).then(function () {
          return resp;
        });
      });
    },

    /**
     * Returns true if <code>current</code> would return this user.
     * @see AV.User#current
     */
    isCurrent: function isCurrent() {
      return this._isCurrentUser;
    },

    /**
     * Returns get("username").
     * @return {String}
     * @see AV.Object#get
     */
    getUsername: function getUsername() {
      return this.get('username');
    },

    /**
     * Returns get("mobilePhoneNumber").
     * @return {String}
     * @see AV.Object#get
     */
    getMobilePhoneNumber: function getMobilePhoneNumber() {
      return this.get('mobilePhoneNumber');
    },

    /**
     * Calls set("mobilePhoneNumber", phoneNumber, options) and returns the result.
     * @param {String} mobilePhoneNumber
     * @return {Boolean}
     * @see AV.Object#set
     */
    setMobilePhoneNumber: function setMobilePhoneNumber(phone, options) {
      return this.set('mobilePhoneNumber', phone, options);
    },

    /**
     * Calls set("username", username, options) and returns the result.
     * @param {String} username
     * @return {Boolean}
     * @see AV.Object#set
     */
    setUsername: function setUsername(username, options) {
      return this.set('username', username, options);
    },

    /**
     * Calls set("password", password, options) and returns the result.
     * @param {String} password
     * @return {Boolean}
     * @see AV.Object#set
     */
    setPassword: function setPassword(password, options) {
      return this.set('password', password, options);
    },

    /**
     * Returns get("email").
     * @return {String}
     * @see AV.Object#get
     */
    getEmail: function getEmail() {
      return this.get('email');
    },

    /**
     * Calls set("email", email, options) and returns the result.
     * @param {String} email
     * @param {AuthOptions} options
     * @return {Boolean}
     * @see AV.Object#set
     */
    setEmail: function setEmail(email, options) {
      return this.set('email', email, options);
    },

    /**
     * Checks whether this user is the current user and has been authenticated.
     * @deprecated 如果要判断当前用户的登录状态是否有效，请使用 currentUser.isAuthenticated().then()，
     * 如果要判断该用户是否是当前登录用户，请使用 user.id === currentUser.id
     * @return (Boolean) whether this user is the current user and is logged in.
     */
    authenticated: function authenticated() {
      console.warn('DEPRECATED: 如果要判断当前用户的登录状态是否有效，请使用 currentUser.isAuthenticated().then()，如果要判断该用户是否是当前登录用户，请使用 user.id === currentUser.id。');
      return !!this._sessionToken && !AV._config.disableCurrentUser && AV.User.current() && AV.User.current().id === this.id;
    },

    /**
     * 检查该用户的登录状态是否有效，请注意该方法会校验 sessionToken 的有效性，是个异步方法。
     *
     * @since 2.0.0
     * @return Promise.<Boolean>
     */
    isAuthenticated: function isAuthenticated() {
      var _this13 = this;

      return _promise2.default.resolve().then(function () {
        return !!_this13._sessionToken && AV.User._fetchUserBySessionToken(_this13._sessionToken).then(function () {
          return true;
        }, function (error) {
          if (error.code === 211) {
            return false;
          }
          throw error;
        });
      });
    },


    /**
     * Get sessionToken of current user.
     * @return {String} sessionToken
     */
    getSessionToken: function getSessionToken() {
      return this._sessionToken;
    },


    /**
     * Refresh sessionToken of current user.
     * @since 2.1.0
     * @param {AuthOptions} [options]
     * @return {Promise.<AV.User>} user with refreshed sessionToken
     */
    refreshSessionToken: function refreshSessionToken(options) {
      var _this14 = this;

      return AVRequest('users/' + this.id + '/refreshSessionToken', null, null, 'PUT', null, options).then(function (response) {
        _this14._finishFetch(response);
        return _this14._handleSaveResult(true).then(function () {
          return _this14;
        });
      });
    },


    /**
     * Get this user's Roles.
     * @param {AuthOptions} [options]
     * @return {Promise.<AV.Role[]>} A promise that is fulfilled with the roles when
     *     the query is complete.
     */
    getRoles: function getRoles(options) {
      return AV.Relation.reverseQuery('_Role', 'users', this).find(options);
    }
  },
  /** @lends AV.User */{
    // Class Variables

    // The currently logged-in user.
    _currentUser: null,

    // Whether currentUser is known to match the serialized version on disk.
    // This is useful for saving a localstorage check if you try to load
    // _currentUser frequently while there is none stored.
    _currentUserMatchesDisk: false,

    // The localStorage key suffix that the current user is stored under.
    _CURRENT_USER_KEY: 'currentUser',

    // The mapping of auth provider names to actual providers
    _authProviders: {},

    // Class Methods

    /**
     * Signs up a new user with a username (or email) and password.
     * This will create a new AV.User on the server, and also persist the
     * session in localStorage so that you can access the user using
     * {@link #current}.
     *
     * @param {String} username The username (or email) to sign up with.
     * @param {String} password The password to sign up with.
     * @param {Object} [attrs] Extra fields to set on the new user.
     * @param {AuthOptions} [options]
     * @return {Promise} A promise that is fulfilled with the user when
     *     the signup completes.
     * @see AV.User#signUp
     */
    signUp: function signUp(username, password, attrs, options) {
      attrs = attrs || {};
      attrs.username = username;
      attrs.password = password;
      var user = AV.Object._create('_User');
      return user.signUp(attrs, options);
    },

    /**
     * Logs in a user with a username (or email) and password. On success, this
     * saves the session to disk, so you can retrieve the currently logged in
     * user using <code>current</code>.
     *
     * @param {String} username The username (or email) to log in with.
     * @param {String} password The password to log in with.
     * @return {Promise} A promise that is fulfilled with the user when
     *     the login completes.
     * @see AV.User#logIn
     */
    logIn: function logIn(username, password) {
      var user = AV.Object._create('_User');
      user._finishFetch({ username: username, password: password });
      return user.logIn();
    },

    /**
     * Logs in a user with a session token. On success, this saves the session
     * to disk, so you can retrieve the currently logged in user using
     * <code>current</code>.
     *
     * @param {String} sessionToken The sessionToken to log in with.
     * @return {Promise} A promise that is fulfilled with the user when
     *     the login completes.
     */
    become: function become(sessionToken) {
      return this._fetchUserBySessionToken(sessionToken).then(function (user) {
        return user._handleSaveResult(true).then(function () {
          return user;
        });
      });
    },

    _fetchUserBySessionToken: function _fetchUserBySessionToken(sessionToken) {
      if (sessionToken === undefined) {
        return _promise2.default.reject(new Error('The sessionToken cannot be undefined'));
      }

      var user = AV.Object._create('_User');
      return request({
        method: 'GET',
        path: '/users/me',
        authOptions: {
          sessionToken: sessionToken
        }
      }).then(function (resp) {
        var serverAttrs = user.parse(resp);
        user._finishFetch(serverAttrs);
        return user;
      });
    },

    /**
     * Logs in a user with a mobile phone number and sms code sent by
     * AV.User.requestLoginSmsCode.On success, this
     * saves the session to disk, so you can retrieve the currently logged in
     * user using <code>current</code>.
     *
     * @param {String} mobilePhone The user's mobilePhoneNumber
     * @param {String} smsCode The sms code sent by AV.User.requestLoginSmsCode
     * @return {Promise} A promise that is fulfilled with the user when
     *     the login completes.
     * @see AV.User#logIn
     */
    logInWithMobilePhoneSmsCode: function logInWithMobilePhoneSmsCode(mobilePhone, smsCode) {
      var user = AV.Object._create('_User');
      user._finishFetch({ mobilePhoneNumber: mobilePhone, smsCode: smsCode });
      return user.logIn();
    },

    /**
     * Sign up or logs in a user with a mobilePhoneNumber and smsCode.
     * On success, this saves the session to disk, so you can retrieve the currently
     * logged in user using <code>current</code>.
     *
     * @param {String} mobilePhoneNumber The user's mobilePhoneNumber.
     * @param {String} smsCode The sms code sent by AV.Cloud.requestSmsCode
     * @param {Object} attributes  The user's other attributes such as username etc.
     * @param {AuthOptions} options
     * @return {Promise} A promise that is fulfilled with the user when
     *     the login completes.
     * @see AV.User#signUpOrlogInWithMobilePhone
     * @see AV.Cloud.requestSmsCode
     */
    signUpOrlogInWithMobilePhone: function signUpOrlogInWithMobilePhone(mobilePhoneNumber, smsCode, attrs, options) {
      attrs = attrs || {};
      attrs.mobilePhoneNumber = mobilePhoneNumber;
      attrs.smsCode = smsCode;
      var user = AV.Object._create('_User');
      return user.signUpOrlogInWithMobilePhone(attrs, options);
    },

    /**
     * Logs in a user with a mobile phone number and password. On success, this
     * saves the session to disk, so you can retrieve the currently logged in
     * user using <code>current</code>.
     *
     * @param {String} mobilePhone The user's mobilePhoneNumber
     * @param {String} password The password to log in with.
     * @return {Promise} A promise that is fulfilled with the user when
     *     the login completes.
     * @see AV.User#logIn
     */
    logInWithMobilePhone: function logInWithMobilePhone(mobilePhone, password) {
      var user = AV.Object._create('_User');
      user._finishFetch({
        mobilePhoneNumber: mobilePhone,
        password: password
      });
      return user.logIn();
    },

    /**
     * Logs in a user with email and password.
     *
     * @since 3.13.0
     * @param {String} email The user's email.
     * @param {String} password The password to log in with.
     * @return {Promise} A promise that is fulfilled with the user when
     *     the login completes.
     */
    loginWithEmail: function loginWithEmail(email, password) {
      var user = AV.Object._create('_User');
      user._finishFetch({
        email: email,
        password: password
      });
      return user.logIn();
    },


    /**
     * Sign up or logs in a user with a third party auth data(AccessToken).
     * On success, this saves the session to disk, so you can retrieve the currently
     * logged in user using <code>current</code>.
     *
     * @since 3.7.0
     * @param {Object} authData The response json data returned from third party token, maybe like { openid: 'abc123', access_token: '123abc', expires_in: 1382686496 }
     * @param {string} platform Available platform for sign up.
     * @param {Object} [options]
     * @param {boolean} [options.failOnNotExist] If true, the login request will fail when no user matches this authData exists.
     * @return {Promise} A promise that is fulfilled with the user when
     *     the login completes.
     * @example AV.User.loginWithAuthData({
     *   openid: 'abc123',
     *   access_token: '123abc',
     *   expires_in: 1382686496
     * }, 'weixin').then(function(user) {
     *   //Access user here
     * }).catch(function(error) {
     *   //console.error("error: ", error);
     * });
     * @see {@link https://leancloud.cn/docs/js_guide.html#绑定第三方平台账户}
     */
    loginWithAuthData: function loginWithAuthData(authData, platform, options) {
      return AV.User._logInWith(platform, authData, options);
    },


    /**
     * @deprecated renamed to {@link AV.User.loginWithAuthData}
     */
    signUpOrlogInWithAuthData: function signUpOrlogInWithAuthData() {
      console.warn('DEPRECATED: User.signUpOrlogInWithAuthData 已废弃，请使用 User#loginWithAuthData 代替');
      return this.loginWithAuthData.apply(this, arguments);
    },


    /**
     * Sign up or logs in a user with a third party authData and unionId.
     * @since 3.7.0
     * @param {Object} authData The response json data returned from third party token, maybe like { openid: 'abc123', access_token: '123abc', expires_in: 1382686496 }
     * @param {string} platform Available platform for sign up.
     * @param {string} unionId
     * @param {Object} [unionLoginOptions]
     * @param {string} [unionLoginOptions.unionIdPlatform = 'weixin'] unionId platform
     * @param {boolean} [unionLoginOptions.asMainAccount = false] If true, the unionId will be associated with the user.
     * @param {boolean} [unionLoginOptions.failOnNotExist] If true, the login request will fail when no user matches this authData exists.
     * @return {Promise<AV.User>} A promise that is fulfilled with the user when completed.
     * @example AV.User.loginWithAuthDataAndUnionId({
     *   openid: 'abc123',
     *   access_token: '123abc',
     *   expires_in: 1382686496
     * }, 'weixin', 'union123', {
     *   unionIdPlatform: 'weixin',
     *   asMainAccount: true,
     * }).then(function(user) {
     *   //Access user here
     * }).catch(function(error) {
     *   //console.error("error: ", error);
     * });
     */
    loginWithAuthDataAndUnionId: function loginWithAuthDataAndUnionId(authData, platform, unionId, unionLoginOptions) {
      return this.loginWithAuthData(mergeUnionDataIntoAuthData()(authData, unionId, unionLoginOptions), platform, unionLoginOptions);
    },


    /**
     * @deprecated renamed to {@link AV.User.loginWithAuthDataAndUnionId}
     * @since 3.5.0
     */
    signUpOrlogInWithAuthDataAndUnionId: function signUpOrlogInWithAuthDataAndUnionId() {
      console.warn('DEPRECATED: User.signUpOrlogInWithAuthDataAndUnionId 已废弃，请使用 User#loginWithAuthDataAndUnionId 代替');
      return this.loginWithAuthDataAndUnionId.apply(this, arguments);
    },


    /**
     * Merge unionId into authInfo.
     * @since 4.6.0
     * @param {Object} authInfo
     * @param {String} unionId
     * @param {Object} [unionIdOption]
     * @param {Boolean} [unionIdOption.asMainAccount] If true, the unionId will be associated with the user.
     */
    mergeUnionId: function mergeUnionId(authInfo, unionId) {
      var _ref11 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          _ref11$asMainAccount = _ref11.asMainAccount,
          asMainAccount = _ref11$asMainAccount === undefined ? false : _ref11$asMainAccount;

      authInfo = JSON.parse((0, _stringify2.default)(authInfo));
      var _authInfo = authInfo,
          authData = _authInfo.authData,
          platform = _authInfo.platform;

      authData.platform = platform;
      authData.main_account = asMainAccount;
      authData.unionid = unionId;
      return authInfo;
    },


    /**
     * 使用当前使用微信小程序的微信用户身份注册或登录，成功后用户的 session 会在设备上持久化保存，之后可以使用 AV.User.current() 获取当前登录用户。
     * 仅在微信小程序中可用。
     *
     * @deprecated please use {@link AV.User.loginWithMiniApp}
     * @since 2.0.0
     * @param {Object} [options]
     * @param {boolean} [options.preferUnionId] 当用户满足 {@link https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/union-id.html 获取 UnionId 的条件} 时，是否使用 UnionId 登录。（since 3.13.0）
     * @param {string} [options.unionIdPlatform = 'weixin'] (only take effect when preferUnionId) unionId platform
     * @param {boolean} [options.asMainAccount = true] (only take effect when preferUnionId) If true, the unionId will be associated with the user.
     * @param {boolean} [options.failOnNotExist] If true, the login request will fail when no user matches this authData exists. (since v3.7.0)
     * @return {Promise.<AV.User>}
     */
    loginWithWeapp: function loginWithWeapp() {
      var _this15 = this;

      var _ref12 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref12$preferUnionId = _ref12.preferUnionId,
          preferUnionId = _ref12$preferUnionId === undefined ? false : _ref12$preferUnionId,
          _ref12$unionIdPlatfor = _ref12.unionIdPlatform,
          unionIdPlatform = _ref12$unionIdPlatfor === undefined ? 'weixin' : _ref12$unionIdPlatfor,
          _ref12$asMainAccount = _ref12.asMainAccount,
          asMainAccount = _ref12$asMainAccount === undefined ? true : _ref12$asMainAccount,
          _ref12$failOnNotExist = _ref12.failOnNotExist,
          failOnNotExist = _ref12$failOnNotExist === undefined ? false : _ref12$failOnNotExist;

      var getAuthInfo = getAdapter('getAuthInfo');
      return getAuthInfo({
        preferUnionId: preferUnionId,
        asMainAccount: asMainAccount,
        platform: unionIdPlatform
      }).then(function (authInfo) {
        return _this15.loginWithMiniApp(authInfo, { failOnNotExist: failOnNotExist });
      });
    },


    /**
     * 使用当前使用微信小程序的微信用户身份注册或登录，
     * 仅在微信小程序中可用。
     *
     * @deprecated please use {@link AV.User.loginWithMiniApp}
     * @since 3.13.0
     * @param {Object} [unionLoginOptions]
     * @param {string} [unionLoginOptions.unionIdPlatform = 'weixin'] unionId platform
     * @param {boolean} [unionLoginOptions.asMainAccount = false] If true, the unionId will be associated with the user.
     * @param {boolean} [unionLoginOptions.failOnNotExist] If true, the login request will fail when no user matches this authData exists.       * @return {Promise.<AV.User>}
     */
    loginWithWeappWithUnionId: function loginWithWeappWithUnionId(unionId) {
      var _this16 = this;

      var _ref13 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref13$unionIdPlatfor = _ref13.unionIdPlatform,
          unionIdPlatform = _ref13$unionIdPlatfor === undefined ? 'weixin' : _ref13$unionIdPlatfor,
          _ref13$asMainAccount = _ref13.asMainAccount,
          asMainAccount = _ref13$asMainAccount === undefined ? false : _ref13$asMainAccount,
          _ref13$failOnNotExist = _ref13.failOnNotExist,
          failOnNotExist = _ref13$failOnNotExist === undefined ? false : _ref13$failOnNotExist;

      var getAuthInfo = getAdapter('getAuthInfo');
      return getAuthInfo({ platform: unionIdPlatform }).then(function (authInfo) {
        authInfo = AV.User.mergeUnionId(authInfo, unionId, { asMainAccount: asMainAccount });
        return _this16.loginWithMiniApp(authInfo, { failOnNotExist: failOnNotExist });
      });
    },


    /**
     * 使用当前使用 QQ 小程序的 QQ 用户身份注册或登录，成功后用户的 session 会在设备上持久化保存，之后可以使用 AV.User.current() 获取当前登录用户。
     * 仅在 QQ 小程序中可用。
     *
     * @deprecated please use {@link AV.User.loginWithMiniApp}
     * @since 4.2.0
     * @param {Object} [options]
     * @param {boolean} [options.preferUnionId] 如果服务端在登录时获取到了用户的 UnionId，是否将 UnionId 保存在用户账号中。
     * @param {string} [options.unionIdPlatform = 'qq'] (only take effect when preferUnionId) unionId platform
     * @param {boolean} [options.asMainAccount = true] (only take effect when preferUnionId) If true, the unionId will be associated with the user.
     * @param {boolean} [options.failOnNotExist] If true, the login request will fail when no user matches this authData exists. (since v3.7.0)
     * @return {Promise.<AV.User>}
     */
    loginWithQQApp: function loginWithQQApp() {
      var _this17 = this;

      var _ref14 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref14$preferUnionId = _ref14.preferUnionId,
          preferUnionId = _ref14$preferUnionId === undefined ? false : _ref14$preferUnionId,
          _ref14$unionIdPlatfor = _ref14.unionIdPlatform,
          unionIdPlatform = _ref14$unionIdPlatfor === undefined ? 'qq' : _ref14$unionIdPlatfor,
          _ref14$asMainAccount = _ref14.asMainAccount,
          asMainAccount = _ref14$asMainAccount === undefined ? true : _ref14$asMainAccount,
          _ref14$failOnNotExist = _ref14.failOnNotExist,
          failOnNotExist = _ref14$failOnNotExist === undefined ? false : _ref14$failOnNotExist;

      var getAuthInfo = getAdapter('getAuthInfo');
      return getAuthInfo({
        preferUnionId: preferUnionId,
        asMainAccount: asMainAccount,
        platform: unionIdPlatform
      }).then(function (authInfo) {
        authInfo.provider = PLATFORM_QQAPP;
        return _this17.loginWithMiniApp(authInfo, { failOnNotExist: failOnNotExist });
      });
    },


    /**
     * 使用当前使用 QQ 小程序的 QQ 用户身份注册或登录，
     * 仅在 QQ 小程序中可用。
     *
     * @deprecated please use {@link AV.User.loginWithMiniApp}
     * @since 4.2.0
     * @param {Object} [unionLoginOptions]
     * @param {string} [unionLoginOptions.unionIdPlatform = 'qq'] unionId platform
     * @param {boolean} [unionLoginOptions.asMainAccount = false] If true, the unionId will be associated with the user.
     * @param {boolean} [unionLoginOptions.failOnNotExist] If true, the login request will fail when no user matches this authData exists.
     * @return {Promise.<AV.User>}
     */
    loginWithQQAppWithUnionId: function loginWithQQAppWithUnionId(unionId) {
      var _this18 = this;

      var _ref15 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref15$unionIdPlatfor = _ref15.unionIdPlatform,
          unionIdPlatform = _ref15$unionIdPlatfor === undefined ? 'qq' : _ref15$unionIdPlatfor,
          _ref15$asMainAccount = _ref15.asMainAccount,
          asMainAccount = _ref15$asMainAccount === undefined ? false : _ref15$asMainAccount,
          _ref15$failOnNotExist = _ref15.failOnNotExist,
          failOnNotExist = _ref15$failOnNotExist === undefined ? false : _ref15$failOnNotExist;

      var getAuthInfo = getAdapter('getAuthInfo');
      return getAuthInfo({ platform: unionIdPlatform }).then(function (authInfo) {
        authInfo = AV.User.mergeUnionId(authInfo, unionId, { asMainAccount: asMainAccount });
        authInfo.provider = PLATFORM_QQAPP;
        return _this18.loginWithMiniApp(authInfo, { failOnNotExist: failOnNotExist });
      });
    },


    /**
     * Register or login using the identity of the current mini-app.
     * @param {Object} authInfo
     * @param {Object} [option]
     * @param {Boolean} [option.failOnNotExist] If true, the login request will fail when no user matches this authInfo.authData exists.
     */
    loginWithMiniApp: function loginWithMiniApp(authInfo, option) {
      var _this19 = this;

      if (authInfo === undefined) {
        var getAuthInfo = getAdapter('getAuthInfo');
        return getAuthInfo().then(function (authInfo) {
          return _this19.loginWithAuthData(authInfo.authData, authInfo.provider, option);
        });
      }
      return this.loginWithAuthData(authInfo.authData, authInfo.provider, option);
    },


    /**
     * Only use for DI in tests to produce deterministic IDs.
     */
    _genId: function _genId() {
      return uuid();
    },


    /**
     * Creates an anonymous user.
     *
     * @since 3.9.0
     * @return {Promise.<AV.User>}
     */
    loginAnonymously: function loginAnonymously() {
      return this.loginWithAuthData({
        id: AV.User._genId()
      }, 'anonymous');
    },
    associateWithAuthData: function associateWithAuthData(userObj, platform, authData) {
      console.warn('DEPRECATED: User.associateWithAuthData 已废弃，请使用 User#associateWithAuthData 代替');
      return userObj._linkWith(platform, authData);
    },

    /**
     * Logs out the currently logged in user session. This will remove the
     * session from disk, log out of linked services, and future calls to
     * <code>current</code> will return <code>null</code>.
     * @return {Promise}
     */
    logOut: function logOut() {
      if (AV._config.disableCurrentUser) {
        console.warn('AV.User.current() was disabled in multi-user environment, call logOut() from user object instead https://leancloud.cn/docs/leanengine-node-sdk-upgrade-1.html');
        return _promise2.default.resolve(null);
      }

      if (AV.User._currentUser !== null) {
        AV.User._currentUser._logOutWithAll();
        AV.User._currentUser._isCurrentUser = false;
      }
      AV.User._currentUserMatchesDisk = true;
      AV.User._currentUser = null;
      return AV.localStorage.removeItemAsync(AV._getAVPath(AV.User._CURRENT_USER_KEY)).then(function () {
        return AV._refreshSubscriptionId();
      });
    },

    /**
     *Create a follower query for special user to query the user's followers.
     * @param {String} userObjectId The user object id.
     * @return {AV.FriendShipQuery}
     * @since 0.3.0
     */
    followerQuery: function followerQuery(userObjectId) {
      if (!userObjectId || !_.isString(userObjectId)) {
        throw new Error('Invalid user object id.');
      }
      var query = new AV.FriendShipQuery('_Follower');
      query._friendshipTag = 'follower';
      query.equalTo('user', AV.Object.createWithoutData('_User', userObjectId));
      return query;
    },

    /**
     *Create a followee query for special user to query the user's followees.
     * @param {String} userObjectId The user object id.
     * @return {AV.FriendShipQuery}
     * @since 0.3.0
     */
    followeeQuery: function followeeQuery(userObjectId) {
      if (!userObjectId || !_.isString(userObjectId)) {
        throw new Error('Invalid user object id.');
      }
      var query = new AV.FriendShipQuery('_Followee');
      query._friendshipTag = 'followee';
      query.equalTo('user', AV.Object.createWithoutData('_User', userObjectId));
      return query;
    },

    /**
     * Requests a password reset email to be sent to the specified email address
     * associated with the user account. This email allows the user to securely
     * reset their password on the AV site.
     *
     * @param {String} email The email address associated with the user that
     *     forgot their password.
     * @return {Promise}
     */
    requestPasswordReset: function requestPasswordReset(email) {
      var json = { email: email };
      var request = AVRequest('requestPasswordReset', null, null, 'POST', json);
      return request;
    },

    /**
     * Requests a verify email to be sent to the specified email address
     * associated with the user account. This email allows the user to securely
     * verify their email address on the AV site.
     *
     * @param {String} email The email address associated with the user that
     *     doesn't verify their email address.
     * @return {Promise}
     */
    requestEmailVerify: function requestEmailVerify(email) {
      var json = { email: email };
      var request = AVRequest('requestEmailVerify', null, null, 'POST', json);
      return request;
    },

    /**
     * Requests a verify sms code to be sent to the specified mobile phone
     * number associated with the user account. This sms code allows the user to
     * verify their mobile phone number by calling AV.User.verifyMobilePhone
     *
     * @param {String} mobilePhoneNumber The mobile phone number associated with the
     *                  user that doesn't verify their mobile phone number.
     * @param {AuthOptions} [options] AuthOptions plus:
     * @param {String} [options.validateToken] a validate token returned by {@link AV.Cloud.verifyCaptcha}
     * @return {Promise}
     */
    requestMobilePhoneVerify: function requestMobilePhoneVerify(mobilePhoneNumber) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var data = {
        mobilePhoneNumber: mobilePhoneNumber
      };
      if (options.validateToken) {
        data.validate_token = options.validateToken;
      }
      var request = AVRequest('requestMobilePhoneVerify', null, null, 'POST', data, options);
      return request;
    },

    /**
     * Requests a reset password sms code to be sent to the specified mobile phone
     * number associated with the user account. This sms code allows the user to
     * reset their account's password by calling AV.User.resetPasswordBySmsCode
     *
     * @param {String} mobilePhoneNumber The mobile phone number  associated with the
     *                  user that doesn't verify their mobile phone number.
     * @param {AuthOptions} [options] AuthOptions plus:
     * @param {String} [options.validateToken] a validate token returned by {@link AV.Cloud.verifyCaptcha}
     * @return {Promise}
     */
    requestPasswordResetBySmsCode: function requestPasswordResetBySmsCode(mobilePhoneNumber) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var data = {
        mobilePhoneNumber: mobilePhoneNumber
      };
      if (options.validateToken) {
        data.validate_token = options.validateToken;
      }
      var request = AVRequest('requestPasswordResetBySmsCode', null, null, 'POST', data, options);
      return request;
    },

    /**
     * Makes a call to reset user's account password by sms code and new password.
     * The sms code is sent by AV.User.requestPasswordResetBySmsCode.
     * @param {String} code The sms code sent by AV.User.Cloud.requestSmsCode
     * @param {String} password The new password.
     * @return {Promise} A promise that will be resolved with the result
     * of the function.
     */
    resetPasswordBySmsCode: function resetPasswordBySmsCode(code, password) {
      var json = { password: password };
      var request = AVRequest('resetPasswordBySmsCode', null, code, 'PUT', json);
      return request;
    },

    /**
     * Makes a call to verify sms code that sent by AV.User.Cloud.requestSmsCode
     * If verify successfully,the user mobilePhoneVerified attribute will be true.
     * @param {String} code The sms code sent by AV.User.Cloud.requestSmsCode
     * @return {Promise} A promise that will be resolved with the result
     * of the function.
     */
    verifyMobilePhone: function verifyMobilePhone(code) {
      var request = AVRequest('verifyMobilePhone', null, code, 'POST', null);
      return request;
    },

    /**
     * Requests a logIn sms code to be sent to the specified mobile phone
     * number associated with the user account. This sms code allows the user to
     * login by AV.User.logInWithMobilePhoneSmsCode function.
     *
     * @param {String} mobilePhoneNumber The mobile phone number  associated with the
     *           user that want to login by AV.User.logInWithMobilePhoneSmsCode
     * @param {AuthOptions} [options] AuthOptions plus:
     * @param {String} [options.validateToken] a validate token returned by {@link AV.Cloud.verifyCaptcha}
     * @return {Promise}
     */
    requestLoginSmsCode: function requestLoginSmsCode(mobilePhoneNumber) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var data = {
        mobilePhoneNumber: mobilePhoneNumber
      };
      if (options.validateToken) {
        data.validate_token = options.validateToken;
      }
      var request = AVRequest('requestLoginSmsCode', null, null, 'POST', data, options);
      return request;
    },

    /**
     * Retrieves the currently logged in AVUser with a valid session,
     * either from memory or localStorage, if necessary.
     * @return {Promise.<AV.User>} resolved with the currently logged in AV.User.
     */
    currentAsync: function currentAsync() {
      if (AV._config.disableCurrentUser) {
        console.warn('AV.User.currentAsync() was disabled in multi-user environment, access user from request instead https://leancloud.cn/docs/leanengine-node-sdk-upgrade-1.html');
        return _promise2.default.resolve(null);
      }

      if (AV.User._currentUser) {
        return _promise2.default.resolve(AV.User._currentUser);
      }

      if (AV.User._currentUserMatchesDisk) {
        return _promise2.default.resolve(AV.User._currentUser);
      }

      return AV.localStorage.getItemAsync(AV._getAVPath(AV.User._CURRENT_USER_KEY)).then(function (userData) {
        if (!userData) {
          return null;
        }

        // Load the user from local storage.
        AV.User._currentUserMatchesDisk = true;

        AV.User._currentUser = AV.Object._create('_User');
        AV.User._currentUser._isCurrentUser = true;

        var json = JSON.parse(userData);
        AV.User._currentUser.id = json._id;
        delete json._id;
        AV.User._currentUser._sessionToken = json._sessionToken;
        delete json._sessionToken;
        AV.User._currentUser._finishFetch(json);
        //AV.User._currentUser.set(json);

        AV.User._currentUser._synchronizeAllAuthData();
        AV.User._currentUser._refreshCache();
        AV.User._currentUser._opSetQueue = [{}];
        return AV.User._currentUser;
      });
    },

    /**
     * Retrieves the currently logged in AVUser with a valid session,
     * either from memory or localStorage, if necessary.
     * @return {AV.User} The currently logged in AV.User.
     */
    current: function current() {
      if (AV._config.disableCurrentUser) {
        console.warn('AV.User.current() was disabled in multi-user environment, access user from request instead https://leancloud.cn/docs/leanengine-node-sdk-upgrade-1.html');
        return null;
      }

      if (AV.localStorage.async) {
        var error = new Error('Synchronous API User.current() is not available in this runtime. Use User.currentAsync() instead.');
        error.code = 'SYNC_API_NOT_AVAILABLE';
        throw error;
      }

      if (AV.User._currentUser) {
        return AV.User._currentUser;
      }

      if (AV.User._currentUserMatchesDisk) {
        return AV.User._currentUser;
      }

      // Load the user from local storage.
      AV.User._currentUserMatchesDisk = true;

      var userData = AV.localStorage.getItem(AV._getAVPath(AV.User._CURRENT_USER_KEY));
      if (!userData) {
        return null;
      }
      AV.User._currentUser = AV.Object._create('_User');
      AV.User._currentUser._isCurrentUser = true;

      var json = JSON.parse(userData);
      AV.User._currentUser.id = json._id;
      delete json._id;
      AV.User._currentUser._sessionToken = json._sessionToken;
      delete json._sessionToken;
      AV.User._currentUser._finishFetch(json);
      //AV.User._currentUser.set(json);

      AV.User._currentUser._synchronizeAllAuthData();
      AV.User._currentUser._refreshCache();
      AV.User._currentUser._opSetQueue = [{}];
      return AV.User._currentUser;
    },

    /**
     * Persists a user as currentUser to localStorage, and into the singleton.
     * @private
     */
    _saveCurrentUser: function _saveCurrentUser(user) {
      var promise;
      if (AV.User._currentUser !== user) {
        promise = AV.User.logOut();
      } else {
        promise = _promise2.default.resolve();
      }
      return promise.then(function () {
        user._isCurrentUser = true;
        AV.User._currentUser = user;

        var json = user._toFullJSON();
        json._id = user.id;
        json._sessionToken = user._sessionToken;
        return AV.localStorage.setItemAsync(AV._getAVPath(AV.User._CURRENT_USER_KEY), (0, _stringify2.default)(json)).then(function () {
          AV.User._currentUserMatchesDisk = true;
          return AV._refreshSubscriptionId();
        });
      });
    },

    _registerAuthenticationProvider: function _registerAuthenticationProvider(provider) {
      AV.User._authProviders[provider.getAuthType()] = provider;
      // Synchronize the current user with the auth provider.
      if (!AV._config.disableCurrentUser && AV.User.current()) {
        AV.User.current()._synchronizeAuthData(provider.getAuthType());
      }
    },

    _logInWith: function _logInWith(provider, authData, options) {
      var user = AV.Object._create('_User');
      return user._linkWith(provider, authData, options);
    }
  });
};
}, function(modId) { var map = {"./error":1595492076968,"./request":1595492076981,"./adapter":1595492076965}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1595492076986, function(require, module, exports) {


var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require('underscore');
var debug = require('debug')('leancloud:query');
var AVError = require('./error');

var _require = require('./request'),
    _request = _require._request,
    request = _require.request;

var _require2 = require('./utils'),
    ensureArray = _require2.ensureArray,
    transformFetchOptions = _require2.transformFetchOptions,
    continueWhile = _require2.continueWhile;

var requires = function requires(value, message) {
  if (value === undefined) {
    throw new Error(message);
  }
};

// AV.Query is a way to create a list of AV.Objects.
module.exports = function (AV) {
  /**
   * Creates a new AV.Query for the given AV.Object subclass.
   * @param {Class|String} objectClass An instance of a subclass of AV.Object, or a AV className string.
   * @class
   *
   * <p>AV.Query defines a query that is used to fetch AV.Objects. The
   * most common use case is finding all objects that match a query through the
   * <code>find</code> method. For example, this sample code fetches all objects
   * of class <code>MyClass</code>. It calls a different function depending on
   * whether the fetch succeeded or not.
   *
   * <pre>
   * var query = new AV.Query(MyClass);
   * query.find().then(function(results) {
   *   // results is an array of AV.Object.
   * }, function(error) {
   *   // error is an instance of AVError.
   * });</pre></p>
   *
   * <p>An AV.Query can also be used to retrieve a single object whose id is
   * known, through the get method. For example, this sample code fetches an
   * object of class <code>MyClass</code> and id <code>myId</code>. It calls a
   * different function depending on whether the fetch succeeded or not.
   *
   * <pre>
   * var query = new AV.Query(MyClass);
   * query.get(myId).then(function(object) {
   *   // object is an instance of AV.Object.
   * }, function(error) {
   *   // error is an instance of AVError.
   * });</pre></p>
   *
   * <p>An AV.Query can also be used to count the number of objects that match
   * the query without retrieving all of those objects. For example, this
   * sample code counts the number of objects of the class <code>MyClass</code>
   * <pre>
   * var query = new AV.Query(MyClass);
   * query.count().then(function(number) {
   *   // There are number instances of MyClass.
   * }, function(error) {
   *   // error is an instance of AVError.
   * });</pre></p>
   */
  AV.Query = function (objectClass) {
    if (_.isString(objectClass)) {
      objectClass = AV.Object._getSubclass(objectClass);
    }

    this.objectClass = objectClass;

    this.className = objectClass.prototype.className;

    this._where = {};
    this._include = [];
    this._select = [];
    this._limit = -1; // negative limit means, do not send a limit
    this._skip = 0;
    this._defaultParams = {};
  };

  /**
   * Constructs a AV.Query that is the OR of the passed in queries.  For
   * example:
   * <pre>var compoundQuery = AV.Query.or(query1, query2, query3);</pre>
   *
   * will create a compoundQuery that is an or of the query1, query2, and
   * query3.
   * @param {...AV.Query} var_args The list of queries to OR.
   * @return {AV.Query} The query that is the OR of the passed in queries.
   */
  AV.Query.or = function () {
    var queries = _.toArray(arguments);
    var className = null;
    AV._arrayEach(queries, function (q) {
      if (_.isNull(className)) {
        className = q.className;
      }

      if (className !== q.className) {
        throw new Error('All queries must be for the same class');
      }
    });
    var query = new AV.Query(className);
    query._orQuery(queries);
    return query;
  };

  /**
   * Constructs a AV.Query that is the AND of the passed in queries.  For
   * example:
   * <pre>var compoundQuery = AV.Query.and(query1, query2, query3);</pre>
   *
   * will create a compoundQuery that is an 'and' of the query1, query2, and
   * query3.
   * @param {...AV.Query} var_args The list of queries to AND.
   * @return {AV.Query} The query that is the AND of the passed in queries.
   */
  AV.Query.and = function () {
    var queries = _.toArray(arguments);
    var className = null;
    AV._arrayEach(queries, function (q) {
      if (_.isNull(className)) {
        className = q.className;
      }

      if (className !== q.className) {
        throw new Error('All queries must be for the same class');
      }
    });
    var query = new AV.Query(className);
    query._andQuery(queries);
    return query;
  };

  /**
   * Retrieves a list of AVObjects that satisfy the CQL.
   * CQL syntax please see {@link https://leancloud.cn/docs/cql_guide.html CQL Guide}.
   *
   * @param {String} cql A CQL string, see {@link https://leancloud.cn/docs/cql_guide.html CQL Guide}.
   * @param {Array} pvalues An array contains placeholder values.
   * @param {AuthOptions} options
   * @return {Promise} A promise that is resolved with the results when
   * the query completes.
   */
  AV.Query.doCloudQuery = function (cql, pvalues, options) {
    var params = { cql: cql };
    if (_.isArray(pvalues)) {
      params.pvalues = pvalues;
    } else {
      options = pvalues;
    }

    var request = _request('cloudQuery', null, null, 'GET', params, options);
    return request.then(function (response) {
      //query to process results.
      var query = new AV.Query(response.className);
      var results = _.map(response.results, function (json) {
        var obj = query._newObject(response);
        if (obj._finishFetch) {
          obj._finishFetch(query._processResult(json), true);
        }
        return obj;
      });
      return {
        results: results,
        count: response.count,
        className: response.className
      };
    });
  };

  /**
   * Return a query with conditions from json.
   * This can be useful to send a query from server side to client side.
   * @since 4.0.0
   * @param {Object} json from {@link AV.Query#toJSON}
   * @return {AV.Query}
   */
  AV.Query.fromJSON = function (_ref) {
    var className = _ref.className,
        where = _ref.where,
        include = _ref.include,
        select = _ref.select,
        includeACL = _ref.includeACL,
        limit = _ref.limit,
        skip = _ref.skip,
        order = _ref.order;

    if (typeof className !== 'string') {
      throw new TypeError('Invalid Query JSON, className must be a String.');
    }
    var query = new AV.Query(className);
    _.extend(query, {
      _where: where,
      _include: include,
      _select: select,
      _includeACL: includeACL,
      _limit: limit,
      _skip: skip,
      _order: order
    });
    return query;
  };

  AV.Query._extend = AV._extend;

  _.extend(AV.Query.prototype,
  /** @lends AV.Query.prototype */{
    //hook to iterate result. Added by dennis<xzhuang@avoscloud.com>.
    _processResult: function _processResult(obj) {
      return obj;
    },

    /**
     * Constructs an AV.Object whose id is already known by fetching data from
     * the server.
     *
     * @param {String} objectId The id of the object to be fetched.
     * @param {AuthOptions} options
     * @return {Promise.<AV.Object>}
     */
    get: function get(objectId, options) {
      if (!_.isString(objectId)) {
        throw new Error('objectId must be a string');
      }
      if (objectId === '') {
        return _promise2.default.reject(new AVError(AVError.OBJECT_NOT_FOUND, 'Object not found.'));
      }

      var obj = this._newObject();
      obj.id = objectId;

      var queryJSON = this._getParams();
      var fetchOptions = {};

      if (queryJSON.keys) fetchOptions.keys = queryJSON.keys;
      if (queryJSON.include) fetchOptions.include = queryJSON.include;
      if (queryJSON.includeACL) fetchOptions.includeACL = queryJSON.includeACL;

      return _request('classes', this.className, objectId, 'GET', transformFetchOptions(fetchOptions), options).then(function (response) {
        if (_.isEmpty(response)) throw new AVError(AVError.OBJECT_NOT_FOUND, 'Object not found.');
        obj._finishFetch(obj.parse(response), true);
        return obj;
      });
    },

    /**
     * Returns a JSON representation of this query.
     * @return {Object}
     */
    toJSON: function toJSON() {
      var className = this.className,
          where = this._where,
          include = this._include,
          select = this._select,
          includeACL = this._includeACL,
          limit = this._limit,
          skip = this._skip,
          order = this._order;

      return {
        className: className,
        where: where,
        include: include,
        select: select,
        includeACL: includeACL,
        limit: limit,
        skip: skip,
        order: order
      };
    },


    _getParams: function _getParams() {
      var params = _.extend({}, this._defaultParams, {
        where: this._where
      });

      if (this._include.length > 0) {
        params.include = this._include.join(',');
      }
      if (this._select.length > 0) {
        params.keys = this._select.join(',');
      }
      if (this._includeACL !== undefined) {
        params.returnACL = this._includeACL;
      }
      if (this._limit >= 0) {
        params.limit = this._limit;
      }
      if (this._skip > 0) {
        params.skip = this._skip;
      }
      if (this._order !== undefined) {
        params.order = this._order;
      }

      return params;
    },

    _newObject: function _newObject(response) {
      var obj;
      if (response && response.className) {
        obj = new AV.Object(response.className);
      } else {
        obj = new this.objectClass();
      }
      return obj;
    },
    _createRequest: function _createRequest() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._getParams();
      var options = arguments[1];
      var path = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '/classes/' + this.className;

      if (encodeURIComponent((0, _stringify2.default)(params)).length > 2000) {
        var body = {
          requests: [{
            method: 'GET',
            path: '/1.1' + path,
            params: params
          }]
        };
        return request({
          path: '/batch',
          method: 'POST',
          data: body,
          authOptions: options
        }).then(function (response) {
          var result = response[0];
          if (result.success) {
            return result.success;
          }
          var error = new Error(result.error.error || 'Unknown batch error');
          error.code = result.error.code;
          throw error;
        });
      }
      return request({
        method: 'GET',
        path: path,
        query: params,
        authOptions: options
      });
    },
    _parseResponse: function _parseResponse(response) {
      var _this = this;

      return _.map(response.results, function (json) {
        var obj = _this._newObject(response);
        if (obj._finishFetch) {
          obj._finishFetch(_this._processResult(json), true);
        }
        return obj;
      });
    },


    /**
     * Retrieves a list of AVObjects that satisfy this query.
     *
     * @param {AuthOptions} options
     * @return {Promise} A promise that is resolved with the results when
     * the query completes.
     */
    find: function find(options) {
      var request = this._createRequest(undefined, options);
      return request.then(this._parseResponse.bind(this));
    },


    /**
     * scan a Query. masterKey required.
     *
     * @since 2.1.0
     * @param {object} [options]
     * @param {string} [options.orderedBy] specify the key to sort
     * @param {number} [options.batchSize] specify the batch size for each request
     * @param {AuthOptions} [authOptions]
     * @return {AsyncIterator.<AV.Object>}
     * @example const scan = new AV.Query(TestClass).scan({
     *   orderedBy: 'objectId',
     *   batchSize: 10,
     * }, {
     *   useMasterKey: true,
     * });
     * const getTen = () => Promise.all(new Array(10).fill(0).map(() => scan.next()));
     * getTen().then(results => {
     *   // results are fisrt 10 instances of TestClass
     *   return getTen();
     * }).then(results => {
     *   // 11 - 20
     * });
     */
    scan: function scan() {
      var _this2 = this;

      var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          orderedBy = _ref2.orderedBy,
          batchSize = _ref2.batchSize;

      var authOptions = arguments[1];

      var condition = this._getParams();
      debug('scan %O', condition);
      if (condition.order) {
        console.warn('The order of the query is ignored for Query#scan. Checkout the orderedBy option of Query#scan.');
        delete condition.order;
      }
      if (condition.skip) {
        console.warn('The skip option of the query is ignored for Query#scan.');
        delete condition.skip;
      }
      if (condition.limit) {
        console.warn('The limit option of the query is ignored for Query#scan.');
        delete condition.limit;
      }
      if (orderedBy) condition.scan_key = orderedBy;
      if (batchSize) condition.limit = batchSize;
      var promise = _promise2.default.resolve([]);
      var cursor = void 0;
      var done = false;
      return {
        next: function next() {
          promise = promise.then(function (remainResults) {
            if (done) return [];
            if (remainResults.length > 1) return remainResults;
            // no cursor means we have reached the end
            // except for the first time
            if (!cursor && remainResults.length !== 0) {
              done = true;
              return remainResults;
            }
            // when only 1 item left in queue
            // start the next request to see if it is the last one
            return _request('scan/classes', _this2.className, null, 'GET', cursor ? _.extend({}, condition, { cursor: cursor }) : condition, authOptions).then(function (response) {
              cursor = response.cursor;
              return _this2._parseResponse(response);
            }).then(function (results) {
              if (!results.length) done = true;
              return remainResults.concat(results);
            });
          });
          return promise.then(function (remainResults) {
            return remainResults.shift();
          }).then(function (result) {
            return {
              value: result,
              done: done
            };
          });
        }
      };
    },


    /**
     * Delete objects retrieved by this query.
     * @param {AuthOptions} options
     * @return {Promise} A promise that is fulfilled when the save
     *     completes.
     */
    destroyAll: function destroyAll(options) {
      var self = this;
      return self.find(options).then(function (objects) {
        return AV.Object.destroyAll(objects, options);
      });
    },

    /**
     * Counts the number of objects that match this query.
     *
     * @param {AuthOptions} options
     * @return {Promise} A promise that is resolved with the count when
     * the query completes.
     */
    count: function count(options) {
      var params = this._getParams();
      params.limit = 0;
      params.count = 1;
      var request = this._createRequest(params, options);

      return request.then(function (response) {
        return response.count;
      });
    },

    /**
     * Retrieves at most one AV.Object that satisfies this query.
     *
     * @param {AuthOptions} options
     * @return {Promise} A promise that is resolved with the object when
     * the query completes.
     */
    first: function first(options) {
      var self = this;

      var params = this._getParams();
      params.limit = 1;
      var request = this._createRequest(params, options);

      return request.then(function (response) {
        return _.map(response.results, function (json) {
          var obj = self._newObject();
          if (obj._finishFetch) {
            obj._finishFetch(self._processResult(json), true);
          }
          return obj;
        })[0];
      });
    },

    /**
     * Sets the number of results to skip before returning any results.
     * This is useful for pagination.
     * Default is to skip zero results.
     * @param {Number} n the number of results to skip.
     * @return {AV.Query} Returns the query, so you can chain this call.
     */
    skip: function skip(n) {
      requires(n, 'undefined is not a valid skip value');
      this._skip = n;
      return this;
    },

    /**
     * Sets the limit of the number of results to return. The default limit is
     * 100, with a maximum of 1000 results being returned at a time.
     * @param {Number} n the number of results to limit to.
     * @return {AV.Query} Returns the query, so you can chain this call.
     */
    limit: function limit(n) {
      requires(n, 'undefined is not a valid limit value');
      this._limit = n;
      return this;
    },

    /**
     * Add a constraint to the query that requires a particular key's value to
     * be equal to the provided value.
     * @param {String} key The key to check.
     * @param value The value that the AV.Object must contain.
     * @return {AV.Query} Returns the query, so you can chain this call.
     */
    equalTo: function equalTo(key, value) {
      requires(key, 'undefined is not a valid key');
      requires(value, 'undefined is not a valid value');
      this._where[key] = AV._encode(value);
      return this;
    },

    /**
     * Helper for condition queries
     * @private
     */
    _addCondition: function _addCondition(key, condition, value) {
      requires(key, 'undefined is not a valid condition key');
      requires(condition, 'undefined is not a valid condition');
      requires(value, 'undefined is not a valid condition value');

      // Check if we already have a condition
      if (!this._where[key]) {
        this._where[key] = {};
      }
      this._where[key][condition] = AV._encode(value);
      return this;
    },

    /**
     * Add a constraint to the query that requires a particular
     * <strong>array</strong> key's length to be equal to the provided value.
     * @param {String} key The array key to check.
     * @param value The length value.
     * @return {AV.Query} Returns the query, so you can chain this call.
     */
    sizeEqualTo: function sizeEqualTo(key, value) {
      this._addCondition(key, '$size', value);
      return this;
    },

    /**
     * Add a constraint to the query that requires a particular key's value to
     * be not equal to the provided value.
     * @param {String} key The key to check.
     * @param value The value that must not be equalled.
     * @return {AV.Query} Returns the query, so you can chain this call.
     */
    notEqualTo: function notEqualTo(key, value) {
      this._addCondition(key, '$ne', value);
      return this;
    },

    /**
     * Add a constraint to the query that requires a particular key's value to
     * be less than the provided value.
     * @param {String} key The key to check.
     * @param value The value that provides an upper bound.
     * @return {AV.Query} Returns the query, so you can chain this call.
     */
    lessThan: function lessThan(key, value) {
      this._addCondition(key, '$lt', value);
      return this;
    },

    /**
     * Add a constraint to the query that requires a particular key's value to
     * be greater than the provided value.
     * @param {String} key The key to check.
     * @param value The value that provides an lower bound.
     * @return {AV.Query} Returns the query, so you can chain this call.
     */
    greaterThan: function greaterThan(key, value) {
      this._addCondition(key, '$gt', value);
      return this;
    },

    /**
     * Add a constraint to the query that requires a particular key's value to
     * be less than or equal to the provided value.
     * @param {String} key The key to check.
     * @param value The value that provides an upper bound.
     * @return {AV.Query} Returns the query, so you can chain this call.
     */
    lessThanOrEqualTo: function lessThanOrEqualTo(key, value) {
      this._addCondition(key, '$lte', value);
      return this;
    },

    /**
     * Add a constraint to the query that requires a particular key's value to
     * be greater than or equal to the provided value.
     * @param {String} key The key to check.
     * @param value The value that provides an lower bound.
     * @return {AV.Query} Returns the query, so you can chain this call.
     */
    greaterThanOrEqualTo: function greaterThanOrEqualTo(key, value) {
      this._addCondition(key, '$gte', value);
      return this;
    },

    /**
     * Add a constraint to the query that requires a particular key's value to
     * be contained in the provided list of values.
     * @param {String} key The key to check.
     * @param {Array} values The values that will match.
     * @return {AV.Query} Returns the query, so you can chain this call.
     */
    containedIn: function containedIn(key, values) {
      this._addCondition(key, '$in', values);
      return this;
    },

    /**
     * Add a constraint to the query that requires a particular key's value to
     * not be contained in the provided list of values.
     * @param {String} key The key to check.
     * @param {Array} values The values that will not match.
     * @return {AV.Query} Returns the query, so you can chain this call.
     */
    notContainedIn: function notContainedIn(key, values) {
      this._addCondition(key, '$nin', values);
      return this;
    },

    /**
     * Add a constraint to the query that requires a particular key's value to
     * contain each one of the provided list of values.
     * @param {String} key The key to check.  This key's value must be an array.
     * @param {Array} values The values that will match.
     * @return {AV.Query} Returns the query, so you can chain this call.
     */
    containsAll: function containsAll(key, values) {
      this._addCondition(key, '$all', values);
      return this;
    },

    /**
     * Add a constraint for finding objects that contain the given key.
     * @param {String} key The key that should exist.
     * @return {AV.Query} Returns the query, so you can chain this call.
     */
    exists: function exists(key) {
      this._addCondition(key, '$exists', true);
      return this;
    },

    /**
     * Add a constraint for finding objects that do not contain a given key.
     * @param {String} key The key that should not exist
     * @return {AV.Query} Returns the query, so you can chain this call.
     */
    doesNotExist: function doesNotExist(key) {
      this._addCondition(key, '$exists', false);
      return this;
    },

    /**
     * Add a regular expression constraint for finding string values that match
     * the provided regular expression.
     * This may be slow for large datasets.
     * @param {String} key The key that the string to match is stored in.
     * @param {RegExp} regex The regular expression pattern to match.
     * @return {AV.Query} Returns the query, so you can chain this call.
     */
    matches: function matches(key, regex, modifiers) {
      this._addCondition(key, '$regex', regex);
      if (!modifiers) {
        modifiers = '';
      }
      // Javascript regex options support mig as inline options but store them
      // as properties of the object. We support mi & should migrate them to
      // modifiers
      if (regex.ignoreCase) {
        modifiers += 'i';
      }
      if (regex.multiline) {
        modifiers += 'm';
      }

      if (modifiers && modifiers.length) {
        this._addCondition(key, '$options', modifiers);
      }
      return this;
    },

    /**
     * Add a constraint that requires that a key's value matches a AV.Query
     * constraint.
     * @param {String} key The key that the contains the object to match the
     *                     query.
     * @param {AV.Query} query The query that should match.
     * @return {AV.Query} Returns the query, so you can chain this call.
     */
    matchesQuery: function matchesQuery(key, query) {
      var queryJSON = query._getParams();
      queryJSON.className = query.className;
      this._addCondition(key, '$inQuery', queryJSON);
      return this;
    },

    /**
     * Add a constraint that requires that a key's value not matches a
     * AV.Query constraint.
     * @param {String} key The key that the contains the object to match the
     *                     query.
     * @param {AV.Query} query The query that should not match.
     * @return {AV.Query} Returns the query, so you can chain this call.
     */
    doesNotMatchQuery: function doesNotMatchQuery(key, query) {
      var queryJSON = query._getParams();
      queryJSON.className = query.className;
      this._addCondition(key, '$notInQuery', queryJSON);
      return this;
    },

    /**
     * Add a constraint that requires that a key's value matches a value in
     * an object returned by a different AV.Query.
     * @param {String} key The key that contains the value that is being
     *                     matched.
     * @param {String} queryKey The key in the objects returned by the query to
     *                          match against.
     * @param {AV.Query} query The query to run.
     * @return {AV.Query} Returns the query, so you can chain this call.
     */
    matchesKeyInQuery: function matchesKeyInQuery(key, queryKey, query) {
      var queryJSON = query._getParams();
      queryJSON.className = query.className;
      this._addCondition(key, '$select', { key: queryKey, query: queryJSON });
      return this;
    },

    /**
     * Add a constraint that requires that a key's value not match a value in
     * an object returned by a different AV.Query.
     * @param {String} key The key that contains the value that is being
     *                     excluded.
     * @param {String} queryKey The key in the objects returned by the query to
     *                          match against.
     * @param {AV.Query} query The query to run.
     * @return {AV.Query} Returns the query, so you can chain this call.
     */
    doesNotMatchKeyInQuery: function doesNotMatchKeyInQuery(key, queryKey, query) {
      var queryJSON = query._getParams();
      queryJSON.className = query.className;
      this._addCondition(key, '$dontSelect', {
        key: queryKey,
        query: queryJSON
      });
      return this;
    },

    /**
     * Add constraint that at least one of the passed in queries matches.
     * @param {Array} queries
     * @return {AV.Query} Returns the query, so you can chain this call.
     * @private
     */
    _orQuery: function _orQuery(queries) {
      var queryJSON = _.map(queries, function (q) {
        return q._getParams().where;
      });

      this._where.$or = queryJSON;
      return this;
    },

    /**
     * Add constraint that both of the passed in queries matches.
     * @param {Array} queries
     * @return {AV.Query} Returns the query, so you can chain this call.
     * @private
     */
    _andQuery: function _andQuery(queries) {
      var queryJSON = _.map(queries, function (q) {
        return q._getParams().where;
      });

      this._where.$and = queryJSON;
      return this;
    },

    /**
     * Converts a string into a regex that matches it.
     * Surrounding with \Q .. \E does this, we just need to escape \E's in
     * the text separately.
     * @private
     */
    _quote: function _quote(s) {
      return '\\Q' + s.replace('\\E', '\\E\\\\E\\Q') + '\\E';
    },

    /**
     * Add a constraint for finding string values that contain a provided
     * string.  This may be slow for large datasets.
     * @param {String} key The key that the string to match is stored in.
     * @param {String} substring The substring that the value must contain.
     * @return {AV.Query} Returns the query, so you can chain this call.
     */
    contains: function contains(key, value) {
      this._addCondition(key, '$regex', this._quote(value));
      return this;
    },

    /**
     * Add a constraint for finding string values that start with a provided
     * string.  This query will use the backend index, so it will be fast even
     * for large datasets.
     * @param {String} key The key that the string to match is stored in.
     * @param {String} prefix The substring that the value must start with.
     * @return {AV.Query} Returns the query, so you can chain this call.
     */
    startsWith: function startsWith(key, value) {
      this._addCondition(key, '$regex', '^' + this._quote(value));
      return this;
    },

    /**
     * Add a constraint for finding string values that end with a provided
     * string.  This will be slow for large datasets.
     * @param {String} key The key that the string to match is stored in.
     * @param {String} suffix The substring that the value must end with.
     * @return {AV.Query} Returns the query, so you can chain this call.
     */
    endsWith: function endsWith(key, value) {
      this._addCondition(key, '$regex', this._quote(value) + '$');
      return this;
    },

    /**
     * Sorts the results in ascending order by the given key.
     *
     * @param {String} key The key to order by.
     * @return {AV.Query} Returns the query, so you can chain this call.
     */
    ascending: function ascending(key) {
      requires(key, 'undefined is not a valid key');
      this._order = key;
      return this;
    },

    /**
     * Also sorts the results in ascending order by the given key. The previous sort keys have
     * precedence over this key.
     *
     * @param {String} key The key to order by
     * @return {AV.Query} Returns the query so you can chain this call.
     */
    addAscending: function addAscending(key) {
      requires(key, 'undefined is not a valid key');
      if (this._order) this._order += ',' + key;else this._order = key;
      return this;
    },

    /**
     * Sorts the results in descending order by the given key.
     *
     * @param {String} key The key to order by.
     * @return {AV.Query} Returns the query, so you can chain this call.
     */
    descending: function descending(key) {
      requires(key, 'undefined is not a valid key');
      this._order = '-' + key;
      return this;
    },

    /**
     * Also sorts the results in descending order by the given key. The previous sort keys have
     * precedence over this key.
     *
     * @param {String} key The key to order by
     * @return {AV.Query} Returns the query so you can chain this call.
     */
    addDescending: function addDescending(key) {
      requires(key, 'undefined is not a valid key');
      if (this._order) this._order += ',-' + key;else this._order = '-' + key;
      return this;
    },

    /**
     * Add a proximity based constraint for finding objects with key point
     * values near the point given.
     * @param {String} key The key that the AV.GeoPoint is stored in.
     * @param {AV.GeoPoint} point The reference AV.GeoPoint that is used.
     * @return {AV.Query} Returns the query, so you can chain this call.
     */
    near: function near(key, point) {
      if (!(point instanceof AV.GeoPoint)) {
        // Try to cast it to a GeoPoint, so that near("loc", [20,30]) works.
        point = new AV.GeoPoint(point);
      }
      this._addCondition(key, '$nearSphere', point);
      return this;
    },

    /**
     * Add a proximity based constraint for finding objects with key point
     * values near the point given and within the maximum distance given.
     * @param {String} key The key that the AV.GeoPoint is stored in.
     * @param {AV.GeoPoint} point The reference AV.GeoPoint that is used.
     * @param maxDistance Maximum distance (in radians) of results to return.
     * @return {AV.Query} Returns the query, so you can chain this call.
     */
    withinRadians: function withinRadians(key, point, distance) {
      this.near(key, point);
      this._addCondition(key, '$maxDistance', distance);
      return this;
    },

    /**
     * Add a proximity based constraint for finding objects with key point
     * values near the point given and within the maximum distance given.
     * Radius of earth used is 3958.8 miles.
     * @param {String} key The key that the AV.GeoPoint is stored in.
     * @param {AV.GeoPoint} point The reference AV.GeoPoint that is used.
     * @param {Number} maxDistance Maximum distance (in miles) of results to
     *     return.
     * @return {AV.Query} Returns the query, so you can chain this call.
     */
    withinMiles: function withinMiles(key, point, distance) {
      return this.withinRadians(key, point, distance / 3958.8);
    },

    /**
     * Add a proximity based constraint for finding objects with key point
     * values near the point given and within the maximum distance given.
     * Radius of earth used is 6371.0 kilometers.
     * @param {String} key The key that the AV.GeoPoint is stored in.
     * @param {AV.GeoPoint} point The reference AV.GeoPoint that is used.
     * @param {Number} maxDistance Maximum distance (in kilometers) of results
     *     to return.
     * @return {AV.Query} Returns the query, so you can chain this call.
     */
    withinKilometers: function withinKilometers(key, point, distance) {
      return this.withinRadians(key, point, distance / 6371.0);
    },

    /**
     * Add a constraint to the query that requires a particular key's
     * coordinates be contained within a given rectangular geographic bounding
     * box.
     * @param {String} key The key to be constrained.
     * @param {AV.GeoPoint} southwest
     *     The lower-left inclusive corner of the box.
     * @param {AV.GeoPoint} northeast
     *     The upper-right inclusive corner of the box.
     * @return {AV.Query} Returns the query, so you can chain this call.
     */
    withinGeoBox: function withinGeoBox(key, southwest, northeast) {
      if (!(southwest instanceof AV.GeoPoint)) {
        southwest = new AV.GeoPoint(southwest);
      }
      if (!(northeast instanceof AV.GeoPoint)) {
        northeast = new AV.GeoPoint(northeast);
      }
      this._addCondition(key, '$within', { $box: [southwest, northeast] });
      return this;
    },

    /**
     * Include nested AV.Objects for the provided key.  You can use dot
     * notation to specify which fields in the included object are also fetch.
     * @param {String[]} keys The name of the key to include.
     * @return {AV.Query} Returns the query, so you can chain this call.
     */
    include: function include(keys) {
      var _this3 = this;

      requires(keys, 'undefined is not a valid key');
      _.forEach(arguments, function (keys) {
        _this3._include = _this3._include.concat(ensureArray(keys));
      });
      return this;
    },

    /**
     * Include the ACL.
     * @param {Boolean} [value=true] Whether to include the ACL
     * @return {AV.Query} Returns the query, so you can chain this call.
     */
    includeACL: function includeACL() {
      var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      this._includeACL = value;
      return this;
    },

    /**
     * Restrict the fields of the returned AV.Objects to include only the
     * provided keys.  If this is called multiple times, then all of the keys
     * specified in each of the calls will be included.
     * @param {String[]} keys The names of the keys to include.
     * @return {AV.Query} Returns the query, so you can chain this call.
     */
    select: function select(keys) {
      var _this4 = this;

      requires(keys, 'undefined is not a valid key');
      _.forEach(arguments, function (keys) {
        _this4._select = _this4._select.concat(ensureArray(keys));
      });
      return this;
    },

    /**
     * Iterates over each result of a query, calling a callback for each one. If
     * the callback returns a promise, the iteration will not continue until
     * that promise has been fulfilled. If the callback returns a rejected
     * promise, then iteration will stop with that error. The items are
     * processed in an unspecified order. The query may not have any sort order,
     * and may not use limit or skip.
     * @param callback {Function} Callback that will be called with each result
     *     of the query.
     * @return {Promise} A promise that will be fulfilled once the
     *     iteration has completed.
     */
    each: function each(callback) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (this._order || this._skip || this._limit >= 0) {
        var error = new Error('Cannot iterate on a query with sort, skip, or limit.');
        return _promise2.default.reject(error);
      }

      var query = new AV.Query(this.objectClass);
      // We can override the batch size from the options.
      // This is undocumented, but useful for testing.
      query._limit = options.batchSize || 100;
      query._where = _.clone(this._where);
      query._include = _.clone(this._include);

      query.ascending('objectId');

      var finished = false;
      return continueWhile(function () {
        return !finished;
      }, function () {
        return query.find(options).then(function (results) {
          var callbacksDone = _promise2.default.resolve();
          _.each(results, function (result) {
            callbacksDone = callbacksDone.then(function () {
              return callback(result);
            });
          });

          return callbacksDone.then(function () {
            if (results.length >= query._limit) {
              query.greaterThan('objectId', results[results.length - 1].id);
            } else {
              finished = true;
            }
          });
        });
      });
    },

    /**
     * Subscribe the changes of this query.
     *
     * LiveQuery is not included in the default bundle: {@link https://url.leanapp.cn/enable-live-query}.
     *
     * @since 3.0.0
     * @return {AV.LiveQuery} An eventemitter which can be used to get LiveQuery updates;
     */
    subscribe: function subscribe(options) {
      return AV.LiveQuery.init(this, options);
    }
  });

  AV.FriendShipQuery = AV.Query._extend({
    _newObject: function _newObject() {
      var UserClass = AV.Object._getSubclass('_User');
      return new UserClass();
    },
    _processResult: function _processResult(json) {
      if (json && json[this._friendshipTag]) {
        var user = json[this._friendshipTag];
        if (user.__type === 'Pointer' && user.className === '_User') {
          delete user.__type;
          delete user.className;
        }
        return user;
      } else {
        return null;
      }
    }
  });
};
}, function(modId) { var map = {"./error":1595492076968,"./request":1595492076981,"./utils":1595492076963}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1595492076987, function(require, module, exports) {


var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require('underscore');
var EventEmitter = require('eventemitter3');

var _require = require('./utils'),
    inherits = _require.inherits;

var _require2 = require('./request'),
    request = _require2.request;

var subscribe = function subscribe(queryJSON, subscriptionId) {
  return request({
    method: 'POST',
    path: '/LiveQuery/subscribe',
    data: {
      query: queryJSON,
      id: subscriptionId
    }
  });
};

module.exports = function (AV) {
  var requireRealtime = function requireRealtime() {
    if (!AV._config.realtime) {
      throw new Error('LiveQuery not supported. Please use the LiveQuery bundle. https://url.leanapp.cn/enable-live-query');
    }
  };
  /**
   * @class
   * A LiveQuery, created by {@link AV.Query#subscribe} is an EventEmitter notifies changes of the Query.
   * @since 3.0.0
   */
  AV.LiveQuery = inherits(EventEmitter,
  /** @lends AV.LiveQuery.prototype */{
    constructor: function constructor(id, client, queryJSON, subscriptionId) {
      var _this = this;

      EventEmitter.apply(this);
      this.id = id;
      this._client = client;
      this._client.register(this);
      this._queryJSON = queryJSON;
      this._subscriptionId = subscriptionId;
      this._onMessage = this._dispatch.bind(this);
      this._onReconnect = function () {
        subscribe(_this._queryJSON, _this._subscriptionId).catch(function (error) {
          return console.error('LiveQuery resubscribe error: ' + error.message);
        });
      };
      client.on('message', this._onMessage);
      client.on('reconnect', this._onReconnect);
    },
    _dispatch: function _dispatch(message) {
      var _this2 = this;

      message.forEach(function (_ref) {
        var op = _ref.op,
            object = _ref.object,
            queryId = _ref.query_id,
            updatedKeys = _ref.updatedKeys;

        if (queryId !== _this2.id) return;
        var target = AV.parseJSON(_.extend({
          __type: object.className === '_File' ? 'File' : 'Object'
        }, object));
        if (updatedKeys) {
          /**
           * An existing AV.Object which fulfills the Query you subscribe is updated.
           * @event AV.LiveQuery#update
           * @param {AV.Object|AV.File} target updated object
           * @param {String[]} updatedKeys updated keys
           */
          /**
           * An existing AV.Object which doesn't fulfill the Query is updated and now it fulfills the Query.
           * @event AV.LiveQuery#enter
           * @param {AV.Object|AV.File} target updated object
           * @param {String[]} updatedKeys updated keys
           */
          /**
           * An existing AV.Object which fulfills the Query is updated and now it doesn't fulfill the Query.
           * @event AV.LiveQuery#leave
           * @param {AV.Object|AV.File} target updated object
           * @param {String[]} updatedKeys updated keys
           */
          _this2.emit(op, target, updatedKeys);
        } else {
          /**
           * A new AV.Object which fulfills the Query you subscribe is created.
           * @event AV.LiveQuery#create
           * @param {AV.Object|AV.File} target updated object
           */
          /**
           * An existing AV.Object which fulfills the Query you subscribe is deleted.
           * @event AV.LiveQuery#delete
           * @param {AV.Object|AV.File} target updated object
           */
          _this2.emit(op, target);
        }
      });
    },

    /**
     * unsubscribe the query
     *
     * @return {Promise}
     */
    unsubscribe: function unsubscribe() {
      var client = this._client;
      client.off('message', this._onMessage);
      client.off('reconnect', this._onReconnect);
      client.deregister(this);
      return request({
        method: 'POST',
        path: '/LiveQuery/unsubscribe',
        data: {
          id: client.id,
          query_id: this.id
        }
      });
    }
  },
  /** @lends AV.LiveQuery */
  {
    init: function init(query) {
      var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref2$subscriptionId = _ref2.subscriptionId,
          userDefinedSubscriptionId = _ref2$subscriptionId === undefined ? AV._getSubscriptionId() : _ref2$subscriptionId;

      requireRealtime();
      if (!(query instanceof AV.Query)) throw new TypeError('LiveQuery must be inited with a Query');
      return _promise2.default.resolve(userDefinedSubscriptionId).then(function (subscriptionId) {
        return AV._config.realtime.createLiveQueryClient(subscriptionId).then(function (liveQueryClient) {
          var _query$_getParams = query._getParams(),
              where = _query$_getParams.where,
              keys = _query$_getParams.keys,
              returnACL = _query$_getParams.returnACL;

          var queryJSON = {
            where: where,
            keys: keys,
            returnACL: returnACL,
            className: query.className
          };
          var promise = subscribe(queryJSON, subscriptionId).then(function (_ref3) {
            var queryId = _ref3.query_id;
            return new AV.LiveQuery(queryId, liveQueryClient, queryJSON, subscriptionId);
          }).finally(function () {
            liveQueryClient.deregister(promise);
          });
          liveQueryClient.register(promise);
          return promise;
        });
      });
    },

    /**
     * Pause the LiveQuery connection. This is useful to deactivate the SDK when the app is swtiched to background.
     * @static
     * @return void
     */
    pause: function pause() {
      requireRealtime();
      return AV._config.realtime.pause();
    },

    /**
     * Resume the LiveQuery connection. All subscriptions will be restored after reconnection.
     * @static
     * @return void
     */
    resume: function resume() {
      requireRealtime();
      return AV._config.realtime.resume();
    }
  });
};
}, function(modId) { var map = {"./utils":1595492076963,"./request":1595492076981}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1595492076988, function(require, module, exports) {


var _ = require('underscore');

var _require = require('./utils'),
    tap = _require.tap;

module.exports = function (AV) {
  /**
   * @class
   * @example
   * AV.Captcha.request().then(captcha => {
   *   captcha.bind({
   *     textInput: 'code', // the id for textInput
   *     image: 'captcha',
   *     verifyButton: 'verify',
   *   }, {
   *     success: (validateCode) => {}, // next step
   *     error: (error) => {}, // present error.message to user
   *   });
   * });
   */
  AV.Captcha = function Captcha(options, authOptions) {
    this._options = options;
    this._authOptions = authOptions;
    /**
     * The image url of the captcha
     * @type string
     */
    this.url = undefined;
    /**
     * The captchaToken of the captcha.
     * @type string
     */
    this.captchaToken = undefined;
    /**
     * The validateToken of the captcha.
     * @type string
     */
    this.validateToken = undefined;
  };

  /**
   * Refresh the captcha
   * @return {Promise.<string>} a new capcha url
   */
  AV.Captcha.prototype.refresh = function refresh() {
    var _this = this;

    return AV.Cloud._requestCaptcha(this._options, this._authOptions).then(function (_ref) {
      var captchaToken = _ref.captchaToken,
          url = _ref.url;

      _.extend(_this, { captchaToken: captchaToken, url: url });
      return url;
    });
  };

  /**
   * Verify the captcha
   * @param {String} code The code from user input
   * @return {Promise.<string>} validateToken if the code is valid
   */
  AV.Captcha.prototype.verify = function verify(code) {
    var _this2 = this;

    return AV.Cloud.verifyCaptcha(code, this.captchaToken).then(tap(function (validateToken) {
      return _this2.validateToken = validateToken;
    }));
  };

  if ('NODE_JS' === 'Browser') {
    /**
     * Bind the captcha to HTMLElements. <b>ONLY AVAILABLE in browsers</b>.
     * @param [elements]
     * @param {String|HTMLInputElement} [elements.textInput] An input element typed text, or the id for the element.
     * @param {String|HTMLImageElement} [elements.image] An image element, or the id for the element.
     * @param {String|HTMLElement} [elements.verifyButton] A button element, or the id for the element.
     * @param [callbacks]
     * @param {Function} [callbacks.success] Success callback will be called if the code is verified. The param `validateCode` can be used for further SMS request.
     * @param {Function} [callbacks.error] Error callback will be called if something goes wrong, detailed in param `error.message`.
     */
    AV.Captcha.prototype.bind = function bind(_ref2, _ref3) {
      var _this3 = this;

      var textInput = _ref2.textInput,
          image = _ref2.image,
          verifyButton = _ref2.verifyButton;
      var success = _ref3.success,
          error = _ref3.error;

      if (typeof textInput === 'string') {
        textInput = document.getElementById(textInput);
        if (!textInput) throw new Error('textInput with id ' + textInput + ' not found');
      }
      if (typeof image === 'string') {
        image = document.getElementById(image);
        if (!image) throw new Error('image with id ' + image + ' not found');
      }
      if (typeof verifyButton === 'string') {
        verifyButton = document.getElementById(verifyButton);
        if (!verifyButton) throw new Error('verifyButton with id ' + verifyButton + ' not found');
      }

      this.__refresh = function () {
        return _this3.refresh().then(function (url) {
          image.src = url;
          if (textInput) {
            textInput.value = '';
            textInput.focus();
          }
        }).catch(function (err) {
          return console.warn('refresh captcha fail: ' + err.message);
        });
      };
      if (image) {
        this.__image = image;
        image.src = this.url;
        image.addEventListener('click', this.__refresh);
      }

      this.__verify = function () {
        var code = textInput.value;
        _this3.verify(code).catch(function (err) {
          _this3.__refresh();
          throw err;
        }).then(success, error).catch(function (err) {
          return console.warn('verify captcha fail: ' + err.message);
        });
      };
      if (textInput && verifyButton) {
        this.__verifyButton = verifyButton;
        verifyButton.addEventListener('click', this.__verify);
      }
    };

    /**
     * unbind the captcha from HTMLElements. <b>ONLY AVAILABLE in browsers</b>.
     */
    AV.Captcha.prototype.unbind = function unbind() {
      if (this.__image) this.__image.removeEventListener('click', this.__refresh);
      if (this.__verifyButton) this.__verifyButton.removeEventListener('click', this.__verify);
    };
  }

  /**
   * Request a captcha
   * @param [options]
   * @param {Number} [options.width] width(px) of the captcha, ranged 60-200
   * @param {Number} [options.height] height(px) of the captcha, ranged 30-100
   * @param {Number} [options.size=4] length of the captcha, ranged 3-6. MasterKey required.
   * @param {Number} [options.ttl=60] time to live(s), ranged 10-180. MasterKey required.
   * @return {Promise.<AV.Captcha>}
   */
  AV.Captcha.request = function (options, authOptions) {
    var captcha = new AV.Captcha(options, authOptions);
    return captcha.refresh().then(function () {
      return captcha;
    });
  };
};
}, function(modId) { var map = {"./utils":1595492076963}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1595492076989, function(require, module, exports) {


var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require('underscore');

var _require = require('./request'),
    _request = _require._request,
    request = _require.request;

module.exports = function (AV) {
  /**
   * Contains functions for calling and declaring
   * <p><strong><em>
   *   Some functions are only available from Cloud Code.
   * </em></strong></p>
   *
   * @namespace
   * @borrows AV.Captcha.request as requestCaptcha
   */
  AV.Cloud = AV.Cloud || {};

  _.extend(AV.Cloud,
  /** @lends AV.Cloud */{
    /**
     * Makes a call to a cloud function.
     * @param {String} name The function name.
     * @param {Object} data The parameters to send to the cloud function.
     * @param {AuthOptions} options
     * @return {Promise} A promise that will be resolved with the result
     * of the function.
     */
    run: function run(name, data, options) {
      return request({
        service: 'engine',
        method: 'POST',
        path: '/functions/' + name,
        data: AV._encode(data, null, true),
        authOptions: options
      }).then(function (resp) {
        return AV._decode(resp).result;
      });
    },


    /**
     * Makes a call to a cloud function, you can send {AV.Object} as param or a field of param; the response
     * from server will also be parsed as an {AV.Object}, array of {AV.Object}, or object includes {AV.Object}
     * @param {String} name The function name.
     * @param {Object} data The parameters to send to the cloud function.
     * @param {AuthOptions} options
     * @return {Promise} A promise that will be resolved with the result of the function.
     */
    rpc: function rpc(name, data, options) {
      if (_.isArray(data)) {
        return _promise2.default.reject(new Error("Can't pass Array as the param of rpc function in JavaScript SDK."));
      }

      return request({
        service: 'engine',
        method: 'POST',
        path: '/call/' + name,
        data: AV._encodeObjectOrArray(data),
        authOptions: options
      }).then(function (resp) {
        return AV._decode(resp).result;
      });
    },


    /**
     * Make a call to request server date time.
     * @return {Promise.<Date>} A promise that will be resolved with the result
     * of the function.
     * @since 0.5.9
     */
    getServerDate: function getServerDate() {
      return _request('date', null, null, 'GET').then(function (resp) {
        return AV._decode(resp);
      });
    },


    /**
     * Makes a call to request a sms code for operation verification.
     * @param {String|Object} data The mobile phone number string or a JSON
     *    object that contains mobilePhoneNumber,template,sign,op,ttl,name etc.
     * @param {String} data.mobilePhoneNumber
     * @param {String} [data.template] sms template name
     * @param {String} [data.sign] sms signature name
     * @param {AuthOptions} [options] AuthOptions plus:
     * @param {String} [options.validateToken] a validate token returned by {@link AV.Cloud.verifyCaptcha}
     * @return {Promise} A promise that will be resolved if the request succeed
     */
    requestSmsCode: function requestSmsCode(data) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (_.isString(data)) {
        data = { mobilePhoneNumber: data };
      }
      if (!data.mobilePhoneNumber) {
        throw new Error('Missing mobilePhoneNumber.');
      }
      if (options.validateToken) {
        data = _.extend({}, data, {
          validate_token: options.validateToken
        });
      }
      return _request('requestSmsCode', null, null, 'POST', data, options);
    },


    /**
     * Makes a call to verify sms code that sent by AV.Cloud.requestSmsCode
     * @param {String} code The sms code sent by AV.Cloud.requestSmsCode
     * @param {phone} phone The mobile phoner number(optional).
     * @return {Promise} A promise that will be resolved with the result
     * of the function.
     */
    verifySmsCode: function verifySmsCode(code, phone) {
      if (!code) throw new Error('Missing sms code.');
      var params = {};
      if (_.isString(phone)) {
        params['mobilePhoneNumber'] = phone;
      }

      return _request('verifySmsCode', code, null, 'POST', params);
    },
    _requestCaptcha: function _requestCaptcha(options, authOptions) {
      return _request('requestCaptcha', null, null, 'GET', options, authOptions).then(function (_ref) {
        var url = _ref.captcha_url,
            captchaToken = _ref.captcha_token;
        return {
          captchaToken: captchaToken,
          url: url
        };
      });
    },


    /**
     * Request a captcha.
     */
    requestCaptcha: AV.Captcha.request,

    /**
     * Verify captcha code. This is the low-level API for captcha.
     * Checkout {@link AV.Captcha} for high abstract APIs.
     * @param {String} code the code from user input
     * @param {String} captchaToken captchaToken returned by {@link AV.Cloud.requestCaptcha}
     * @return {Promise.<String>} validateToken if the code is valid
     */
    verifyCaptcha: function verifyCaptcha(code, captchaToken) {
      return _request('verifyCaptcha', null, null, 'POST', {
        captcha_code: code,
        captcha_token: captchaToken
      }).then(function (_ref2) {
        var validateToken = _ref2.validate_token;
        return validateToken;
      });
    }
  });
};
}, function(modId) { var map = {"./request":1595492076981}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1595492076990, function(require, module, exports) {


var request = require('./request').request;

module.exports = function (AV) {
  AV.Installation = AV.Object.extend('_Installation');

  /**
   * @namespace
   */
  AV.Push = AV.Push || {};

  /**
   * Sends a push notification.
   * @param {Object} data The data of the push notification.
   * @param {String[]} [data.channels] An Array of channels to push to.
   * @param {Date} [data.push_time] A Date object for when to send the push.
   * @param {Date} [data.expiration_time]  A Date object for when to expire
   *         the push.
   * @param {Number} [data.expiration_interval] The seconds from now to expire the push.
   * @param {Number} [data.flow_control] The clients to notify per second
   * @param {AV.Query} [data.where] An AV.Query over AV.Installation that is used to match
   *         a set of installations to push to.
   * @param {String} [data.cql] A CQL statement over AV.Installation that is used to match
   *         a set of installations to push to.
   * @param {Object} data.data The data to send as part of the push.
             More details:  https://url.leanapp.cn/pushData
   * @param {AuthOptions} [options]
   * @return {Promise}
   */
  AV.Push.send = function (data, options) {
    if (data.where) {
      data.where = data.where._getParams().where;
    }

    if (data.where && data.cql) {
      throw new Error("Both where and cql can't be set");
    }

    if (data.push_time) {
      data.push_time = data.push_time.toJSON();
    }

    if (data.expiration_time) {
      data.expiration_time = data.expiration_time.toJSON();
    }

    if (data.expiration_time && data.expiration_time_interval) {
      throw new Error("Both expiration_time and expiration_time_interval can't be set");
    }

    return request({
      service: 'push',
      method: 'POST',
      path: '/push',
      data: data,
      authOptions: options
    });
  };
};
}, function(modId) { var map = {"./request":1595492076981}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1595492076991, function(require, module, exports) {


var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require('underscore');
var AVRequest = require('./request')._request;

var _require = require('./utils'),
    getSessionToken = _require.getSessionToken;

module.exports = function (AV) {
  var getUser = function getUser() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var sessionToken = getSessionToken(options);
    if (sessionToken) {
      return AV.User._fetchUserBySessionToken(getSessionToken(options));
    }
    return AV.User.currentAsync();
  };

  var getUserPointer = function getUserPointer(options) {
    return getUser(options).then(function (currUser) {
      return AV.Object.createWithoutData('_User', currUser.id)._toPointer();
    });
  };

  /**
   * Contains functions to deal with Status in LeanCloud.
   * @class
   */
  AV.Status = function (imageUrl, message) {
    this.data = {};
    this.inboxType = 'default';
    this.query = null;
    if (imageUrl && (typeof imageUrl === 'undefined' ? 'undefined' : (0, _typeof3.default)(imageUrl)) === 'object') {
      this.data = imageUrl;
    } else {
      if (imageUrl) {
        this.data.image = imageUrl;
      }
      if (message) {
        this.data.message = message;
      }
    }
    return this;
  };

  _.extend(AV.Status.prototype,
  /** @lends AV.Status.prototype */{
    /**
     * Gets the value of an attribute in status data.
     * @param {String} attr The string name of an attribute.
     */
    get: function get(attr) {
      return this.data[attr];
    },
    /**
     * Sets a hash of model attributes on the status data.
     * @param {String} key The key to set.
     * @param {} value The value to give it.
     */
    set: function set(key, value) {
      this.data[key] = value;
      return this;
    },
    /**
     * Destroy this status,then it will not be avaiable in other user's inboxes.
     * @param {AuthOptions} options
     * @return {Promise} A promise that is fulfilled when the destroy
     *     completes.
     */
    destroy: function destroy(options) {
      if (!this.id) return _promise2.default.reject(new Error('The status id is not exists.'));
      var request = AVRequest('statuses', null, this.id, 'DELETE', options);
      return request;
    },
    /**
     * Cast the AV.Status object to an AV.Object pointer.
     * @return {AV.Object} A AV.Object pointer.
     */
    toObject: function toObject() {
      if (!this.id) return null;
      return AV.Object.createWithoutData('_Status', this.id);
    },
    _getDataJSON: function _getDataJSON() {
      var json = _.clone(this.data);
      return AV._encode(json);
    },
    /**
     * Send a status by a AV.Query object.
     * @since 0.3.0
     * @param {AuthOptions} options
     * @return {Promise} A promise that is fulfilled when the send
     *     completes.
     * @example
     *     // send a status to male users
     *     var status = new AVStatus('image url', 'a message');
     *     status.query = new AV.Query('_User');
     *     status.query.equalTo('gender', 'male');
     *     status.send().then(function(){
     *              //send status successfully.
     *      }, function(err){
     *             //an error threw.
     *             console.dir(err);
     *      });
     */
    send: function send() {
      var _this = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (!getSessionToken(options) && !AV.User.current()) {
        throw new Error('Please signin an user.');
      }
      if (!this.query) {
        return AV.Status.sendStatusToFollowers(this, options);
      }

      return getUserPointer(options).then(function (currUser) {
        var query = _this.query._getParams();
        query.className = _this.query.className;
        var data = {};
        data.query = query;
        _this.data = _this.data || {};
        _this.data.source = _this.data.source || currUser;
        data.data = _this._getDataJSON();
        data.inboxType = _this.inboxType || 'default';

        return AVRequest('statuses', null, null, 'POST', data, options);
      }).then(function (response) {
        _this.id = response.objectId;
        _this.createdAt = AV._parseDate(response.createdAt);
        return _this;
      });
    },

    _finishFetch: function _finishFetch(serverData) {
      this.id = serverData.objectId;
      this.createdAt = AV._parseDate(serverData.createdAt);
      this.updatedAt = AV._parseDate(serverData.updatedAt);
      this.messageId = serverData.messageId;
      delete serverData.messageId;
      delete serverData.objectId;
      delete serverData.createdAt;
      delete serverData.updatedAt;
      this.data = AV._decode(serverData);
    }
  });

  /**
   * Send a status to current signined user's followers.
   * @since 0.3.0
   * @param {AV.Status} status  A status object to be send to followers.
   * @param {AuthOptions} options
   * @return {Promise} A promise that is fulfilled when the send
   *     completes.
   * @example
   *     var status = new AVStatus('image url', 'a message');
   *     AV.Status.sendStatusToFollowers(status).then(function(){
   *              //send status successfully.
   *      }, function(err){
   *             //an error threw.
   *             console.dir(err);
   *      });
   */
  AV.Status.sendStatusToFollowers = function (status) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (!getSessionToken(options) && !AV.User.current()) {
      throw new Error('Please signin an user.');
    }
    return getUserPointer(options).then(function (currUser) {
      var query = {};
      query.className = '_Follower';
      query.keys = 'follower';
      query.where = { user: currUser };
      var data = {};
      data.query = query;
      status.data = status.data || {};
      status.data.source = status.data.source || currUser;
      data.data = status._getDataJSON();
      data.inboxType = status.inboxType || 'default';

      var request = AVRequest('statuses', null, null, 'POST', data, options);
      return request.then(function (response) {
        status.id = response.objectId;
        status.createdAt = AV._parseDate(response.createdAt);
        return status;
      });
    });
  };

  /**
   * <p>Send  a status from current signined user to other user's private status inbox.</p>
   * @since 0.3.0
   * @param {AV.Status} status  A status object to be send to followers.
   * @param {String} target The target user or user's objectId.
   * @param {AuthOptions} options
   * @return {Promise} A promise that is fulfilled when the send
   *     completes.
   * @example
   *     // send a private status to user '52e84e47e4b0f8de283b079b'
   *     var status = new AVStatus('image url', 'a message');
   *     AV.Status.sendPrivateStatus(status, '52e84e47e4b0f8de283b079b').then(function(){
   *              //send status successfully.
   *      }, function(err){
   *             //an error threw.
   *             console.dir(err);
   *      });
   */
  AV.Status.sendPrivateStatus = function (status, target) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    if (!getSessionToken(options) && !AV.User.current()) {
      throw new Error('Please signin an user.');
    }
    if (!target) {
      throw new Error('Invalid target user.');
    }
    var userObjectId = _.isString(target) ? target : target.id;
    if (!userObjectId) {
      throw new Error('Invalid target user.');
    }
    return getUserPointer(options).then(function (currUser) {
      var query = {};
      query.className = '_User';
      query.where = { objectId: userObjectId };
      var data = {};
      data.query = query;
      status.data = status.data || {};
      status.data.source = status.data.source || currUser;
      data.data = status._getDataJSON();
      data.inboxType = 'private';
      status.inboxType = 'private';

      var request = AVRequest('statuses', null, null, 'POST', data, options);
      return request.then(function (response) {
        status.id = response.objectId;
        status.createdAt = AV._parseDate(response.createdAt);
        return status;
      });
    });
  };

  /**
   * Count unread statuses in someone's inbox.
   * @since 0.3.0
   * @param {AV.User} owner The status owner.
   * @param {String} inboxType The inbox type, 'default' by default.
   * @param {AuthOptions} options
   * @return {Promise} A promise that is fulfilled when the count
   *     completes.
   * @example
   *  AV.Status.countUnreadStatuses(AV.User.current()).then(function(response){
   *    console.log(response.unread); //unread statuses number.
   *    console.log(response.total);  //total statuses number.
   *  });
   */
  AV.Status.countUnreadStatuses = function (owner) {
    var inboxType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'default';
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    if (!_.isString(inboxType)) options = inboxType;
    if (!getSessionToken(options) && owner == null && !AV.User.current()) {
      throw new Error('Please signin an user or pass the owner objectId.');
    }
    return _promise2.default.resolve(owner || getUser(options)).then(function (owner) {
      var params = {};
      params.inboxType = AV._encode(inboxType);
      params.owner = AV._encode(owner);
      return AVRequest('subscribe/statuses/count', null, null, 'GET', params, options);
    });
  };

  /**
   * reset unread statuses count in someone's inbox.
   * @since 2.1.0
   * @param {AV.User} owner The status owner.
   * @param {String} inboxType The inbox type, 'default' by default.
   * @param {AuthOptions} options
   * @return {Promise} A promise that is fulfilled when the reset
   *     completes.
   * @example
   *  AV.Status.resetUnreadCount(AV.User.current()).then(function(response){
   *    console.log(response.unread); //unread statuses number.
   *    console.log(response.total);  //total statuses number.
   *  });
   */
  AV.Status.resetUnreadCount = function (owner) {
    var inboxType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'default';
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    if (!_.isString(inboxType)) options = inboxType;
    if (!getSessionToken(options) && owner == null && !AV.User.current()) {
      throw new Error('Please signin an user or pass the owner objectId.');
    }
    return _promise2.default.resolve(owner || getUser(options)).then(function (owner) {
      var params = {};
      params.inboxType = AV._encode(inboxType);
      params.owner = AV._encode(owner);
      return AVRequest('subscribe/statuses/resetUnreadCount', null, null, 'POST', params, options);
    });
  };

  /**
   * Create a status query to find someone's published statuses.
   * @since 0.3.0
   * @param {AV.User} source The status source, typically the publisher.
   * @return {AV.Query} The query object for status.
   * @example
   *   //Find current user's published statuses.
   *   var query = AV.Status.statusQuery(AV.User.current());
   *   query.find().then(function(statuses){
   *      //process statuses
   *   });
   */
  AV.Status.statusQuery = function (source) {
    var query = new AV.Query('_Status');
    if (source) {
      query.equalTo('source', source);
    }
    return query;
  };

  /**
   * <p>AV.InboxQuery defines a query that is used to fetch somebody's inbox statuses.</p>
   * @class
   */
  AV.InboxQuery = AV.Query._extend(
  /** @lends AV.InboxQuery.prototype */{
    _objectClass: AV.Status,
    _sinceId: 0,
    _maxId: 0,
    _inboxType: 'default',
    _owner: null,
    _newObject: function _newObject() {
      return new AV.Status();
    },
    _createRequest: function _createRequest(params, options) {
      return AV.InboxQuery.__super__._createRequest.call(this, params, options, '/subscribe/statuses');
    },

    /**
     * Sets the messageId of results to skip before returning any results.
     * This is useful for pagination.
     * Default is zero.
     * @param {Number} n the mesage id.
     * @return {AV.InboxQuery} Returns the query, so you can chain this call.
     */
    sinceId: function sinceId(id) {
      this._sinceId = id;
      return this;
    },
    /**
     * Sets the maximal messageId of results。
     * This is useful for pagination.
     * Default is zero that is no limition.
     * @param {Number} n the mesage id.
     * @return {AV.InboxQuery} Returns the query, so you can chain this call.
     */
    maxId: function maxId(id) {
      this._maxId = id;
      return this;
    },
    /**
     * Sets the owner of the querying inbox.
     * @param {AV.User} owner The inbox owner.
     * @return {AV.InboxQuery} Returns the query, so you can chain this call.
     */
    owner: function owner(_owner) {
      this._owner = _owner;
      return this;
    },
    /**
     * Sets the querying inbox type.default is 'default'.
     * @param {Object} type The inbox type.
     * @return {AV.InboxQuery} Returns the query, so you can chain this call.
     */
    inboxType: function inboxType(type) {
      this._inboxType = type;
      return this;
    },
    _getParams: function _getParams() {
      var params = AV.InboxQuery.__super__._getParams.call(this);
      params.owner = AV._encode(this._owner);
      params.inboxType = AV._encode(this._inboxType);
      params.sinceId = AV._encode(this._sinceId);
      params.maxId = AV._encode(this._maxId);
      return params;
    }
  });

  /**
   * Create a inbox status query to find someone's inbox statuses.
   * @since 0.3.0
   * @param {AV.User} owner The inbox's owner
   * @param {String} inboxType The inbox type,'default' by default.
   * @return {AV.InboxQuery} The inbox query object.
   * @see AV.InboxQuery
   * @example
   *   //Find current user's default inbox statuses.
   *   var query = AV.Status.inboxQuery(AV.User.current());
   *   //find the statuses after the last message id
   *   query.sinceId(lastMessageId);
   *   query.find().then(function(statuses){
   *      //process statuses
   *   });
   */
  AV.Status.inboxQuery = function (owner, inboxType) {
    var query = new AV.InboxQuery(AV.Status);
    if (owner) {
      query._owner = owner;
    }
    if (inboxType) {
      query._inboxType = inboxType;
    }
    return query;
  };
};
}, function(modId) { var map = {"./request":1595492076981,"./utils":1595492076963}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1595492076992, function(require, module, exports) {


var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require('underscore');
var AVRequest = require('./request')._request;

module.exports = function (AV) {
  /**
   * A builder to generate sort string for app searching.For example:
   * @class
   * @since 0.5.1
   * @example
   *   var builder = new AV.SearchSortBuilder();
   *   builder.ascending('key1').descending('key2','max');
   *   var query = new AV.SearchQuery('Player');
   *   query.sortBy(builder);
   *   query.find().then();
   */
  AV.SearchSortBuilder = function () {
    this._sortFields = [];
  };

  _.extend(AV.SearchSortBuilder.prototype,
  /** @lends AV.SearchSortBuilder.prototype */{
    _addField: function _addField(key, order, mode, missing) {
      var field = {};
      field[key] = {
        order: order || 'asc',
        mode: mode || 'avg',
        missing: '_' + (missing || 'last')
      };
      this._sortFields.push(field);
      return this;
    },

    /**
     * Sorts the results in ascending order by the given key and options.
     *
     * @param {String} key The key to order by.
     * @param {String} mode The sort mode, default is 'avg', you can choose
     *                  'max' or 'min' too.
     * @param {String} missing The missing key behaviour, default is 'last',
     *                  you can choose 'first' too.
     * @return {AV.SearchSortBuilder} Returns the builder, so you can chain this call.
     */
    ascending: function ascending(key, mode, missing) {
      return this._addField(key, 'asc', mode, missing);
    },

    /**
     * Sorts the results in descending order by the given key and options.
     *
     * @param {String} key The key to order by.
     * @param {String} mode The sort mode, default is 'avg', you can choose
     *                  'max' or 'min' too.
     * @param {String} missing The missing key behaviour, default is 'last',
     *                  you can choose 'first' too.
     * @return {AV.SearchSortBuilder} Returns the builder, so you can chain this call.
     */
    descending: function descending(key, mode, missing) {
      return this._addField(key, 'desc', mode, missing);
    },

    /**
     * Add a proximity based constraint for finding objects with key point
     * values near the point given.
     * @param {String} key The key that the AV.GeoPoint is stored in.
     * @param {AV.GeoPoint} point The reference AV.GeoPoint that is used.
     * @param {Object} options The other options such as mode,order, unit etc.
     * @return {AV.SearchSortBuilder} Returns the builder, so you can chain this call.
     */
    whereNear: function whereNear(key, point, options) {
      options = options || {};
      var field = {};
      var geo = {
        lat: point.latitude,
        lon: point.longitude
      };
      var m = {
        order: options.order || 'asc',
        mode: options.mode || 'avg',
        unit: options.unit || 'km'
      };
      m[key] = geo;
      field['_geo_distance'] = m;

      this._sortFields.push(field);
      return this;
    },

    /**
     * Build a sort string by configuration.
     * @return {String} the sort string.
     */
    build: function build() {
      return (0, _stringify2.default)(AV._encode(this._sortFields));
    }
  });

  /**
   * App searching query.Use just like AV.Query:
   *
   * Visit <a href='https://leancloud.cn/docs/app_search_guide.html'>App Searching Guide</a>
   * for more details.
   * @class
   * @since 0.5.1
   * @example
   *   var query = new AV.SearchQuery('Player');
   *   query.queryString('*');
   *   query.find().then(function(results) {
   *     console.log('Found %d objects', query.hits());
   *     //Process results
   *   });
   */
  AV.SearchQuery = AV.Query._extend(
  /** @lends AV.SearchQuery.prototype */{
    _sid: null,
    _hits: 0,
    _queryString: null,
    _highlights: null,
    _sortBuilder: null,
    _createRequest: function _createRequest(params, options) {
      return AVRequest('search/select', null, null, 'GET', params || this._getParams(), options);
    },

    /**
     * Sets the sid of app searching query.Default is null.
     * @param {String} sid  Scroll id for searching.
     * @return {AV.SearchQuery} Returns the query, so you can chain this call.
     */
    sid: function sid(_sid) {
      this._sid = _sid;
      return this;
    },

    /**
     * Sets the query string of app searching.
     * @param {String} q  The query string.
     * @return {AV.SearchQuery} Returns the query, so you can chain this call.
     */
    queryString: function queryString(q) {
      this._queryString = q;
      return this;
    },

    /**
     * Sets the highlight fields. Such as
     * <pre><code>
     *   query.highlights('title');
     *   //or pass an array.
     *   query.highlights(['title', 'content'])
     * </code></pre>
     * @param {String|String[]} highlights a list of fields.
     * @return {AV.SearchQuery} Returns the query, so you can chain this call.
     */
    highlights: function highlights(_highlights) {
      var objects;
      if (_highlights && _.isString(_highlights)) {
        objects = arguments;
      } else {
        objects = _highlights;
      }
      this._highlights = objects;
      return this;
    },

    /**
     * Sets the sort builder for this query.
     * @see AV.SearchSortBuilder
     * @param { AV.SearchSortBuilder} builder The sort builder.
     * @return {AV.SearchQuery} Returns the query, so you can chain this call.
     *
     */
    sortBy: function sortBy(builder) {
      this._sortBuilder = builder;
      return this;
    },

    /**
     * Returns the number of objects that match this query.
     * @return {Number}
     */
    hits: function hits() {
      if (!this._hits) {
        this._hits = 0;
      }
      return this._hits;
    },

    _processResult: function _processResult(json) {
      delete json['className'];
      delete json['_app_url'];
      delete json['_deeplink'];
      return json;
    },

    /**
     * Returns true when there are more documents can be retrieved by this
     * query instance, you can call find function to get more results.
     * @see AV.SearchQuery#find
     * @return {Boolean}
     */
    hasMore: function hasMore() {
      return !this._hitEnd;
    },

    /**
     * Reset current query instance state(such as sid, hits etc) except params
     * for a new searching. After resetting, hasMore() will return true.
     */
    reset: function reset() {
      this._hitEnd = false;
      this._sid = null;
      this._hits = 0;
    },

    /**
     * Retrieves a list of AVObjects that satisfy this query.
     * Either options.success or options.error is called when the find
     * completes.
     *
     * @see AV.Query#find
     * @return {Promise} A promise that is resolved with the results when
     * the query completes.
     */
    find: function find() {
      var self = this;

      var request = this._createRequest();

      return request.then(function (response) {
        //update sid for next querying.
        if (response.sid) {
          self._oldSid = self._sid;
          self._sid = response.sid;
        } else {
          self._sid = null;
          self._hitEnd = true;
        }
        self._hits = response.hits || 0;

        return _.map(response.results, function (json) {
          if (json.className) {
            response.className = json.className;
          }
          var obj = self._newObject(response);
          obj.appURL = json['_app_url'];
          obj._finishFetch(self._processResult(json), true);
          return obj;
        });
      });
    },

    _getParams: function _getParams() {
      var params = AV.SearchQuery.__super__._getParams.call(this);
      delete params.where;
      if (this.className) {
        params.clazz = this.className;
      }
      if (this._sid) {
        params.sid = this._sid;
      }
      if (!this._queryString) {
        throw new Error('Please set query string.');
      } else {
        params.q = this._queryString;
      }
      if (this._highlights) {
        params.highlights = this._highlights.join(',');
      }
      if (this._sortBuilder && params.order) {
        throw new Error('sort and order can not be set at same time.');
      }
      if (this._sortBuilder) {
        params.sort = this._sortBuilder.build();
      }

      return params;
    }
  });
};

/**
 * Sorts the results in ascending order by the given key.
 *
 * @method AV.SearchQuery#ascending
 * @param {String} key The key to order by.
 * @return {AV.SearchQuery} Returns the query, so you can chain this call.
 */
/**
 * Also sorts the results in ascending order by the given key. The previous sort keys have
 * precedence over this key.
 *
 * @method AV.SearchQuery#addAscending
 * @param {String} key The key to order by
 * @return {AV.SearchQuery} Returns the query so you can chain this call.
 */
/**
 * Sorts the results in descending order by the given key.
 *
 * @method AV.SearchQuery#descending
 * @param {String} key The key to order by.
 * @return {AV.SearchQuery} Returns the query, so you can chain this call.
 */
/**
 * Also sorts the results in descending order by the given key. The previous sort keys have
 * precedence over this key.
 *
 * @method AV.SearchQuery#addDescending
 * @param {String} key The key to order by
 * @return {AV.SearchQuery} Returns the query so you can chain this call.
 */
/**
 * Include nested AV.Objects for the provided key.  You can use dot
 * notation to specify which fields in the included object are also fetch.
 * @method AV.SearchQuery#include
 * @param {String[]} keys The name of the key to include.
 * @return {AV.SearchQuery} Returns the query, so you can chain this call.
 */
/**
 * Sets the number of results to skip before returning any results.
 * This is useful for pagination.
 * Default is to skip zero results.
 * @method AV.SearchQuery#skip
 * @param {Number} n the number of results to skip.
 * @return {AV.SearchQuery} Returns the query, so you can chain this call.
 */
/**
 * Sets the limit of the number of results to return. The default limit is
 * 100, with a maximum of 1000 results being returned at a time.
 * @method AV.SearchQuery#limit
 * @param {Number} n the number of results to limit to.
 * @return {AV.SearchQuery} Returns the query, so you can chain this call.
 */
}, function(modId) { var map = {"./request":1595492076981}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1595492076993, function(require, module, exports) {


var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require('underscore');
var AVError = require('./error');

var _require = require('./request'),
    request = _require.request;

module.exports = function (AV) {
  /**
   * 包含了使用了 LeanCloud
   *  <a href='/docs/leaninsight_guide.html'>离线数据分析功能</a>的函数。
   * <p><strong><em>
   *   仅在云引擎运行环境下有效。
   * </em></strong></p>
   * @namespace
   */
  AV.Insight = AV.Insight || {};

  _.extend(AV.Insight,
  /** @lends AV.Insight */{
    /**
     * 开始一个 Insight 任务。结果里将返回 Job id，你可以拿得到的 id 使用
     * AV.Insight.JobQuery 查询任务状态和结果。
     * @param {Object} jobConfig 任务配置的 JSON 对象，例如：<code><pre>
     *                   { "sql" : "select count(*) as c,gender from _User group by gender",
     *                     "saveAs": {
     *                         "className" : "UserGender",
     *                         "limit": 1
     *                      }
     *                   }
     *                  </pre></code>
     *               sql 指定任务执行的 SQL 语句， saveAs（可选） 指定将结果保存在哪张表里，limit 最大 1000。
     * @param {AuthOptions} [options]
     * @return {Promise} A promise that will be resolved with the result
     * of the function.
     */
    startJob: function startJob(jobConfig, options) {
      if (!jobConfig || !jobConfig.sql) {
        throw new Error('Please provide the sql to run the job.');
      }
      var data = {
        jobConfig: jobConfig,
        appId: AV.applicationId
      };
      return request({
        path: '/bigquery/jobs',
        method: 'POST',
        data: AV._encode(data, null, true),
        authOptions: options,
        signKey: false
      }).then(function (resp) {
        return AV._decode(resp).id;
      });
    },

    /**
     * 监听 Insight 任务事件（未来推出独立部署的离线分析服务后开放）
     *  <p><strong><em>
     *     仅在云引擎运行环境下有效。
     *  </em></strong></p>
     * @param {String} event 监听的事件，目前尚不支持。
     * @param {Function} 监听回调函数，接收 (err, id) 两个参数，err 表示错误信息，
     *                   id 表示任务 id。接下来你可以拿这个 id 使用AV.Insight.JobQuery 查询任务状态和结果。
     *
     */
    on: function on(event, cb) {}
  });

  /**
   * 创建一个对象，用于查询 Insight 任务状态和结果。
   * @class
   * @param {String} id 任务 id
   * @since 0.5.5
   */
  AV.Insight.JobQuery = function (id, className) {
    if (!id) {
      throw new Error('Please provide the job id.');
    }
    this.id = id;
    this.className = className;
    this._skip = 0;
    this._limit = 100;
  };

  _.extend(AV.Insight.JobQuery.prototype,
  /** @lends AV.Insight.JobQuery.prototype */{
    /**
     * Sets the number of results to skip before returning any results.
     * This is useful for pagination.
     * Default is to skip zero results.
     * @param {Number} n the number of results to skip.
     * @return {AV.Query} Returns the query, so you can chain this call.
     */
    skip: function skip(n) {
      this._skip = n;
      return this;
    },

    /**
     * Sets the limit of the number of results to return. The default limit is
     * 100, with a maximum of 1000 results being returned at a time.
     * @param {Number} n the number of results to limit to.
     * @return {AV.Query} Returns the query, so you can chain this call.
     */
    limit: function limit(n) {
      this._limit = n;
      return this;
    },

    /**
     * 查询任务状态和结果，任务结果为一个 JSON 对象，包括 status 表示任务状态， totalCount 表示总数，
     * results 数组表示任务结果数组，previewCount 表示可以返回的结果总数，任务的开始和截止时间
     * startTime、endTime 等信息。
     *
     * @param {AuthOptions} [options]
     * @return {Promise} A promise that will be resolved with the result
     * of the function.
     *
     */
    find: function find(options) {
      var params = {
        skip: this._skip,
        limit: this._limit
      };

      return request({
        path: '/bigquery/jobs/' + this.id,
        method: 'GET',
        query: params,
        authOptions: options,
        signKey: false
      }).then(function (response) {
        if (response.error) {
          return _promise2.default.reject(new AVError(response.code, response.error));
        }
        return _promise2.default.resolve(response);
      });
    }
  });
};
}, function(modId) { var map = {"./error":1595492076968,"./request":1595492076981}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1595492076994, function(require, module, exports) {


var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require('underscore');

var _require = require('./request'),
    _request = _require._request;

var AV = require('./av');

var serializeMessage = function serializeMessage(message) {
  if (typeof message === 'string') {
    return message;
  }
  if (typeof message.getPayload === 'function') {
    return (0, _stringify2.default)(message.getPayload());
  }
  return (0, _stringify2.default)(message);
};

/**
 * <p>An AV.Conversation is a local representation of a LeanCloud realtime's
 * conversation. This class is a subclass of AV.Object, and retains the
 * same functionality of an AV.Object, but also extends it with various
 * conversation specific methods, like get members, creators of this conversation.
 * </p>
 *
 * @class AV.Conversation
 * @param {String} name The name of the Role to create.
 * @param {Object} [options]
 * @param {Boolean} [options.isSystem] Set this conversation as system conversation.
 * @param {Boolean} [options.isTransient] Set this conversation as transient conversation.
 */
module.exports = AV.Object.extend('_Conversation',
/** @lends AV.Conversation.prototype */{
  constructor: function constructor(name) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    AV.Object.prototype.constructor.call(this, null, null);
    this.set('name', name);
    if (options.isSystem !== undefined) {
      this.set('sys', options.isSystem ? true : false);
    }
    if (options.isTransient !== undefined) {
      this.set('tr', options.isTransient ? true : false);
    }
  },

  /**
   * Get current conversation's creator.
   *
   * @return {String}
   */
  getCreator: function getCreator() {
    return this.get('c');
  },


  /**
   * Get the last message's time.
   *
   * @return {Date}
   */
  getLastMessageAt: function getLastMessageAt() {
    return this.get('lm');
  },


  /**
   * Get this conversation's members
   *
   * @return {String[]}
   */
  getMembers: function getMembers() {
    return this.get('m');
  },


  /**
   * Add a member to this conversation
   *
   * @param {String} member
   */
  addMember: function addMember(member) {
    return this.add('m', member);
  },


  /**
   * Get this conversation's members who set this conversation as muted.
   *
   * @return {String[]}
   */
  getMutedMembers: function getMutedMembers() {
    return this.get('mu');
  },


  /**
   * Get this conversation's name field.
   *
   * @return String
   */
  getName: function getName() {
    return this.get('name');
  },


  /**
   * Returns true if this conversation is transient conversation.
   *
   * @return {Boolean}
   */
  isTransient: function isTransient() {
    return this.get('tr');
  },


  /**
   * Returns true if this conversation is system conversation.
   *
   * @return {Boolean}
   */
  isSystem: function isSystem() {
    return this.get('sys');
  },


  /**
   * Send realtime message to this conversation, using HTTP request.
   *
   * @param {String} fromClient Sender's client id.
   * @param {String|Object} message The message which will send to conversation.
   *     It could be a raw string, or an object with a `toJSON` method, like a
   *     realtime SDK's Message object. See more: {@link https://leancloud.cn/docs/realtime_guide-js.html#消息}
   * @param {Object} [options]
   * @param {Boolean} [options.transient] Whether send this message as transient message or not.
   * @param {String[]} [options.toClients] Ids of clients to send to. This option can be used only in system conversation.
   * @param {Object} [options.pushData] Push data to this message. See more: {@link https://url.leanapp.cn/pushData 推送消息内容}
   * @param {AuthOptions} [authOptions]
   * @return {Promise}
   */
  send: function send(fromClient, message) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var authOptions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    var data = {
      from_peer: fromClient,
      conv_id: this.id,
      transient: false,
      message: serializeMessage(message)
    };
    if (options.toClients !== undefined) {
      data.to_peers = options.toClients;
    }
    if (options.transient !== undefined) {
      data.transient = options.transient ? true : false;
    }
    if (options.pushData !== undefined) {
      data.push_data = options.pushData;
    }
    return _request('rtm', 'messages', null, 'POST', data, authOptions);
  },


  /**
   * Send realtime broadcast message to all clients, via this conversation, using HTTP request.
   *
   * @param {String} fromClient Sender's client id.
   * @param {String|Object} message The message which will send to conversation.
   *     It could be a raw string, or an object with a `toJSON` method, like a
   *     realtime SDK's Message object. See more: {@link https://leancloud.cn/docs/realtime_guide-js.html#消息}.
   * @param {Object} [options]
   * @param {Object} [options.pushData] Push data to this message. See more: {@link https://url.leanapp.cn/pushData 推送消息内容}.
   * @param {Object} [options.validTill] The message will valid till this time.
   * @param {AuthOptions} [authOptions]
   * @return {Promise}
   */
  broadcast: function broadcast(fromClient, message) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var authOptions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    var data = {
      from_peer: fromClient,
      conv_id: this.id,
      message: serializeMessage(message)
    };
    if (options.pushData !== undefined) {
      data.push = options.pushData;
    }
    if (options.validTill !== undefined) {
      var ts = options.validTill;
      if (_.isDate(ts)) {
        ts = ts.getTime();
      }
      options.valid_till = ts;
    }
    return _request('rtm', 'broadcast', null, 'POST', data, authOptions);
  }
});
}, function(modId) { var map = {"./request":1595492076981,"./av":1595492076962}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1595492076995, function(require, module, exports) {


var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require('underscore');

var _require = require('./request'),
    request = _require.request;

var _require2 = require('./utils'),
    ensureArray = _require2.ensureArray,
    parseDate = _require2.parseDate;

var AV = require('./av');

/**
 * The version change interval for Leaderboard
 * @enum
 */
AV.LeaderboardVersionChangeInterval = {
  NEVER: 'never',
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month'
};

/**
 * The order of the leaderboard results
 * @enum
 */
AV.LeaderboardOrder = {
  ASCENDING: 'ascending',
  DESCENDING: 'descending'
};

/**
 * The update strategy for Leaderboard
 * @enum
 */
AV.LeaderboardUpdateStrategy = {
  /** Only keep the best statistic. If the leaderboard is in descending order, the best statistic is the highest one. */
  BETTER: 'better',
  /** Keep the last updated statistic */
  LAST: 'last',
  /** Keep the sum of all updated statistics */
  SUM: 'sum'
};

/**
 * @typedef {Object} Ranking
 * @property {number} rank Starts at 0
 * @property {number} value the statistic value of this ranking
 * @property {AV.User} user The user of this ranking
 * @property {Statistic[]} [includedStatistics] Other statistics of the user, specified by the `includeStatistic` option of `AV.Leaderboard.getResults()`
 */

/**
 * @typedef {Object} LeaderboardArchive
 * @property {string} statisticName
 * @property {number} version version of the leaderboard
 * @property {string} status
 * @property {string} url URL for the downloadable archive
 * @property {Date} activatedAt time when this version became active
 * @property {Date} deactivatedAt time when this version was deactivated by a version incrementing
 */

/**
 * @class
 */
function Statistic(_ref) {
  var name = _ref.name,
      value = _ref.value,
      version = _ref.version;

  /**
   * @type {string}
   */
  this.name = name;
  /**
   * @type {number}
   */
  this.value = value;
  /**
   * @type {number?}
   */
  this.version = version;
}

var parseStatisticData = function parseStatisticData(statisticData) {
  var _AV$_decode = AV._decode(statisticData),
      name = _AV$_decode.statisticName,
      value = _AV$_decode.statisticValue,
      version = _AV$_decode.version;

  return new Statistic({ name: name, value: value, version: version });
};

/**
 * @class
 */
AV.Leaderboard = function Leaderboard(statisticName) {
  /**
   * @type {string}
   */
  this.statisticName = statisticName;
  /**
   * @type {AV.LeaderboardOrder}
   */
  this.order = undefined;
  /**
   * @type {AV.LeaderboardUpdateStrategy}
   */
  this.updateStrategy = undefined;
  /**
   * @type {AV.LeaderboardVersionChangeInterval}
   */
  this.versionChangeInterval = undefined;
  /**
   * @type {number}
   */
  this.version = undefined;
  /**
   * @type {Date?}
   */
  this.nextResetAt = undefined;
  /**
   * @type {Date?}
   */
  this.createdAt = undefined;
};
var Leaderboard = AV.Leaderboard;

/**
 * Create an instance of Leaderboard for the give statistic name.
 * @param {string} statisticName
 * @return {AV.Leaderboard}
 */
AV.Leaderboard.createWithoutData = function (statisticName) {
  return new Leaderboard(statisticName);
};
/**
 * (masterKey required) Create a new Leaderboard.
 * @param {Object} options
 * @param {string} options.statisticName
 * @param {AV.LeaderboardOrder} options.order
 * @param {AV.LeaderboardVersionChangeInterval} [options.versionChangeInterval] default to WEEK
 * @param {AV.LeaderboardUpdateStrategy} [options.updateStrategy] default to BETTER
 * @param {AuthOptions} [authOptions]
 * @return {Promise<AV.Leaderboard>}
 */
AV.Leaderboard.createLeaderboard = function (_ref2, authOptions) {
  var statisticName = _ref2.statisticName,
      order = _ref2.order,
      versionChangeInterval = _ref2.versionChangeInterval,
      updateStrategy = _ref2.updateStrategy;
  return request({
    method: 'POST',
    path: '/leaderboard/leaderboards',
    data: {
      statisticName: statisticName,
      order: order,
      versionChangeInterval: versionChangeInterval,
      updateStrategy: updateStrategy
    },
    authOptions: authOptions
  }).then(function (data) {
    var leaderboard = new Leaderboard(statisticName);
    return leaderboard._finishFetch(data);
  });
};
/**
 * Get the Leaderboard with the specified statistic name.
 * @param {string} statisticName
 * @param {AuthOptions} [authOptions]
 * @return {Promise<AV.Leaderboard>}
 */
AV.Leaderboard.getLeaderboard = function (statisticName, authOptions) {
  return Leaderboard.createWithoutData(statisticName).fetch(authOptions);
};
/**
 * Get Statistics for the specified user.
 * @param {AV.User} user The specified AV.User pointer.
 * @param {Object} [options]
 * @param {string[]} [options.statisticNames] Specify the statisticNames. If not set, all statistics of the user will be fetched.
 * @param {AuthOptions} [authOptions]
 * @return {Promise<Statistic[]>}
 */
AV.Leaderboard.getStatistics = function (user) {
  var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      statisticNames = _ref3.statisticNames;

  var authOptions = arguments[2];
  return _promise2.default.resolve().then(function () {
    if (!(user && user.id)) throw new Error('user must be an AV.User');
    return request({
      method: 'GET',
      path: '/leaderboard/users/' + user.id + '/statistics',
      query: {
        statistics: statisticNames ? ensureArray(statisticNames).join(',') : undefined
      },
      authOptions: authOptions
    }).then(function (_ref4) {
      var results = _ref4.results;
      return results.map(parseStatisticData);
    });
  });
};

/**
 * Update Statistics for the specified user.
 * @param {AV.User} user The specified AV.User pointer.
 * @param {Object} statistics A name-value pair representing the statistics to update.
 * @param {AuthOptions} [options] AuthOptions plus:
 * @param {boolean} [options.overwrite] Wethere to overwrite these statistics disregarding the updateStrategy of there leaderboards
 * @return {Promise<Statistic[]>}
 */
AV.Leaderboard.updateStatistics = function (user, statistics) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return _promise2.default.resolve().then(function () {
    if (!(user && user.id)) throw new Error('user must be an AV.User');
    var data = _.map(statistics, function (value, key) {
      return {
        statisticName: key,
        statisticValue: value
      };
    });
    var overwrite = options.overwrite;

    return request({
      method: 'POST',
      path: '/leaderboard/users/' + user.id + '/statistics',
      query: {
        overwrite: overwrite ? 1 : undefined
      },
      data: data,
      authOptions: options
    }).then(function (_ref5) {
      var results = _ref5.results;
      return results.map(parseStatisticData);
    });
  });
};

/**
 * Delete Statistics for the specified user.
 * @param {AV.User} user The specified AV.User pointer.
 * @param {Object} statistics A name-value pair representing the statistics to delete.
 * @param {AuthOptions} [options]
 * @return {Promise<void>}
 */
AV.Leaderboard.deleteStatistics = function (user, statisticNames, authOptions) {
  return _promise2.default.resolve().then(function () {
    if (!(user && user.id)) throw new Error('user must be an AV.User');
    return request({
      method: 'DELETE',
      path: '/leaderboard/users/' + user.id + '/statistics',
      query: {
        statistics: ensureArray(statisticNames).join(',')
      },
      authOptions: authOptions
    }).then(function () {
      return undefined;
    });
  });
};

_.extend(Leaderboard.prototype,
/** @lends AV.Leaderboard.prototype */{
  _finishFetch: function _finishFetch(data) {
    var _this = this;

    _.forEach(data, function (value, key) {
      if (key === 'updatedAt' || key === 'objectId') return;
      if (key === 'expiredAt') {
        key = 'nextResetAt';
      }
      if (key === 'createdAt') {
        value = parseDate(value);
      }
      if (value && value.__type === 'Date') {
        value = parseDate(value.iso);
      }
      _this[key] = value;
    });
    return this;
  },

  /**
   * Fetch data from the srever.
   * @param {AuthOptions} [authOptions]
   * @return {Promise<AV.Leaderboard>}
   */
  fetch: function fetch(authOptions) {
    var _this2 = this;

    return request({
      method: 'GET',
      path: '/leaderboard/leaderboards/' + this.statisticName,
      authOptions: authOptions
    }).then(function (data) {
      return _this2._finishFetch(data);
    });
  },

  /**
   * Counts the number of users participated in this leaderboard
   * @param {Object} [options]
   * @param {number} [options.version] Specify the version of the leaderboard
   * @param {AuthOptions} [authOptions]
   * @return {Promise<number>}
   */
  count: function count() {
    var _ref6 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        version = _ref6.version;

    var authOptions = arguments[1];

    return request({
      method: 'GET',
      path: '/leaderboard/leaderboards/' + this.statisticName + '/ranks',
      query: {
        count: 1,
        limit: 0,
        version: version
      },
      authOptions: authOptions
    }).then(function (_ref7) {
      var count = _ref7.count;
      return count;
    });
  },
  _getResults: function _getResults(_ref8, authOptions, userId) {
    var skip = _ref8.skip,
        limit = _ref8.limit,
        selectUserKeys = _ref8.selectUserKeys,
        includeUserKeys = _ref8.includeUserKeys,
        includeStatistics = _ref8.includeStatistics,
        version = _ref8.version;

    return request({
      method: 'GET',
      path: '/leaderboard/leaderboards/' + this.statisticName + '/ranks' + (userId ? '/' + userId : ''),
      query: {
        skip: skip,
        limit: limit,
        selectUserKeys: _.union(ensureArray(selectUserKeys), ensureArray(includeUserKeys)).join(',') || undefined,
        includeUser: includeUserKeys ? ensureArray(includeUserKeys).join(',') : undefined,
        includeStatistics: includeStatistics ? ensureArray(includeStatistics).join(',') : undefined,
        version: version
      },
      authOptions: authOptions
    }).then(function (_ref9) {
      var rankings = _ref9.results;
      return rankings.map(function (rankingData) {
        var _AV$_decode2 = AV._decode(rankingData),
            user = _AV$_decode2.user,
            value = _AV$_decode2.statisticValue,
            rank = _AV$_decode2.rank,
            _AV$_decode2$statisti = _AV$_decode2.statistics,
            statistics = _AV$_decode2$statisti === undefined ? [] : _AV$_decode2$statisti;

        return {
          user: user,
          value: value,
          rank: rank,
          includedStatistics: statistics.map(parseStatisticData)
        };
      });
    });
  },

  /**
   * Retrieve a list of ranked users for this Leaderboard.
   * @param {Object} [options]
   * @param {number} [options.skip] The number of results to skip. This is useful for pagination.
   * @param {number} [options.limit] The limit of the number of results.
   * @param {string[]} [options.selectUserKeys] Specify keys of the users to include in the Rankings
   * @param {string[]} [options.includeUserKeys] If the value of a selected user keys is a Pointer, use this options to include its value.
   * @param {string[]} [options.includeStatistics] Specify other statistics to include in the Rankings
   * @param {number} [options.version] Specify the version of the leaderboard
   * @param {AuthOptions} [authOptions]
   * @return {Promise<Ranking[]>}
   */
  getResults: function getResults() {
    var _ref10 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        skip = _ref10.skip,
        limit = _ref10.limit,
        selectUserKeys = _ref10.selectUserKeys,
        includeUserKeys = _ref10.includeUserKeys,
        includeStatistics = _ref10.includeStatistics,
        version = _ref10.version;

    var authOptions = arguments[1];

    return this._getResults({
      skip: skip,
      limit: limit,
      selectUserKeys: selectUserKeys,
      includeUserKeys: includeUserKeys,
      includeStatistics: includeStatistics,
      version: version
    }, authOptions);
  },

  /**
   * Retrieve a list of ranked users for this Leaderboard, centered on the specified user.
   * @param {AV.User} user The specified AV.User pointer.
   * @param {Object} [options]
   * @param {number} [options.limit] The limit of the number of results.
   * @param {string[]} [options.selectUserKeys] Specify keys of the users to include in the Rankings
   * @param {string[]} [options.includeUserKeys] If the value of a selected user keys is a Pointer, use this options to include its value.
   * @param {string[]} [options.includeStatistics] Specify other statistics to include in the Rankings
   * @param {number} [options.version] Specify the version of the leaderboard
   * @param {AuthOptions} [authOptions]
   * @return {Promise<Ranking[]>}
   */
  getResultsAroundUser: function getResultsAroundUser(user) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var authOptions = arguments[2];

    // getResultsAroundUser(options, authOptions)
    if (user && typeof user.id !== 'string') {
      return this.getResultsAroundUser(undefined, user, options);
    }
    var limit = options.limit,
        selectUserKeys = options.selectUserKeys,
        includeUserKeys = options.includeUserKeys,
        includeStatistics = options.includeStatistics,
        version = options.version;

    return this._getResults({ limit: limit, selectUserKeys: selectUserKeys, includeUserKeys: includeUserKeys, includeStatistics: includeStatistics, version: version }, authOptions, user ? user.id : 'self');
  },
  _update: function _update(data, authOptions) {
    var _this3 = this;

    return request({
      method: 'PUT',
      path: '/leaderboard/leaderboards/' + this.statisticName,
      data: data,
      authOptions: authOptions
    }).then(function (result) {
      return _this3._finishFetch(result);
    });
  },

  /**
   * (masterKey required) Update the version change interval of the Leaderboard.
   * @param {AV.LeaderboardVersionChangeInterval} versionChangeInterval
   * @param {AuthOptions} [authOptions]
   * @return {Promise<AV.Leaderboard>}
   */
  updateVersionChangeInterval: function updateVersionChangeInterval(versionChangeInterval, authOptions) {
    return this._update({ versionChangeInterval: versionChangeInterval }, authOptions);
  },

  /**
   * (masterKey required) Update the version change interval of the Leaderboard.
   * @param {AV.LeaderboardUpdateStrategy} updateStrategy
   * @param {AuthOptions} [authOptions]
   * @return {Promise<AV.Leaderboard>}
   */
  updateUpdateStrategy: function updateUpdateStrategy(updateStrategy, authOptions) {
    return this._update({ updateStrategy: updateStrategy }, authOptions);
  },

  /**
   * (masterKey required) Reset the Leaderboard. The version of the Leaderboard will be incremented by 1.
   * @param {AuthOptions} [authOptions]
   * @return {Promise<AV.Leaderboard>}
   */
  reset: function reset(authOptions) {
    var _this4 = this;

    return request({
      method: 'PUT',
      path: '/leaderboard/leaderboards/' + this.statisticName + '/incrementVersion',
      authOptions: authOptions
    }).then(function (data) {
      return _this4._finishFetch(data);
    });
  },

  /**
   * (masterKey required) Delete the Leaderboard and its all archived versions.
   * @param {AuthOptions} [authOptions]
   * @return {void}
   */
  destroy: function destroy(authOptions) {
    return AV.request({
      method: 'DELETE',
      path: '/leaderboard/leaderboards/' + this.statisticName,
      authOptions: authOptions
    }).then(function () {
      return undefined;
    });
  },

  /**
   * (masterKey required) Get archived versions.
   * @param {Object} [options]
   * @param {number} [options.skip] The number of results to skip. This is useful for pagination.
   * @param {number} [options.limit] The limit of the number of results.
   * @param {AuthOptions} [authOptions]
   * @return {Promise<LeaderboardArchive[]>}
   */
  getArchives: function getArchives() {
    var _this5 = this;

    var _ref11 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        skip = _ref11.skip,
        limit = _ref11.limit;

    var authOptions = arguments[1];

    return request({
      method: 'GET',
      path: '/leaderboard/leaderboards/' + this.statisticName + '/archives',
      query: {
        skip: skip,
        limit: limit
      },
      authOptions: authOptions
    }).then(function (_ref12) {
      var results = _ref12.results;
      return results.map(function (_ref13) {
        var version = _ref13.version,
            status = _ref13.status,
            url = _ref13.url,
            activatedAt = _ref13.activatedAt,
            deactivatedAt = _ref13.deactivatedAt;
        return {
          statisticName: _this5.statisticName,
          version: version,
          status: status,
          url: url,
          activatedAt: parseDate(activatedAt.iso),
          deactivatedAt: parseDate(deactivatedAt.iso)
        };
      });
    });
  }
});
}, function(modId) { var map = {"./request":1595492076981,"./utils":1595492076963,"./av":1595492076962}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1595492076996, function(require, module, exports) {


var adapters = require('@leancloud/platform-adapters-node');

module.exports = function (AV) {
  AV.setAdapters(adapters);
  return AV;
};
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1595492076959);
})()
//# sourceMappingURL=index.js.map