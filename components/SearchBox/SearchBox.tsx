"use client";

import { forwardRef, useRef, useImperativeHandle } from "react";
import css from "./SearchBox.module.css";

export type SearchBoxProps = {
  onChange: (value: string) => void;
};

export type SearchBoxRef = {
  focus: () => void;
};

const SearchBox = forwardRef<SearchBoxRef, SearchBoxProps>((props, ref) => {
  const { onChange } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current?.focus();
    },
  }));

  return (
    <input
      ref={inputRef}
      className={css.input}
      type="text"
      placeholder="Search notes"
      onChange={(e) => onChange(e.target.value)}
    />
  );
});

SearchBox.displayName = "SearchBox";

export default SearchBox;