export const startScreenShare = async (videoElement) => {
  try {
    const mediaStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });

    videoElement.srcObject = mediaStream;

    mediaStream.getTracks().forEach((track) => {
      track.onended = () => {
        videoElement.srcObject = null;
      };
    });
  } catch (error) {
    console.error('Error sharing the screen:', error);
  }
};
export const stopScreenShare = (videoElement) => {
  const mediaStream = videoElement.srcObject;
  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop());
    videoElement.srcObject = null; 
  }
};

