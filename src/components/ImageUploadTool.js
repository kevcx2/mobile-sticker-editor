import React, { Component } from 'react';
import ImageUploader from 'react-images-upload';

import './ImageUploadTool.css';

class ImageUploadTool extends Component {
  onUpload = (pictureList) => {
    const reader = new FileReader();

    reader.onload = (loadEvt) => {
      const dataUrl = loadEvt.target.result;
      this.props.onUpload(dataUrl);
    }

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
          buttonText='Upload Image'
          onChange={this.onUpload}
          imgExtension={['.jpg', '.png']}
          maxFileSize={5242880}
        />
      </div>
    );
  }
}

export default ImageUploadTool;