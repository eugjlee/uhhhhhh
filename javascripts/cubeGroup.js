function CubeGroup () {

  this.locations = this.createLocations()

  this.mesh = this.createCubes()

}

CubeGroup.prototype.createLocations = function() {
  var locations = []

  for (var x = -16; x < 17; x+=2) {
  // for (var x = -3; x < 4; x+=2) {
    for (var y = -16; y < 17; y+=2) {
    // for (var y = -3; y < 4; y+=2) {
      for (var z = -60; z < 51; z+=2) {
      // for (var z = 0; z < 1; z+=3) {
        if (y === 0) {
          if (x === 0 ) {
            console.log('skip')
          } else {
            locations.push(new THREE.Vector3(x,y,z))
          }
        } else {
          locations.push(new THREE.Vector3(x,y,z))
        }
      }
    }
  }
  return locations
}

CubeGroup.prototype.createCubes = function(first_argument) {
  var self = this
  var cubes = []

  var geometry = new THREE.Geometry()
  var material = new THREE.MeshNormalMaterial({});



  _.forEach(self.locations, function (location) {

    // var geom = new THREE.CubeGeometry(1, 1, 1);
    // var geom = new THREE.SphereGeometry(150, 6, 6)
    var geom = new THREE.TetrahedronGeometry(150, 0);

    var matrix = new THREE.Matrix4();

    var scale = new THREE.Vector3();
    scale.x =  0.002;
    scale.y =  0.002;
    scale.z =  0.002

    matrix.scale(scale)
    matrix.setPosition(location)

    geometry.merge(geom, matrix)


  })
  var mesh = new THREE.Mesh(geometry, material)
  return mesh
}


 // this.locations = [
  //     new THREE.Vector3(0,0,-3),
  //     new THREE.Vector3(5,0,-3),
  //     new THREE.Vector3(-5,0,-3),

  //     new THREE.Vector3(0,5,-3),
  //     new THREE.Vector3(5,5,-3),
  //     new THREE.Vector3(-5,5,-3),

  //     new THREE.Vector3(0,-5,-3),
  //     new THREE.Vector3(5,-5,-3),
  //     new THREE.Vector3(-5,-5,-3),

  //     // new THREE.Vector3(0,0,0),
  //     // new THREE.Vector3(10,0,0),
  //     // new THREE.Vector3(-10,0,0),

  //     // new THREE.Vector3(0,-5,0),
  //     // new THREE.Vector3(5,-5,0),
  //     // new THREE.Vector3(-5,-5,0),

  //     // new THREE.Vector3(0,5,0),
  //     // new THREE.Vector3(5,5,0),
  //     // new THREE.Vector3(-5,5,0),



  //     // new THREE.Vector3(0,0,3),
  //     // new THREE.Vector3(5,0,3),
  //     // new THREE.Vector3(-5,0,3),

  //     // new THREE.Vector3(0,5,3),
  //     // new THREE.Vector3(5,5,3),
  //     // new THREE.Vector3(-5,5,3),

  //     // new THREE.Vector3(0,-5,3),
  //     // new THREE.Vector3(5,-5,3),
  //     // new THREE.Vector3(-5,-5,3),
  //   ]
