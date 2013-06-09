/* 
	Popout.js - Pop that tile out of that browser
	
	Works locally in chrome unsafe mode, use flags below
	chrome.exe --disable-web-security --allow-file-access-from-files
	
	Location and other Popup decorations are under the user control so popup
	decoration might vary based on browsers/settings/bah.
*/
(function($) {

	var 
		// calculating this is very hard but we could mesure the default height
		// on each supported browsers as use that. Some browsers might allow
		// bookmarks or other bar detection, need to research
		// maybe a extension could detect things more accurately
		chromeH = 100, // chrome with bookmark bar
		windowX = window.screenX,
		windowY = window.screenY,
		screenW = window.outerWidth,
		screenH = window.outerHeight,
		docH = document.height,
		docW = document.width,
		offsetX = windowX, 
		offsetY = windowY + chromeH,
		
		target,
		targetX, targetY,
		targetW, targetH,
		
		mouseX, mouseY,
		pid = 0,
		
		Popout = function() {
			
			$(document).on('mousedown', '.popout', function(ev) {
				target = $(ev.target).hasClass('popout') ? ev.target : $(ev.target).parents('.popout')[0];
				targetX = parseInt(ev.target.left);
				targetY = parseInt(ev.target.top) + offsetY;
				targetW = parseInt($(ev.target).outerWidth());
				targetH = parseInt($(ev.target).outerHeight());
				$(target).blur().addClass('out');
				this.onMouseDown(ev);
			}.bind(this));
			
			$(document).on('mouseup', this.onMouseUp.bind(this));
			$(window).on('resize', this.onWindowResize.bind(this));
			this.watchWindow(this.onWindowMove.bind(this));
		},
		
		Popup = function(ev) {
		
			var popupX = 0;
			var popupY = 0;
			
			popupX = targetX + offsetX;
			popupY = targetY + offsetY;
			
			// some things can not be disabled based on browser settings
			this.win = window.open(
				'blank.html',
				'popup' + pid,
				'\
					width='+(targetW)+',\
					height='+(targetW)+',\
					top='+popupY+',\
					left='+popupX+',\
					menubar=no,\
					toolbar=no,\
					location=no,\
					locationbar=no,\
					personalbar=no,\
					titlebar=no,\
					status=no,\
					scrollbars=no,\
					dependent=yes\
					minimizable=no\
					close=no,\
					chrome=no,\
					alwaysRaised\
				'
			);
			
			this.win.pid = pid;
			this.win._target = target;
			
			pid++;
		};
	
	extend(Popout.prototype, {
	
		// pop
		popupMove: false,
		popupWindow: undefined,
		popupInterval: undefined,
		
		createPopup: function(ev) {
			new Popup(ev);
		},
		onPopupReady: function(popupWindow) {
		
			this.popupMove = true;
			this.popupWindow = popupWindow;
			
			// quick and dirty way of doing it
			popupWindow.document.body.innerHTML = target.innerHTML;
			$(popupWindow.document.body).addClass('popout');
			(function(popupWindow) {
			
				popupWindow.popupInterval = setInterval(function() {
					popupWindow.document.body.innerHTML = target.innerHTML;
				}.bind(this), 250);
				
			})(popupWindow);
		},
		onPopupClose: function(popupWindow) {
			popupWindow._target.className = 'popout';
			clearInterval(popupWindow.popupInterval);
		},
		
		// mouse
		onMouseDown: function(ev) {
			$(document).on('mousemove', this.onMouseMove.bind(this));
			this.createPopup(ev);
		},
		onMouseUp: function(ev) {
			this.popupMove = false;
		},
		onMouseMove: function(ev) {
			this.updateMousePosition(ev);
		},
		updateMousePosition: function(ev) {
		
			var popupX = ev.clientX + offsetX;
			var popupY = ev.clientY + offsetY;
			
			if (this.popupWindow && this.popupMove) {
				this.popupWindow.moveTo(popupX, popupY);
			};
		},
		
		// window
		onWindowMove: function() {
			this.onWindowResize();
		},
		onWindowResize: function() {
		
			windowX = window.screenX;
			windowY = window.screenY;
			screenW = window.outerWidth;
			screenH = window.outerHeight;
			
			docW = document.width;
			docH = document.height;
			
			offsetX = windowX;
			offsetY = windowY + chromeH;
		},
		watchWindow: function(listener) {
			
			setInterval(function() {
			
				if (windowX != window.screenX || windowY != window.screenY) {
					windowX = window.screenX;
					windowY = window.screenY;
					listener.apply(this);
				  };

			}.bind(this), 250);
		}
		
	});
	
	function extend(sub, sup) {
		for (var prop in sup) sub[prop] = sup[prop];
	};
	
	window.popout = new Popout();

})(jQuery);