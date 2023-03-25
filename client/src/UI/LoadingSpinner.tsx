import classes from "./LoadingSpinner.module.css";
type Props = {
  pixelSize: number;
};
const LoadingSpinner = (props: React.PropsWithChildren<Props>) => {
  const { pixelSize } = props;
  return (
    <div
      style={
        {
          "--border-width": `${Math.floor(pixelSize / 10)}px`,
          width: `${pixelSize}px`,
          height: `${pixelSize}px`,
        } as React.CSSProperties
      }
      className={classes.spinner}
    ></div>
  );
};

export default LoadingSpinner;
