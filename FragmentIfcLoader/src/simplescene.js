import React, { useEffect } from 'react';
import * as THREE from 'three';
import * as OBC from 'openbim-components';
import * as WEBIFC from 'web-ifc';
import { downloadZip } from './downloadZip';


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

    let fragments = new OBC.FragmentManager(components);
    let fragmentIfcLoader = new OBC.FragmentIfcLoader(components);
    
    const mainToolbar = new OBC.Toolbar(components, {name: 'Main Toolbar', position: 'bottom'});
    components.ui.addToolbar(mainToolbar);

    const ifcButton = fragmentIfcLoader.uiElement.get("main");
    mainToolbar.addChild(ifcButton);
    
    async function setupFragmentIfcLoader() {
      await fragmentIfcLoader.setup();

      const excludedCats = [
          WEBIFC.IFCTENDONANCHOR,
          WEBIFC.IFCREINFORCINGBAR,
          WEBIFC.IFCREINFORCINGELEMENT,
      ];
      for (const cat of excludedCats) {
          fragmentIfcLoader.settings.excludedCategories.add(cat);
      }

      fragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true;
      fragmentIfcLoader.settings.webIfc.OPTIMIZE_PROFILES = true;
    }
    setupFragmentIfcLoader();

    async function loadIfcAsFragments() {
      const file = await fetch('./ifc/small.ifc');
      const data = await file.arrayBuffer();
      const buffer = new Uint8Array(data);
      const model = await fragmentIfcLoader.load(buffer, "example");
      scene.add(model);
      }
    
    async function exportFragments() {
      if (!fragments.groups.length) return;
      const group = fragments.groups[0];
      const data = fragments.export(group);
      const blob = new Blob([data]);
      const fragmentFile = new File([blob], 'small.frag');
      const files = [];
      files.push(fragmentFile);
      const properties = group.getLocalProperties();
      if (properties) {
        files.push(new File([JSON.stringify(properties)], 'small.json'));
        }
      const result = await downloadZip(files).blob();
      result.name = 'example';
      download(result);
      }
    
    function download(file) {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(file);
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      link.remove();
      }
    
    function disposeFragments() {
      fragments.dispose();
          }
    
    
    components.scene.setup();


    return () => {
      components.dispose();
    };
  }, []);

  return <div id="scene-container" style={{ width: '600px', height: '400px' }}></div>;
};

export default SimpleScene;
