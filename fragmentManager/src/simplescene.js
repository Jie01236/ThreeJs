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

    let fragments = new OBC.FragmentManager(components);

    const toolbar = new OBC.Toolbar(components);
    components.ui.addToolbar(toolbar);

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

      function exportFragments() {
        if(!fragments.groups.length) return;
        const group = fragments.groups[0];
        const data = fragments.export(group);
        const blob = new Blob([data]);
        const file = new File([blob], "small.frag");
        download(file);
        }
        const exportButton = new OBC.Button(components);
        exportButton.materialIcon = "exit_to_app";
        exportButton.tooltip = "Export model";
        toolbar.addChild(exportButton);
        exportButton.onClick.add(() => exportFragments());

        function download(file) {
          const link = document.createElement("a");
          link.href = URL.createObjectURL(file);
          link.download = file.name;
          document.body.appendChild(link);
          link.click();
          link.remove();
          }

        function disposeFragments() {
            fragments.dispose();
            }
            const disposeButton = new OBC.Button(components);
            disposeButton.materialIcon = "delete";
            disposeButton.tooltip = "Delete model";
            toolbar.addChild(disposeButton);
            disposeButton.onClick.add(() => disposeFragments());

            function importExternalFragment() {
              if(fragments.groups.length) return;
              const input = document.createElement("input");
              input.type = "file";
              input.onchange = async () => {
              const file = input.files[0];
              if(file.name.includes(".frag")) {
              const url = URL.createObjectURL(file);
              const result = await fetch(url);
              const data = await result.arrayBuffer();
              const buffer = new Uint8Array(data);
              fragments.load(buffer);
              }
              input.remove();
              }
              input.click();
              }
              const openButton = new OBC.Button(components);
              openButton.materialIcon = "folder_open";
              openButton.tooltip = "Import model";
              toolbar.addChild(openButton);
              openButton.onClick.add(() => importExternalFragment());
    components.scene.setup();

    // 组件卸载时清理资源
    return () => {
      components.dispose();
    };
  }, []);

  return <div id="scene-container" style={{ width: '600px', height: '400px' }}></div>;
};

export default SimpleScene;
