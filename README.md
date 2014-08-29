Modules Manager
===============

A simple script to help organize javascript modules

##Why
When you have many scripts that are required for a webapp to run you need some way of organizing them.
The first thing you may think of is, ok I minimize them all in the exact order so they dont present
dependency issues. That's great but if you wanted to keep them separated and forget about the order
you place them in the HTML there comes this script into aid.

##Usage

Let's say we have a module called Dogs another Cats and the last one, those two depend on, called Animals. All
of these modules are written in different files:

###Dogs.js
```sh
ModulesManager.module("Dogs", "Animals", function(Animals) {
	return {
		bark: function() {
			Animals.talk();
		}
	}
});
```

###Cats.js
```sh
ModulesManager.module("Cats", "Animals", function(Animals) {
	return {
		meow: function() {
			Animals.talk();
		}
	}
});
```

###Animals.js
```sh
ModulesManager.module("Animals", function() {
	return {
		talk: function() {
			console.log("Hello!");
		}
	}
});
```

By using this library we can add the files in any order we want and when all modules are ready we can start calling
the methods we want:

```sh
ModulesManager.module("Cats").meow();
ModulesManager.module("Dogs").bark();
```
The first argument is the name of the module, next arguments are the name of the modules it depends on while the last argument is a function that encapsulates the modules code.