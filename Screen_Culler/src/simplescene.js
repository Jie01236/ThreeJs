import React, { useEffect } from 'react';
import * as THREE from 'three';
import * as OBC from 'openbim-components';

const SimpleScene = () => {
  useEffect(() => {
    const setupScene = async () => {
      const container = document.getElementById('scene-container');
      const components = new OBC.Components();
      components.scene = new OBC.SimpleScene(components);
      components.renderer = new OBC.SimpleRenderer(components, container);
      components.camera = new OBC.SimpleCamera(components);
      components.raycaster = new OBC.SimpleRaycaster(components);

      const scene = components.scene.get();
      components.camera.controls.setLookAt(10, 10, 10, 0, 0, 0);

      const culler = new OBC.ScreenCuller(components);
      await culler.setup();

      culler.elements.threshold = 200;
      
      culler.elements.renderDebugFrame = true;
      const debugFrame = culler.elements.get().domElement;
      document.body.appendChild(debugFrame);
      debugFrame.style.position = 'fixed';
      debugFrame.style.left = '0';
      debugFrame.style.bottom = '0';
      debugFrame.style.visibility = 'collapse';
      
      function getRandomNumber(limit) {
        return Math.random() * limit;
      }

      const cubes = [];
      const geometry = new THREE.BoxGeometry(2, 2, 2);
      const material = new THREE.MeshLambertMaterial({ color: '#6528D7' });

      function regenerateCubes() {
        resetCubes();
        for (let i = 0; i < 300; i++) {
          const cube = new THREE.Mesh(geometry, material);
          cube.position.x = getRandomNumber(10);
          cube.position.y = getRandomNumber(10);
          cube.position.z = getRandomNumber(10);
          cube.updateMatrix();
          scene.add(cube);
          culler.elements.add(cube);
          cubes.push(cube);
        }
      }

      function resetCubes() {
        for (const cube of cubes) {
        cube.removeFromParent();
        }
        cubes.length = 0;
        }

      regenerateCubes();

      culler.elements.needsUpdate = true;
      components.camera.controls.addEventListener("controlend", () => {
        culler.elements.needsUpdate = true;});

      components.scene.setup();

      return () => components.dispose();
    };

    setupScene();
  }, []);

  return <div id="scene-container" style={{ width: '600px', height: '400px' }}></div>;
};

export default SimpleScene;
