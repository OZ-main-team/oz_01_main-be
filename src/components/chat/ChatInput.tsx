import { UserContext } from '@/App';
import { XMarkIcon } from '@heroicons/react/16/solid';
import { CameraIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { useContext, useRef, useState } from 'react';
import Resizer from 'react-image-file-resizer';
import CommonButton from '../CommonButton';
interface ChatProps {
  sendMessage: (nickname: string, message: string, image?: string) => void;
}

const ChatInput = ({ sendMessage }: ChatProps) => {
  const [inputMessage, setInputMessage] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { userData } = useContext(UserContext)
  const fileInputRef = useRef<HTMLInputElement>(null);


  const handleSend = async () => {
    let imageBase64 = "";
    if (fileInputRef.current?.files?.[0]) {
      const file = fileInputRef.current.files[0];
      imageBase64 = await convertFileToBase64(file);
    }

    // 텍스트 메시지가 비어있지 않거나 이미지가 있는 경우에만 메시지 전송
    if (inputMessage.trim() !== "" || imageBase64) {
      sendMessage(inputMessage.trim(), imageBase64, userData?.nickname);
    }
    setInputMessage(""); // 메시지 전송 후 입력 필드 초기화
    setPreviewImage(null); // 메시지 전송 후 미리보기 초기화
    if (fileInputRef.current) fileInputRef.current.value = ''; // 파일 입력 초기화
  }


  const handleCameraIconClick = () => {
    // 카메라 아이콘 클릭 시 파일 선택 창 열기
    fileInputRef.current?.click();
  }

  /** 엔터 키 입력시 전송 */
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      handleSend()
    }
  }

  const handleFileChange = () => {
    if (fileInputRef.current?.files?.[0]) {
      const file = fileInputRef.current.files[0];
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
    }
  }

  // XMarkIcon 클릭 시 첨부된 이미지 삭제
  const handleRemoveImage = () => {
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }



  return (
    <div className='flex flex-col sm:mb-10 md:mb-10'>
      {previewImage && (
        <div className="mb-2 flex flex-col p-2 relative z-50">
          <div className='flex justify-end'>
            <XMarkIcon className='w-6 cursor-pointer' onClick={handleRemoveImage} />
          </div>
          <img src={previewImage} alt="미리보기" className=" w-80 object-cover " />
        </div>
      )}
      <div className="flex items-center justify-between pb-1">
        <div className="w-10 h-10 rounded-full flex justify-center items-center">
          <CameraIcon className="w-7 h-7 cursor-pointer" onClick={handleCameraIconClick} />
          <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
        </div>
        <div className="flex flex-row justify-between rounded-full w-full">
          <input
            placeholder="메시지를 입력하세요."
            className="block w-full rounded-lg border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-customGray placeholder:text-gray focus:ring-2 focus:ring-inset focus:ring-mainBlack sm:text-sm sm:leading-6"
            onChange={(e) => setInputMessage(e.target.value)}
            value={inputMessage}
            onKeyDown={handleKeyPress}
          />
          <CommonButton
            className="w-10 h-10 bg-chatBg rounded-full flex justify-center items-center"
            onClick={handleSend}
          >
            <PaperAirplaneIcon className="w-7 h-7 cursor-pointer" />
          </CommonButton>
        </div>
      </div>

    </div>
  );
};

export default ChatInput;


// 파일을 Base64로 인코딩하는 순수함수
const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      Resizer.imageFileResizer(
        file, // 원본 파일
        800, // 최대 가로 너비
        800, // 최대 세로 높이
        'JPEG', // 변환할 이미지 포맷
        100, // 품질
        0, // 회전
        (uri) => {
          resolve(uri as string);
        },
        'base64' // 출력 타입
      );

    } catch (error) {
      reject(error);
    }
  });
}