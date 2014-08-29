var ModulesManager = (function() {

		var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
		var ARGUMENT_NAMES = /([^\s,]+)/g;

		function getParamNames(func) {

			var fnStr = func.toString().replace(STRIP_COMMENTS, ''),
				result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
			
			if(result == null) {
				result = [];
			}

			return result

		}

		function ModulesManager() {
			this.modules = {};
		}
		/**
		 * Defines a new module where the first parameter is the name, last parameter is the constructor
		 * and parameters in the middle are dependencies
		 */
		ModulesManager.prototype.define = function() {

			var module = {
				"requires": Array.prototype.slice.call(arguments, 1, arguments.length - 1),
				"name": arguments[0],
				"constructor": arguments[arguments.length - 1]
			};

			if ( module.requires.length == 0 ) {
				module.requires = getParamNames(module.constructor);
			}

			this.modules[module.name] = module;

		};
		/**
		 * Gets a module provided the required modules have been defined
		 */
		ModulesManager.prototype.get = function(name) {

			var module = this.modules[name],
				requiredModules = [],
				canBeLoaded = true;

			if ( module ) {

				for ( var i = 0; i < module.requires.length; i++ ) {
				
					var requiredModule = this.modules[module.requires[i]];
				
					if ( requiredModule ) {

						if ( !requiredModule.cache ) {
							requiredModule.cache = this.get(requiredModule.name);
						}

						requiredModules.push(requiredModule.cache);

					} else {
						canBeLoaded = false;
						break;
					}
				
				}

				if ( canBeLoaded ) {
					return module.constructor.apply(module.constructor, requiredModules);
				}

			}

			return {};

		};
		/**
		 * Short-hand to get and define
		 * Calls get if argument length equals 1 otherwise calls define
		 */
		ModulesManager.prototype.module = function() {
			if ( arguments.length == 1 ) {
				return this.get(arguments[0]);
			} else {
				this.define.apply(this, arguments);
				return this;
			}
		};

		return new ModulesManager();

	})();