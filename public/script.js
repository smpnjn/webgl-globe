import * as THREE from './js/src/Three.js';
import { EffectComposer } from './js/examples/jsm/postprocessing/EffectComposer.js';
import { UnrealBloomPass } from './js/examples/jsm/postprocessing/UnrealBloomPass.js';
// import { GlitchPass } from './js/examples/jsm/postprocessing/GlitchPass.js';
import { RenderPass } from './js/examples/jsm/postprocessing/RenderPass.js';

function rgb(r, g, b) {
    return new THREE.Vector3(r, g, b);
}

document.addEventListener("DOMContentLoaded", function(e) {
   
    const renderer = new THREE.WebGLRenderer({
        powerPreference: "high-performance",
        antialias: true, 
        alpha: true
    });

    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement )
    renderer.setPixelRatio( window.devicePixelRatio );
    
    // This is for post processing
    const composer = new EffectComposer( renderer );
    // This is our scene
    const scene = new THREE.Scene();
    // This is the perspective for the camera
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    // THis is our post processing render
    const renderPass = new RenderPass( scene, camera );
    composer.addPass(renderPass);

    // This is our bloom to make our earth glow
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.65, 0.15, 0.05);
    composer.addPass(bloomPass);
    
    /*
    const glitchPass = new GlitchPass(1.2);
    composer.addPass(glitchPass);
    */
    let geometry = new THREE.SphereGeometry(170, 1024, 1024);
    let material = new THREE.ShaderMaterial({
        uniforms: {
            u_color1: {type: 'v3', value: rgb(61, 142, 241)},
            u_color2: {type: 'v3', value: rgb(0, 46, 76)},
            u_time: {type: 'f', value: 0},
            getTexture1: { type: "t", value: new THREE.TextureLoader().load('earth-height.png') }
        },
        fragmentShader: document.querySelector('#fragment-shader').textContent,
        vertexShader: document.querySelector('#vertex-shader').textContent
    });

    // Now we add this to 
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, -280);
    scene.add(mesh);
    
    // Time variable
    let t = 0;
    let movement = false;
    // We'll stop the globe moving if the user clicks
    document.body.addEventListener('pointerdown', function(e) {
        movement = true;
    })
    document.body.addEventListener('pointerup', function(e) {
        movement = false;
    });

    const animate = function () {
        requestAnimationFrame( animate );
        // This will create a new canvas element and add it to our HTML page
        composer.render();
        if(movement == false) {
            // We will rotate the object by a certain number of radians every time unit
            mesh.rotation.y = (Math.PI / 2) * (t / 12);
            mesh.rotation.x = (Math.PI / 2) * (t / 48);
            mesh.material.uniforms.u_time.value = t;
            // Increase t by a certain value every frame
            t = t + 0.05;
        }

        // These are optional but will make the glow occilate
        //composer.passes[1].strength = Math.sin(t) * 0.5 + 2;
        //composer.passes[1].radius = Math.sin(t) * 0.9;

    };
    
    animate();

});