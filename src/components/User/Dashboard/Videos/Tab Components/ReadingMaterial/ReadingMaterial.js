import axios from "axios";
import React from "react";
import baseDomain from "../../../../../common/baseDomain";
import AddMaterial from "./AddMaterial/AddMaterial";
import PDF from "./pdf/pdf";

const ReadingMaterial = (props) => {
  const [materials, setMaterials] = React.useState([]);

  React.useEffect(() => {
    getMaterial();
  }, [props.video]);

  const getMaterial = async () => {
    await axios({
      url: `${baseDomain.route}${baseDomain.subRoute}/get_video_materials?video_url=${props.video.url}`,
      method: "GET",
      headers: {
        // Authorization: `Bearer ${getLocal("access_token")}`,
        Accept: "application/json;charset=UTF-8",
      },
    })
      .then((response) => {
        let res = response.data.data;
        setMaterials(res);
        // console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const deleteMaterial = async (id) => {
    await axios({
      url: `${baseDomain.route}${baseDomain.subRoute}/remove_video_materials?note_id=${id}`,
      method: "GET",
      headers: {
        // Authorization: `Bearer ${getLocal("access_token")}`,
        Accept: "application/json;charset=UTF-8",
      },
    })
      .then((response) => {
        console.log(response);
        getMaterial();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <React.Fragment>
      <AddMaterial video_url={props.video.url} getMaterial={getMaterial} />

      {materials.map((e, i) => (
        <PDF material={e} key={i} deleteMaterial={deleteMaterial} slug={props.slug} />
      ))}
    </React.Fragment>
  );
};

export default ReadingMaterial;
