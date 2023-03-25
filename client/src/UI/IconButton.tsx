import styled from "./IconButton.module.css";
type Props = {
  alt: string;
  icon: string;
  pixelSize: number;
  onClick?: React.MouseEventHandler;
};

const Button = (props: React.PropsWithChildren<Props>) => {
  const { alt, icon, pixelSize, onClick, children } = props;
  return (
    <button className={styled.btn} onClick={onClick}>
      <img
        style={{ width: `${pixelSize}px`, height: `${pixelSize}px` }}
        alt={alt}
        src={icon}
      ></img>
      {children}
    </button>
  );
};

export default Button;
