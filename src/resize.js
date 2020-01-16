
export let setResizeHandler = function (camera, renderer) {
  let onWindowResize = function () {
    // const windowHalfX = window.innerWidth / 2;
    // const windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }
  window.addEventListener( 'resize', onWindowResize, false );
}

