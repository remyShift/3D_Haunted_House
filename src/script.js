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
 * Textures
 */

const textureLoader = new THREE.TextureLoader()

const floorAlphaTexture = textureLoader.load('./floor/alpha.jpg')
const floorColorTexture = textureLoader.load('./floor/textures/forest_leaves_03_diff_1k.jpg')
const floorARMTexture = textureLoader.load('./floor/textures/forest_leaves_03_arm_1k.jpg')
const floorNormalTexture = textureLoader.load('./floor/textures/forest_leaves_03_nor_gl_1k.jpg')
const floorDisplacementTexture = textureLoader.load('./floor/textures/forest_leaves_03_disp_1k.jpg')

floorColorTexture.repeat.set(8, 8)
floorARMTexture.repeat.set(8, 8)
floorNormalTexture.repeat.set(8, 8)
floorDisplacementTexture.repeat.set(8, 8)

floorColorTexture.wrapS = THREE.RepeatWrapping
floorARMTexture.wrapS = THREE.RepeatWrapping
floorDisplacementTexture.wrapS = THREE.RepeatWrapping
floorNormalTexture.wrapS = THREE.RepeatWrapping

floorColorTexture.wrapT = THREE.RepeatWrapping
floorARMTexture.wrapT = THREE.RepeatWrapping
floorDisplacementTexture.wrapT = THREE.RepeatWrapping
floorNormalTexture.wrapT = THREE.RepeatWrapping

floorColorTexture.colorSpace = THREE.SRGBColorSpace

const wallColorTexture = textureLoader.load('./wall/textures/rock_wall_09_diff_1k.jpg')
const wallARMTexture = textureLoader.load('./wall/textures/rock_wall_09_arm_1k.jpg')
const wallNormalTexture = textureLoader.load('./wall/textures/rock_wall_09_nor_1k.jpg')

wallColorTexture.repeat.set(2, 2)
wallARMTexture.repeat.set(2, 2)
wallNormalTexture.repeat.set(2, 2)

wallColorTexture.wrapS = THREE.RepeatWrapping
wallARMTexture.wrapS = THREE.RepeatWrapping
wallNormalTexture.wrapS = THREE.RepeatWrapping

wallNormalTexture.wrapT = THREE.RepeatWrapping
wallARMTexture.wrapT = THREE.RepeatWrapping
wallColorTexture.wrapT = THREE.RepeatWrapping

wallColorTexture.colorSpace = THREE.SRGBColorSpace

const doorAlphaTexture = textureLoader.load('./door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('./door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('./door/height.jpg')
const doorNormalTexture = textureLoader.load('./door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('./door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('./door/roughness.jpg')
const doorColorTexture = textureLoader.load('./door/color.jpg')

doorColorTexture.colorSpace = THREE.SRGBColorSpace

const roofColorTexture = textureLoader.load('./roof/textures/roof_tile_14_diff_1k.jpg')
const roofARMTexture = textureLoader.load('./roof/textures/roof_tile_14_arm_1k.jpg')
const roofNormalTexture = textureLoader.load('./roof/textures/roof_tile_14_nor_1k.jpg')

roofColorTexture.colorSpace = THREE.SRGBColorSpace

/**
 * Objects
 */

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 100, 100),
    new THREE.MeshStandardMaterial({
        alphaMap: floorAlphaTexture,
        transparent: true,
        map: floorColorTexture,
        aoMap: floorARMTexture,
        roughnessMap: floorARMTexture,
        metalnessMap: floorARMTexture,
        normalMap: floorNormalTexture,
        displacementMap: floorDisplacementTexture,
        displacementScale: 0.2,
        displacementBias: -0.1
    })
)

floor.rotation.x = -Math.PI / 2
floor.position.y = 0

scene.add(floor)

// House

const house = new THREE.Group()

scene.add(house)

const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4, 100, 100),
    new THREE.MeshStandardMaterial({
        map: wallColorTexture,
        aoMap: wallARMTexture,
        roughnessMap: wallARMTexture,
        metalnessMap: wallARMTexture,
        normalMap: wallNormalTexture
    })
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

const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        alphaMap: doorAlphaTexture,
        transparent: true,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture
    })
)

door.position.y = 1
door.position.z = 2 + 0.001

house.add(door)

const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial()

const bushPositions = [
    [-0.8, 0, 2.2], // Gauche de la porte
    [0.8, 0, 2.2],  // Droite de la porte
    [-1.4, 0, 2.2], // Plus à gauche
    [1.4, 0, 2.2],  // Plus à droite
]

bushPositions.forEach(position => {
    const bush = new THREE.Mesh(bushGeometry, bushMaterial)
    bush.scale.setScalar(Math.random() * 0.3 + 0.2)
    bush.position.set(...position)
    house.add(bush)
})

// Graves

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial()

const graves = new THREE.Group() 
scene.add(graves)

for(let i = 0; i < 30; i++) {

    const angle = Math.random() * Math.PI * 2
    const radius = 3 + Math.random() * 4
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius

    const grave = new THREE.Mesh(graveGeometry, graveMaterial)

    grave.position.x = x
    grave.position.y = Math.random() * 0.4
    grave.position.z = z

    grave.rotation.x = (Math.random() - 0.5) * 0.4
    grave.rotation.y = (Math.random() - 0.5) * 0.4
    grave.rotation.z = (Math.random() - 0.5) * 0.4

    graves.add(grave)
}


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