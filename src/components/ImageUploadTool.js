import React, { Component } from 'react';
import ImageUploader from 'react-images-upload';

import { addStickerToCanvas } from '../canvas';

import './ImageUploadTool.css';
import './EditorButton.css';

class ImageUploadTool extends Component {
  onUpload = (pictureList) => {
    const reader = new FileReader();

    reader.onload = (loadEvt) => {
      const dataUrl = loadEvt.target.result;
      const uploadImg = document.createElement('img');
      uploadImg.setAttribute('src', dataUrl);
      uploadImg.onload = () => {
        addStickerToCanvas(uploadImg);
      };
    };

    [...Array(pictureList.length)].forEach((_, idx) => {
      const pictureFile = pictureList[idx];
      reader.readAsDataURL(pictureFile);
    });
  }

  render() {
    return (
      <div className="ImageUploadTool">
        <ImageUploader
          withIcon={false}
          withLabel={false}
          withPreview={false}
          buttonText="+ Add Custom Graphic"
          onChange={this.onUpload}
          imgExtension={['.jpg', '.png', '.PNG', '.JPG']}
          maxFileSize={5242880}
          buttonClassName="EditorButton"
        />
      </div>
    );
  }
}

export default ImageUploadTool;
