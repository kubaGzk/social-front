import React, {
  createContext,
  useReducer,
  useCallback,
  useEffect,
} from "react";

const INITIAL_STATE = {
  width: window.innerWidth,
  height: window.innerHeight,
  scrollX: window.scrollX,
  scrollY: window.scrollY,
  scrollWidth: document.body.scrollWidth,
  scrollHeight: document.body.scrollHeight,
};

const DimensionContext = createContext({ ...INITIAL_STATE });

const dimensionReducer = (state, action) => {
  switch (action.type) {
    case "SIZE":
      return { ...state, width: action.width, height: action.height };
    case "SCROLL":
      return {
        ...state,
        scrollX: action.scrollX,
        scrollY: action.scrollY,
        scrollWidth: action.scrollWidth,
        scrollHeight: action.scrollHeight,
      };
    default:
      return state;
  }
};

const DimensionContextProvider = (props) => {
  const [store, dispatch] = useReducer(dimensionReducer, { ...INITIAL_STATE });

  const updateWindowSize = useCallback(() => {
    const innerWidth = window.innerWidth;
    const innerHeigth = window.innerHeight;

    dispatch({ type: "SIZE", width: innerWidth, height: innerHeigth });
  }, [window.innerWidth, window.innerHeigh]);

  const updateScrollPosition = useCallback(() => {
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const scrollWidth = document.body.offsetWidth;
    const scrollHeight = document.body.offsetHeight;

    console.log(document.body.scrollTop)

    dispatch({ type: "SCROLL", scrollX, scrollY, scrollWidth, scrollHeight });
  }, [
    window.scrollX,
    window.scrollY,
    document.body.offsetWidth,
    document.body.offsetHeight,
  ]);

  useEffect(() => {
    window.addEventListener("resize", updateWindowSize);
    window.addEventListener("scroll", updateScrollPosition);

    return () => {
      window.removeEventListener("resize", updateWindowSize);
      window.removeEventListener("scroll", updateScrollPosition);
    };
  }, [updateWindowSize, updateScrollPosition]);

  return <DimensionContext.Provider value={store} {...props} />;
};

export { DimensionContext, DimensionContextProvider };
