import React from "react";

const Likes = (props) => {
  let body = "No likes";

  if (props.likes.length > 0) {
    body = props.likes.reduce((accBody, like, ind) => {
      ind === 10 && accBody.push(<p>...</p>);
      ind < 10 &&
        accBody.push(
          <p
            style={{ margin: "1px" }}
          >{`${like.firstname} ${like.lastname}`}</p>
        );

      return accBody;
    }, []);
  }

  return <div>{body}</div>;
};

export default Likes;
