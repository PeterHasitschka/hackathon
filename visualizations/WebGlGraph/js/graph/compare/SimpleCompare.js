
var GLGR = GLGR || {};




/**
 * Constructor of a Simple Compare Class.
 * Two graphs are getting compared by looking at the results of their query.
 * Changed nodes are highlighted (or similar).
 * Automatically starts comparing if two graphs are selected and the compare-
 * button gets clicked
 */
GLGR.SimpleCompare = function () {

    if (GLGR.SimpleCompare.singleton_ !== undefined)
        throw ("Error! SimpleCompare is Singleton use!");

    GLGR.SimpleCompare.singleton_ = this;


    this.button = jQuery("#webgl_status_bar_buttoncompare_simple");

    this.graphs_ = {g1: null, g2: null};


    jQuery(document).ready(function () {

        var that = GLGR.SimpleCompare.getSingleton();
        jQuery(that.button).click(function () {
            that.handleClick();
        });
    });
};

GLGR.SimpleCompare.getSingleton = function () {
    return this.singleton_;
};

/**
 * Just for checking if 2 Graphs are selected.
 * If so -> Show compare button, else hide.
 */
GLGR.SimpleCompare.prototype.manageCompareButton = function () {

    var select_count = this.getSelectedGraphs_().length;

    if (select_count === 2)
        this.button.show();
    else
    {
        this.button.hide();
        this.graphs_.g1 = null;
        this.graphs_.g2 = null;
    }
};

/**
 * Searching the two graphs and init compare after clicking the Compare-Button
 */
GLGR.SimpleCompare.prototype.handleClick = function () {

    var selected_graphs = this.getSelectedGraphs_();

    if (selected_graphs.length !== 2)
        throw ("Error in handling compare button! Size is " +
                selected_graphs.length + " instead of 2");

    this.graphs_.g1 = selected_graphs[0];
    this.graphs_.g2 = selected_graphs[1];

    this.compare();


};



GLGR.SimpleCompare.prototype.compare = function () {

    if (!this.graphs_.g1 || !this.graphs_.g2)
        throw("Can't compare - At least 1 Graph not set!");


    var recs_1 = [];
    for (var i = 0; i < this.graphs_.g1.getRecommendations().length; i++)
        recs_1.push(this.graphs_.g1.getRecommendations()[i].getId());

    var recs_2 = [];
    for (var i = 0; i < this.graphs_.g2.getRecommendations().length; i++)
        recs_2.push(this.graphs_.g2.getRecommendations()[i].getId());

    console.log(recs_1, recs_2);
    
    for (var i=0; i < recs_1.length; i++){
        if(jQuery.inArray(recs_1[i], recs_2) !== -1) {
            console.log(this.graphs_.g1.getRecommendations()[i].getId() + " also in G2");
        }
    }
    for (var i=0; i < recs_2.length; i++){
         if(jQuery.inArray(recs_2[i], recs_1) !== -1) {
            console.log(this.graphs_.g2.getRecommendations()[i].getId() + " also in G1");
        }
    }

};


/**
 * Finding two selected graphs.
 * @return {array} holding all selected graphs
 */
GLGR.SimpleCompare.prototype.getSelectedGraphs_ = function () {

    var scene = GLGR.Scene.getSingleton();

    var graphs = scene.getGraphs();

    var out_graphs = [];
    for (var i = 0; i < graphs.length; i++) {

        /** @type {GLGR.Graph} **/
        var curr_graph = graphs[i];

        if (curr_graph.getIsSelected()) {
            out_graphs.push(curr_graph);
        }
    }

    return out_graphs;
};