import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import * as OBC from "openbim-components";
import * as dat from "dat.gui";

const SimpleScene = () => {
  const hasMount = useRef(false);
  useEffect(() => {
    // 定义一个立即执行的异步函数来处理加载逻辑
    if (!hasMount.current) {
      (async () => {
        const container = document.getElementById("scene-container");
        const components = new OBC.Components();
        components.scene = new OBC.SimpleScene(components);
        components.renderer = new OBC.PostproductionRenderer(
          components,
          container
        );
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
        model.setLocalProperties(await properties.json());

        const hider = new OBC.FragmentHider(components);
        await hider.loadCached();

        const classifier = new OBC.FragmentClassifier(components);
        classifier.byStorey(model);
        classifier.byEntity(model);
        const classifications = classifier.get();

        const storeys = {};
        const storeyNames = Object.keys(classifications.storeys);
        for (const name of storeyNames) {
          storeys[name] = true;
        }

        const classes = {};
        const classNames = Object.keys(classifications.entities);
        for (const name of classNames) {
          classes[name] = true;
        }

        const gui = new dat.GUI();
        const storeysGui = gui.addFolder("Storeys");
        for (const name in storeys) {
          storeysGui.add(storeys, name).onChange((visible) => {
            const found = classifier.find({ storeys: [name] });
            hider.set(visible, found);
          });
        }

        const entitiesGui = gui.addFolder("Classes");
        for (const name in classes) {
          entitiesGui.add(classes, name).onChange((visible) => {
            const found = classifier.find({ entities: [name] });
            hider.set(visible, found);
          });
        }

        const toolbar = new OBC.Toolbar(components);
        components.ui.addToolbar(toolbar);
        const hiderButton = hider.uiElement.get("main");
        toolbar.addChild(hiderButton);

        components.scene.setup();
      })();

      hasMount.current = true;
    }
  }, []); // 确保这个effect仅在组件加载时执行一次

  return (
    <div id="scene-container" style={{ width: "100vw", height: "100vh" }}></div>
  );
};

export default SimpleScene;
