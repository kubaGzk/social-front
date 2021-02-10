import React, { useRef, useState, useCallback } from "react";
import { useLazyQuery } from "@apollo/client";

import { FETCH_USER_LIST } from "../../util/graphql";

import { Search } from "semantic-ui-react";

const UserSearch = (props) => {
  const { placeholder, resultSelect } = props;

  const [searchVal, setSearchVal] = useState("");
  const [results, setResults] = useState([]);

  const timeoutRef = useRef();
  const searchValRef = useRef();

  searchValRef.current = searchVal;

  const [fetchUserList, { loading }] = useLazyQuery(FETCH_USER_LIST, {
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      console.log(data);
      setResults(() => {
        if (data.getUserList.length < 1) {
          return [{ title: "No results" }];
        }

        return data.getUserList.map((el) => {
          return {
            title: `${el.firstname} ${el.lastname}`,
            image: process.env.REACT_APP_IMAGES_URL + "/" + el.image,
            id: el.id,
          };
        });
      });
    },
  });

  const handleSearchChange = useCallback((e, data) => {
    setSearchVal(e.target.value);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      searchValRef.current.length > 0 &&
        fetchUserList({ variables: { text: searchValRef.current } });
    }, 500);
  }, []);

  return (
    <Search
      loading={loading}
      onResultSelect={(e, data) => {
        setSearchVal("");
        resultSelect(e, data);
        document.activeElement.blur();
      }}
      placeholder={placeholder}
      onSearchChange={handleSearchChange}
      results={results}
      size="mini"
      value={searchVal}
      className="user-search"
      showNoResults={false}
    />
  );
};

export default UserSearch;
