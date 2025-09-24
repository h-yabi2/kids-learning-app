"use client";

interface Friend {
  id: string;
  name: string;
  nameJapanese: string;
  imagePath: string;
}

interface FriendsTabProps {
  onFriendClick: (friend: Friend) => void;
}

const friends: Friend[] = [
  {
    id: "ayumu",
    name: "Ayumu",
    nameJapanese: "あゆむ",
    imagePath: "/images/ayumu.png",
  },
  {
    id: "miona",
    name: "Miona",
    nameJapanese: "みおな",
    imagePath: "/images/miona.png",
  },
  {
    id: "mitsuki",
    name: "Mitsuki",
    nameJapanese: "みつき",
    imagePath: "/images/mitsuki.png",
  },
  {
    id: "yattyan",
    name: "Yattyan",
    nameJapanese: "やっちゃん",
    imagePath: "/images/yattyan.png",
  },
];

export default function FriendsTab({ onFriendClick }: FriendsTabProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <div className="grid grid-cols-2 gap-8 max-w-2xl">
        {friends.map((friend) => (
          <div
            key={friend.id}
            className="flex flex-col items-center cursor-pointer transform transition-transform hover:scale-105 active:scale-95"
            onClick={() => onFriendClick(friend)}
          >
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-pink-300 shadow-lg mb-4">
              <img
                src={friend.imagePath}
                alt={friend.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // 画像が読み込めない場合のフォールバック
                  const target = e.target as HTMLImageElement;
                  target.style.backgroundColor = "#f3f4f6";
                  target.style.display = "flex";
                  target.style.alignItems = "center";
                  target.style.justifyContent = "center";
                  target.style.fontSize = "24px";
                  target.style.color = "#9ca3af";
                  target.textContent = "📷";
                }}
              />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-1">
                {friend.nameJapanese}
              </h3>
              <p className="text-lg text-gray-600">{friend.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}