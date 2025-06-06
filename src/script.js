import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { Timer } from 'three/addons/misc/Timer.js'
import { Sky } from 'three/addons/objects/Sky.js'

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
const floorColorTexture = textureLoader.load('./floor/textures/brown_mud_leaves_01_diff_1k.webp')
const floorARMTexture = textureLoader.load('./floor/textures/brown_mud_leaves_01_arm_1k.webp')
const floorNormalTexture = textureLoader.load('./floor/textures/brown_mud_leaves_01_nor_gl_1k.webp')
const floorDisplacementTexture = textureLoader.load('./floor/textures/brown_mud_leaves_01_disp_1k.webp')

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

const wallColorTexture = textureLoader.load('./wall/textures/rock_wall_09_diff_1k.webp')
const wallARMTexture = textureLoader.load('./wall/textures/rock_wall_09_arm_1k.webp')
const wallNormalTexture = textureLoader.load('./wall/textures/rock_wall_09_nor_gl_1k.webp')

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

const doorAlphaTexture = textureLoader.load('./door/alpha.webp')
const doorAmbientOcclusionTexture = textureLoader.load('./door/ambientOcclusion.webp')
const doorHeightTexture = textureLoader.load('./door/height.webp')
const doorNormalTexture = textureLoader.load('./door/normal.webp')
const doorMetalnessTexture = textureLoader.load('./door/metalness.webp')
const doorRoughnessTexture = textureLoader.load('./door/roughness.webp')
const doorColorTexture = textureLoader.load('./door/color.webp')

doorColorTexture.colorSpace = THREE.SRGBColorSpace

const roofColorTexture = textureLoader.load('./roof/textures/roof_slates_02_diff_1k.webp')
const roofARMTexture = textureLoader.load('./roof/textures/roof_slates_02_arm_1k.webp')
const roofNormalTexture = textureLoader.load('./roof/textures/roof_slates_02_nor_1k.webp')

roofColorTexture.colorSpace = THREE.SRGBColorSpace

roofColorTexture.repeat.set(3, 1)
roofARMTexture.repeat.set(3, 1)
roofNormalTexture.repeat.set(3, 1)

roofColorTexture.wrapS = THREE.RepeatWrapping
roofARMTexture.wrapS = THREE.RepeatWrapping
roofNormalTexture.wrapS = THREE.RepeatWrapping

const bushColorTexture = textureLoader.load('./bush/textures/leaves_forest_ground_diff_1k.webp')
const bushARMTexture = textureLoader.load('./bush/textures/leaves_forest_ground_arm_1k.webp')
const bushNormalTexture = textureLoader.load('./bush/textures/leaves_forest_ground_nor_1k.webp')

bushColorTexture.colorSpace = THREE.SRGBColorSpace

bushColorTexture.repeat.set(2, 1)
bushARMTexture.repeat.set(2, 1)
bushNormalTexture.repeat.set(2, 1)

bushColorTexture.wrapS = THREE.RepeatWrapping
bushARMTexture.wrapS = THREE.RepeatWrapping
bushNormalTexture.wrapS = THREE.RepeatWrapping

const graveColorTexture = textureLoader.load('./grave/textures/stone_tiles_02_diff_1k.webp')
const graveARMTexture = textureLoader.load('./grave/textures/stone_tiles_02_arm_1k.webp')
const graveNormalTexture = textureLoader.load('./grave/textures/stone_tiles_02_nor_1k.webp')

graveColorTexture.colorSpace = THREE.SRGBColorSpace

graveColorTexture.repeat.set(0.3, 0.4)
graveARMTexture.repeat.set(0.3, 0.4)
graveNormalTexture.repeat.set(0.3, 0.4)

graveColorTexture.wrapS = THREE.RepeatWrapping
graveARMTexture.wrapS = THREE.RepeatWrapping
graveNormalTexture.wrapS = THREE.RepeatWrapping
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
    new THREE.MeshStandardMaterial({
        map: roofColorTexture,
        aoMap: roofARMTexture,
        roughnessMap: roofARMTexture,
        metalnessMap: roofARMTexture,
        normalMap: roofNormalTexture
    })
)

roof.position.y = 2.5 + 1.5 / 2
roof.rotation.y = Math.PI / 4

house.add(roof) 

