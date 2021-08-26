import { useEffect, useState, useRef } from "react";
import { Layout, Container, BoxUpload, ImagePreview } from "../style";

import {
  Paper
  } from '@material-ui/core';


export default function Filepage(props) {

    const [image, setImage] = useState("");
    const [isUploaded, setIsUploaded] = useState(false);
    const [typeFile, setTypeFile] = useState("");

    function handleImageChange(e) {
      if (e.target.files && e.target.files[0]) {
        setTypeFile(e.target.files[0].type);
        let reader = new FileReader();

        reader.onload = function (e) {
          setImage(e.target.result);
          setIsUploaded(true);
        };

        reader.readAsDataURL(e.target.files[0]);
      }
    }


    return (
        <Paper style={{margin : '50px', padding : '20px'}}>
          <Layout>
      <Container>
        <h2>Upload your image</h2>
        <p>Upload with preview 😁</p>

        <BoxUpload>
          <div className="image-upload">
            {!isUploaded ? (
              <>
                <label htmlFor="upload-input">
                  <p style={{ color: "#444" }}>Click to upload image</p>
                </label>

                <input
                  id="upload-input"
                  type="file"
                  accept=".jpg,.jpeg,.gif,.png,.mov,.mp4"
                  onChange={handleImageChange}
                />
              </>
            ) : (
              <ImagePreview> 
                {typeFile.includes("video") ? (
                  <video
                    id="uploaded-image"
                    src={image}
                    draggable={false}
                    controls
                    autoPlay
                    alt="uploaded-img"
                  />
                ) : (
                  <img
                    id="uploaded-image"
                    src={image}
                    draggable={false}
                    alt="uploaded-img"
                  />
                )}
              </ImagePreview>
            )}
          </div>
        </BoxUpload>

        {isUploaded ? <h2>Type is {typeFile}</h2> : null}
      </Container>
    </Layout>
        
        </Paper>
    )
}