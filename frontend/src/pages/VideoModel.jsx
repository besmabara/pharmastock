import { X } from "lucide-react";
import video from "../assets/demo.mp4";

function VideoModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-5xl w-full mx-4 relative p-6 shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-center">
          Démo de PharmaStock
        </h2>

        <div className="relative pt-[56.25%]"> 
          <video
            src={video}
            controls
            autoPlay
            className="absolute top-0 left-0 w-full h-full rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}

export default VideoModal;
