import toast from "react-hot-toast";

const useFileUpload = () => {
  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("key", "c5b34be56c75837211d31c743b6cec76");
    formData.append("image", file);

    const api = fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: formData,
    });

    const response = await toast.promise(
      api.then((res) => res.json()),
      {
        loading: "Uploading...",
        success: "Uploaded successfully",
        error: "Failed to upload",
      }
    );

    return response?.data?.url;
  };

  return { uploadFile };
};

export default useFileUpload;
