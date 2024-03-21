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

    const cubeMaterial = new THREE.MeshStandardMaterial({ color: '#6528D7' });
    const greenMaterial = new THREE.MeshStandardMaterial({color: '#BCF124'});
    const boxGeometry = new THREE.BoxGeometry(3, 3, 3);
    const cube1 = new THREE.Mesh(boxGeometry, cubeMaterial); 
    const cube2 = new THREE.Mesh(boxGeometry, cubeMaterial);
    const cube3 = new THREE.Mesh(boxGeometry, cubeMaterial);
    scene.add(cube1,cube2,cube3);

    cube1.position.set(0, 0 , 0);
    cube2.position.x = 5;
    cube3.position.x =-5;
    
    const cubes = [cube1, cube2, cube3]

    const oneDegree = Math.PI / 180;
    //这行定义了oneDegree变量，它将一度转换为弧度。
    //因为Three.js中旋转是以弧度计算的，而一个完整圆周是2 * Math.PI弧度，
    //等于360度。所以，一度等于Math.PI / 180弧度。
    function rotateCubes(){
        cube1.rotation.x += oneDegree;
        cube1.rotation.y += oneDegree;
        cube2.rotation.x += oneDegree;
        cube2.rotation.z += oneDegree;
        cube3.rotation.y += oneDegree;
        cube3.rotation.z += oneDegree;}
        components.renderer.onBeforeUpdate.add(rotateCubes);

        let previousSelection;
        window.onmousemove = () => {
        //在全局window对象上设置一个onmousemove事件监听器
        const result = components.raycaster.castRay(cubes); //调用components.raycaster的castRay方法，并传入一个包含所有可能被选中立方体的数组cubes。这个方法的作用是根据当前的鼠标位置，计算一条从相机出发穿过鼠标指针的射线，并检查这条射线是否与场景中的某些对象相交。如果找到相交的对象，result会包含有关这个对象的信息；否则，result为null或undefined。
        if (previousSelection) {
        previousSelection.material = cubeMaterial;
        }//检查previousSelection是否存在。如果存在，说明之前有一个q立方体被选中，现在将其材质重置为cubeMaterial，即将其颜色改回原来的颜色。这样做是为了确保之前被选中的立方体在不再被选中时能够恢复其原始状态。
        if (!result) {
        return;
        }
        result.object.material = greenMaterial;
        previousSelection = result.object;
        }

    components.scene.setup();

    // 组件卸载时清理资源
    return () => {
      components.dispose();
    };
  }, []);

  return <div id="scene-container" style={{ width: '600px', height: '400px' }}></div>;
};

export default SimpleScene;
