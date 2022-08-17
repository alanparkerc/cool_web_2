
// import './style.css';
// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import {GUI} from 'three/examples/jsm/libs/'

// // Setup

// const scene = new THREE.Scene();

// // Background

// const hazeTexture = new THREE.TextureLoader().load('haze.png');
// scene.background = hazeTexture;

// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// camera.position.setZ(30);
// camera.position.setY(4);
// camera.position.setX(-3);

// const renderer = new THREE.WebGLRenderer({
//   canvas: document.querySelector('#bg'),
// });

// renderer.setPixelRatio(window.devicePixelRatio);
// renderer.setSize(window.innerWidth, window.innerHeight);

// renderer.render(scene, camera);

// // Lights

// const pointLight = new THREE.PointLight(0xffffff);
// pointLight.position.set(5, 5, 5);

// const ambientLight = new THREE.AmbientLight(0xffffff);

// scene.add(pointLight, ambientLight);

// // Helpers

// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper)

// const controls = new OrbitControls(camera, renderer.domElement);


// // Animation Loop

// function animate() {
//   requestAnimationFrame(animate);

//   controls.update();

//   renderer.render(scene, camera);
// }

// animate();


import * as THREE from 'https://unpkg.com/three/build/three.module.js';

			// import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

			let scene, camera, renderer;
			let geometry, mesh, material;
			let mouse, center;

			init();
			animate();

			function init() {

				const container = document.createElement( 'div' );
				document.body.appendChild( container );

				const info = document.createElement( 'div' );
				info.id = 'info';
				info.innerHTML = '<a href="https://threejs.org" target="_blank" rel="noopener">three.js</a> - kinect';
				document.body.appendChild( info );

				camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 10000 );
				camera.position.set( 0, 0, 500 );

				scene = new THREE.Scene();
				center = new THREE.Vector3();
				center.z = - 1000;

        // const hazeTexture = new THREE.TextureLoader().load('haze.png');
        // scene.background = hazeTexture;

				const video = document.getElementById( 'video' );

				const texture = new THREE.VideoTexture( video );
				texture.minFilter = THREE.NearestFilter;

				const width = 640, height = 480;
				const nearClipping = 850, farClipping = 4000;

				geometry = new THREE.BufferGeometry();

				const vertices = new Float32Array( width * height * 3 );

				for ( let i = 0, j = 0, l = vertices.length; i < l; i += 3, j ++ ) {

					vertices[ i ] = j % width;
					vertices[ i + 1 ] = Math.floor( j / width );

				}

				geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );

				material = new THREE.ShaderMaterial( {

					uniforms: {

						'map': { value: texture },
						'width': { value: width },
						'height': { value: height },
						'nearClipping': { value: nearClipping },
						'farClipping': { value: farClipping },

						'pointSize': { value: 2 },
						'zOffset': { value: 1000 }

					},
					vertexShader: document.getElementById( 'vs' ).textContent,
					fragmentShader: document.getElementById( 'fs' ).textContent,
					blending: THREE.AdditiveBlending,
					depthTest: false, depthWrite: false,
					transparent: true

				} );

        console.log();

				mesh = new THREE.Points( geometry, material );
				scene.add( mesh );

				// const gui = new GUI();
				// gui.add( material.uniforms.nearClipping, 'value', 1, 10000, 1.0 ).name( 'nearClipping' );
				// gui.add( material.uniforms.farClipping, 'value', 1, 10000, 1.0 ).name( 'farClipping' );
				// gui.add( material.uniforms.pointSize, 'value', 1, 10, 1.0 ).name( 'pointSize' );
				// gui.add( material.uniforms.zOffset, 'value', 0, 4000, 1.0 ).name( 'zOffset' );

				video.play();

				//

				renderer = new THREE.WebGLRenderer();
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				container.appendChild( renderer.domElement );

				mouse = new THREE.Vector3( 0, 0, 1 );

				document.addEventListener( 'mousemove', onDocumentMouseMove );

				

				window.addEventListener( 'resize', onWindowResize );

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			function onDocumentMouseMove( event ) {

				mouse.x = ( event.clientX - window.innerWidth / 2 ) * 0.2;
				mouse.y = ( event.clientY - window.innerHeight / 2 ) * 0.2;

			}

			function animate() {

				requestAnimationFrame( animate );

				render();

			}

			function render() {

				camera.position.x += ( mouse.x - camera.position.x ) * 0.05;
				camera.position.y += ( - mouse.y - camera.position.y ) * 0.05;
				camera.lookAt( center );

				renderer.render( scene, camera );

			}
