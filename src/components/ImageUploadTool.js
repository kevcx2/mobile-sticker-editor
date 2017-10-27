// This component makes hacky use of the ImageUploader component used from an
// external package. This would be a good spot to replace with a home-grown
// image uploader or find a better pre-built solution.
import React, { Component } from 'react';
import ImageUploader from 'react-images-upload';

import { addStickerToCanvas } from '../canvas';

import './ImageUploadTool.css';
import './EditorButton.css';

const ACCEPTED_FILE_FORMATS = ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG',]

class ImageUploadTool extends Component {
  onUpload = (pictureList) => {
    // We want to make any error dialogues dissapear after a period of time.
    // We have this in a timeout beacuse the ImageUploader component has not
    // yet rendered the error dilogue, and will not until later in the current js event
    // loop.

    // All the timeout nonsense here does is add click to dismiss and a fade out after 5
    // seconds functionality to the error message. We do it in this hacky way due to the
    // limitations of working with a prebuild ImageUploader component.
    let componentContext = this;
    window.setTimeout(() => {
      const errorMessageEls = componentContext.imageUploadEl.querySelectorAll('.errorMessage');
      errorMessageEls.forEach((errorEl) => {
        errorEl.onclick = () => {
          errorEl.classList.add('fade-out')
          window.setTimeout(() => {
            if (errorEl) {
              errorEl.parentNode.removeChild(errorEl);
            }
          }, 500);
        };
        window.setTimeout(() => {
          if (document.body.contains(errorEl)) {
            errorEl.classList.add('fade-out');
            window.setTimeout(() => {
              if (document.body.contains(errorEl)) errorEl.parentNode.removeChild(errorEl);
            }, 500);
          }
        }, 4500);
      });
    });

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
      <div
        ref={(imageUploadEl) => {this.imageUploadEl = imageUploadEl}}
        className="ImageUploadTool"
      >
        <ImageUploader
          withIcon={false}
          withLabel={false}
          withPreview={false}
          buttonText="+ Add Custom Graphic"
          onChange={(files) => this.onUpload(files)}
          imgExtension={ACCEPTED_FILE_FORMATS}
          maxFileSize={5242880}
          buttonClassName="EditorButton"
          errorClass=" ImageUploadTool-error"
          fileTypeError=" is not a supported file type. Please use .jpg or .png images"
        />
      </div>
    );
  }
}

export default ImageUploadTool;
