import { NextPage } from "next";
import { Dispatch, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { setCookie } from "nookies";

import { ShortenLinkFormContainer } from "./styles";

interface InputProps {
  link: string;
}

interface ShortenLinkFormProps {
  savedLinks: any;
  setSavedLinks: Dispatch<any>;
}

const ShortenLinkForm: NextPage<ShortenLinkFormProps> = ({
  savedLinks,
  setSavedLinks,
}) => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<InputProps>();

  const onSubmit: SubmitHandler<InputProps> = async (data) => {
    await fetch(`https://api.shrtco.de/v2/shorten?url=${data.link}`)
      .then((response) => response.json())
      .then(({ result }) => {
        setSavedLinks([
          ...savedLinks,
          {
            original: result.original_link,
            short: result.full_short_link,
          },
        ]);
      });
  };

  useEffect(() => {
    setCookie(null, "SAVED_LINKS", JSON.stringify(savedLinks), {
      maxAge: 86400 * 31,
      path: "/",
    });
  }, [savedLinks]);

  return (
    <ShortenLinkFormContainer onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input
          className={
            errors.link && getValues.length > 0
              ? "input input-with-error"
              : "input"
          }
          type="text"
          placeholder="Shorter a link here..."
          {...register("link", {
            required: true,
            pattern:
              /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi,
          })}
        />
        {errors.link && <p>Please add a link</p>}
      </div>
      <button type="submit">Shorten It!</button>
    </ShortenLinkFormContainer>
  );
};

export default ShortenLinkForm;
