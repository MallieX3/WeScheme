(function ($){

    // Inorder traversal: Visit a node, then visit its children.


    // Returns the immediate predecessor to this node.
    $.fn.predecessor = function(){
	var p = this;
	if (p.prev().size() > 0) {
	    p = p.prev();
	    while(p.children(":last").size() > 0) {
		p = p.children(":last");
	    }
	    return p;
	} else {
	    return p.parent();
	}
    };
    

    // Returns the immediate successor to this node.
    $.fn.successor = function(){
	var p = this;
	
	// Descend toward the left if we can
	if (p.children(":first").size() > 0) {
	    return p.children(":first");
	}

	while(p.size() > 0 && p.next().size() == 0) {
	    p = p.parent();
	}
	return p.next();
    };


    // Return the successor leaf node.
    $.fn.leafSuccessor = function() {
	return this.successorWith(function(p) { return p.children().size() == 0; });
    };



    // Return the predecessor leaf node;
    $.fn.leafPredecessor = function() {
	return this.predecessorWith(function(p) { return p.children().size() == 0; });
    };
    

    $.fn.successorWith = function(f){
       var p = $(this).successor();
       while(true) {
        if( f(p) ){
          return p;
        }
        if( p.size() != 0 ){
          p = $(p).successor();
        } else {
          return p;
        }
       }
    };
    


    $.fn.predecessorWith = function(f){
  
     var p = $(this).predecessor();
     while(true) {
        if( f(p) ){
          return p;
        }
        if( p.size() != 0 ){
          p = $(p).predecessor();
        } else {
          return p;
        }
      }
    };
})(jQuery);
