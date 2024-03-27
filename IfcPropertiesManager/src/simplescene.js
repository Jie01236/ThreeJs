import React, { useEffect } from 'react';
import * as THREE from 'three';
import * as OBC from 'openbim-components';

const SimpleScene = () => {
  useEffect(() => {
    // 定义一个立即执行的异步函数来处理加载逻辑
    (async () => {
      const container = document.getElementById('scene-container');
      const components = new OBC.Components();
      components.scene = new OBC.SimpleScene(components);
      const postProdRenderer = new OBC.PostproductionRenderer(
        components,
        container
      );
      components.renderer = postProdRenderer;
      components.camera = new OBC.SimpleCamera(components);
      components.raycaster = new OBC.SimpleRaycaster(components);
      components.init();

      const fragments = new OBC.FragmentManager(components);

      // 加载fragments和properties
      const file = await fetch(process.env.PUBLIC_URL + "/small.frag");
      const dataBlob = await file.arrayBuffer();
      const buffer = new Uint8Array(dataBlob);
      const model = await fragments.load(buffer);

      const properties = await fetch(process.env.PUBLIC_URL + "/small.json");
      const props = await properties.json(); // 仅读取一次，然后保存到变量中
      model.setLocalProperties(props);
      
      postProdRenderer.postproduction.enabled = true;
      postProdRenderer.postproduction.customEffects.outlineEnabled = true;

      const propsProcessor = new OBC.IfcPropertiesProcessor(components);
      const propsManager = new OBC.IfcPropertiesManager(components);
      propsProcessor.propertiesManager = propsManager;

      propsProcessor.process(model);
      
      propsManager.onRequestFile.add(async () => {
      const fetched = await fetch(process.env.PUBLIC_URL + "/small.ifc");
      const buffer = await fetched.arrayBuffer()
      const ifc = await propsManager.saveToIfc(model, new Uint8Array(buffer));
      const a = document.createElement("a");
      const url = URL.createObjectURL(new Blob([ifc]));
      a.href = url;
      a.download = model.name;
      a.click();
      URL.revokeObjectURL(url);
      })

      const highlighter = new OBC.FragmentHighlighter(components, fragments);
      highlighter.setup();
      components.renderer.postproduction.customEffects.outlineEnabled = true;
      highlighter.outlinesEnabled = true;
      const highlighterEvents = highlighter.events;
      highlighterEvents.select.onClear.add(() => {
      propsProcessor.cleanPropertiesList();
      });

      highlighterEvents.select.onHighlight.add(
        (selection) => {
        const fragmentID = Object.keys(selection)[0];
        const expressID = [...selection[fragmentID]][0];
        let model
        for (const group of fragments.groups) {
        for(const [_key, value] of group.keyFragments) {
        if(value === fragmentID) {
        model = group;
        break;
        }
        }
        }
        if(model) {
        propsProcessor.renderProperties(model, expressID);
        }
        }
        );

      const mainToolbar = new OBC.Toolbar(components);
      components.ui.addToolbar(mainToolbar);
      mainToolbar.addChild(propsProcessor.uiElement.get("main"));

  components.scene.setup();
    })();
    
  }, []); // 确保这个effect仅在组件加载时执行一次

  return <div id="scene-container" style={{ width: '600px', height: '400px' }}></div>;
};

export default SimpleScene;
