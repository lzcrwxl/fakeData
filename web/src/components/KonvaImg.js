import React, { useState, useEffect, useRef } from "react";
import { Image, Transformer, Text } from "react-konva";
import useImage from "use-image";

const KonvaImage = ({ url = "", handleSelected = () => {}, ...props }) => {
  const [image, status] = useImage(url, "anonymous");
  let { myRef } = props;
  return myRef ? (
    <Image
      image={image}
      draggable
      ref={myRef}
      onClick={handleSelected}
      {...props}
    />
  ) : null;
};

export default KonvaImage;
