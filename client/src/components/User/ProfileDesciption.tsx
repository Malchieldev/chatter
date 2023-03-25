import {
  useState,
  Dispatch,
  SetStateAction,
  FormEvent,
  useCallback,
} from "react";

import useFetch from "../../hooks/use-fetch";

import LoadingSpinner from "../../UI/LoadingSpinner";
import Input from "../../UI/Input";
import IconButton from "../../UI/IconButton";

import success_40 from "../../assets/success_40.svg";
import edit_40 from "../../assets/edit_40.svg";

type ProfileDesciptionProps = {
  isEditibale: boolean;
  description: string;
  onChangeDescription: Dispatch<SetStateAction<any>>;
};

const ProfileDesciption = (props: ProfileDesciptionProps) => {
  const { isEditibale, description, onChangeDescription } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [descriptionText, setDescriptionText] = useState(description);

  const onSuccessHandler = useCallback(
    (data: any) => {
      onChangeDescription({ description: data.description });
      setDescriptionText(data.description);
      setIsEditing(false);
    },
    [onChangeDescription]
  );
  const onErrorHandler = useCallback(() => {
    setIsEditing(false);
  }, []);

  const [isLoading, , sendRequest] = useFetch(
    "PUT",
    onSuccessHandler,
    onErrorHandler
  );

  const finishDescriptionHandler = (e: FormEvent) => {
    e.preventDefault();
    sendRequest(`/user/description`, { description: descriptionText });
  };

  if (!isEditibale) {
    return <span>{description}</span>;
  }

  if (!isEditing) {
    return (
      <>
        <span>{description}</span>
        {/* button to edit: */}
        <IconButton
          alt={"edit"}
          pixelSize={20}
          icon={edit_40}
          onClick={() => setIsEditing(true)}
        />
      </>
    );
  }

  return (
    <form onSubmit={finishDescriptionHandler}>
      {/* input:*/}
      <Input
        placeholder={"description"}
        value={descriptionText}
        onChange={(e) => setDescriptionText(e.target.value)}
      />
      {/* button to finish:*/}
      {!isLoading && (
        <IconButton alt={"success"} pixelSize={20} icon={success_40} />
      )}
      {isLoading && <LoadingSpinner pixelSize={20} />}
    </form>
  );
};
export default ProfileDesciption;
