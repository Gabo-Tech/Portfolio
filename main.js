import"./style.css";import*as THREE from"three";import{OrbitControls}from"three/examples/jsm/controls/OrbitControls";const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,.1,1000),canvas=document.querySelector("#bg"),renderer=new THREE.WebGLRenderer({canvas:canvas});renderer.setPixelRatio(window.devicePixelRatio);renderer.setSize(window.innerWidth,window.innerHeight);camera.position.setZ(30);camera.position.setX(-3);renderer.render(scene,camera);const torusGeometry=new THREE.TorusKnotGeometry(10,3,90,100),torusMaterial=new THREE.MeshStandardMaterial({color:0xffffff,transparent:true,opacity:.2,wireframe:true}),torus=new THREE.Mesh(torusGeometry,torusMaterial);scene.add(torus);const pointLight=new THREE.PointLight(0xffffff);pointLight.position.set(5,5,5);const pointLight2=new THREE.PointLight(0xffffff);pointLight.position.set(12,12,12);const ambientLight=new THREE.AmbientLight(0xffffff);scene.add(pointLight,pointLight2,ambientLight);const lightHelper=new THREE.PointLightHelper(pointLight);scene.add(lightHelper);const controls=new OrbitControls(camera,renderer.domElement);function addStar(){const geometry=new THREE.SphereGeometry(.25,24,24),material=new THREE.MeshStandardMaterial({color:0xffffff}),star=new THREE.Mesh(geometry,material),[x,y,z]=Array(3).fill().map(()=>THREE.MathUtils.randFloatSpread(100));star.position.set(x,y,z);scene.add(star)}Array(200).fill().forEach(addStar);const spaceTexture=new THREE.TextureLoader().load("1920x1080.jpg");scene.background=spaceTexture;const gabrielTexture=new THREE.TextureLoader().load("photo_2020-08-09_02-37-04.jpg"),gabriel=new THREE.Mesh(new THREE.SphereGeometry(1.5,32,32),new THREE.MeshBasicMaterial({map:gabrielTexture}));scene.add(gabriel);const moonTexture=new THREE.TextureLoader().load("moon_texture.jpg"),normalTexture=new THREE.TextureLoader().load("normal.jpg"),moon=new THREE.Mesh(new THREE.SphereGeometry(3,32,32),new THREE.MeshStandardMaterial({map:moonTexture,normalMap:normalTexture}));scene.add(moon);moon.position.z=30;moon.position.setX(-10);const earthTexture=new THREE.TextureLoader().load("earth_texture_map_1000px.jpg"),earth=new THREE.Mesh(new THREE.SphereGeometry(12,128,128),new THREE.MeshStandardMaterial({map:earthTexture,normalMap:normalTexture}));scene.add(earth);earth.position.z=50;earth.position.setX(-30);gabriel.position.z=-5;gabriel.position.x=2;function moveCamera(){const t=document.body.getBoundingClientRect().top;moon.rotation.x+=.05;moon.rotation.y+=.075;moon.rotation.z+=.05;earth.rotation.x+=.05;earth.rotation.y+=.075;earth.rotation.z+=.05;gabriel.rotation.y+=.01;gabriel.rotation.z+=.01;camera.position.z=t*-.01;camera.position.x=t*-.0002;camera.rotation.y=t*-.0002}document.body.onscroll=moveCamera;moveCamera();function animate(){requestAnimationFrame(animate);torus.rotation.x+=.01;torus.rotation.y+=.005;torus.rotation.z+=.01;moon.rotation.x+=.005;earth.rotation.y+=.005;renderer.render(scene,camera)}animate();