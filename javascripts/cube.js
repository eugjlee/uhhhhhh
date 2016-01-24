function Cube (opts) {
  this.mesh = this.createMesh({location : opts.location})
}

Cube.prototype.createMesh = function(opts) {

  // console.log(geometry)
  material = new THREE.MeshNormalMaterial({});
  var mesh = new THREE.Mesh(opts.geometry, material)
  mesh.position.set(opts.location.x, opts.location.y, opts.location.z)
  return mesh
};