$(document).on('ready', function () {

  var environment = {}
  environment.container = undefined
  environment.camera = undefined
  environment.controls = undefined
  environment.scene = undefined
  environment.renderer  = undefined
  environment.onRenderFcts = []
  environment.dollyState = 'in'

  environment.init = function (opts) {

    var self = this

    this.container = document.getElementById( "container" );

    /////////////////////////// set up camera /////////////////////////////

    this.camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 0.0001, 10000 );
    // this.camera.target = new THREE.Vector3(0,0,0)

    var depth = 10

    this.camera.position.set(0,0,depth)
    this.camera.lookAt(new THREE.Vector3(0,0,0))


    function findVFOV(opts) {
      var angleRadians = 2 * Math.atan(opts.height / (2*opts.depth) )
      var angleDegrees = radiansToDegrees(angleRadians)
      return angleDegrees
    }

    function findHeight(opts) {
      height = 2 * opts.distance * Math.tan(opts.vFOV/2)
      return height
    }


    // when we start the dolly zoom, we have:
    var currentVFOV = this.camera.fov
    var focalPoint = new THREE.Vector3(0,0,0)
    var cameraLocation = this.camera.position
    // we also have
    var totalDepthChange = 100

    var currentD = cameraLocation.distanceTo(focalPoint)




    function degreesToRadians(degrees) {
      return degrees * Math.PI /180
    }
    function radiansToDegrees(radians) {
      return radians * 180 / Math.PI
    }

    // dollyOut({
    //   dollyD: 1000,
    //   duration : 10000
    // })

    $(document).on('keypress', function (e) {
      if ( e.keyCode == 100 || e.keyCode == 68) {

        if (self.dollyState === 'in') {
          self.dollyState = 'out'
          dollyOut({
            dollyD: 3000,
            duration : 30000
          })


        } else if (self.dollyState === 'out')
          self.dollyState === 'in'
          dollyOut({
            dollyD: (-3000),
            duration : 30000
          })
      }
    })

    function dollyOut(opts) {

      var focalPoint = new THREE.Vector3(0,0,0)
      var camera = self.camera

      var newZ = camera.position.z + opts.dollyD
      var newX = camera.position.x
      var newy = camera.position.y


      var tweenIncrementors = {
        x : camera.position.x,
        y : camera.position.y,
        z : camera.position.z
      }

      var screenHeight = findHeight({
        distance : camera.position.distanceTo(focalPoint),
        vFOV : camera.fov
      })

      console.log(camera.fov)

      var tween = new TWEEN.Tween(tweenIncrementors)
          .to({
            x : newX,
            y : newy,
            z : newZ
          }, opts.duration)
          .easing(TWEEN.Easing.Exponential.In)
          .onUpdate(function () {
            camera.position.set(tweenIncrementors.x, tweenIncrementors.y, tweenIncrementors.z)

            var newVFOV = findVFOV({
              depth : camera.position.distanceTo(focalPoint),
              height : screenHeight,
            })


            camera.fov = newVFOV
            camera.updateProjectionMatrix()


          })
          .start();
    }



    /////////////////////////// set up controls /////////////////////////////

    this.controls = new THREE.OrbitControls( this.camera, this.container );
    // this.controls.maxDistance = 5
    // this.controls.minDistance = 1.7
    this.controls.zoomSpeed = 0.2
    // this.controls.target = new THREE.Vector3(0,0,0)
    this.controls.mouseButtons = { ORBIT: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE };

    this.onRenderFcts.push(this.controls.update)

    // setInterval(function () {
    //   self.controls.manualDolly({
    //     scale : 1
    //   }), 1000
    // })

    /////////////////////////// set up scene /////////////////////////////

    this.scene = new THREE.Scene();

    /////////////////////////// set up renderer /////////////////////////////

    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.renderer.setClearColor( 0xffffff );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    // this.renderer.sortObjects = false;
    this.container.appendChild( this.renderer.domElement );

    ///////////////////// On Window Resize ////////////////////////

    var windowResize = new THREEx.WindowResize(this.renderer, this.camera)

    ///////////////////////////////////// AxisHelper ////////////////////////////////////////

    // this.axisHelper = new THREE.AxisHelper( 50 );
    // this.scene.add( this.axisHelper );

    ///////////////////////////////////// Stats ////////////////////////////////////////

    var stats = new Stats();

    stats.setMode( 1 ); // 0: fps, 1: ms, 2: mb

    // align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.body.appendChild( stats.domElement );
    var $stats = $(stats.domElement)

    $stats.hide()

    this.onRenderFcts.push(function () {
      stats.begin();
      stats.end();
    })

    var rendererStats   = new THREEx.RendererStats()

    rendererStats.domElement.style.position = 'absolute'
    rendererStats.domElement.style.right = '0px'
    rendererStats.domElement.style.top   = '0px'
    document.body.appendChild( rendererStats.domElement )

    var $rendererStats = $(rendererStats.domElement)
    $rendererStats.hide()


    this.onRenderFcts.push(function () {
      rendererStats.update(self.renderer);
    })

    $(document).on('keypress', function (e) {
      if ( e.keyCode == 115 || e.keyCode == 83) {
        $stats.toggle()
        $rendererStats.toggle()
      }
    })


    ///////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////// UTILITIES ////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////

    ///////////////////////// adding & removing objects from scene /////////////////////////////////

    this.addObjectsToScene = function (objects) {
      forEach(objects, self.addObjectToScene)
    }

    this.addObjectToScene = function (object) {
      self.scene.add(object.mesh)
    }

    this.removeObjectFromScene = function (object) {
      self.scene.remove( object.mesh )
    }

    this.removeObjectsFromScene = function (objects) { // duplicate of ebove function
      forEach( objects, self.removeObjectFromScene )
    }

    // //////////////////////////////////// create the cube ////////////////////////////////////////////////

    // this.jSONloader.load('./assets/geometries/axis-cube.json', function (geometry) {
    //   var cubeMaterial = new THREE.MeshBasicMaterial({shading: THREE.FlatShading, color: 0xffffff, side: THREE.DoubleSide});
    //   var cube = new THREE.Mesh(geometry, cubeMaterial)
    //   self.scene.add(cube)
    // })

    // //////////////////////////////////// create axis guides ////////////////////////////////////////////////

    // this.axisGuides = new AxisGuides()
    // this.addObjectsToScene(this.axisGuides.lines)




    this.cubeGroup = new CubeGroup()

    this.addObjectToScene(this.cubeGroup)

// var geometry = new THREE.CubeGeometry(1, 1, 1);
// geometry.position= new THREE.Vector3(0,0,0)
// var material = new THREE.MeshNormalMaterial({shading: THREE.FlatShading});
// var mesh = new THREE.Mesh(geometry, material);
// this.scene.add(mesh);








    //////////////////////////////////////////////////////////////////////////////
    //                         render the scene                                 //
    //////////////////////////////////////////////////////////////////////////////

    this.onRenderFcts.push(function(){
      self.renderer.render( self.scene, self.camera );
    })

  }

  environment.render = function () {

    var self = this
    var lastTimeMsec = null
    requestAnimationFrame(function animate(nowMsec){

      // keep looping
      self.rafId = requestAnimationFrame( animate );

      // measure time
      lastTimeMsec  = lastTimeMsec || nowMsec-1000/60
      var deltaMsec = Math.min(200, nowMsec - lastTimeMsec)
      lastTimeMsec  = nowMsec

      // call each update function
      self.onRenderFcts.forEach(function(onRenderFct){
        onRenderFct(deltaMsec/1000, nowMsec/1000)
      })

      // update TWEEN functions
      TWEEN.update(nowMsec);


    })
  }

  environment.init()

  environment.render()


  function forEach(array, action) {
    for (var i = 0; i < array.length; i++) {
      action(array[i])
    }
  }









})