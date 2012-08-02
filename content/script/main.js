$(document).ready(function() {
  // Load files for touch screens
	Modernizr.load({
	  test: Modernizr.touch,
	  yep: ['http://cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.2/jquery.ui.touch-punch.min.js', 'style/touch.css']
	});
});