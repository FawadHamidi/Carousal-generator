import React, { useRef, useState } from "react";
import "./LandingPage.css";
import circlesImage from "../../assets/circles.png";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function LandingPage() {
  const [image, setImage] = useState(null);
  const [uploadLabel, setUploadLabel] = useState("Upload Image");
  const [slices, setSlices] = useState([]);

  const fileInput = useRef(null);

  const handleUploadClick = () => {
    fileInput.current.click();
  };

  const downloadAll = async () => {
    const zip = new JSZip();
    await Promise.all(
      slices.map((slice, index) => {
        return fetch(slice)
          .then((response) => response.blob())
          .then((blob) => {
            zip.file(`slice_${index + 1}.png`, blob);
          });
      })
    );
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "slices.zip");
  };

  const handleUpload = (event) => {
    const file = event.target.files[0];
    setImage(URL.createObjectURL(file));
    setUploadLabel("Convert");
  };

  const handleConvert = async () => {
    setUploadLabel("Converting...");
    const slices = await sliceImage(image);
    setSlices(slices);
    setUploadLabel("Upload Image");
  };

  const sliceImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const sliceWidth = img.width / (img.width / 1080);
        const sliceHeight = img.height;
        const slices = [];
        for (let x = 0; x < img.width / 1080; x++) {
          const canvas = document.createElement("canvas");
          canvas.width = sliceWidth;
          canvas.height = sliceHeight;
          const context = canvas.getContext("2d");
          context.drawImage(
            img,
            x * sliceWidth,
            0,
            sliceWidth,
            sliceHeight,
            0,
            0,
            sliceWidth,
            sliceHeight
          );
          slices.push(canvas.toDataURL());
        }
        resolve(slices);
      };
      img.onerror = reject;
      img.src = src;
    });
  };
  return (
    <div className="main-div">
      {/* <div>
     
      
      </div> */}
      <div className="card">
        <div className="uploadedImage-div">
          {image ? (
            <img className="uploadedImage" src={image} alt="Uploaded" />
          ) : (
            <div className="loader"></div>
          )}
        </div>

        <div className="button-circles-div">
          <img className="circles-image" src={circlesImage} alt="Circles" />
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            style={{ display: "none" }}
          />
          <button
            className="upload-button"
            onClick={
              uploadLabel === "Convert" ? handleConvert : handleUploadClick
            }
          >
            {uploadLabel}
          </button>
        </div>

        <div>
       
          <div className="slice-images-div">
            {slices.map((slice, index) => (
              <div key={index}>
                <img
                  src={slice}
                  alt={`Slice ${index + 1}`}
                  className="slice-images"
                />
                <a href={slice} download={`slice_${index + 1}.png`}></a>
              </div>
            ))}
          </div>
          <div className="download-button-div">
            {slices.length > 0 ? (
              <button
                onClick={() => downloadAll()}
                class="button"
                type="button"
              >
                <span class="button__text">Download</span>
                <span class="button__icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 35 35"
                    id="bdd05811-e15d-428c-bb53-8661459f9307"
                    data-name="Layer 2"
                    class="svg"
                  >
                    <path d="M17.5,22.131a1.249,1.249,0,0,1-1.25-1.25V2.187a1.25,1.25,0,0,1,2.5,0V20.881A1.25,1.25,0,0,1,17.5,22.131Z"></path>
                    <path d="M17.5,22.693a3.189,3.189,0,0,1-2.262-.936L8.487,15.006a1.249,1.249,0,0,1,1.767-1.767l6.751,6.751a.7.7,0,0,0,.99,0l6.751-6.751a1.25,1.25,0,0,1,1.768,1.767l-6.752,6.751A3.191,3.191,0,0,1,17.5,22.693Z"></path>
                    <path d="M31.436,34.063H3.564A3.318,3.318,0,0,1,.25,30.749V22.011a1.25,1.25,0,0,1,2.5,0v8.738a.815.815,0,0,0,.814.814H31.436a.815.815,0,0,0,.814-.814V22.011a1.25,1.25,0,1,1,2.5,0v8.738A3.318,3.318,0,0,1,31.436,34.063Z"></path>
                  </svg>
                </span>
              </button>
            ) :  <h2>The Online Image Splitter for your Instagram Carousals</h2>}
          </div>



          
        </div>
      </div>
    </div>
  );
}
