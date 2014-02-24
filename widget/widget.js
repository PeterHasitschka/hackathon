var EEXCESS = EEXCESS || {};
EEXCESS.extID = chrome.i18n.getMessage('@@extension_id');

///**
// * Handler to be called on scrolling in the result list. If the end of the result
// * list is reached, but there are still more results available for the current query, the 
// * background script is called to retrieve a further set of results.
// * @memberOf EEXCESS
// * @param {Boolean} moreResults Indicating, if more results are available for the current query
// */
//EEXCESS.scrollalert = function(moreResults) {
//    var scrolltop = $('#eexcess_content').prop('scrollTop');
//    var scrollheight = $('#eexcess_content').prop('scrollHeight');
//    var windowheight = $('#eexcess_content').prop('clientHeight');
//    var offset = 20;
//    EEXCESS.callBG({method: 'scroll', data: scrolltop});
//    if (moreResults && scrolltop > 0 && (scrolltop + windowheight + offset >= scrollheight)) {
//        $('#eexcess_content').unbind('scroll');
//        $('#eexcess_content').append($('<div id="eexcess_loading"><img src="../media/loading.gif" /></div>'));
//        var start = $('#eexcess_content').find('li:last').data('pos') + 2;
//        EEXCESS.callBG({method: {parent: 'model', func: 'moreResults'}, data: start});
//    }
//};

///**
// * Sets the scroll position of the '#eexcess_content' element to the specified
// * value.
// * @memberOf EEXCESS
// * @param {Integer} value The scroll position to set
// */
//EEXCESS.scroll = function(value) {
//    $('#eexcess_content').scrollTop(value);
//};

EEXCESS.searchResults = EEXCESS.searchResultList($('#eexcess_content'));

/**
 * Updates the widget's view with the current state of the model in the background script
 * @memberOf EEXCESS
 * @param {Object} widget The current state of the widget model in the background script
 */
EEXCESS.update = function(widget) {
    if (widget.results.query === 'search text...') {
        $('#eexcess_query').attr('placeholder', widget.results.query);
    } else {
        $('#eexcess_query').val(widget.results.query);
    }

//    switch (widget.params.tab) {
//        case 'results':
//            EEXCESS.results.showResults(widget.results.data);
//            break;
//    }

//    setTimeout(function() {
//        $('#eexcess_content').scrollTop(widget[widget.params.tab].scroll);
//    }, 200);
};


/**
 * Initializes the widget's view with the current state of the widget in the background script's model
 * @memberOf EEXCESS
 * @param {Object} widget The current state of the widget's model in the background script
 */
EEXCESS.init = function(widget) {
//    $('#eexcess_tab a.inline').click(function(evt) {
//        evt.preventDefault();
//        $('#eexcess_tab').find('a').removeAttr('class');
//        $(this).attr('class', 'selected');
//        $('#eexcess_content').empty();
//        $('#eexcess_content').append($('<div id="eexcess_loading"><img id="eexcess_loading" src="../media/loading.gif" /></div>'));
//        EEXCESS.callBG({method: {parent: 'model', func: 'changeTab'}, data: $(this).data('name')});
//    });
    
    $('#eexcess_tab a.fancybox_link').click(function(evt) {
        evt.preventDefault();
        //console.log();
        EEXCESS.callBG({method: 'fancybox', data: 'chrome-extension://'+EEXCESS.extID + '/' +$(evt.target).parent('a').attr('href')});
    });

    var form = $('#eexcess_searchForm');
    form.submit(function() {
//        $('#eexcess_content').empty();
//        $('#eexcess_content').unbind('scroll');
//        $('#eexcess_content').scrollTop(0);
//        $('#eexcess_content').append($('<div id="eexcess_loading"><img id="eexcess_loading" src="../media/loading.gif" /></div>'));
        //evt.preventDefault();
        EEXCESS.searchResults.loading();
        var query = $('#eexcess_query').val();
        EEXCESS.callBG({method: {parent: 'model', func: 'query'}, data: [{weight: 1, text: query}]});
        return false;
    });
    //EEXCESS.update(widget);
};

/**
 * Displays an error message to the user and resets the widget to its current state
 * in the background script's model
 * @memberOf EEXCESS
 * @param {String} error The error message to display
 */
EEXCESS.error = function(error) {
    alert(error);
    EEXCESS.callBG({method: {parent: 'model', func: 'widget'}}, EEXCESS.init);
};

// Initalize the widget with the current state in the background script's model on execution of this script
EEXCESS.callBG({method: {parent: 'model', func: 'widget'}}, EEXCESS.init);
