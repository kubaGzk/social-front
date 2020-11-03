import { useState } from "react";

export const useForm = (callback, initialState = {}) => {
  const [values, setValues] = useState(initialState);

  const onChange = (e) => {
    if (e.target.name === "image") {
      const val = e.target.files.length === 1 ? e.target.files[0] : null;
      setValues({ ...values, [e.target.name]: val });
    } else {
      setValues({ ...values, [e.target.name]: e.target.value });
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    callback();
  };

  return [values, onChange, onSubmit];
};
