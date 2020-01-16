import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Vector3,
} from 'three';

import {addPointLight} from './lights';
import {addDirectionalLight} from './lights';
import {setResizeHandler} from './resize';
import {loadAllImages, createTexturePlane, setupCanvas} from "./image-plane";
import {addTextMesh} from './text-mesh';

/*
 * target is the destination elemnet of the threejs rendering
 */
const target = document.getElementById('webgl');
/*
 * container is the element with the mouse event handlers
 */
const container = document.getElementById('container');
const imageNum = document.getElementById('image-num');
/*
 * Camera distance
 */
const distance = 10;
/*
 * Threejs.CanvasTexture requires each dimension to be a power of 2
 * The image will be scaled down to fit within the planeWidth.
 */
const width = 1024;
const height = 512;
/*
 * ratio of delta angle to delta x movement of the mousedown
 */
const dAngledX = 0.008;

/*
 * The viewed image is a plane with a texture created from the loaded images
 */
const planeWidth = 10;
const planeHeight = planeWidth * height / width;

let numImages;
let plane;
let images;
let lastX;
let observerAngle = 0;

/*
 * Call functions to setup the Threejs components
 */
const scene = setupScene();
const camera = setupCamera();
const renderer = setupRenderer({target});
const canvas = setupCanvas({width, height, color: '#ffffff'});

/*
 * The images are loaded asynchronously before the animation loop is started
 */
loadAndRender();

/*
 * Create the Threejs scene object with lighting
 */
function setupScene() {
  const scene = new Scene();
  addPointLight(scene);
  addDirectionalLight(scene);
  return scene;
}

/*
 * The x dimension is across the page
 * The y dimension is from the bottom to top of the page
 * The image plane is placed at (0, 0, height / 2)
 * The camera is placed at (0, -distance, height / 2)
 */
function setupCamera() {
  // const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, -distance,height / 2);
  camera.up = new Vector3(0,0,1);
  camera.lookAt(new Vector3(0, 0, height / 2));
  return camera;
}

/*
 *  Create the Threejs WebGL renderer
 */
function setupRenderer({target}) {
  const renderer = new WebGLRenderer({alpha: true});
  renderer.setClearColor(0xffffff, 1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  setResizeHandler(camera, renderer);
  target.appendChild(renderer.domElement);
  return renderer;
}

/*
 * Load the images asynchronously and then add the plane depicting the image.
 * Add the mouse handlers so a "drag" (mousedown followed by mousemove) will rotate
 * the viewpoint.
 */
async function loadAndRender() {
  const textMesh = await addTextMesh();
  scene.add(textMesh);
  images = await loadAllImages();
  let imageIndex = 0;
  let angleIndex = 0;
  let angle0 = 1.5 * Math.PI;
  let angle = angle0;
  numImages = images.length;
  let image = images[imageIndex];
  plane = createTexturePlane({image, canvas, planeWidth, planeHeight});
  scene.add(plane);
  function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  render();
  addMouseHandlers();
}

/*
 * Remove mousemove handlers when there is a mouseup or the mouse is moved out of
 * the container.
 *
 * The mouse must be engaged (mousedown) again after it has left the container
 * in order to move the observer angle.
 */
function addMouseHandlers() {
  container.addEventListener('mousedown', function(evt) {
    // console.log('mousedown', evt);
    lastX = evt.screenX;
    container.addEventListener('mousemove', mousemove);
    container.addEventListener('mouseup', function(e) {
        container.removeEventListener('mousemove', mousemove);
    });
    container.addEventListener('mouseout', function(e) {
      container.removeEventListener('mousemove', mousemove);
    });
  });
}

/*
 * Map net horizontal mouse movements to image angle change.
 * Get the image index and offset angle at the new observer angle, then
 * update the view.
 */
function mousemove(evt) {
  // console.log('mousemove', evt);
  const x = evt.screenX;
  const dx = lastX - x;
  lastX = x;
  // console.log('mousemove', dx);
  observerAngle += dx * dAngledX;
  const {imageIndex, offsetAngle} = getImageAndAngle(observerAngle);
  setView({imageIndex, offsetAngle});
}

/*
 * The offet angle is used to create the illusion that the image is moving
 * between frames, by changing the camera position from which the image plane
 * is viewed.
 */
function getImageAndAngle(observerAngle) {
  const normalizedAngle = ((observerAngle  % (2 * Math.PI)) +
    2 * Math.PI) % (2 * Math.PI);
  const imageIndex = Math.floor((normalizedAngle / (2 * Math.PI)) * numImages + 0.5) % numImages;
  const fraction = imageIndex / numImages;
  const offsetAngle = (normalizedAngle - (2 * Math.PI * imageIndex / numImages));
  return {imageIndex, offsetAngle};
}

/*
 * Create a new Plane object using the specified image index, then set the
 * camera position and view point.
 */
function setView({imageIndex, offsetAngle}) {
  imageNum.innerHTML = imageIndex;
  scene.remove(plane);
  const image = images[imageIndex]
  plane = createTexturePlane({image, canvas, planeWidth, planeHeight});
  scene.add(plane);

  let centerAngle = 1.5 * Math.PI;
  const angle = centerAngle + offsetAngle;
  const x = distance * Math.cos(angle);
  const y = distance * Math.sin(angle);
  console.log('camera: ', x, y);
  camera.position.set(x, y,height / 2);
  camera.lookAt(new Vector3(0, 0, height / 2));
}

