var GLVIS = GLVIS || {};


/**
 * Handling the visual navigation of the scene
 * @param {GLVIS.Scene} scene Current scene
 */
GLVIS.NavigationHandler = function (scene) {
    /** @type {GLVIS.Scene} **/
    this.scene_ = scene;

    this.animation_ = {
        zoom_id: 'nh_anim_zoom',
        move_id_x: 'nh_anim_move_x',
        move_id_y: 'nh_anim_move_y'
    };
};


GLVIS.NavigationHandler.prototype.setCameraToCircle = function (x, y, z) {

    if (x === undefined)
        x = null;
    if (y === undefined)
        y = null;
    if (z === undefined)
        z = null;

    if (x === null | y === null | z === null) {
        throw Exception("All cordinate values needed!");
    }

    var collection_circle_center = new THREE.Vector3(0, 0, 0 - GLVIS.config.scene.circle_radius);
    var focus_point = new THREE.Vector3(x, y, z);

    var view_dir = collection_circle_center.clone().sub(focus_point);
    view_dir.normalize();

    var distance = GLVIS.config.three.camera_perspective.DISTANCE;
    var camera_pos = focus_point.clone().sub(view_dir.setLength(distance));

    var camera = this.scene_.getWebGlHandler().getCamera();
    camera.position.set(camera_pos.x, camera_pos.y, camera_pos.z);
    camera.lookAt(focus_point);
};

/**
 * Single getter for animation
 * @returns {float}
 */
GLVIS.NavigationHandler.prototype.getPosX = function () {
    return GLVIS.Scene.getCurrentScene().getWebGlHandler().getCamera().position.x;
};

/**
 * Single getter for animation
 * @returns {float}
 */
GLVIS.NavigationHandler.prototype.getPosY = function () {
    return GLVIS.Scene.getCurrentScene().getWebGlHandler().getCamera().position.y;
};

/**
 * 
 * @param {float} degree_h_delta Movement around the circle
 * @param {float} degree_b_delta Vertical tilt
 */
GLVIS.NavigationHandler.prototype.moveCameraAroundCircle = function (degree_h_delta, degree_v_delta) {

    if (degree_h_delta === null || degree_h_delta === undefined)
        degree_h_delta = 0;

    if (degree_v_delta === null || degree_v_delta === undefined)
        degree_v_delta = 0;

    var coll_circle_radius = GLVIS.config.scene.circle_radius;
    var camera_distance_to_colls = GLVIS.config.three.camera_perspective.DISTANCE;

    var total_distance_to_center = coll_circle_radius + camera_distance_to_colls;

    var camera = GLVIS.Scene.getCurrentScene().getWebGlHandler().getCamera();

    /** @type {THREE.Vector3} **/
    var current_camera_pos = camera.position.clone();


    //Move Circle to center
    current_camera_pos.add(new THREE.Vector3(0, 0, coll_circle_radius));

    //Normalize Circle to calculate
    current_camera_pos.divideScalar(total_distance_to_center);


    //HORIZONTAL

    //Get the degree
    var current_degree_h = Math.atan2(current_camera_pos.x, current_camera_pos.z) * 180 / Math.PI;

    //Add new delta
    current_degree_h += degree_h_delta;
    var rad_h_to_set = current_degree_h / (180 / Math.PI);

    //Get positions / Calculate back to world
    var pos_h = new THREE.Vector3(Math.sin(rad_h_to_set), current_camera_pos.y, Math.cos(rad_h_to_set));
    pos_h.multiplyScalar(total_distance_to_center);
    pos_h.sub(new THREE.Vector3(0, 0, coll_circle_radius));


    //VERTICAL

    //Current degree
    var curr_v_degree = Math.acos(current_camera_pos.y) * 180 / Math.PI;

    var rad_v_to_set = (curr_v_degree - degree_v_delta) / (180 / Math.PI);
    var pos_y = Math.cos(rad_v_to_set) * total_distance_to_center;

    camera.position.set(pos_h.x, pos_y, pos_h.z);
    camera.lookAt(new THREE.Vector3(0, 0, -coll_circle_radius));
};


/**
 * Move the scene's camera
 * @param {float | null} x
 * @param {type | null} y
 * @param {type | null} z
 */
GLVIS.NavigationHandler.prototype.moveCamera = function (x, y, z) {

    if (x === null || x === undefined)
        x = 0;
    if (y === null || y === undefined)
        y = 0;
    if (z === null || z === undefined)
        z = 0;


    GLVIS.Scene.getCurrentScene().getWebGlHandler().getCamera().position.x += x;
    GLVIS.Scene.getCurrentScene().getWebGlHandler().getCamera().position.y += y;
    GLVIS.Scene.getCurrentScene().getWebGlHandler().getCamera().position.z += z;
};

/**
 * Perform (absolute) zoom
 * @param {float} zoom_factor
 */
GLVIS.NavigationHandler.prototype.zoom = function (zoom_factor) {

    if (zoom_factor < 0)
        zoom_factor = 0;

    GLVIS.Scene.getCurrentScene().getWebGlHandler().getCamera().zoom = zoom_factor;
    GLVIS.Scene.getCurrentScene().getWebGlHandler().getCamera().updateProjectionMatrix();
};

