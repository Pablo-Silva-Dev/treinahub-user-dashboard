import {
  FILE_MAX_SIZE_MESSAGE,
  FILE_TYPE_UNSUPPORTED_MESSAGE,
} from "@/appConstants/index";
import { Button } from "@/components/buttons/Button";
import { ErrorMessage } from "@/components/inputs/ErrorMessage";
import { FileInput } from "@/components/inputs/FileInput";
import { IFile, UploadedFile } from "@/components/miscellaneous/UploadedFile";
import { Title } from "@/components/typography/Title";
import { useThemeStore } from "@/store/theme";
import {
  reactModalCustomStyles,
  reactModalCustomStylesDark,
} from "@/styles/react-modal";
import { yupResolver } from "@hookform/resolvers/yup";
import { ChangeEvent, KeyboardEvent, MouseEvent, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Modal from "react-modal";
import * as yup from "yup";

interface IUpdateAvatarInput {
  id: string;
  img_file: string;
}
interface UpdateAvatarModalProps {
  isOpen: boolean;
  onRequestClose: (
    event: MouseEvent<Element, MouseEvent> | KeyboardEvent<Element>
  ) => void;
  onConfirmAction: (param: any) => void;
  onClose: () => void;
}

export function UpdateAvatarModal({
  isOpen,
  onRequestClose,
  onConfirmAction,
  onClose,
}: UpdateAvatarModalProps) {
  const MAX_AVATAR_FILE_SIZE = 2 * 1024 * 1024; //2MB

  const { theme } = useThemeStore();

  const [wasFileUploaded, setWasFileUploaded] = useState(false);
  const [filePreview, setFilePreview] = useState<IFile | null>(null);
  const [imageFile, setImageFile] = useState<Blob | null>(null);

  const validationSchema = yup.object({
    img_file: yup
      .mixed()
      .test(
        "fileType",
        FILE_TYPE_UNSUPPORTED_MESSAGE + "png, jpeg",
        (value: any) => {
          if (!value || value.length === 0) return true;
          return (value && value[0] && ["image/png", "image/jpeg"]).includes(
            value[0].type
          );
        }
      )
      .test("fileSize", FILE_MAX_SIZE_MESSAGE + "2MB", (value: any) => {
        if (value) {
          return value[0].size <= MAX_AVATAR_FILE_SIZE;
        }
      }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setFilePreview({
        name: file.name,
        type: file.type,
        size: file.size,
        uri: previewUrl,
      });
      setImageFile(file);
      setWasFileUploaded(true);
    }
  };

  const handleRemoveFile = () => {
    setFilePreview(null);
    setImageFile(null);
    setWasFileUploaded(false);
  };

  const handleUpdateAvatar: SubmitHandler<IUpdateAvatarInput> = (
    data: IUpdateAvatarInput
  ) => {
    onConfirmAction({ ...data, img_file: imageFile });
    setImageFile(null);
    setFilePreview(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose as never}
      style={
        theme === "light" ? reactModalCustomStyles : reactModalCustomStylesDark
      }
    >
      <Title
        content="Atualizar foto de perfil"
        className="text-center text-black dark:text-white mb-4 font-bold text-[14px] md:text-lg"
      />
      <form onSubmit={handleSubmit(handleUpdateAvatar as never)}>
        <div className="my-4">
          {wasFileUploaded && filePreview ? (
            <UploadedFile
              file={{
                name: filePreview.name,
                size: Number((filePreview.size / 1024 / 1024).toFixed(2)),
                uri: filePreview.uri,
                type: filePreview.type,
              }}
              onCancel={handleRemoveFile}
              imgWidth={320}
            />
          ) : (
            <FileInput
              label="Foto de perfil"
              labelDescription="Selecione um arquivo .jpeg ou .png de até 2MB"
              onUpload={handleFileUpload}
              {...register("img_file", { onChange: handleFileUpload })}
            />
          )}
        </div>
        <div className="mb-3">
          {errors && errors.img_file?.message && (
            <ErrorMessage errorMessage={errors.img_file.message} />
          )}
        </div>
        <Button
          title="Atualizar foto"
          type="submit"
          disabled={!isValid || !wasFileUploaded}
        />
        <button
          onClick={onClose}
          className="text-black dark:text-white bg-gray-200 dark:bg-slate-700 p-4 rounded-lg text-[13px] md:text-[14px] w-full my-2"
        >
          Cancelar
        </button>
      </form>
    </Modal>
  );
}
