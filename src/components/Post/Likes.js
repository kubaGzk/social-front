import React from "react";

const Likes = (props) => {
  const { likes } = props;

  let body = "No likes";

  if (likes.length > 0) {
    body = likes.reduce((accBody, like, ind) => {
      ind === 10 && accBody.push(<p key={like.id}>...</p>);
      ind < 10 &&
        accBody.push(
          <p
            key={like.id}
            style={{ margin: "1px" }}
          >{`${like.firstname} ${like.lastname}`}</p>
        );

      return accBody;
    }, []);
  }

  return <div>{body}</div>;
};

export default Likes;
