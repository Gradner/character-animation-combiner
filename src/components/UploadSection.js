import React, { useContext } from "react";
import UploadButton from "./UploadButton";
import { Context as ModalContext } from "../context/ModelContext";
import { TextureLoader } from "three";

const UploadSection = ({ onMainModelUpload, onAnimationUpload, onAnimationFolderUpload }) => {
  const {
    state: { mainModel },
    setTexture,
  } = useContext(ModalContext);

  const onTextureUpload = (event) => {
    console.log('Texture upload event received');
    if (!event.target.files || !event.target.files[0]) {
      console.log('No file selected');
      return;
    }

    const file = event.target.files[0];
    const fileUrl = URL.createObjectURL(file);
    
    console.log('Loading texture:', {
      name: file.name,
      size: file.size,
      url: fileUrl
    });
    
    const loader = new TextureLoader();
    loader.setCrossOrigin("anonymous");
    
    try {
      loader.load(
        fileUrl,
        (loadedTexture) => {
          console.log('Texture loaded successfully:', {
            width: loadedTexture.image.width,
            height: loadedTexture.image.height,
            format: loadedTexture.format,
            type: loadedTexture.type
          });
          setTexture(loadedTexture);
        },
        (progress) => {
          console.log('Texture loading progress:', progress);
        },
        (error) => {
          console.error('Error loading texture:', error);
        }
      );
    } catch (error) {
      console.error('Error in texture loading process:', error);
    }
  };

  return (
    <ul className="collection with-header">
      <li className="collection-header grey darken-3 white-text">
        <h5>Upload File with Character </h5>
        <p>(.fbx / .gltf /.glb)</p>
        <UploadButton onUpload={onMainModelUpload} accept=".fbx,.FBX,.gltf,.glb" />
      </li>
      <li className="collection-header grey darken-3 white-text">
        <h5>Upload Animations (.fbx)</h5>
        <UploadButton
          onUpload={onAnimationUpload}
          multiple={true}
          accept=".fbx,.FBX"
        />
      </li>
      <li className="collection-header grey darken-3 white-text">
        <h5>Upload Folder Animations</h5>
        <p>(Select a folder containing .fbx files)</p>
        <UploadButton
          onUpload={onAnimationFolderUpload}
          directory={true}
          webkitdirectory={true}
          accept=".fbx,.FBX"
        />
      </li>
      <li className="collection-header grey darken-3 white-text">
        <h5>Upload Textures</h5>
        <p>(.jpg / .png)</p>
        <UploadButton
          onUpload={onTextureUpload}
          accept=".jpg,.jpeg,.png"
        />
      </li>
    </ul>
  );
};

export default UploadSection;
