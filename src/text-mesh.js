import {
  TextGeometry,
  MeshPhongMaterial,
  MultiMaterial,
  GeometryUtils,
  Mesh,
  FlatShading,
  SmoothShading,
  FontLoader
} from 'three';

export let createTextMesh = function (text, options) {
  let textGeo = new TextGeometry( text, options )
  textGeo.scale(options.scale, options.scale, options.scale)

  textGeo.computeBoundingBox();
  textGeo.computeVertexNormals();

  // "fix" side normals by removing z-component of normals for side faces
  // (this doesn't work well for beveled geometry as then we lose nice curvature around z-axis)

  if ( ! options.bevelEnabled ) {

    const triangleAreaHeuristics = 0.1 * ( options.height * options.size );

    for ( let i = 0; i < textGeo.faces.length; i ++ ) {

      const face = textGeo.faces[ i ];

      if ( face.materials[ 0 ].id == options.textMaterialSide.id ) {

        for ( let j = 0; j < face.vertexNormals.length; j ++ ) {
          face.vertexNormals[ j ].z = 0;
          face.vertexNormals[ j ].normalize();
        }

        const va = textGeo.vertices[ face.a ].position;
        const vb = textGeo.vertices[ face.b ].position;
        const vc = textGeo.vertices[ face.c ].position;
        const s = GeometryUtils.triangleArea( va, vb, vc );

        if ( s > triangleAreaHeuristics ) {
          for ( let j = 0; j < face.vertexNormals.length; j ++ ) {
            face.vertexNormals[ j ].copy( face.normal );
          }
        }
      }
    }
  }

  const centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

  const textMesh = new Mesh( textGeo, options.faceMaterial );

  textMesh.position.x = centerOffset;
  textMesh.position.z = options.hover;
  textMesh.position.y = options.depthOffset;

  textMesh.rotation.y = 0;
  textMesh.rotation.x = Math.PI / 2;

  return textMesh

}

let callTextMesh = function (font) {

  let material = new MultiMaterial( [
    new MeshPhongMaterial( { color: 0x00ffff, shading: FlatShading } ), // front
    new MeshPhongMaterial( { color: 0x0000ff, shading: SmoothShading } ) // side
  ] );

  const text = 'Pseudo Image Interpolation';
  const options = {
    size: 16,
    // Extrusion depth
    height: 3,
    scale: 0.04,
    // z position
    hover: 258,
    // y position
    depthOffset: -0.1,
    curveSegments: 4,
    // bevelThickness:2,
    bevelThickness: 1,
    bevelSize:1.5,
    bevelSegments:3,
    bevelEnabled:true,
    bend:false,
    font: font,
    // weight can be normal or bold
    weight: "normal",
    // style can be normal or italic
    style: "normal",
    material: 0,
    faceMaterial: material,
    groupMaterial: new MeshPhongMaterial( { color: 0xEE7600, shading: FlatShading } ),
    extrudeMaterial: 1,
    textMaterial: new MeshPhongMaterial( { color: 0x00ffff, shading: SmoothShading } )
  }

  return createTextMesh(text, options)

}

export let addTextMesh = function() {
  return new Promise((res, rej) => {
    const loader = new FontLoader();
    const fontFile = 'fonts/helvetiker_regular.typeface.js'
    loader.load( fontFile, function ( font ) {
      console.log('font loaded')
      const textMesh = callTextMesh(font)
      res(textMesh)
    })
  })
}
