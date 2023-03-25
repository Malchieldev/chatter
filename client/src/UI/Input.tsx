import { ChangeEventHandler } from "react";

import styled from "./Input.module.css";

type InputProps = {
  placeholder: string;
  defaultValue?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
};

const Input = (props: React.PropsWithChildren<InputProps>) => {
  const { placeholder, defaultValue, value, onChange } = props;

  return (
    <input
      type={"text"}
      className={styled.inpt}
      placeholder={placeholder}
      defaultValue={defaultValue}
      value={value}
      onChange={onChange}
    >
      {props.children}
    </input>
  );
};
export default Input;
