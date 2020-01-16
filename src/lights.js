import {PointLight} from 'three'
import {DirectionalLight} from 'three'
import {Fog} from 'three'

function decimalToHex( d ) {
  var hex = Number( d ).toString( 16 );
  hex = "000000".substr( 0, 6 - hex.length ) + hex;
  return hex.toUpperCase();
}

export let addPointLight = function (scene) {
  var pointLight = new PointLight( 0xffffff, 1.5 );
  pointLight.position.set( 0, -500, 90 );
  scene.add( pointLight );
  return pointLight
}

export let randomizePointLight = function (pointLight) {
  pointLight.color.setHSL( Math.random(), 1, 0.5 );
  let hex = decimalToHex( pointLight.color.getHex() );
  return hex
}

export let addDirectionalLight = function (scene) {
  var dirLight = new DirectionalLight( 0xffffff, 0.125 );
  dirLight.position.set( 0, 0, 100 ).normalize();
  scene.add( dirLight );
  return dirLight
}

export let addFog = function (scene) {
  scene.fog = new Fog( 0x000000, 250, 1400 );
}