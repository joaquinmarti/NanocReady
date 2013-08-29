;JM.Scroll = (function(window, $, Modernizr, JM, Math, undefined) {

  var DOM = JM.DOM;
  var Config = JM.Config;
  var _moving = false;
  var _itemsPositions, _contentPosition;
  var $items;

  var _init = function() {
    _prepareList(); /* Control events */
    _controlPosition(); /* Scroll event to know everymoment which is active content */
    _initArrows(); /* Init arrows events */
    _initKeyboard(); /* Init keyboard events */
    _refreshList(); /* Refresh breakpoints values */
  };

  var _prepareList = function() {
    DOM.get('.scroll_block').find('img').load(function() { /* When each image of blocks is loaded */
      _refreshList();
    });

    /* When user resize browser, some heights could change and we need to refresh the values */
    $(window).on('resize.Scroll', $.throttle( 250, _refreshList ) );
  };

  var _refreshList = function() {
    /* Search for .block divs and look for their offset position */
    $items = DOM.get('.scroll_block');
    _itemsPositions = [];
    _itemsPositions[0] = 0;
    $items.each(function(i) {
      _itemsPositions[i + 1] = Math.floor($(this).offset().top);

      /* For non touch screens (desktop), substract nav bar height because it's fixed on the top */
      if (!Modernizr.touch) {
        _itemsPositions[i + 1] = _itemsPositions[i + 1] - DOM.get('#nav').height() - Config.scrollToTopDistance;
      }
    });

  };

  var _controlPosition = function() {
    _contentPosition = 0;
    $(window).scroll(function () {
      var scrollTop = $(window).scrollTop(); /* Current scroll position */

      /* Control active block */
      for (var i = _itemsPositions.length - 1; i >= 0; i--) { /* Loop inversely the position list to know which is the current content */
        if (scrollTop >= _itemsPositions[i]) {
          _contentPosition = i; /* Set current _contentPosition */
          break;
        }
      }

    });
  };

  var _initArrows = function() {
    /* Down arrow event */
    DOM.get('.down_arrow').on('click', function(event) {
      event.preventDefault();
      if (!_moving) {
        var nextPosition = _getNextPosition();
        if (nextPosition) { /* Navigate to the next position */
          _navigateToItem(nextPosition);
        }
        else { /* User is in last position, so scroll down few pixels */
          _scrollTo($(window).scrollTop() + Config.manualScrollDistance, function() {});
        }
      }
    });

    /* Top arrow event */
    DOM.get('.up_arrow').on('click', function(event) {
      event.preventDefault();
      if (!_moving) {
        _navigateToItem(_getPrevPosition()); /* Navigate to the prev position */
      }
    });
  };

  var _initKeyboard = function() {
    $(document).keydown(function(e) {
      switch (e.keyCode) {
        case 40: /* Down key */
          e.preventDefault();
          e.stopPropagation();
          if (!_moving && _checkInputs()) {
            var nextPosition = _getNextPosition();
            if (nextPosition) { /* Navigate to the next position */
              _navigateToItem(nextPosition);
            }
            else { /* User is in last position, so scroll down few pixels */
              _scrollTo($(window).scrollTop() + Config.manualScrollDistance, function() {});
            }
          }
          break;
        case 38: /* Up key */
          e.preventDefault();
          e.stopPropagation();
          if (!_moving && _checkInputs()) {
            _navigateToItem(_getPrevPosition()); /* Navigate to the prev position */
          }
          break;
      }
    });
  };

  var _checkInputs = function() {
    DOM.clear('input:focus, textarea:focus');
    if (DOM.get('input:focus, textarea:focus').length > 0) return false;
    return true;
  };

  var _navigateToItem = function(newPosition) {
    if (!_moving) {
      var scrollTo = 0;
      _moving = true; /* Set _moving var to true */

      /* Get the item's offset position from list */
      scrollTo = _itemsPositions[newPosition] + 1; /* Itemposition minus configured distance */

      /* Animate function to scrollTop property works good with desktop and ipad */
      DOM.get('body, html').stop().animate({
        scrollTop: scrollTo
      }, 800, 'easeInOutExpo', function() {
        _moving = false; /* When movement is finished set _moving var to false */
      });
    }

  };

  var _getNextPosition = function() {
    if (_contentPosition < $items.length) {
      return _contentPosition + 1; /* Get the next if it exists */
    }
    else {
      return false; /* Get the last position if there's no more items */
    }
  };

  var _getPrevPosition = function() {
    if (_contentPosition > 0) {
      return _contentPosition - 1; /* Get the prev position if it exits */
    }
    else {
      return 0; /* Get the first position: 0 */
    }
  };

  /* Scroll to a point */
  var _scrollTo = function(newScroll, callback) {
    if (!_moving) {
      _moving = true; /* Set _moving var to true */

      /* Animate function to scrollTop property works good with desktop and ipad */
      DOM.get('body, html').stop().animate({
        scrollTop: newScroll
      }, 800, 'easeInOutExpo', function() {
        _moving = false; /* When movement is finished set _moving var to false */

        callback.call(); /* Execute callback after scroll */
      });

    }
  };

  return {
    init: _init,
    refreshList: _refreshList,
    scrollTo: _scrollTo
  };

})(window, jQuery, Modernizr, JM, Math);