const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        alphaMap: doorAlphaTexture,
        transparent: true,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.15,
        displacementBias: -0.04,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture
    })
)

door.position.y = 1
door.position.z = 2 + 0.01

house.add(door)

const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({
    color: '#ccffcc',
    map: bushColorTexture,
    aoMap: bushARMTexture,
    roughnessMap: bushARMTexture,
    metalnessMap: bushARMTexture,
    normalMap: bushNormalTexture
})

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
    bush.rotation.x = - 0.75
    house.add(bush)
})

const doorLight = new THREE.PointLight('#ff7d46', 1)
doorLight.position.set(0, 2.2, 2.5)

house.add(doorLight)

// Graves

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({
    color: '#c1c1c1',
    map: graveColorTexture,
    aoMap: graveARMTexture,
    roughnessMap: graveARMTexture,
    metalnessMap: graveARMTexture,
    normalMap: graveNormalTexture
})

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
const ambientLight = new THREE.AmbientLight('#86cdff', 0.2)

scene.add(ambientLight)

// Directional Light
const directionalLight = new THREE.DirectionalLight('#86cdff', 0.5)
directionalLight.position.set(3, 2, -8)

scene.add(directionalLight)

/**
 * Ghosts Lights
 */

const ghost1 = new THREE.PointLight('#8800ff', 2)
const ghost2 = new THREE.PointLight('#ff0088', 2)
const ghost3 = new THREE.PointLight('#ff0000', 2)

scene.add(ghost1, ghost2, ghost3)


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

/**
 * Shadows
 */

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap

// Cast
directionalLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true
walls.castShadow = true
roof.castShadow = true

// Receive
walls.receiveShadow = true
floor.receiveShadow = true

for (const grave of graves.children) {
    grave.castShadow = true
    grave.receiveShadow = true
}

// Maping

directionalLight.shadow.mapSize.width = 256
directionalLight.shadow.mapSize.height = 256
directionalLight.shadow.camera.top = 8
directionalLight.shadow.camera.right = 8
directionalLight.shadow.camera.bottom = -8
directionalLight.shadow.camera.left = -8
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 20

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.mapSize.far = 10

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.mapSize.far = 10

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.mapSize.far = 10

/**
 * Sky
 */

const sky = new Sky()

sky.material.uniforms['turbidity'].value = 10
sky.material.uniforms['rayleigh'].value = 3
sky.material.uniforms['mieCoefficient'].value = 0.1
sky.material.uniforms['mieDirectionalG'].value = 0.95
sky.material.uniforms['sunPosition'].value.set(0.3, -0.038, -0.95)

sky.scale.set(100, 100, 100)

scene.add(sky)

/**
 * Fog
 */

scene.fog = new THREE.FogExp2('#04343f', 0.1)


// Timer

const timer = new Timer();

// Animation

const tick = () => {
    // Timer
    timer.update()
	const elapsedTime = timer.getElapsed();

    // Update controls
    controls.update();

    // Update Ghosts Lights
    const ghost1Angle = elapsedTime * 0.5
    ghost1.position.x = Math.sin(ghost1Angle) * 4
    ghost1.position.z = Math.cos(ghost1Angle) * 4
    ghost1.position.y = Math.sin(ghost1Angle) * Math.sin(ghost1Angle * 2.34) * Math.sin(ghost1Angle * 3.45)
    
    const ghost2Angle = - elapsedTime * 0.38
    ghost2.position.x = Math.sin(ghost2Angle) * 5
    ghost2.position.z = Math.cos(ghost2Angle) * 5
    ghost2.position.y = Math.sin(ghost2Angle) * Math.sin(ghost2Angle * 2.34) * Math.sin(ghost2Angle * 3.45)
    
    const ghost3Angle = elapsedTime * 0.23
    ghost3.position.x = Math.sin(ghost3Angle) * 6
    ghost3.position.z = Math.cos(ghost3Angle) * 6
    ghost3.position.y = Math.sin(ghost3Angle) * Math.sin(ghost3Angle * 2.34) * Math.sin(ghost3Angle * 3.45)

    // flicker door light
    doorLight.intensity = Math.random() + 1

	// Render
	renderer.render(scene, camera);

	// Recursion pour avoir une animation sur notre framerate
	window.requestAnimationFrame(tick);
};

tick();