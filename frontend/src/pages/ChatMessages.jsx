import ChatInfo from "../components/ChatInfo.jsx";
import MessageList from "../components/MessageList.jsx";
import MessageSend from "../components/MessageSend.jsx";
import { useContext, useState } from "react";
import { DataContext } from "../DataContext.jsx";
import { useNavigate } from "react-router-dom";
const ChatMessages = ({ theme }) => {
    const { data, receiver } = useContext(DataContext);
    const navigate = useNavigate();
    // there is no receiver then it will redirect to homepage
    if (receiver == "") {
        navigate("/");
    }

    return (
        <div
            className={`flex flex-col flex-1 justify-center relative h-[100vh]  w-full ${
                theme === "dark"
                    ? "bg-gray-900 text-white"
                    : "bg-white text-black"
            }`}>
            <ChatInfo theme={theme} data={data[receiver]} />
            <MessageList theme={theme}  />
            <MessageSend theme={theme} />
        </div>
    );
};

export default ChatMessages;
