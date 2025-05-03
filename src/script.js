import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { Timer } from 'three/addons/misc/Timer.js'
/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene

const scene = new THREE.Scene()

/**
 * Objects
 */

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial()
)

floor.rotation.x = -Math.PI / 2
floor.position.y = 0

scene.add(floor)

// House

const house = new THREE.Group()

scene.add(house)

const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial()
)

walls.position.y = 2.5 / 2
house.add(walls)

const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1.5, 4),
    new THREE.MeshStandardMaterial()
)

roof.position.y = 2.5 + 1.5 / 2
roof.rotation.y = Math.PI / 4

house.add(roof) 



/**
 * Lights
 */

// Ambient Lights
const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)

// Directional Light
const directionalLight = new THREE.DirectionalLight('#ffffff', 2.5)
directionalLight.position.set(3, 2, -8)
directionalLight.intensity = 0.3

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)

scene.add(ambientLight, directionalLight)

/**
 * Sizes
 */

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener("resize", () => {
	// Update Sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	// Update Camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// Update Renderer
	renderer.setSize(sizes.width, sizes.height);
});

/**
 * Camera
 */

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 2, 5)

scene.add(camera)

// Camera Controls

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(sizes.width, sizes.height)

renderer.render(scene, camera)

// Timer

const timer = new Timer();

// Animation

const tick = () => {
        // Timer
    timer.update()
	const elapsedTime = timer.getElapsed();

    // Update controls
    controls.update();

	// Render
	renderer.render(scene, camera);

	// Recursion pour avoir une animation sur notre framerate
	window.requestAnimationFrame(tick);
};

tick();