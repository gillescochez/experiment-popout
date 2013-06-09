# Popout

Popout is just a very basic experiment to test dragging an element outside the browser window by turning it into a popup.
So mousedown on a div for example, popup appear underneath with div content, whilst mouse is down dragging of the popup
is possible. If the popup is closed the content is displayed inside the browser again.

This is very badly coded and shouldn't really be used as is, it was mostly to demo the popup stuff so the rest is done in a very crude way to provide the visual result, the goal was mostly to show it is possible to create a popup on the fly and sort of similate dragging an element outside the browser window.

## Tested... erm... sort of...

Just loaded, tried and noted what was wrong, there is nothing to handle various browsers but pretty sure many issues can be easily resolved. The main problem is that browsers don't handle multiple window properly so the even fire on mousemove
doesn't return the right values anymore if the mouse leave the main monitor. So unfortunately dragging to another monitor is
not possible on first move.

### Chrome

Seems perfect but the odd glitch on start if the popup is slow to load, fine after that.
No issue on local test so just question of loading popup container in bg so its cached when we need it.

### Firefox

Focus issue, it detach and drag but under main window, also bit off on positioning as code doesn't handle muliple browsers in chrome dimension estimate just chrome with bookmarks bar

### Opera

Popup stuck inside window (also might be just some option in window.open call.
Also doesn't show div again if popup is closed.

### IE

Popup and restore on close. Seem to drag here and there so work around should be possible.

## Making it work on file protocol

In Chrome use the following flags. Elsewhere...

``` chrome.exe --disable-web-security --allow-file-access-from-files ```