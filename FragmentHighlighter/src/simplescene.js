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
    
    const postProdRenderer = new OBC.PostproductionRenderer(
      components,
      container
    );
    components.renderer = postProdRenderer; //allows us to see things moving around.
   
    components.camera = new OBC.SimpleCamera(components); //defines where we are and in that 3D world.
    components.raycaster = new OBC.SimpleRaycaster(components);

    components.init();
    
    //a reference to the scene, which you can get with the get() method
    const scene = components.scene.get(); //获取场景对象，以便可以向其中添加物体。
    components.camera.controls.setLookAt(10, 10, 10, 0, 0, 0);

    const fragments = new OBC.FragmentManager(components);

    const toolbar = new OBC.Toolbar(components);
    components.ui.addToolbar(toolbar);
    
    const highlighter = new OBC.FragmentHighlighter(components, fragments);
  
    async function loadFragments() {
      if(fragments.groups.length) return;
      const file = await fetch(process.env.PUBLIC_URL + "/small.frag");

      const data = await file.arrayBuffer();
      const buffer = new Uint8Array(data);
      const group = await fragments.load(buffer);
      console.log(group)
      // const scene = components.scene.get();
      // scene.add(model);
      }
    const loadButton = new OBC.Button(components);
    loadButton.materialIcon = "download";
    loadButton.tooltip = "Load model";
    toolbar.addChild(loadButton);
    loadButton.onClick.add(() => loadFragments());

    postProdRenderer.postproduction.enabled = true;
    postProdRenderer.postproduction.customEffects.outlineEnabled = true;

    highlighter.updateHighlight();
    
    components.renderer.postproduction.customEffects.outlineEnabled = true;
    highlighter.outlinesEnabled = true;

    const highlightMaterial = new THREE.MeshBasicMaterial({
      color: '#BCF124',
      depthTest: false,
      opacity: 0.8,
      transparent: true
      });
      highlighter.add('default', highlightMaterial);
      highlighter.outlineMaterial.color.set(0xf0ff7a);

      let lastSelection;
      let singleSelection = {
      value: true,
      };
    
      async function highlightOnClick(event) {
        const result = await highlighter.highlight('default', singleSelection.value);
        if (result) {
        lastSelection = {};
        for (const fragment of result.fragments) {
        const fragmentID = fragment.id;
        lastSelection[fragmentID] = [result.id];
        }
        }
        }
        container.addEventListener('click', (event) => highlightOnClick(event));

        function highlightOnID() {
          if (lastSelection !== undefined) {
          highlighter.highlightByID('default', lastSelection);
          }
          }
    components.scene.setup();
    
  }, []);

  return <div id="scene-container" style={{ width: '600px', height: '400px' }}></div>;
};

export default SimpleScene;