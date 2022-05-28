import React from "react";
import { Helmet } from "react-helmet";

const MetaHelmet = ({ title, description, image }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image:src" content={image} />}
    </Helmet>
  );
};
export default MetaHelmet;
