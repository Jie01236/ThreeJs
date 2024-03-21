import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import * as OBC from 'openbim-components';
import dat from 'dat.gui';

const SimpleScene = () => {
  const [components, setComponents] = useState(null);

  useEffect(() => {
    const initializeScene = async () => {
      const container = document.getElementById('scene-container');
      if (!container) {
        console.error('Container not found');
        return;
      }

      const components = new OBC.Components();
      components.scene = new OBC.SimpleScene(components);
      components.renderer = new OBC.SimpleRenderer(components, container);
      components.camera = new OBC.SimpleCamera(components);
      components.raycaster = new OBC.SimpleRaycaster(components);
      components.init();

      setComponents(components);

      // 创建一个简单的网格作为参考
      const grid = new OBC.SimpleGrid(components);
      components.scene.get().add(grid.mesh);

      // 加载片段并将其添加到场景中
      const fragments = new OBC.FragmentManager(components);
      const file = await fetch('../../../resources/small.frag'); // 确保文件路径是正确的
      const data = await file.arrayBuffer();
      const buffer = new Uint8Array(data);
      const model = await fragments.load(buffer);
      model.items.forEach(fragment => {
        components.scene.get().add(fragment.mesh);
      });

      // 设置屏幕剔除
      const culler = new OBC.ScreenCuller(components);
      await culler.setup();
      model.items.forEach(fragment => {
        culler.elements.add(fragment.mesh);
      });

      // 设置后处理效果
      if (comps.renderer.postproduction) {
        const postproduction = comps.renderer.postproduction;
        postproduction.enabled = true;

        // 排除网格模型，以免它们被后处理效果影响
        postproduction.customEffects.excludedMeshes.push(grid.mesh);

        // 设置dat.GUI来调整后处理参数
        const gui = new dat.GUI({ autoPlace: false });
        container.appendChild(gui.domElement); // 将GUI附加到容器中

        gui.add(postproduction, 'enabled').name("Enable Post-Production");
        const guiGamma = gui.addFolder('Gamma Correction');
        guiGamma.add(postproduction.settings, 'gamma', 0, 2.5).name("Gamma").onChange(value => {
          postproduction.setPasses({ gamma: value });
        });

        const guiCustomEffects = gui.addFolder('Custom Effects');
        guiCustomEffects.add(postproduction.customEffects, 'opacity', 0, 1).name('Line Opacity');
        guiCustomEffects.add(postproduction.customEffects, 'tolerance', 0, 6).name('Line Tolerance');
        guiCustomEffects.addColor(postproduction.customEffects, 'lineColor').name('Line Color');
        guiCustomEffects.add(postproduction.customEffects, 'glossEnabled').name('Gloss Enabled');
        guiCustomEffects.add(postproduction.customEffects, 'glossExponent', 0, 5).name('Gloss Exponent');
        guiCustomEffects.add(postproduction.customEffects, 'maxGloss', -2, 2).name('Max Gloss');
        guiCustomEffects.add(postproduction.customEffects, 'minGloss', -2, 2).name('Min Gloss');
      }

      return () => comps.dispose();
    };

    initializeScene();
  }, []);

export default SimpleScene;
