import React, { useContext } from "react";
import { DataContext } from "../DataContext";
import { set, ref } from "firebase/database";
import { db } from "../firebase";

const ProfileDetail = ({ theme }) => {
    const { data, receiver, user } = useContext(DataContext);

    const profile = data[receiver];
    const userInfo = data[user];
    let user_friend = JSON.parse(userInfo.friend_list);
    let user_filter = user_friend.filter((cur) => {
        return cur !== profile.uid;
    });
    let user_request = JSON.parse(userInfo.request_list);
    let receiver_friend = JSON.parse(profile.friend_list);
    let receiver_request = JSON.parse(profile.request_list);
    let filter_receiver = receiver_friend.filter((cur) => {
        return cur !== userInfo.uid;
    });
    const HandleUnFriend = () => {
        console.log(userInfo, profile, user_filter, filter_receiver);
        set(ref(db, "users/" + userInfo.uid), {
            username: userInfo.username,
            name: userInfo.name,
            profile_picture: userInfo.profile_picture,
            friend_list: JSON.stringify(user_filter),
            request_list: userInfo.request_list,
            uid: userInfo.uid,
        });
        set(ref(db, "users/" + profile.uid), {
            username: profile.username,
            name: profile.name,
            profile_picture: profile.profile_picture,
            friend_list: JSON.stringify(filter_receiver),
            request_list: profile.request_list,
            uid: profile.uid,
        });
    };
    const HandleAccept = () => {
        let list1 = user_friend;
        list1.unshift(receiver); // add receiver id to users friend list
        let list3 = user_request.filter((cur) => {
            return cur !== receiver; //remove receivers id from request_list
        });
        list1 = [...new Set(list1)]; //make list unique

        set(ref(db, "users/" + user), {
            username: data[user].username,
            name: data[user].name,
            profile_picture: data[user].profile_picture,
            friend_list: JSON.stringify(list1),
            request_list: JSON.stringify(list3),
            uid: user,
        }); //set updated list
        let list2 = JSON.parse(data[receiver].friend_list || "[]");
        list2.unshift(user); //similar to user
        list2 = [...new Set(list2)];
        set(ref(db, "users/" + receiver), {
            username: data[receiver].username,
            name: data[receiver].name,
            profile_picture: data[receiver].profile_picture,
            friend_list: JSON.stringify(list2),
            request_list: data[receiver].request_list,
            uid: receiver,
        });
    };
    const handleReject = () => {
        let list1 = user_request.filter((cur) => {
            return cur !== receiver;
        }); //if friend request is rejected then remove receiver id from request list
        set(ref(db, "users/" + user), {
            username: data[user].username,
            name: data[user].name,
            profile_picture: data[user].profile_picture,
            friend_list: data[user].friend_list,
            request_list: JSON.stringify(list1),
            uid: user,
        });
    };
    const handleEdit = () => {};
    const SendRequest = () => {
        let list1 = receiver_request;
        list1.unshift(user);
        list1 = [...new Set(list1)]; //send friend request add users id to receivers request_list
        set(ref(db, "users/" + receiver), {
            username: data[receiver].username,
            name: data[receiver].name,
            profile_picture: data[receiver].profile_picture,
            friend_list: data[receiver].friend_list,
            request_list: JSON.stringify(list1),
            uid: receiver,
        });
    };
    if (!profile) {
        return <div className="text-white">Loading...</div>;
    }
    if (user === receiver) {
        return (
            <div className="w-full flex flex-col justify-center gap-5  items-center h-[100vh] text-white">
                <img
                    src={profile?.profile_picture}
                    alt="user profile"
                    className="w-[250px] h-[250px] object-center border-4 border-blue-500 p-2 rounded-full"
                />
                <h2>{profile?.username}</h2>
                <h2>{profile?.name}</h2>
                <button
                    className="bg-blue-600 text-white p-3 text-lg font-semibold rounded-lg w-[250px ] hover:bg-blue-500 transition-all"
                    onClick={() => {
                        handleEdit();
                    }}>
                    Edit
                </button>
            </div>
        );
    }
    return (
        <div className="w-full flex flex-col justify-center gap-5  items-center h-[100vh] text-white">
            <img
                src={profile?.profile_picture}
                alt="user profile"
                className="w-[250px] h-[250px] object-center border-4 border-blue-500 p-2 rounded-full"
            />
            <h2>{profile?.username}</h2>
            <h2>{profile?.name}</h2>
            {user_friend.includes(profile.uid) && (
                <button
                    className="bg-blue-600 text-white p-3 text-lg font-semibold rounded-lg w-[250px ] hover:bg-blue-500 transition-all"
                    onClick={() => {
                        HandleUnFriend();
                    }}>
                    Unfriend
                </button>
            )}
            {user_request.includes(profile.uid) && (
                <div className=" w-full flex justify-center ">
                    <button
                        className="text-center h-10 w-40 m-auto rounded-xl grid items-center text-white bg-green-400"
                        onClick={() => {
                            HandleAccept();
                        }}>
                        Accept Request
                    </button>
                    <button
                        className="text-center h-10 w-40 m-auto rounded-xl grid items-center text-white bg-red-400"
                        onClick={() => {
                            handleReject();
                        }}>
                        Reject Request
                    </button>
                </div>
            )}
            {receiver_request.includes(userInfo.uid) && (
                <div className="text-center h-10 w-40 m-auto rounded-xl grid items-center text-white bg-green-400">
                    Friend Request Send
                </div>
            )}
            {!user_friend.includes(profile.uid) &&
            !user_request.includes(profile.uid) &&
            !receiver_request.includes(userInfo.uid) ? (
                <div
                    className="text-center h-10 w-40 m-auto rounded-xl grid items-center text-white bg-blue-400"
                    onClick={() => {
                        SendRequest();
                    }}>
                    Send friend request
                </div>
            ) : (
                ""
            )}
        </div>
    );
};

export default ProfileDetail;
