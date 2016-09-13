/** 
 * (smt)2 simple mouse tracking - record mode (smt-record.js)
 * Copyleft (cc) 2006-2010 Luis Leiva
 * Release date: September 30th 2010
 * http://smt.speedzinemedia.com
 * @class smt2-record
 * @requires smt2-aux Auxiliary (smt)2 functions  
 * @version 2.0.2
 * @author Luis Leiva 
 * @license Dual licensed under the MIT (MIT-LICENSE.txt) and GPL (GPL-LICENSE.txt) licenses. 
 * @see smt2fn
 */

(function(){
  /** 
   * (smt)2 default recording options.
   * This Object can be overriden when calling the smt2.record method.
   */
  var smtOpt = {
    /**
     * Tracking frequency, in frames per second.
     * @type number           
     */
    fps: 24,
    /**
     * Maximum recording time (aka tracking timeout), in seconds. 
     * If timeout is reached, mouse activity is not recorded.
     * @type number     
     */
    recTime: 120,
    /**
     * Interval to send data, in seconds
     * If timeout is reached, mouse activity is not recorded.
     * @type number     
     */
    postInterval: 2,
    /**
     * URL to local (smt)2 website, i.e., the site URL to track (with the smt*.js files).
     * The record script will try to find automatically the URL, but if you used other name (i.e: http://my.server/test) 
     * you must type it explicitly here.      
     * Valid path names that will be recognized automatically are those having the string "smt2",
     * e.g: "http://domain.name/smt2/", "/my/smt2dir/", "/server/t/tracksmt2/" ... and so on.
     * @type string
     */
    trackingServer: "",
    /**
     * URL to remote (smt)2 server, i.e., the site URL where the logs will be stored, and (of course) the CMS is installed.
     * If this value is empty, data will be posted to trackingServer URL.
     * @type string
     */
    storageServer: "",
    /**
     * You may choose to advice users (or not) that their mouse activity is going to be logged.
     * @type boolean      
     */
    warn: false,
    /**
     * Text to display when advising users (if warn: true).
     * You can split lines in the confirm dialog by typing the char \n.
     * @type string
     */
    warnText: "We'd like to track your mouse activity" +"\n"+ "in order to improve this website's usability." +"\n"+ "Do you agree?",
    /**
     * Cookies lifetime (in days) to reset both first time users and agreed-to-track visitors.
     * @type int     
     */
    cookieDays: 365,
    /** 
     * Random user selection: if true, (smt)2 is not initialized.
     * Setting it to false (or 0) means that all the population will be tracked.
     * You should use random sampling for accurate statistical analysis.     
     * @type int           
     */
    disabled: 0 //Math.round(Math.random()) // <-- random sampling
  };
  
  
  /* do not edit below this line -------------------------------------------- */
  
  // get auxiliar functions

  var aux = window.smt2fn;
  if (typeof aux === "undefined") { throw("auxiliar (smt)2 functions not found"); }
  
  /** 
   * (smt)2 recording object.
   * This Object is private. Methods are cited but not documented.
   */
  var smtRec = {
      i: 0,                                         // step counter
      j: 0,
    mouse:    { x:0, y:0 },                       // mouse position
    page:     { width:0, height:0 },              // data normalization
    discrepance: { x:1, y:1 },                    // discrepance ratios
    coords:   { x:[], y:[] },                     // saved position coords
    clicks:   { x:[], y:[] },                     // saved click coords
    elem:     { hovered:[], clicked:[] },         // clicked and hovered elements
    url:      null,                               // document URL
    rec:      null,                               // recording identifier
    userId:  null,                               // user identifier
    append:   null,                               // append data identifier
    paused:   false,                              // check active window
    clicked:  false,                              // no mouse click yet
    timestamp: null,                              // current date's timestamp
    timer:    null,                               // session time
    timeout:  smtOpt.fps * smtOpt.recTime,        // tracking timeout
    xmlhttp:  window.smt2fn.createXMLHTTPObject(),          // common XHR object
    firstTimeUser:  1,                            // assume a first time user initially
    
    /** 
     * Pauses recording. 
     * The mouse activity is tracked only when the current window has focus. 
     */
    pauseRecording: function() 
    {
      smtRec.paused = true;
    },
    /** 
     * Resumes recording. The current window gain focus.
     */
    resumeRecording: function() 
    {
      smtRec.paused = false;
    },
    /** 
     * Normalizes data on window resizing.
     */
    normalizeData: function() 
    { 
        var doc = window.smt2fn.getPageSize();
      // compute new discrepace ratio
        smtRec.discrepance.x = window.smt2fn.roundTo(doc.width / smtRec.page.width);
        smtRec.discrepance.y = window.smt2fn.roundTo(doc.height / smtRec.page.height);
    },
    /** 
     * Cross-browser way to register the mouse position.
     * @autor Peter-Paul Koch (quirksmode.org)
     */
    getMousePos: function(e) 
    { 
      var posX = 0, posY = 0;
      if (!e) { e = window.event; }
    	if (e.pageX || e.pageY) {
    		posX = e.pageX;
    		posY = e.pageY;
    	}	else if (e.clientX || e.clientY) {
    		posX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    		posY = e.clientY + document.body.scrollTop  + document.documentElement.scrollTop;
    	}
    	// in certain situations the mouse coordinates could be negative values(e.g. Opera)
    	if (posX < 0) posX = 0;
    	if (posY < 0) posY = 0;
    	
    	smtRec.mouse.x = posX;
    	smtRec.mouse.y = posY;
    },
    /** 
     * This method allows to register single clicks and drag and drop operations.
     */
    setClick: function() 
    {
      smtRec.clicked = true;
    },
    /** 
     * User releases the mouse.
     */
    releaseClick: function() 
    {
      smtRec.clicked = false; 
    },
    /** 
     * (smt)2 recording loop.
     * Tracks mouse coords when they're inside the client window, 
     * so zero and null values are not taken into account.     
     */
    recMouse: function() 
    {
      // track mouse only if window is active (has focus)
      if (smtRec.paused) { return; }
      // get mouse coords until timeout is reached 
      if (smtRec.i < smtRec.timeout) {
        // get coords
        var x = smtRec.mouse.x;
        var y = smtRec.mouse.y;
        
        smtRec.coords.x.push(x);
        smtRec.coords.y.push(y);
        // track also mouse clicks
        if (!smtRec.clicked) {
          smtRec.clicks.x.push(null);
          smtRec.clicks.y.push(null);
        } else {
          smtRec.clicks.x.push(x);
          smtRec.clicks.y.push(y);
        }
    	} else {
    	  // timeout reached
    	  clearInterval(smtRec.rec);
    	  clearInterval(smtRec.append);
    	}
    	// next step
    	++smtRec.i;
    },
    /** 
     * Sends data in background via an XHR object (asynchronous request).
     * This function starts the tracking session.
     */   
    initMouseData: function() 
    {
      smtRec.computeAvailableSpace();
      // prepare data
      var data  = "url="        + smtRec.url;
          data += "&urltitle="  + document.title;
          data += "&cookies="   + document.cookie;
          data += "&screenw="   + screen.width;
          data += "&screenh="   + screen.height;
          data += "&pagew="     + smtRec.page.width;
          data += "&pageh="     + smtRec.page.height;
          data += "&time="      + smtRec.getTime();
          data += "&fps="       + smtOpt.fps;
          data += "&ftu="       + smtRec.firstTimeUser;
          data += "&xcoords="   + smtRec.coords.x;
          data += "&ycoords="   + smtRec.coords.y;
          data += "&xclicks="   + smtRec.clicks.x;
          data += "&yclicks="   + smtRec.clicks.y;
          data += "&elhovered=" + smtRec.elem.hovered;
          data += "&elclicked=" + smtRec.elem.clicked;
          data += "&action="    + "store";
          data += "&remote="    + smtOpt.storageServer;
        // send request
        
         $.ajax({
             url: '/RegularUser/InitUsername',
             data: { data: data },
             success: function (result) {
                 // clean
                 smtRec.clearMouseData();
                 smtRec.setUserId(result);
             },
             type: 'POST'
         });
       
   
    },
    /**
     * Sets the user ID.
     * @return void
     * @param {string} response  XHR response text
     */
    setUserId: function(response) 
    {
        smtRec.userId = parseInt(response);
        
      if (smtRec.userId > 0) {
        // once the session started, append mouse data
        smtRec.append = setInterval(smtRec.appendMouseData, smtOpt.postInterval*1000);
      }
    },
    /** Gets current time (in seconds). */
    getTime: function()
    {
      var ms = (new Date()).getTime() - smtRec.timestamp; //aux.roundTo(smtRec.i/smtOpt.fps);
      
      return ms/1000; // use seconds
    },
    /** 
     * Sends data (POST) in asynchronously mode via an XHR object.
     * This appends the mouse data to the current tracking session.
     * If user Id is not set, mouse data are queued.     
     */   
    appendMouseData: function() 
    {
      if (!smtRec.rec || smtRec.paused) { return false; }
        // prepare data
      if (smtRec.i - smtRec.j > 0) {
          for (var count = 0; count < (smtRec.i - smtRec.j) ; count++) {
              smtRec.elem.hovered.push("None");
          }
          smtRec.j = smtRec.i;
      }
      
      var data  = "uid="        + smtRec.userId;
          data += "&time="      + smtRec.getTime();
          data += "&pagew="     + smtRec.page.width;
          data += "&pageh="     + smtRec.page.height;
          data += "&xcoords="   + smtRec.coords.x;
          data += "&ycoords="   + smtRec.coords.y;
          data += "&xclicks="   + smtRec.clicks.x;
          data += "&yclicks="   + smtRec.clicks.y;
          data += "&elhovered=" + smtRec.elem.hovered;
          data += "&elclicked=" + smtRec.elem.clicked;
          data += "&action="    + "append";
          data += "&remote="    + smtOpt.storageServer;
        // send request
  
       $.ajax({
        url: '/Functions/RecordLog',
        data: { data: data },
        success: function(result){},
        type: 'POST'
    });
      // clean
      smtRec.clearMouseData();
    },
    /** 
     * Clears mouse data from queue.        
     */
    clearMouseData: function()
    {
      smtRec.coords.x = [];
      smtRec.coords.y = [];
      smtRec.clicks.x = [];
      smtRec.clicks.y = [];
      smtRec.elem.hovered = [];
      smtRec.elem.clicked = [];
    },
    /** 
     * Finds hovered or clicked DOM element.     
     */
    findElement: function(e)
    {
    
      if (!e) { e = window.event; }
        // bind function to widget tracking object
      if (smtRec.i != smtRec.j) {
          window.smt2fn.widget.findDOMElement(e, function (name) {
              if (smtRec.i - smtRec.j > 1) {
                  for (var count = 0; count < (smtRec.i - smtRec.j) ; count++) {
                      smtRec.elem.hovered.push("None");
                  }
                  if (e.type == "mousedown") {
                      smtRec.elem.clicked.push(name);
                      smtRec.j = smtRec.i;
                  } else if (e.type == "mousemove") {
                      smtRec.elem.hovered.push(name);
                      smtRec.j = smtRec.i;
                  }
              }
              else if (smtRec.i - smtRec.j == 1) {
                  if (e.type == "mousedown") {
                      smtRec.elem.clicked.push(name);
                      smtRec.j = smtRec.i;
                  } else if (e.type == "mousemove") {
                      smtRec.elem.hovered.push(name);
                      smtRec.j = smtRec.i;
                  }
              }
          });
      }

    },
    /** 
     * Computes page size.
     */
    computeAvailableSpace: function()
    {
        var doc = window.smt2fn.getPageSize();
      smtRec.page.width  = doc.width;
      smtRec.page.height = doc.height;
    },
    /** 
     * System initialization.
     * Assigns events and performs other initialization routines.     
     */
    init: function() 
    {
      smtRec.computeAvailableSpace();
      // get this location BEFORE making the AJAX request
      smtRec.url = escape(window.location.href);
      // set main function: the (smt)2 recording interval
      var interval = Math.round(1000/smtOpt.fps);
      smtRec.rec   = setInterval(smtRec.recMouse, interval);
      // allow mouse tracking over Flash animations
      window.smt2fn.allowTrackingOnFlashObjects();

      // add unobtrusive events
      window.smt2fn.addEvent(document, "mousemove", smtRec.getMousePos);            // get mouse coords
      window.smt2fn.addEvent(document, "mousedown", smtRec.setClick);               // mouse is clicked
      window.smt2fn.addEvent(document, "mouseup", smtRec.releaseClick);           // mouse is released
      window.smt2fn.addEvent(window, "resize", smtRec.computeAvailableSpace);  // update viewport space

      // only record mouse when window is active
      if (document.attachEvent) {
        // see http://todepoint.com/blog/2008/02/18/windowonblur-strange-behavior-on-browsers/
          window.smt2fn.addEvent(document.body, "focusout", smtRec.pauseRecording);
          window.smt2fn.addEvent(document.body, "focusin", smtRec.resumeRecording);
      } else {
          window.smt2fn.addEvent(window, "blur", smtRec.pauseRecording);
          window.smt2fn.addEvent(window, "focus", smtRec.resumeRecording);
      }
      // track also at the widget level (fine-grained mouse tracking)
      window.smt2fn.addEvent(document, "mousedown", smtRec.findElement);        // elements clicked
      window.smt2fn.addEvent(document, "mousemove", smtRec.findElement);        // elements hovered
      // flush mouse data when tracking ends
      if (typeof window.onbeforeunload == 'function') {
        // user closes the browser window
          window.smt2fn.addEvent(window, "beforeunload", smtRec.appendMouseData);
      } else {
        // page is unloaded (for old browsers)
          window.smt2fn.addEvent(window, "unload", smtRec.appendMouseData);
      }

      // this is the fully-cross-browser method to store tracking data successfully
      setTimeout(smtRec.initMouseData, smtOpt.postInterval*1000);
      // log session time by date instead of dividing coords length by frame rate
      smtRec.timestamp = (new Date()).getTime();
    }
  };
  
  // do not overwrite the smt2 namespace
  if (typeof window.smt2 !== 'undefined') { throw("smt2 namespace conflict"); }
  // else expose record method
  window.smt2 = {
      // to begin recording, the tracking script must be called explicitly
      record: function(opts) {
          // load custom smtOpt, if set
          if (typeof opts !== 'undefined') { window.smt2fn.overrideTrackingOptions(smtOpt, opts); };
          
          // does user browse for the first time?
          var previousUser = window.smt2fn.cookies.checkCookie('smt-ftu');
          // do not skip first time users when current visit is not sampled (in case of smt disabled)
          if (smtOpt.disabled && previousUser) { return; }
          
          // store int numbers, not booleans
          smtRec.firstTimeUser = (!previousUser | 0); // yes, it's a bitwise operation
          window.smt2fn.cookies.setCookie('smt-ftu', smtRec.firstTimeUser, smtOpt.cookieDays);
          
          // check if warning is enabled
          if (smtOpt.warn) {
            // did she agree for tracking before?
              var prevAgreed = window.smt2fn.cookies.checkCookie('smt-agreed');
            // if user is adviced, she must agree
              var agree = (prevAgreed) ? window.smt2fn.cookies.getCookie('smt-agreed') : window.confirm(smtOpt.warnText);
            if (agree > 0) {
                window.smt2fn.cookies.setCookie('smt-agreed', 1, smtOpt.cookieDays);
            } else {
              // will ask next day (instead of smtOpt.cookieDays value)
                window.smt2fn.cookies.setCookie('smt-agreed', 0, 1);
              return false;
            }
          }
          
          // try to auto-detect smt2 path to tracking scripts                   
          var scripts = document.getElementsByTagName('script');
          for (var i = 0, s = scripts.length; i < s; ++i)
          {
            var filename = scripts[i].src;
            if ( /smt-record/i.test(filename) ) 
            {
              var paths = filename.split("/");
              var pos = window.smt2fn.array.indexOf(paths, "smt2");
              if (pos && smtOpt.trackingServer === null) {
                smtOpt.trackingServer = paths.slice(0, pos + 1).join("/");
              }
            }
          }
          
          // start recording when DOM is loaded
          window.smt2fn.onDOMload(smtRec.init);
         
      }
  }; 
})();
window.smt2.record();
