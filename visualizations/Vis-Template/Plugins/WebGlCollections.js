(function () {

    var WebGlCollectionsPlugin = {
        librariesLoaded: false
    };


    var $root = null;

    WebGlCollectionsPlugin.initialize = function (EEXCESSObj, rootSelector) {
        $root = $(rootSelector);
        // load CSS
        // load other needed scripts (require.js is available)


        requirejs.config({
            baseUrl: '/visualizations/WebGlGraph/js/',
            paths: {
                gl_jquery: '../../../libs/jquery-1.10.1.min',
                gl_jquerymousewheel: '../../../libs/jquery-mousewheel/jquery.mousewheel.min',
                gl_threejs: 'libs/three.js/three',
                gl_gldebugger: 'graph/Debugger',
                gl_interactionhandler: 'graph/InteractionHandler',
                gl_glscene: 'graph/Scene',
                gl_navigationhandler: 'graph/NavigationHandler',
                gl_simplecompare: 'graph/compare/SimpleCompare',
                gl_connectionabstract: 'graph/connections/ConnectionAbstract',
                gl_connectiongrpahrec: 'graph/connections/ConnectionGraphRec',
                gl_connectiongraphgraph: 'graph/connections/ConnectionGraphGraph',
                gl_graphrelationhandler: 'graph/GraphRelationHandler',
                gl_graph: 'graph/Graph',
                gl_recommendation: 'graph/Recommendation',
                gl_storage: '../../../common_js/storage',
                gl_dbhandler: 'DbHandler',
                gl_initpage: 'InitPage'
            }
        });




    };

    WebGlCollectionsPlugin.draw = function (receivedData, mappingCombination, iWidth, iHeight) {

        if (!WebGlCollectionsPlugin.librariesLoaded) {
            require([ 'gl_jquery','gl_jquerymousewheel',
                'gl_threejs','gl_gldebugger', 'gl_interactionhandler', 
                'gl_glscene', 'gl_navigationhandler', 'gl_simplecompare',
                'gl_connectionabstract', 'gl_connectionabstract', 
                'gl_connectiongrpahrec', 'gl_connectiongraphgraph', 
                'gl_graphrelationhandler', 'gl_graph', 'gl_recommendation',
                'gl_storage', 'gl_dbhandler', 'gl_initpage'
            ], function () {
                WebGlCollectionsPlugin.librariesLoaded = true;
                WebGlCollectionsPlugin.draw();
            });
            return;
        }
       
        
        var inner_html = ''                                                 +
            '<div id="webgl_canvas_container">'                             +
            '<p>Loading WebGL-Graphs...<br />'                              +
            ''                                                              +
            '    Please wait!<br/>'                                         +
            '    <img src="media/ajax-loader.gif" alt="loading" /></p>'     +
        '</div>'                                                            +


        '<div id="webgl_status_bar">'                                       +
            '<span id="webgl_status_bar_content"> </span>'                  +
            '<div id="webgl_status_bar_buttoncompare_simple"><a href="#">'  +
            '   Compare (Simple)'                                           +
            '</a></div>'                                                    +
        '</div>';
        $root.append(inner_html);
    };

    // indexArray: array with items' indices to highlight. They match items in receivedData (parameter in Render.draw)
    WebGlCollectionsPlugin.highlightItems = function (indexArray) {
    };

    WebGlCollectionsPlugin.finalize = function () {
    };

    PluginHandler.registerVisualisation(WebGlCollectionsPlugin, {
        'displayName': 'WebGl-Collections',
    });
})();
