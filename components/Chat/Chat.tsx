'use client'
import authRequests from '@/api/authRequests';
import chatRequests from '@/api/chatRequests';
import productsDetails from '@/productDetailData';
import useChatRoomStore from '@/stores/chatRoomStore';
import useUserStore from '@/stores/userStore';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import ChatAcceptModal from './ChatAcceptModal';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';
import ChatRentalModal from './ChatRentalModal';
const userResCss = 'flex justify-center items-center flex-row ';
const Chat = ({ sendMessage, messages, setMessages }) => {
  const [rentalModalOpen, setRentalModalOpen] = useState(false);
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const setUser = useUserStore((state) => state.setUser)
  const { user } = useUserStore()
  const ac = Cookies.get('ac')
  const { chatRoomId } = useChatRoomStore()

  useEffect(() => {
    fethChatMessages()
    fetchUserData()
  }, [chatRoomId])

  const fethChatMessages = async () => {
    try {
      const response = await axios.get(process.env.NEXT_PUBLIC_BASE_REQUEST_URL + chatRequests.chat + `${chatRoomId}/`, {
        headers: {
          Authorization: `Bearer ${ac}`,
        },
      });
      setChatMessages(response.data.messages);
      console.log("채팅 메시지:", response.data.messages);
    } catch (error) {
      console.error('채팅 메시지 불러오기 에러', error);
    }
  }

  const fetchUserData = async () => {
    try {
      const response = await axios.get(process.env.NEXT_PUBLIC_BASE_REQUEST_URL + authRequests.userInfo, {
        headers: {
          Authorization: `Bearer ${ac}`,
        },
      })
      // const userData = await response()
      setUser(response.data)
      console.log("chatBubble에서 불러오는 회원정보", response)
    } catch (error) {
      console.error('회원정보 불러오기 에러', error)
    }
  }

  console.log("실시간 채팅", messages)






  return (
    <>
      {/* 대여신청하기, 수락하기 어떤 버튼 눌렀느냐에 따라서 다른 모달 보여주기 */}
      {rentalModalOpen ? (
        <ChatRentalModal setRentalModalOpen={setRentalModalOpen} />
      ) : (
        acceptModalOpen && <ChatAcceptModal setAcceptModalOpen={setAcceptModalOpen} />
      )}
      <div className="flex flex-col justify-center items-center pl-10 relative w-full  ">
        <div className="flex w-full flex-col justify-between h-screen overflow-y-scroll scrollbar-hide ">
          <div className="flex flex-col">
            {/* 사용자 정보 */}
            <div className={`sm:hidden ${userResCss}`}>
              <div className="w-10 aspect-[1/1] mr-2 border-mainBlack rounded-full border ">
                <img
                  src="https://i.pinimg.com/564x/2a/58/e3/2a58e3d012bb65932a7c38d7381f29ee.jpg"
                  className="w-full h-full object-cover rounded-full"
                  alt="프로필 이미지"
                />
              </div>
              <div className="text-2xl my-3">상대방 이름</div>
            </div>
            <div className="flex justify-between items-center">
              {/* 상품정보 */}
              {productsDetails.map(item => (
                <div className="flex flex-row justify-left items-center h-16 my-3" key={item.id}>
                  {/* 상품이미지 */}
                  <div className=" h-20 w-20 border-mainBlack flex justify-center items-center overflow-hidden">
                    <img src={item.image} alt="상품이미지 " className="object-cover w-32 " />
                  </div>
                  {/* 상품상세정보 */}
                  <div className="flex flex-col justify-center w-1/3 ml-3 h-14 sm:w-full md:w-full">
                    <p className="text-sm font-semibold">{item.title}</p>

                    <p className=" text-xs font-base text-subGray">
                      {item.description.length > 40 ? `${item.description.substring(0, 40)}...` : item.description}
                    </p>
                    <p className="text-sm">대여비 {item.price}</p>
                  </div>
                </div>
              ))}
              <div>
                <div
                  className="bg-mainBlack text-mainWhite w-32 h-9 flex text-sm justify-center items-center mb-2 rounded-md p-1 sm:w-24 cursor-pointer "
                  onClick={() => setRentalModalOpen(true)}
                >
                  대여 신청하기
                </div>
                <div
                  className="bg-[#D3D3D3] text-mainWhite  w-32 h-9 flex text-sm justify-center items-center rounded-md p-1 sm:w-24 cursor-pointer 
              "
                  onClick={() => setAcceptModalOpen(true)}
                >
                  수락하기
                </div>
              </div>
            </div>
          </div>
          {/* 날짜 수평선 */}
          <div className="flex items-center justify-center space-x-2  ">
            <div className="flex-1 border-b  border-hrGray"></div>
            <div className="text-subGray text-[11px]  bg-mainWhite px-2">2024.05.09</div>
            <div className="flex-1 border-b border-hrGray"></div>
          </div>
          {/* 채팅창 */}
          <div className="flex flex-col flex-grow overflow-y-scroll scrollbar-hide pb-3 ">
            <div className="flex flex-col justify-between mt-4">
              {chatMessages.length > 0 && (
                chatMessages.map((data) => (
                  <ChatBubble
                    key={data.id}
                    content={data.text}
                    time={data.timestamp}
                    subject={data.nickname}
                    img={data.image}
                    read={data.status}
                  />
                )))}

              {messages.map((data, index) => (
                <ChatBubble
                  key={index}
                  content={data.message}
                  time={data.timestamp}
                  subject={data.nickname}
                  img={data.image}
                  read={data.status}
                />
              ))}
            </div>
          </div>
          {/* 입력창 */}
          <ChatInput sendMessage={sendMessage} />
        </div>
      </div>
    </>
  );
};

export default Chat;
