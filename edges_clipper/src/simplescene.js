import React, { useEffect } from 'react';
import * as THREE from 'three';
import * as OBC from 'openbim-components';

const SimpleScene = () => {
  useEffect(() => {
    // 组件加载时初始化3D场景->iseEffect 

    const container = document.getElementById('scene-container');
    //最后return <div id="scene-container">

    const components = new OBC.Components(); //创建openbim-components库中Components类的一个实例。
    
    components.scene = new OBC.SimpleScene(components);
    components.renderer = new OBC.SimpleRenderer(components, container);//allows us to see things moving around.
    components.camera = new OBC.SimpleCamera(components); //defines where we are and in that 3D world.
    components.raycaster = new OBC.SimpleRaycaster(components);

    components.init();
    
    //a reference to the scene, which you can get with the get() method
    const scene = components.scene.get(); //获取场景对象，以便可以向其中添加物体。
    components.camera.controls.setLookAt(10, 10, 10, 0, 0, 0);

    //add a simple grid component.
    const grid = new OBC.SimpleGrid(components);

    const cubeGeometry = new THREE.BoxGeometry(3, 3, 3);
    const cubeMaterial = new THREE.MeshStandardMaterial({ color: '#6528D7' });
    
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(-2, 1.5, 0);

    scene.add(cube);
    components.meshes.add(cube);

    const cube2 = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube2.position.set(2, 1.5, 0);
    
    scene.add(cube2);
    components.meshes.add(cube2);
    
    const clipper = new OBC.EdgesClipper(components);
    clipper.enabled = true;

    const blueFill = new THREE.MeshBasicMaterial({color: 'lightblue', side: 2});
    const blueLine = new THREE.LineBasicMaterial({ color: 'blue' });
    const blueOutline = new THREE.MeshBasicMaterial({color: 'blue', opacity: 0.2, side: 2, transparent: true});
    clipper.styles.create('Red lines', new Set([cube]), blueLine, blueFill, blueOutline);
    const salmonFill = new THREE.MeshBasicMaterial({color: 'salmon', side: 2});
    const redLine = new THREE.LineBasicMaterial({ color: 'red' });
    const redOutline = new THREE.MeshBasicMaterial({color: 'red', opacity: 0.2, side: 2, transparent: true});
    clipper.styles.create('Blue lines', new Set([cube2]), redLine, salmonFill, redOutline);
    container.ondblclick = () => clipper.create();

    window.onkeydown = (event) => {
      if (event.code === 'Delete' || event.code === 'Backspace') {
      clipper.delete();
      }
      if (event.code === 'KeyP') {
      console.log(clipper);
      }
      };

    // 组件卸载时清理资源
    return () => {
      components.dispose();
    };
  }, []);

  return <div id="scene-container" style={{ width: '600px', height: '400px' }}></div>;
};

export default SimpleScene;
