$(document).on('ready', function () {

  var environment = {}
  environment.container = undefined
  environment.camera = undefined
  environment.controls = undefined
  environment.scene = undefined
  environment.renderer  = undefined
  environment.onRenderFcts = []
  environment.dollyOut = true

  environment.init = function (opts) {

    var self = this

    this.container = document.getElementById( "container" );

    this.focalPoint = new THREE.Vector3(0,0,0)

    /////////////////////////// set up camera /////////////////////////////

    this.camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 0.0001, 10000 );
    this.camera.position.set(0,0,10)
    this.camera.lookAt(this.focalPoint)

    this.screenHeight = findHeight({
        distance : self.camera.position.distanceTo(self.focalPoint),
        vFOV : self.camera.fov
      })

    function findVFOV(opts) {
      var angleRadians = 2 * Math.atan(opts.height / (2*opts.depth) )
      var angleDegrees = radiansToDegrees(angleRadians)
      return angleDegrees
    }

    function findHeight(opts) {
      vFOV = degreesToRadians(opts.vFOV)
      height = 2 * opts.distance * Math.tan(vFOV/2)
      return height
    }

    function degreesToRadians(degrees) {
      return degrees * Math.PI /180
    }
    function radiansToDegrees(radians) {
      return radians * 180 / Math.PI
    }

    // $(document).on('keypress', function (e) {
    //   if ( e.keyCode == 100 ) {

    //     animate()
    //   }
    // })

    this.animate = function () {
      var focalMove = moveFocalPoint({
        focalPoint : randomVector(10),
        duration : 10000
      })

      focalMove.onComplete( function () {
        var dollyOut = dollyZoom({
          destination: new THREE.Vector3(
            Math.floor(Math.random()* 10000- 5000),
            Math.floor(Math.random()* 10000- 5000),
            Math.floor(Math.random()* 10000- 5000)
          ),
          duration : 10000
        })

        dollyOut.onComplete(function () {
          var move = moveCamera({
            destination : new THREE.Vector3(
              Math.floor(Math.random()* 10000 - 5000),
              Math.floor(Math.random()* 10000 - 5000),
              Math.floor(Math.random()* 10000 - 5000)
            ),
            duration : 10000
          })
          move.onComplete(function () {
            var dollyIn = dollyZoom({
              destination : new THREE.Vector3(
                Math.floor(Math.random()* 6 - 3),
                Math.floor(Math.random()* 6 - 3),
                Math.floor(Math.random()* 6 - 3)
              ),
              duration : 10000
            })
            dollyIn.onComplete(function () {
              self.animate()
            })
          })
        })
      })
    }

    function randomVector(multiplier) {
      return new THREE.Vector3(
        Math.random()* multiplier - multiplier / 2 ,
        Math.random()* multiplier - multiplier / 2,
        Math.random()* multiplier - multiplier / 2
      )
    }

    function moveCamera(opts) {

      var destination = opts.destination

      var newX = destination.x
      var newy = destination.y
      var newZ = destination.z

      var tweenIncrementors = {
        x : self.camera.position.x,
        y : self.camera.position.y,
        z : self.camera.position.z
      }

      var tween = new TWEEN.Tween(tweenIncrementors)
          .to({
            x : newX,
            y : newy,
            z : newZ
          }, opts.duration)
          .easing(TWEEN.Easing.Quadratic.InOut)
          .onUpdate(function () {
            self.camera.position.set(tweenIncrementors.x, tweenIncrementors.y, tweenIncrementors.z)
            self.camera.lookAt(self.focalPoint)

            var newVFOV = findVFOV({
              depth : self.camera.position.distanceTo(self.focalPoint),
              height : self.screenHeight,
            })
            self.camera.fov = newVFOV
            self.camera.updateProjectionMatrix()
          })
          .start();
      return tween
    }

    function moveFocalPoint(opts) {
      var camera = self.camera
      var duration = opts.duration

      var newFocalPointPoint = opts.focalPoint
      var newX = newFocalPointPoint.x
      var newy = newFocalPointPoint.y
      var newZ = newFocalPointPoint.z

      var tween = new TWEEN.Tween(self.focalPoint)
          .to({
            x : newX,
            y : newy,
            z : newZ
          }, opts.duration)
          .easing(TWEEN.Easing.Quadratic.InOut)
          .onUpdate(function () {
            self.camera.lookAt(self.focalPoint)

            var newVFOV = findVFOV({
              depth : self.camera.position.distanceTo(self.focalPoint),
              height : self.screenHeight,
            })
            self.camera.fov = newVFOV
            self.camera.updateProjectionMatrix()
          })
          .start();
      return tween
    }


    function dollyZoom(opts) {
      var destination = opts.destination

      var currentDistance = self.camera.position.distanceTo(self.focalPoint)
      var newDistance = destination.distanceTo(self.focalPoint)
      var easing = TWEEN.Easing.Circular.InOut

      var newX = destination.x
      var newy = destination.y
      var newZ = destination.z

      var tweenIncrementors = {
        x : self.camera.position.x,
        y : self.camera.position.y,
        z : self.camera.position.z
      }

      var tween = new TWEEN.Tween(tweenIncrementors)
          .to({
            x : newX,
            y : newy,
            z : newZ
          }, opts.duration)
          .easing(easing)
          .onUpdate(function () {
            self.camera.position.set(tweenIncrementors.x, tweenIncrementors.y, tweenIncrementors.z)
            self.camera.lookAt(self.focalPoint)

            var newVFOV = findVFOV({
              depth : self.camera.position.distanceTo(self.focalPoint),
              height : self.screenHeight,
            })

            self.camera.fov = newVFOV
            self.camera.updateProjectionMatrix()
          })
          .start();
      return tween
    }

    /////////////////////////// set up controls /////////////////////////////

    // this.controls = new THREE.OrbitControls( this.camera, this.container );
    // this.controls.zoomSpeed = 0.2
    // this.controls.mouseButtons = { ORBIT: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE };

    // this.onRenderFcts.push(this.controls.update)

    /////////////////////////// set up scene /////////////////////////////

    this.scene = new THREE.Scene();

    /////////////////////////// set up renderer /////////////////////////////

    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.renderer.setClearColor( 0xffffff );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.container.appendChild( this.renderer.domElement );

    ///////////////////// On Window Resize ////////////////////////

    var windowResize = new THREEx.WindowResize(this.renderer, this.camera)

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

    var rendererStats = new THREEx.RendererStats()

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

    this.addObjectToScene = function (object) {
      self.scene.add(object.mesh)
    }

    this.cubeGroup = new CubeGroup()

    this.addObjectToScene(this.cubeGroup)


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

  // environment.animate()

  environment.render()


  function forEach(array, action) {
    for (var i = 0; i < array.length; i++) {
      action(array[i])
    }
  }









})