/**
 * Getting the zoom level of the THREE.js Camera
 * @returns {Three.Camera.zoom}
 */
GLVIS.NavigationHandler.prototype.getZoomFactor = function () {
    var zoom = GLVIS.Scene.getCurrentScene().getWebGlHandler().getCamera().zoom;
    return zoom;
};

/**
 * Perform zoom relative
 * @param {float} delta_zoom_factor
 */
GLVIS.NavigationHandler.prototype.zoomDelta = function (delta_zoom_factor) {

    var zoom = GLVIS.Scene.getCurrentScene().getWebGlHandler().getCamera().zoom + (delta_zoom_factor / 100);

    //"this" may be unknown... 
    GLVIS.Scene.getCurrentScene().getNavigationHandler().zoom(zoom);
};

/**
 * 
 * @param {type} move_goal_x position x to reach
 * @param {type} move_goal_y position y to reach
 * @param {type} callback_fct
 */
GLVIS.NavigationHandler.prototype.animatedMovement = function (move_goal_x, move_goal_y, callback_fct) {

    var config = GLVIS.config.navigation.move.animated;
    var setter = this.moveCamera;

    var getter_x = this.getPosX;
    var setter_param_x = 0;
    var getter_y = this.getPosY;
    var setter_param_y = 1;

    var factor = config.speed_fct;
    var pow = config.pow;
    var threshold = config.threshold;


    //X
    GLVIS.Scene.getCurrentScene().getAnimation().finishAnimation(this.animation_.move_id_x);
    GLVIS.Scene.getCurrentScene().getAnimation().register(
            this.animation_.move_id_x,
            move_goal_x,
            null,
            getter_x,
            setter,
            setter_param_x,
            factor,
            pow,
            threshold,
            callback_fct
            );

    //Y
    GLVIS.Scene.getCurrentScene().getAnimation().finishAnimation(this.animation_.move_id_y);
    GLVIS.Scene.getCurrentScene().getAnimation().register(
            this.animation_.move_id_y,
            move_goal_y,
            null,
            getter_y,
            setter,
            setter_param_y,
            factor,
            pow,
            threshold,
            callback_fct
            );
};

/**
 * 
 * @param {type} zoom_goal zoom level to reach
 * @param {type} callback_fct
 */
GLVIS.NavigationHandler.prototype.animatedZoom = function (zoom_goal, callback_fct) {

    var config = GLVIS.config.navigation.zoom.animated;
    var threshold = config.threshold;
    var pow = config.pow;
    var factor = config.speed_fct;

    var getter = this.getZoomFactor;
    var setter = this.zoomDelta;

    //GLVIS.Scene.getCurrentScene().getAnimation().finishAnimation(this.animation_.zoom_id);

    GLVIS.Scene.getCurrentScene().getAnimation().register(
            this.animation_.zoom_id,
            zoom_goal,
            null,
            getter,
            setter,
            0,
            factor,
            pow,
            threshold,
            callback_fct
            );
};

/**
 * Resetting both movement-animations
 */
GLVIS.NavigationHandler.prototype.resetAnimationMovement = function () {
    GLVIS.Scene.getCurrentScene().getAnimation().unregister(this.animation_.move_id_x);
    GLVIS.Scene.getCurrentScene().getAnimation().unregister(this.animation_.move_id_y);
};

/**
 * Resetting the zoom-animation
 */
GLVIS.NavigationHandler.prototype.resetAnimationZoom = function () {
    GLVIS.Scene.getCurrentScene().getAnimation().unregister(this.animation_.zoom_id);
};

/**
 * 
 * @param {GLVIS.Collection} collection
 * @param {function} callback_fct callback when ready
 */
GLVIS.NavigationHandler.prototype.focusCollection = function (collection, callback_fct) {
    var that = this;
    var callback_called = false;

    /*
     * Move animation currently turned off. If Flipbook gets activated, the length
     * of the collections decreases, so the position where the movement starts is
     * somewhere far right of the collections and looks strange.
     * @TODO: Skip animation only if flipbook just created.
     * @TODO: Fix click-coll-bug when animation not ready. (Starting far right)
     */
    var animated_move = false;

    if (!animated_move)
        //this.setCamera(collection.getPosition().x, collection.getPosition().y, collection.getPosition().z);
        this.setCameraToCircle(collection.getPosition().x, collection.getPosition().y, collection.getPosition().z);


    that.animatedZoom(GLVIS.config.navigation.zoom.animated.zoom_in, function () {
        GLVIS.Debugger.debug("NavigationHandler",
                "finished zoom to " + GLVIS.config.navigation.zoom.animated.zoom_in,
                3);

        if (callback_fct && !callback_called) {
            callback_called = true;
            callback_fct();
        }
    });

    if (animated_move) {
        this.animatedMovement(collection.getPosition().x, collection.getPosition().y, function () {

            GLVIS.Debugger.debug("NavigationHandler",
                    "Finished movement to graph",
                    3);
            if (callback_fct && !callback_called) {
                callback_called = true;
                callback_fct();
            }

        });
    }
};
