import {
  PlaneGeometry,
  CanvasTexture,
  MeshBasicMaterial,
  Mesh
} from 'three';

/*
 * Use the browser API to load the images asynchronously, and
 * return an array of images when all the Promises are resolved.
 */
export let loadAllImages = function () {
  const images = [];
  const promises = []
  for (let i = 1; i <= 36; i++) {
    const image = new Image();
    image.src = `./images/${i}.jpg`;
    images.push(image);
    promises.push(new Promise((resolve, reject) => {
      image.onload = function (evt) {
        resolve(image);
      }
    }));
  };
  return Promise.all(promises);
};

/*
 * Offscreen HTML Canvas object used to display a specfied image
 */
export let setupCanvas = function ({width, height, color}) {
  let canvas = document.createElement('canvas')
  Object.assign(canvas, {width, height});
  if (color) {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
  }
  return canvas;
};

/*
 * Fit the image at the center point of the canvas at the largest scale
 * possible
 */
export let addImageToCanvas = function({canvas, image}) {
  const {width: imgWidth, height: imgHeight} = image;
  const {width, height} = canvas;
  let x;
  let y;
  let scale;
  if (height / width > imgHeight / imgWidth) {
    scale = width / imgWidth;
    x = 0;
    y = (height - imgHeight * scale) / 2;
  } else {
    scale = height / imgHeight;
    y = 0;
    x = (width - imgWidth * scale) / 2;
  }
  const context = canvas.getContext('2d');
  context.drawImage(image, x, y, imgWidth * scale, imgHeight * scale);
};

export let clearCanvas = function clearCanvas ({width, height}) {
  ctx.clearRect(0, 0, width, height)
};

export let createBackgroundPlane = function ({ backgroundWidth, backgroundHeight, z }) {
  const planeGeometry = new PlaneGeometry(backgroundWidth, backgroundHeight);
  const planeMaterial = new MeshBasicMaterial({
    color: 0xffffff
  });
  const plane = new Mesh(planeGeometry, planeMaterial);
  plane.receiveShadow = true;
  plane.rotation.x = 0.5 * Math.PI;
  plane.position.set(0, 1, z);
  return plane
};

/*
 * Use the image rendered to the canvas as the texture of the plane
 */
export let createTexturePlane = function({ image, canvas, planeWidth, planeHeight }) {
  const {width, height} = canvas;
  const { width: imageWidth, height: imageHeight } = image;
  addImageToCanvas({canvas, image});
  const planeGeometry = new PlaneGeometry(planeWidth, planeHeight);
  const texture = new CanvasTexture(canvas);
  const planeMaterial = new MeshBasicMaterial({
    map: texture
  });
  const plane = new Mesh(planeGeometry, planeMaterial);
  plane.receiveShadow = true;
  plane.rotation.x = 0.5 * Math.PI;
  plane.position.set(0, 0, height / 2);
  return plane
};

