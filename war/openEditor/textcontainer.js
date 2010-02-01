var WeSchemeTextContainer;

// TextContainers should support the following:
//
// onchange attribute: called whenever the text changes, with this bound to the container.
// 



(function() {

    // container: DIV
    // Assumption of the textarea implementation:
    // The div contains a "defn" element.
    WeSchemeTextContainer = function(aDiv, afterInitialization) {
	var that = this;
	this.div = aDiv;
	this.impl = new TextareaImplementation(
	    this.div, 
	    function(){
		that.behaviorE = receiverE();
		that.mode = 'textarea';
		that.behavior = switchB(
		    startsWith(that.behaviorE,
			       this.getSourceB()));
		afterInitialization(that);
	    });
    };


    WeSchemeTextContainer.prototype.setMode = function(mode) {
	var that = this;
	if (mode == this.mode) {
	    return;
	} else {
	    var code = this.getCode();
	    this.impl.shutdown();
	    jQuery(this.div).empty();
	    
	    var implementations = { bespin: BespinImplementation,
				    textarea: TextareaImplmentation,
				    codemirror: CodeMirrorImplementation };

	    var afterConstruction = function() {
		that.impl.setCode(code);
		that.behaviorE.sendEvent(this.getSourceB());
		that.mode = mode;
	    };

	    if (implementations.hasOwnProperty(mode)) {
		implementations[mode](this.div, afterConstruction);
	    } else {
		throw new Error("Unknown mode " + mode);
	    }

	}
    }


    // Returns a behavior of the source code
    WeSchemeTextContainer.prototype.getSourceB = function() {
	return this.behavior;
    };


    var normalizeString = function(s) {
	return s.replace(/\r\n/g, "\n");
    };

    // getCode: void -> string
    WeSchemeTextContainer.prototype.getCode = function() {
	return normalizeString(this.impl.getCode());
    };


    // setCode: string -> void
    WeSchemeTextContainer.prototype.setCode = function(code) {
	return this.impl.setCode(normalizeString(code));
    };



    //////////////////////////////////////////////////////////////////////

    function TextareaImplementation(rawContainer, onSuccess) {
	this.container = new FlapjaxValueHandler(
	    jQuery(rawContainer).find("#defn").get(0));
	onSuccess.call(this, []);
    }

    // Returns a behavior of the source code
    TextareaImplementation.prototype.getSourceB = function() {
	return this.container.behavior;
    };

    // getCode: void -> string
    TextareaImplementation.prototype.getCode = function() {
	var result = this.container.attr("value");
	return result;
    };

    // setCode: string -> void
    TextareaImplementation.prototype.setCode = function(code) {
	this.container.attr("value", code);
    };

    // shutdown: -> void
    TextareaImplementation.prototype.shutdown = function() {
    };


    //////////////////////////////////////////////////////////////////////
    function CodeMirrorImplementation(div, onSuccess) {
	var that = this;
	this.behaviorE = receiverE();
	this.behavior = startsWith(this.behaviorE, "");


	this.editor = new CodeMirror(
	    div, 
	    { 
		onChange: function() {
		    this.behaviorE.sendEvent(that.editor.getCode());
		},

		initCallback: function() {
		    onSuccess();
		}});
    }
    CodeMirrorImplementation.prototype.getSourceB = function() {
	return this.behavior;
    }

    CodeMirrorImplementation.prototype.getCode = function() {
	return valueNow(this.behavior);
    }

    CodeMirrorImplementation.prototype.setCode = function(code) {
	this.editor.setCode(code);
	this.behaviorE.sendEvent(code);
    }

    CodeMirrorImplementation.prototype.shutdown = function() {
    }


    //////////////////////////////////////////////////////////////////////

    function BespinImplementation(div, onSuccess) {
	var that = this;
	this.div = div;
	this.component = undefined;
	this.behaviorE = receiverE();
	this.behavior = startsWith(this.behaviorE, "");

	dojo.require("bespin.editor.component");
	dojo.addOnLoad(function() { 
	    that.component = 
		new bespin.editor.Component(that.div.id, {
		    language: "scheme",
		    loadfromdiv: true,
		    set: {
			strictlines: 'on',
			closepairs: 'off',
			tabmode: 'off',
			tabsize: 1
		    }
		});
	    that.component.onchange(function() {
		that.behaviorE.sendEvent(that.component.getContent());
	    });
	    onSuccess.call(that, []);
	});
    }

    // Returns a behavior of the source code
    BespinImplementation.prototype.getSourceB = function() {
	return this.behavior;
    };

    // getCode: void -> string
    BespinImplementation.prototype.getCode = function() {
	return valueNow(this.behavior);
    };

    // setCode: string -> void
    BespinImplementation.prototype.setCode = function(code) {
	this.component.setContent(code);
	this.behaviorE.sendEvent(code);
    };

    // shutdown: -> void
    BespinImplementation.prototype.shutdown = function() {
	this.component.dispose();
    };



})();