import React, { useState, useContext } from "react";
import Layout from "../components/Layout";
import UploadSection from "../components/UploadSection";
import ModelViewer from "../components/ModelViewer";
import AnimationList from "../components/AnimationList";
import loadModel from "../helpers/loadModel";
import { Context as ModalContext } from "../context/ModelContext";
import Export from "../components/Export";
import Preloader from "../components/Preloader";
import DefaultGLB from "../assets/model3d/default.glb";
import Info from "../components/Info";

const Home = () => {
  const [model, setModel] = useState(DefaultGLB);
  const [fileExt, setFileExt] = useState("gltf");
  const {
    state: { loading },
    addAnimations,
  } = useContext(ModalContext);

  const onMainModelUpload = (event) => {
    if (event.target.files[0]) {
      const file = event.target.files[0];
      let fileUrl = URL.createObjectURL(file);
      setFileExt(file.name.split(".").pop().toLowerCase());

      setModel(fileUrl);
    }
  };

  const onAnimationUpload = (event) => {
    if (event.target.files.length) {
      Array.from(event.target.files).forEach((element) => {
        let fileUrl = URL.createObjectURL(element);
        let fileExt = element.name.split(".").pop().toLowerCase();
        loadModel(fileUrl, fileExt, (object) => {
          let fileName = element.name.split(".")[0].replace(/\s/g, "");
          fileName = fileName.charAt(0).toUpperCase() + fileName.slice(1);
          if (object.animations.length > 1) {
            object.animations.forEach((anim, index) => {
              anim.name = fileName + index;
            });
          } else {
            if (object.animations[0].name === "Take 001") {
              object.animations[0].name = "T-Pose (No Animation)";
            } else {
              object.animations[0].name = fileName;
            }
          }
          addAnimations(object.animations);
        });
      });
    }
  };

  const onAnimationFolderUpload = (event) => {
    if (event.target.files.length) {
      const files = Array.from(event.target.files);
      const fbxFiles = files.filter(file => 
        file.name.toLowerCase().endsWith('.fbx') || 
        file.name.toLowerCase().endsWith('.FBX')
      );

      if (fbxFiles.length === 0) {
        console.warn('No FBX files found in the selected folder');
        return;
      }

      fbxFiles.forEach((file) => {
        let fileUrl = URL.createObjectURL(file);
        let fileExt = file.name.split(".").pop().toLowerCase();
        
        // Get the relative path from the selected folder
        const path = file.webkitRelativePath || file.relativePath;
        const pathParts = path.split('/');
        
        // Remove the filename and root folder
        pathParts.pop(); // Remove filename
        pathParts.shift(); // Remove root folder
        
        // Only use subfolder structure if there are subfolders
        const folderPath = pathParts.length > 0 ? pathParts.join('_') : null;
        
        loadModel(fileUrl, fileExt, (object) => {
          let fileName = file.name.split(".")[0].replace(/\s/g, "");
          fileName = fileName.charAt(0).toUpperCase() + fileName.slice(1);
          
          // Only include folder path if there are subfolders
          const animationName = folderPath ? `${folderPath}_${fileName}` : fileName;
          
          // Since each file contains only one animation, we can just set its name directly
          object.animations[0].name = animationName;
          addAnimations(object.animations);
        });
      });
    }
  };

  return (
    <Layout>
      <div className="row" style={{ height: "91vh" }}>
        <div className="col m3">
          <UploadSection
            onMainModelUpload={onMainModelUpload}
            onAnimationUpload={onAnimationUpload}
            onAnimationFolderUpload={onAnimationFolderUpload}
          />
          <Export />
          <Info />
        </div>
        <div className="col m6">
          <ModelViewer model={model} fileExt={fileExt} />
        </div>
        <div className="col m3">
          <AnimationList />
        </div>
      </div>
      <Preloader loading={loading} />
    </Layout>
  );
};

export default Home;
