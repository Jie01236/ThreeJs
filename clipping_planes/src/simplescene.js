import React, { useEffect } from 'react';
import * as THREE from 'three';
import * as OBC from 'openbim-components';

const SimpleScene = () => {
  useEffect(() => {
    // 组件加载时初始化3D场景->useEffect 

    const container = document.getElementById('scene-container');
    //最后return <div id="scene-container">
    
    const components = new OBC.Components();
    
    components.scene = new OBC.SimpleScene(components);
    components.renderer = new OBC.SimpleRenderer(components, container);//allows us to see things moving around.
    components.camera = new OBC.SimpleCamera(components); //defines where we are and in that 3D world.
    components.raycaster = new OBC.SimpleRaycaster(components);
    components.init();

    const scene = components.scene.get(); //获取场景对象，以便可以向其中添加物体。
    components.camera.controls.setLookAt(10, 10, 10, 0, 0, 0);

    //add a simple grid component.
    const grid = new OBC.SimpleGrid(components);

    // 假设已经导入了THREE和OBC库
    // 第1步：创建立方体网格
    const cubeGeometry = new THREE.BoxGeometry(3, 3, 3);
    const cubeMaterial = new THREE.MeshStandardMaterial({ color: '#ffe599' }); // 提供的颜色是红色，但你提到了不同的十六进制值。根据需要进行调整。
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(0, 1.5, 0);

// 第2步：将立方体添加到场景和网格数组中
    scene.add(cube);
    components.meshes.add(cube);
    
    const clipper = new OBC.SimpleClipper(components);
    clipper.enabled = true;

// 创建工具栏和剪切按钮
    const mainButton = clipper.uiElement.get("main");
    const mainToolbar = new OBC.Toolbar(components, { name: 'Main Toolbar', position: 'bottom' });
    mainToolbar.addChild(mainButton);
    components.ui.addToolbar(mainToolbar);

// 剪切平面的创建和删除
    container.ondblclick = () => clipper.create();

    window.onkeydown = (event) => {
        if (event.code === 'Delete' || event.code === 'Backspace') {
            clipper.delete();
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
