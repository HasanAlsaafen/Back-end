import SideBar from "../components/dashboard/SideBar";
import Nav from "../components/dashboard/Nav";
import HeroManage from "../components/dashboard/HeroManage";
import { ProjectManage } from "../components/dashboard/ProjectManage";
import CertifacateManage from "../components/dashboard/CertifacteManage";
import MessageManage from "../components/dashboard/MessageManage";
import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Dashboard() {
  const [selectedItem, setSelectedItem] = useState("Main");
  const [hasNotifications, setHasNotifications] = useState(false);

  const checkNotifications = async () => {
    try {
      const response = await fetch(`${API_URL}/messages?limit=1`);
      if (response.ok) {
        const data = await response.json();
        setHasNotifications(data.length > 0);
      }
    } catch (err) {
      console.error("Failed to check notifications", err);
    }
  };

  useEffect(() => {
    checkNotifications();
    const interval = setInterval(checkNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedItem === "Messages") {
      checkNotifications();
    }
  }, [selectedItem]);

  return (
    <div className="flex min-h-screen bg-secondary overflow-hidden">
      <SideBar selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Nav 
          onBellClick={() => setSelectedItem("Messages")} 
          hasNotifications={hasNotifications} 
        />
        {selectedItem === "Main" && <HeroManage />}
        {selectedItem === "Projects" && <ProjectManage />}
        {selectedItem === "Certificates" && <CertifacateManage />}
        {selectedItem === "Messages" && <MessageManage onMessageUpdate={checkNotifications} />}
      </div>
    </div>
  );
}

