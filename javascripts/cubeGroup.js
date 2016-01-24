function CubeGroup () {
  this.locations = this.createLocations()
  this.mesh = this.createCubes()
}

CubeGroup.prototype.createLocations = function() {
  var locations = []

  for (var x = -36; x < 37; x+=2) {
    for (var y = -36; y < 37; y+=2) {
      for (var z = -36; z < 37; z+=2) {
        locations.push(new THREE.Vector3(x,y,z))
      }
    }
  }
  return locations
}

CubeGroup.prototype.createCubes = function() {
  var self = this

  var geometry = new THREE.Geometry()
  var material = new THREE.MeshNormalMaterial();

  forEach(self.locations, function (location) {

    var geom = new THREE.CubeGeometry(1, 1, 1);

    var matrix = new THREE.Matrix4();

    var scale = new THREE.Vector3();
    scale.x =  0.3;
    scale.y =  0.3;
    scale.z =  0.3

    matrix.scale(scale)
    matrix.setPosition(location)

    geometry.merge(geom, matrix)

  })
  var mesh = new THREE.Mesh(geometry, material)

  return mesh
}

function forEach(array, action) {
  for (var i = 0; i < array.length; i++) {
    action(array[i])
  }
}
