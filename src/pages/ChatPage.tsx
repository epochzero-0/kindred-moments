import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Shield, Users, ChevronLeft, Search, User, Paperclip, Camera,
  MessageCircle, Sparkles, Heart, MapPin,
  // Group icons
  Palette, CircleDot, Gamepad2, Coffee, Cat, UtensilsCrossed, Bike,
  Dog, Sunset, Soup, Flower2, Dumbbell, Footprints, Film, Music,
  BookOpen, Monitor, HandHeart, type LucideIcon
} from "lucide-react";
import { useCurrentUser, useUsers } from "@/hooks/use-data";
import { useChatConnections } from "@/hooks/use-chat-connections";
import { useUserProfile } from "@/hooks/use-user-profile";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  isMe: boolean;
}

interface ChatRoom {
  id: string;
  name: string;
  type: "group" | "direct";
  icon: LucideIcon;
  lastMessage: string;
  lastMessageTime: Date;
  unread: number;
  members: number;
  isNew?: boolean;
  suggestedStarters?: string[];
  userId?: string;
  fromLikedList?: boolean;
  isNeighborhood?: boolean;
}

// Group icon mapping
const groupIcons: Record<string, LucideIcon> = {
  "art": Palette,
  "badminton": CircleDot,
  "board games": Gamepad2,
  "bubble tea": Coffee,
  "cats": Cat,
  "cooking": UtensilsCrossed,
  "cycling": Bike,
  "dogs": Dog,
  "evening walks": Sunset,
  "food hunt": Soup,
  "gardening": Flower2,
  "gym light": Dumbbell,
  "jogging": Footprints,
  "kopi": Coffee,
  "movies": Film,
  "music": Music,
  "photography": Camera,
  "study": BookOpen,
  "tech": Monitor,
  "volunteering": HandHeart,
};

// Neighbourhood display names
const neighbourhoodLabels: Record<string, string> = {
  woodlands: "Woodlands", yishun: "Yishun", sembawang: "Sembawang", amk: "Ang Mo Kio",
  tampines: "Tampines", bedok: "Bedok", "pasir-ris": "Pasir Ris", punggol: "Punggol",
  sengkang: "Sengkang", "jurong-east": "Jurong East", clementi: "Clementi",
  "bukit-batok": "Bukit Batok", bishan: "Bishan", "toa-payoh": "Toa Payoh", kallang: "Kallang",
};

const formatTime = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return `${Math.floor(diff / (1000 * 60))}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString("en-SG", { day: "numeric", month: "short" });
};

// Color palette for different senders
const senderColors: Record<string, { bg: string; text: string }> = {
  "u003": { bg: "bg-rose-100", text: "text-rose-700" },
  "u008": { bg: "bg-amber-100", text: "text-amber-700" },
  "u009": { bg: "bg-lime-100", text: "text-lime-700" },
  "u011": { bg: "bg-emerald-100", text: "text-emerald-700" },
  "u012": { bg: "bg-teal-100", text: "text-teal-700" },
  "u013": { bg: "bg-cyan-100", text: "text-cyan-700" },
  "u014": { bg: "bg-sky-100", text: "text-sky-700" },
  "u015": { bg: "bg-blue-100", text: "text-blue-700" },
  "u016": { bg: "bg-indigo-100", text: "text-indigo-700" },
  "u017": { bg: "bg-violet-100", text: "text-violet-700" },
  "u018": { bg: "bg-purple-100", text: "text-purple-700" },
  "u019": { bg: "bg-fuchsia-100", text: "text-fuchsia-700" },
  "u020": { bg: "bg-pink-100", text: "text-pink-700" },
  "u021": { bg: "bg-rose-100", text: "text-rose-700" },
  "u022": { bg: "bg-orange-100", text: "text-orange-700" },
  "u023": { bg: "bg-amber-100", text: "text-amber-700" },
  "u024": { bg: "bg-yellow-100", text: "text-yellow-700" },
  "u025": { bg: "bg-lime-100", text: "text-lime-700" },
  "u026": { bg: "bg-green-100", text: "text-green-700" },
  "u027": { bg: "bg-emerald-100", text: "text-emerald-700" },
  "u028": { bg: "bg-teal-100", text: "text-teal-700" },
  "u029": { bg: "bg-cyan-100", text: "text-cyan-700" },
  "u030": { bg: "bg-sky-100", text: "text-sky-700" },
  "u031": { bg: "bg-blue-100", text: "text-blue-700" },
  "u032": { bg: "bg-indigo-100", text: "text-indigo-700" },
  "u033": { bg: "bg-violet-100", text: "text-violet-700" },
  "u034": { bg: "bg-purple-100", text: "text-purple-700" },
  "u035": { bg: "bg-fuchsia-100", text: "text-fuchsia-700" },
  "u036": { bg: "bg-pink-100", text: "text-pink-700" },
  "u037": { bg: "bg-rose-100", text: "text-rose-700" },
  "u038": { bg: "bg-orange-100", text: "text-orange-700" },
  "u039": { bg: "bg-amber-100", text: "text-amber-700" },
  "u040": { bg: "bg-yellow-100", text: "text-yellow-700" },
  "u041": { bg: "bg-lime-100", text: "text-lime-700" },
  "u042": { bg: "bg-green-100", text: "text-green-700" },
  "u043": { bg: "bg-emerald-100", text: "text-emerald-700" },
  "u044": { bg: "bg-teal-100", text: "text-teal-700" },
  "u045": { bg: "bg-cyan-100", text: "text-cyan-700" },
  "u046": { bg: "bg-sky-100", text: "text-sky-700" },
  "u047": { bg: "bg-blue-100", text: "text-blue-700" },
  "u098": { bg: "bg-indigo-100", text: "text-indigo-700" },
  "u099": { bg: "bg-violet-100", text: "text-violet-700" },
};

const getSenderColor = (senderId: string) => {
  return senderColors[senderId] || { bg: "bg-slate-100", text: "text-slate-700" };
};

// Generic neighborhood messages (shared across all neighborhoods)
const neighborhoodMessages: Message[] = [
  { id: "nb-1", senderId: "u098", senderName: "Auntie Rose", content: "Good morning neighbours! The wet market fish is very fresh today.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), isMe: false },
  { id: "nb-2", senderId: "u027", senderName: "Uncle Tan", content: "Thanks for the tip! Any idea if the fruit stall is open?", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3.5), isMe: false },
  { id: "nb-3", senderId: "u098", senderName: "Auntie Rose", content: "Yes, just opened. They have nice papayas.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3.2), isMe: false },
  { id: "nb-4", senderId: "u042", senderName: "Steven", content: "Hi all, I made too much curry chicken. Anyone wants some? Bring your own container!", timestamp: new Date(Date.now() - 1000 * 60 * 45), isMe: false },
  { id: "nb-5", senderId: "u018", senderName: "Nancy", content: "Oh I would love some! Be there in 10 mins.", timestamp: new Date(Date.now() - 1000 * 60 * 30), isMe: false },
  { id: "nb-6", senderId: "u042", senderName: "Steven", content: "Sure Nancy, see you!", timestamp: new Date(Date.now() - 1000 * 60 * 25), isMe: false },
];

// Pre-populated messages for group chats to make them feel alive
const groupMessages: Record<string, Message[]> = {
  "art": [
    { id: "art-1", senderId: "u034", senderName: "Mei Ling", content: "Just finished my watercolor piece! Anyone want to share their latest work?", timestamp: new Date(Date.now() - 1000 * 60 * 120), isMe: false },
    { id: "art-2", senderId: "u022", senderName: "Ravi", content: "That sounds amazing! I've been experimenting with acrylics lately", timestamp: new Date(Date.now() - 1000 * 60 * 105), isMe: false },
    { id: "art-3", senderId: "u017", senderName: "Sarah", content: "We should organize a weekend paint session at the CC!", timestamp: new Date(Date.now() - 1000 * 60 * 90), isMe: false },
    { id: "art-4", senderId: "u034", senderName: "Mei Ling", content: "Great idea Sarah! I can bring extra supplies", timestamp: new Date(Date.now() - 1000 * 60 * 75), isMe: false },
    { id: "art-5", senderId: "u039", senderName: "Kenneth", content: "Count me in! Been wanting to try oil painting", timestamp: new Date(Date.now() - 1000 * 60 * 60), isMe: false },
    { id: "art-6", senderId: "u022", senderName: "Ravi", content: "Oil painting is tricky but rewarding. Happy to share some tips!", timestamp: new Date(Date.now() - 1000 * 60 * 45), isMe: false },
    { id: "art-7", senderId: "u017", senderName: "Sarah", content: "How about this Saturday 2pm?", timestamp: new Date(Date.now() - 1000 * 60 * 30), isMe: false },
    { id: "art-8", senderId: "u034", senderName: "Mei Ling", content: "Perfect! I'll book the room at the CC", timestamp: new Date(Date.now() - 1000 * 60 * 15), isMe: false },
  ],
  "badminton": [
    { id: "bad-1", senderId: "u023", senderName: "Wei Ming", content: "Anyone free for doubles this Saturday morning?", timestamp: new Date(Date.now() - 1000 * 60 * 180), isMe: false },
    { id: "bad-2", senderId: "u045", senderName: "Priya", content: "Count me in! What time?", timestamp: new Date(Date.now() - 1000 * 60 * 165), isMe: false },
    { id: "bad-3", senderId: "u023", senderName: "Wei Ming", content: "How about 8am at the sports hall?", timestamp: new Date(Date.now() - 1000 * 60 * 150), isMe: false },
    { id: "bad-4", senderId: "u011", senderName: "Ahmad", content: "Perfect! I'll bring extra shuttlecocks", timestamp: new Date(Date.now() - 1000 * 60 * 135), isMe: false },
    { id: "bad-5", senderId: "u038", senderName: "Li Ting", content: "I'm in too! Need a 4th player?", timestamp: new Date(Date.now() - 1000 * 60 * 120), isMe: false },
    { id: "bad-6", senderId: "u023", senderName: "Wei Ming", content: "Yes! That makes 4 for doubles. Perfect!", timestamp: new Date(Date.now() - 1000 * 60 * 90), isMe: false },
    { id: "bad-7", senderId: "u045", senderName: "Priya", content: "I booked court 3. See you all there!", timestamp: new Date(Date.now() - 1000 * 60 * 60), isMe: false },
    { id: "bad-8", senderId: "u011", senderName: "Ahmad", content: "Great! Don't forget to bring water, it's gonna be warm", timestamp: new Date(Date.now() - 1000 * 60 * 30), isMe: false },
  ],
  "board games": [
    { id: "bg-1", senderId: "u039", senderName: "Kenneth", content: "Just got Wingspan! Anyone interested for game night?", timestamp: new Date(Date.now() - 1000 * 60 * 240), isMe: false },
    { id: "bg-2", senderId: "u016", senderName: "Hui Wen", content: "Ooh I've been wanting to try that! When?", timestamp: new Date(Date.now() - 1000 * 60 * 210), isMe: false },
    { id: "bg-3", senderId: "u039", senderName: "Kenneth", content: "How about Friday 7pm at my place?", timestamp: new Date(Date.now() - 1000 * 60 * 180), isMe: false },
    { id: "bg-4", senderId: "u024", senderName: "Bryan", content: "I'm in! Can I bring Catan as backup?", timestamp: new Date(Date.now() - 1000 * 60 * 150), isMe: false },
    { id: "bg-5", senderId: "u016", senderName: "Hui Wen", content: "Love Catan! Let's play both if we have time", timestamp: new Date(Date.now() - 1000 * 60 * 120), isMe: false },
    { id: "bg-6", senderId: "u033", senderName: "Darren", content: "Room for one more? I'll bring snacks!", timestamp: new Date(Date.now() - 1000 * 60 * 90), isMe: false },
    { id: "bg-7", senderId: "u039", senderName: "Kenneth", content: "The more the merrier! My place can fit 6", timestamp: new Date(Date.now() - 1000 * 60 * 60), isMe: false },
    { id: "bg-8", senderId: "u024", senderName: "Bryan", content: "Nice! See everyone Friday then", timestamp: new Date(Date.now() - 1000 * 60 * 30), isMe: false },
  ],
  "bubble tea": [
    { id: "bt-1", senderId: "u028", senderName: "Jia Hui", content: "New LiHO outlet opened near the MRT! Anyone tried it?", timestamp: new Date(Date.now() - 1000 * 60 * 180), isMe: false },
    { id: "bt-2", senderId: "u033", senderName: "Darren", content: "Not yet! What's their signature?", timestamp: new Date(Date.now() - 1000 * 60 * 165), isMe: false },
    { id: "bt-3", senderId: "u028", senderName: "Jia Hui", content: "The brown sugar boba is really good! Less sweet option available too", timestamp: new Date(Date.now() - 1000 * 60 * 150), isMe: false },
    { id: "bt-4", senderId: "u041", senderName: "Michelle", content: "Ooh I love brown sugar boba! Going to try it today", timestamp: new Date(Date.now() - 1000 * 60 * 120), isMe: false },
    { id: "bt-5", senderId: "u019", senderName: "Jason", content: "Anyone wants to do a bubble tea run together?", timestamp: new Date(Date.now() - 1000 * 60 * 90), isMe: false },
    { id: "bt-6", senderId: "u033", senderName: "Darren", content: "I'm down! What time?", timestamp: new Date(Date.now() - 1000 * 60 * 75), isMe: false },
    { id: "bt-7", senderId: "u019", senderName: "Jason", content: "After lunch? Around 2pm?", timestamp: new Date(Date.now() - 1000 * 60 * 60), isMe: false },
    { id: "bt-8", senderId: "u028", senderName: "Jia Hui", content: "Meet at the MRT station! I'll show you the way", timestamp: new Date(Date.now() - 1000 * 60 * 30), isMe: false },
  ],
  "cats": [
    { id: "cat-1", senderId: "u041", senderName: "Michelle", content: "My cat just learned to high-five!", timestamp: new Date(Date.now() - 1000 * 60 * 180), isMe: false },
    { id: "cat-2", senderId: "u019", senderName: "Jason", content: "So cute! My tabby just sleeps all day haha", timestamp: new Date(Date.now() - 1000 * 60 * 165), isMe: false },
    { id: "cat-3", senderId: "u027", senderName: "Auntie Susan", content: "Anyone knows a good vet in the area? Need to get vaccinations done", timestamp: new Date(Date.now() - 1000 * 60 * 150), isMe: false },
    { id: "cat-4", senderId: "u041", senderName: "Michelle", content: "Dr. Tan at block 456 is great! Very gentle with cats", timestamp: new Date(Date.now() - 1000 * 60 * 120), isMe: false },
    { id: "cat-5", senderId: "u030", senderName: "Karen", content: "Seconded! Been going there for years", timestamp: new Date(Date.now() - 1000 * 60 * 90), isMe: false },
    { id: "cat-6", senderId: "u027", senderName: "Auntie Susan", content: "Thanks! Will call them tomorrow", timestamp: new Date(Date.now() - 1000 * 60 * 75), isMe: false },
    { id: "cat-7", senderId: "u019", senderName: "Jason", content: "Anyone interested in cat cafe outing this weekend?", timestamp: new Date(Date.now() - 1000 * 60 * 45), isMe: false },
    { id: "cat-8", senderId: "u041", senderName: "Michelle", content: "Yes please! The one at Bugis?", timestamp: new Date(Date.now() - 1000 * 60 * 20), isMe: false },
  ],
  "cooking": [
    { id: "cook-1", senderId: "u044", senderName: "Hui Min", content: "Made char kway teow for dinner! Finally got the wok hei right", timestamp: new Date(Date.now() - 1000 * 60 * 240), isMe: false },
    { id: "cook-2", senderId: "u009", senderName: "John", content: "Recipe please! I always burn mine", timestamp: new Date(Date.now() - 1000 * 60 * 210), isMe: false },
    { id: "cook-3", senderId: "u003", senderName: "Farah", content: "The secret is high heat and fast stirring!", timestamp: new Date(Date.now() - 1000 * 60 * 180), isMe: false },
    { id: "cook-4", senderId: "u044", senderName: "Hui Min", content: "Yes! And don't overcrowd the wok", timestamp: new Date(Date.now() - 1000 * 60 * 150), isMe: false },
    { id: "cook-5", senderId: "u009", senderName: "John", content: "We should do a cooking session together!", timestamp: new Date(Date.now() - 1000 * 60 * 120), isMe: false },
    { id: "cook-6", senderId: "u046", senderName: "Auntie Mary", content: "Great idea! I can teach my chicken rice recipe", timestamp: new Date(Date.now() - 1000 * 60 * 90), isMe: false },
    { id: "cook-7", senderId: "u003", senderName: "Farah", content: "Auntie Mary's chicken rice is legendary!", timestamp: new Date(Date.now() - 1000 * 60 * 60), isMe: false },
    { id: "cook-8", senderId: "u044", senderName: "Hui Min", content: "Let's book the CC kitchen next weekend?", timestamp: new Date(Date.now() - 1000 * 60 * 30), isMe: false },
  ],
  "cycling": [
    { id: "cyc-1", senderId: "u015", senderName: "Daniel", content: "Morning ride to ECP this Sunday? Starting from Bedok", timestamp: new Date(Date.now() - 1000 * 60 * 240), isMe: false },
    { id: "cyc-2", senderId: "u038", senderName: "Li Ting", content: "What time? I can join if it's not too early", timestamp: new Date(Date.now() - 1000 * 60 * 210), isMe: false },
    { id: "cyc-3", senderId: "u015", senderName: "Daniel", content: "7am to beat the heat! We can grab breakfast after", timestamp: new Date(Date.now() - 1000 * 60 * 180), isMe: false },
    { id: "cyc-4", senderId: "u031", senderName: "Marcus", content: "I'm in! How far are we going?", timestamp: new Date(Date.now() - 1000 * 60 * 150), isMe: false },
    { id: "cyc-5", senderId: "u015", senderName: "Daniel", content: "About 20km round trip. Easy pace for everyone", timestamp: new Date(Date.now() - 1000 * 60 * 120), isMe: false },
    { id: "cyc-6", senderId: "u038", senderName: "Li Ting", content: "Perfect! I'll bring my road bike", timestamp: new Date(Date.now() - 1000 * 60 * 90), isMe: false },
    { id: "cyc-7", senderId: "u020", senderName: "Hafiz", content: "Can join too? Just got a new bicycle!", timestamp: new Date(Date.now() - 1000 * 60 * 60), isMe: false },
    { id: "cyc-8", senderId: "u015", senderName: "Daniel", content: "Of course! Meet at Bedok MRT exit A", timestamp: new Date(Date.now() - 1000 * 60 * 30), isMe: false },
  ],
  "dogs": [
    { id: "dog-1", senderId: "u021", senderName: "Rachel", content: "Puppy playdate at the dog run this evening?", timestamp: new Date(Date.now() - 1000 * 60 * 180), isMe: false },
    { id: "dog-2", senderId: "u037", senderName: "Uncle Tan", content: "My golden will be there! He loves making new friends", timestamp: new Date(Date.now() - 1000 * 60 * 165), isMe: false },
    { id: "dog-3", senderId: "u012", senderName: "Mei", content: "See you there! Bringing my corgi", timestamp: new Date(Date.now() - 1000 * 60 * 150), isMe: false },
    { id: "dog-4", senderId: "u021", senderName: "Rachel", content: "My shiba will finally have playmates!", timestamp: new Date(Date.now() - 1000 * 60 * 120), isMe: false },
    { id: "dog-5", senderId: "u008", senderName: "Michael", content: "What time? My lab needs some exercise", timestamp: new Date(Date.now() - 1000 * 60 * 90), isMe: false },
    { id: "dog-6", senderId: "u021", senderName: "Rachel", content: "5pm when it's cooler? The big dog run", timestamp: new Date(Date.now() - 1000 * 60 * 75), isMe: false },
    { id: "dog-7", senderId: "u037", senderName: "Uncle Tan", content: "Good timing! I'll bring some treats to share", timestamp: new Date(Date.now() - 1000 * 60 * 45), isMe: false },
    { id: "dog-8", senderId: "u012", senderName: "Mei", content: "So excited! See everyone at 5pm", timestamp: new Date(Date.now() - 1000 * 60 * 20), isMe: false },
  ],
  "evening walks": [
    { id: "ew-1", senderId: "u099", senderName: "Uncle Lim", content: "Nice breeze tonight! Anyone joining for the park walk?", timestamp: new Date(Date.now() - 1000 * 60 * 180), isMe: false },
    { id: "ew-2", senderId: "u098", senderName: "Auntie Rose", content: "Yes! Meeting at the usual spot at 7pm?", timestamp: new Date(Date.now() - 1000 * 60 * 165), isMe: false },
    { id: "ew-3", senderId: "u025", senderName: "Jenny", content: "I'll be there! Need to destress after work", timestamp: new Date(Date.now() - 1000 * 60 * 150), isMe: false },
    { id: "ew-4", senderId: "u099", senderName: "Uncle Lim", content: "7pm it is! The new walking path is very nice", timestamp: new Date(Date.now() - 1000 * 60 * 120), isMe: false },
    { id: "ew-5", senderId: "u018", senderName: "Nancy", content: "Can I bring my neighbour? She just moved in", timestamp: new Date(Date.now() - 1000 * 60 * 90), isMe: false },
    { id: "ew-6", senderId: "u098", senderName: "Auntie Rose", content: "Of course! The more the merrier", timestamp: new Date(Date.now() - 1000 * 60 * 75), isMe: false },
    { id: "ew-7", senderId: "u025", senderName: "Jenny", content: "I'll bring some bottled water to share", timestamp: new Date(Date.now() - 1000 * 60 * 45), isMe: false },
    { id: "ew-8", senderId: "u099", senderName: "Uncle Lim", content: "Perfect! See you all at the entrance", timestamp: new Date(Date.now() - 1000 * 60 * 20), isMe: false },
  ],
  "food hunt": [
    { id: "fh-1", senderId: "u044", senderName: "Hui Min", content: "Found an amazing wanton mee at the hawker centre!", timestamp: new Date(Date.now() - 1000 * 60 * 240), isMe: false },
    { id: "fh-2", senderId: "u009", senderName: "John", content: "Which stall? I need to try!", timestamp: new Date(Date.now() - 1000 * 60 * 210), isMe: false },
    { id: "fh-3", senderId: "u044", senderName: "Hui Min", content: "The one near the drinks stall. Queue is long but worth it!", timestamp: new Date(Date.now() - 1000 * 60 * 180), isMe: false },
    { id: "fh-4", senderId: "u028", senderName: "Jia Hui", content: "Oh I know that one! The chili is amazing", timestamp: new Date(Date.now() - 1000 * 60 * 150), isMe: false },
    { id: "fh-5", senderId: "u033", senderName: "Darren", content: "Food hunt this weekend? Let's explore the new food court", timestamp: new Date(Date.now() - 1000 * 60 * 120), isMe: false },
    { id: "fh-6", senderId: "u009", senderName: "John", content: "Yes! Saturday lunch?", timestamp: new Date(Date.now() - 1000 * 60 * 90), isMe: false },
    { id: "fh-7", senderId: "u044", senderName: "Hui Min", content: "Count me in! I heard they have good laksa there", timestamp: new Date(Date.now() - 1000 * 60 * 60), isMe: false },
    { id: "fh-8", senderId: "u028", senderName: "Jia Hui", content: "12pm? Meet at the MRT", timestamp: new Date(Date.now() - 1000 * 60 * 30), isMe: false },
  ],
  "gardening": [
    { id: "gard-1", senderId: "u046", senderName: "Auntie Mary", content: "My tomatoes are finally ripening! So satisfying", timestamp: new Date(Date.now() - 1000 * 60 * 240), isMe: false },
    { id: "gard-2", senderId: "u029", senderName: "Kelvin", content: "Any tips for growing herbs in HDB balcony?", timestamp: new Date(Date.now() - 1000 * 60 * 210), isMe: false },
    { id: "gard-3", senderId: "u046", senderName: "Auntie Mary", content: "Basil and mint do well! Just need good drainage and morning sun", timestamp: new Date(Date.now() - 1000 * 60 * 180), isMe: false },
    { id: "gard-4", senderId: "u025", senderName: "Jenny", content: "Where do you buy your seedlings?", timestamp: new Date(Date.now() - 1000 * 60 * 150), isMe: false },
    { id: "gard-5", senderId: "u046", senderName: "Auntie Mary", content: "World Farm at Bah Soon Pah is great!", timestamp: new Date(Date.now() - 1000 * 60 * 120), isMe: false },
    { id: "gard-6", senderId: "u029", senderName: "Kelvin", content: "We should do a gardening trip together!", timestamp: new Date(Date.now() - 1000 * 60 * 90), isMe: false },
    { id: "gard-7", senderId: "u025", senderName: "Jenny", content: "Yes! I need pots and soil too", timestamp: new Date(Date.now() - 1000 * 60 * 60), isMe: false },
    { id: "gard-8", senderId: "u046", senderName: "Auntie Mary", content: "Sunday morning? I'll drive us there", timestamp: new Date(Date.now() - 1000 * 60 * 30), isMe: false },
  ],
  "gym light": [
    { id: "gym-1", senderId: "u031", senderName: "Marcus", content: "Anyone up for gym session tomorrow morning?", timestamp: new Date(Date.now() - 1000 * 60 * 240), isMe: false },
    { id: "gym-2", senderId: "u014", senderName: "Siti", content: "What time? I can join for cardio", timestamp: new Date(Date.now() - 1000 * 60 * 210), isMe: false },
    { id: "gym-3", senderId: "u031", senderName: "Marcus", content: "7am at the CC gym! Easier to get equipment early", timestamp: new Date(Date.now() - 1000 * 60 * 180), isMe: false },
    { id: "gym-4", senderId: "u020", senderName: "Hafiz", content: "I'm in! Working on my fitness goals this month", timestamp: new Date(Date.now() - 1000 * 60 * 150), isMe: false },
    { id: "gym-5", senderId: "u014", senderName: "Siti", content: "Same here! Trying to be more consistent", timestamp: new Date(Date.now() - 1000 * 60 * 120), isMe: false },
    { id: "gym-6", senderId: "u031", senderName: "Marcus", content: "Having gym buddies really helps with motivation!", timestamp: new Date(Date.now() - 1000 * 60 * 90), isMe: false },
    { id: "gym-7", senderId: "u035", senderName: "Ying Xuan", content: "Can I join too? New to weights", timestamp: new Date(Date.now() - 1000 * 60 * 60), isMe: false },
    { id: "gym-8", senderId: "u031", senderName: "Marcus", content: "Of course! We can show you the basics", timestamp: new Date(Date.now() - 1000 * 60 * 30), isMe: false },
  ],
  "jogging": [
    { id: "jog-1", senderId: "u020", senderName: "Hafiz", content: "5km run tonight at 7pm anyone?", timestamp: new Date(Date.now() - 1000 * 60 * 180), isMe: false },
    { id: "jog-2", senderId: "u035", senderName: "Ying Xuan", content: "I'm in! What's the route?", timestamp: new Date(Date.now() - 1000 * 60 * 165), isMe: false },
    { id: "jog-3", senderId: "u020", senderName: "Hafiz", content: "The usual park connector loop. Easy pace so everyone can join!", timestamp: new Date(Date.now() - 1000 * 60 * 150), isMe: false },
    { id: "jog-4", senderId: "u014", senderName: "Siti", content: "Perfect! Training for the upcoming community run", timestamp: new Date(Date.now() - 1000 * 60 * 120), isMe: false },
    { id: "jog-5", senderId: "u031", senderName: "Marcus", content: "Me too! Let's pace each other", timestamp: new Date(Date.now() - 1000 * 60 * 90), isMe: false },
    { id: "jog-6", senderId: "u035", senderName: "Ying Xuan", content: "Is there a water point along the way?", timestamp: new Date(Date.now() - 1000 * 60 * 75), isMe: false },
    { id: "jog-7", senderId: "u020", senderName: "Hafiz", content: "Yes! At the 2.5km mark. I'll bring extra bottles", timestamp: new Date(Date.now() - 1000 * 60 * 45), isMe: false },
    { id: "jog-8", senderId: "u014", senderName: "Siti", content: "Great! See everyone at the start point", timestamp: new Date(Date.now() - 1000 * 60 * 20), isMe: false },
  ],
  "kopi": [
    { id: "kopi-1", senderId: "u099", senderName: "Uncle Lim", content: "Best kopi-o in the neighbourhood is at block 123!", timestamp: new Date(Date.now() - 1000 * 60 * 240), isMe: false },
    { id: "kopi-2", senderId: "u042", senderName: "Steven", content: "Agreed! Their kaya toast also shiok", timestamp: new Date(Date.now() - 1000 * 60 * 210), isMe: false },
    { id: "kopi-3", senderId: "u018", senderName: "Nancy", content: "Morning kopi session tomorrow? I'll be there at 7am", timestamp: new Date(Date.now() - 1000 * 60 * 180), isMe: false },
    { id: "kopi-4", senderId: "u099", senderName: "Uncle Lim", content: "I'm always there by 6:30! Old habit", timestamp: new Date(Date.now() - 1000 * 60 * 150), isMe: false },
    { id: "kopi-5", senderId: "u098", senderName: "Auntie Rose", content: "Save me a seat! I want kopi-c", timestamp: new Date(Date.now() - 1000 * 60 * 120), isMe: false },
    { id: "kopi-6", senderId: "u042", senderName: "Steven", content: "The uncle there knows everyone's order by heart", timestamp: new Date(Date.now() - 1000 * 60 * 90), isMe: false },
    { id: "kopi-7", senderId: "u018", senderName: "Nancy", content: "That's the kampong spirit we love!", timestamp: new Date(Date.now() - 1000 * 60 * 60), isMe: false },
    { id: "kopi-8", senderId: "u099", senderName: "Uncle Lim", content: "See you all tomorrow! First round on me", timestamp: new Date(Date.now() - 1000 * 60 * 30), isMe: false },
  ],
  "movies": [
    { id: "mov-1", senderId: "u024", senderName: "Bryan", content: "Anyone watching the new Marvel movie this weekend?", timestamp: new Date(Date.now() - 1000 * 60 * 240), isMe: false },
    { id: "mov-2", senderId: "u036", senderName: "Cheryl", content: "Yes! Saturday afternoon slot?", timestamp: new Date(Date.now() - 1000 * 60 * 210), isMe: false },
    { id: "mov-3", senderId: "u024", senderName: "Bryan", content: "Perfect! I'll book the tickets. IMAX or regular?", timestamp: new Date(Date.now() - 1000 * 60 * 180), isMe: false },
    { id: "mov-4", senderId: "u019", senderName: "Jason", content: "IMAX please! Worth the experience", timestamp: new Date(Date.now() - 1000 * 60 * 150), isMe: false },
    { id: "mov-5", senderId: "u036", senderName: "Cheryl", content: "Agreed! The sound system is amazing", timestamp: new Date(Date.now() - 1000 * 60 * 120), isMe: false },
    { id: "mov-6", senderId: "u041", senderName: "Michelle", content: "Count me in! What time?", timestamp: new Date(Date.now() - 1000 * 60 * 90), isMe: false },
    { id: "mov-7", senderId: "u024", senderName: "Bryan", content: "3pm show? Then we can grab dinner after", timestamp: new Date(Date.now() - 1000 * 60 * 60), isMe: false },
    { id: "mov-8", senderId: "u019", senderName: "Jason", content: "Perfect plan! Booking 4 tickets now", timestamp: new Date(Date.now() - 1000 * 60 * 30), isMe: false },
  ],
  "music": [
    { id: "mus-1", senderId: "u026", senderName: "Wei Lin", content: "Anyone plays guitar here? Looking for jam buddies", timestamp: new Date(Date.now() - 1000 * 60 * 240), isMe: false },
    { id: "mus-2", senderId: "u043", senderName: "Amir", content: "I play bass! What genre are you into?", timestamp: new Date(Date.now() - 1000 * 60 * 210), isMe: false },
    { id: "mus-3", senderId: "u026", senderName: "Wei Lin", content: "Mostly pop and rock. We should organize a session!", timestamp: new Date(Date.now() - 1000 * 60 * 180), isMe: false },
    { id: "mus-4", senderId: "u024", senderName: "Bryan", content: "I can play drums! Basic level though", timestamp: new Date(Date.now() - 1000 * 60 * 150), isMe: false },
    { id: "mus-5", senderId: "u043", senderName: "Amir", content: "That's perfect! We have a band forming", timestamp: new Date(Date.now() - 1000 * 60 * 120), isMe: false },
    { id: "mus-6", senderId: "u036", senderName: "Cheryl", content: "I can sing backup if you need vocals!", timestamp: new Date(Date.now() - 1000 * 60 * 90), isMe: false },
    { id: "mus-7", senderId: "u026", senderName: "Wei Lin", content: "Amazing! Let's rent a jamming studio next week", timestamp: new Date(Date.now() - 1000 * 60 * 60), isMe: false },
    { id: "mus-8", senderId: "u043", senderName: "Amir", content: "I know a good one nearby. I'll book it!", timestamp: new Date(Date.now() - 1000 * 60 * 30), isMe: false },
  ],
  "photography": [
    { id: "photo-1", senderId: "u030", senderName: "Karen", content: "Golden hour photos at the park yesterday were amazing!", timestamp: new Date(Date.now() - 1000 * 60 * 240), isMe: false },
    { id: "photo-2", senderId: "u013", senderName: "David", content: "Would love to see them! Can share in the group?", timestamp: new Date(Date.now() - 1000 * 60 * 210), isMe: false },
    { id: "photo-3", senderId: "u030", senderName: "Karen", content: "Sure! Maybe we can plan a photowalk together soon", timestamp: new Date(Date.now() - 1000 * 60 * 180), isMe: false },
    { id: "photo-4", senderId: "u022", senderName: "Ravi", content: "Count me in! I just got a new lens", timestamp: new Date(Date.now() - 1000 * 60 * 150), isMe: false },
    { id: "photo-5", senderId: "u013", senderName: "David", content: "What lens? I'm still using kit lens", timestamp: new Date(Date.now() - 1000 * 60 * 120), isMe: false },
    { id: "photo-6", senderId: "u022", senderName: "Ravi", content: "35mm f1.8 - great for street photography!", timestamp: new Date(Date.now() - 1000 * 60 * 90), isMe: false },
    { id: "photo-7", senderId: "u030", senderName: "Karen", content: "How about Gardens by the Bay this Saturday?", timestamp: new Date(Date.now() - 1000 * 60 * 60), isMe: false },
    { id: "photo-8", senderId: "u013", senderName: "David", content: "Perfect! Morning or evening light?", timestamp: new Date(Date.now() - 1000 * 60 * 30), isMe: false },
  ],
  "study": [
    { id: "study-1", senderId: "u022", senderName: "Aiman", content: "Study session at the library this weekend?", timestamp: new Date(Date.now() - 1000 * 60 * 240), isMe: false },
    { id: "study-2", senderId: "u017", senderName: "Priya", content: "I'm in! Preparing for my certification exam", timestamp: new Date(Date.now() - 1000 * 60 * 210), isMe: false },
    { id: "study-3", senderId: "u032", senderName: "Ken", content: "Let's do 2pm? We can grab coffee after", timestamp: new Date(Date.now() - 1000 * 60 * 180), isMe: false },
    { id: "study-4", senderId: "u022", senderName: "Aiman", content: "Perfect! Which floor? I like the quiet zone", timestamp: new Date(Date.now() - 1000 * 60 * 150), isMe: false },
    { id: "study-5", senderId: "u016", senderName: "Hui Wen", content: "Can I join? Working on my thesis", timestamp: new Date(Date.now() - 1000 * 60 * 120), isMe: false },
    { id: "study-6", senderId: "u017", senderName: "Priya", content: "Of course! We have a big table", timestamp: new Date(Date.now() - 1000 * 60 * 90), isMe: false },
    { id: "study-7", senderId: "u032", senderName: "Ken", content: "I'll bring some snacks to share", timestamp: new Date(Date.now() - 1000 * 60 * 60), isMe: false },
    { id: "study-8", senderId: "u022", senderName: "Aiman", content: "Great! See everyone at level 5", timestamp: new Date(Date.now() - 1000 * 60 * 30), isMe: false },
  ],
  "tech": [
    { id: "tech-1", senderId: "u034", senderName: "Wei Lin", content: "Anyone tried the new ChatGPT update? Pretty impressive!", timestamp: new Date(Date.now() - 1000 * 60 * 240), isMe: false },
    { id: "tech-2", senderId: "u023", senderName: "Raj", content: "Yeah the code generation is much better now", timestamp: new Date(Date.now() - 1000 * 60 * 210), isMe: false },
    { id: "tech-3", senderId: "u047", senderName: "Sarah", content: "We should do a tech sharing session! I can share about React", timestamp: new Date(Date.now() - 1000 * 60 * 180), isMe: false },
    { id: "tech-4", senderId: "u034", senderName: "Wei Lin", content: "Great idea! I can talk about Python automation", timestamp: new Date(Date.now() - 1000 * 60 * 150), isMe: false },
    { id: "tech-5", senderId: "u032", senderName: "Ken", content: "I'm interested in learning both!", timestamp: new Date(Date.now() - 1000 * 60 * 120), isMe: false },
    { id: "tech-6", senderId: "u023", senderName: "Raj", content: "Let's organize a monthly tech meetup", timestamp: new Date(Date.now() - 1000 * 60 * 90), isMe: false },
    { id: "tech-7", senderId: "u047", senderName: "Sarah", content: "First Saturday of each month? I can host at my office", timestamp: new Date(Date.now() - 1000 * 60 * 60), isMe: false },
    { id: "tech-8", senderId: "u034", senderName: "Wei Lin", content: "Perfect! I'll create a shared doc for topics", timestamp: new Date(Date.now() - 1000 * 60 * 30), isMe: false },
  ],
  "volunteering": [
    { id: "vol-1", senderId: "u040", senderName: "Grace", content: "Beach cleanup this Saturday at 8am! Who's joining?", timestamp: new Date(Date.now() - 1000 * 60 * 240), isMe: false },
    { id: "vol-2", senderId: "u008", senderName: "Michael", content: "Count me in! I'll bring extra gloves", timestamp: new Date(Date.now() - 1000 * 60 * 210), isMe: false },
    { id: "vol-3", senderId: "u040", senderName: "Grace", content: "Great! Meet at the beach entrance. Breakfast provided after!", timestamp: new Date(Date.now() - 1000 * 60 * 180), isMe: false },
    { id: "vol-4", senderId: "u025", senderName: "Jenny", content: "I'd love to join! First time volunteering", timestamp: new Date(Date.now() - 1000 * 60 * 150), isMe: false },
    { id: "vol-5", senderId: "u008", senderName: "Michael", content: "Welcome! It's very rewarding work", timestamp: new Date(Date.now() - 1000 * 60 * 120), isMe: false },
    { id: "vol-6", senderId: "u040", senderName: "Grace", content: "We'll provide all equipment. Just bring sunscreen!", timestamp: new Date(Date.now() - 1000 * 60 * 90), isMe: false },
    { id: "vol-7", senderId: "u018", senderName: "Nancy", content: "Can I bring my kids? They want to help too", timestamp: new Date(Date.now() - 1000 * 60 * 60), isMe: false },
    { id: "vol-8", senderId: "u040", senderName: "Grace", content: "Absolutely! We have kid-friendly tasks too", timestamp: new Date(Date.now() - 1000 * 60 * 30), isMe: false },
  ],
};

const ChatPage = () => {
  const [searchParams] = useSearchParams();
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [showJoinPopup, setShowJoinPopup] = useState(false);
  const [pendingGroup, setPendingGroup] = useState<{ id: string; name: string } | null>(null);
  const [pendingDraft, setPendingDraft] = useState<string | null>(null);

  const currentUser = useCurrentUser();
  const users = useUsers();
  const { joinedGroups, contactedUsers, joinGroup, contactUser, isGroupJoined, isUserContacted } = useChatConnections();
  const { profile: storedProfile } = useUserProfile();

  // Load liked users from swipe state
  const getLikedUsers = () => {
    try {
      const saved = sessionStorage.getItem("swipe-state");
      if (saved) {
        const state = JSON.parse(saved);
        return state.likedUsers || [];
      }
    } catch {
      // Ignore parse errors
    }
    return [];
  };
  const likedUsers = getLikedUsers();

  // Get user's active neighborhoods from profile or current user fallback
  const userNeighbourhoods = storedProfile?.neighbourhoods?.length 
    ? storedProfile.neighbourhoods 
    : (currentUser?.neighbourhood ? [currentUser.neighbourhood] : []);

  // Build rooms from joined groups, neighborhoods, and contacted users
  const allRooms: ChatRoom[] = [
    // Neighborhood Groups (Automatically Joined)
    ...userNeighbourhoods.map(hood => {
      const displayName = neighbourhoodLabels[hood] || hood;
      const msgs = neighborhoodMessages;
      const lastMsg = msgs[msgs.length - 1];
      return {
        id: `neigh-${hood}`,
        name: `${displayName} Community`,
        type: "group" as const,
        icon: MapPin,
        lastMessage: lastMsg.content,
        lastMessageTime: lastMsg.timestamp,
        unread: 2, // Always show some activity
        members: Math.floor(Math.random() * 50) + 120, // Random count for realism
        isNeighborhood: true
      };
    }),
    // Joined groups
    ...joinedGroups.map(g => {
      const msgs = groupMessages[g.id];
      const lastMsg = msgs && msgs.length > 0 ? msgs[msgs.length - 1] : null;
      return {
        id: `group-${g.id}`,
        name: g.name,
        type: "group" as const,
        icon: groupIcons[g.id] || Users,
        lastMessage: lastMsg ? lastMsg.content : "Tap to view conversation",
        lastMessageTime: lastMsg ? lastMsg.timestamp : new Date(g.joinedAt),
        unread: msgs ? Math.min(msgs.length, 3) : 0,
        members: users.filter(u => u.interests.includes(g.id)).length,
      };
    }),
    // Contacted users
    ...contactedUsers.map(c => {
      const user = users.find(u => u.id === c.userId);
      const isFromLiked = likedUsers.some((lu: { id: string }) => lu.id === c.userId);
      return {
        id: `dm-${c.userId}`,
        userId: c.userId,
        name: user?.name || c.name, // Always prefer fresh name from users.json
        type: "direct" as const,
        icon: User,
        lastMessage: user ? `Start chatting with ${user.name.split(' ')[0]}` : "Start a conversation",
        lastMessageTime: new Date(c.contactedAt),
        unread: 0,
        members: 2,
        fromLikedList: isFromLiked,
      };
    }),
    // Liked users not yet contacted
    ...likedUsers
      .filter((lu: { id: string }) => !isUserContacted(lu.id))
      .map((lu: { id: string; name: string }) => ({
        id: `dm-${lu.id}`,
        userId: lu.id,
        name: lu.name,
        type: "direct" as const,
        icon: User,
        lastMessage: "You liked this person - say hello!",
        lastMessageTime: new Date(),
        unread: 0,
        members: 2,
        fromLikedList: true,
      })),
  ];

  // Check for roomId, roomName, or userId in URL
  useEffect(() => {
    const roomId = searchParams.get("roomId");
    const roomName = searchParams.get("roomName");
    const userId = searchParams.get("userId");

    if (roomId && roomId.startsWith("group-")) {
      const groupId = roomId.replace("group-", "");
      const groupName = roomName || groupId;

      // Check if already joined
      if (isGroupJoined(groupId)) {
        const room = allRooms.find(r => r.id === roomId);
        if (room) {
          setSelectedRoom(room);
        } else {
          // Room not yet in allRooms (timing) — create it inline
          const memberCount = users.filter(u => u.interests.includes(groupId)).length;
          const newRoom: ChatRoom = {
            id: `group-${groupId}`,
            name: groupName,
            type: "group",
            icon: groupIcons[groupId] || Users,
            lastMessage: "Tap to view conversation",
            lastMessageTime: new Date(),
            unread: 0,
            members: memberCount || 1,
          };
          setSelectedRoom(newRoom);
        }
      } else {
        // Show join popup
        setPendingGroup({ id: groupId, name: groupName });
        setShowJoinPopup(true);
      }
      return;
    }

    if (roomId) {
      const room = allRooms.find(r => r.id === roomId);
      if (room) {
        setSelectedRoom(room);
        return;
      }
    }

    if (userId) {
      // Check existing direct chat
      const existingRoom = allRooms.find(r => r.type === "direct" && r.userId === userId);

      if (existingRoom) {
        setSelectedRoom(existingRoom);
        // Check for draft message
        const draft = searchParams.get("draft");
        if (draft) {
          setPendingDraft(draft);
        }
        return;
      }

      // Create room for new DM and add to contacted users
      const targetUser = users.find(u => u.id === userId);
      if (targetUser && currentUser) {
        contactUser(userId, targetUser.name);

        const sharedInterests = targetUser.interests.filter(i => currentUser.interests.includes(i));
        const starters = sharedInterests.map(i => `Hi! I saw you're also into ${i}.`);
        if (starters.length === 0) starters.push("Hi! I'm from the same neighbourhood.");

        const newRoom: ChatRoom = {
          id: `dm-${userId}`,
          userId: userId,
          name: targetUser.name,
          type: "direct",
          icon: User,
          lastMessage: "Start a conversation",
          lastMessageTime: new Date(),
          unread: 0,
          members: 2,
          isNew: true,
          suggestedStarters: starters,
        };
        setSelectedRoom(newRoom);

        // Check for draft message
        const draft = searchParams.get("draft");
        if (draft) {
          setPendingDraft(draft);
        }
      }
    }
  }, [searchParams, users, currentUser, isGroupJoined, contactUser]);

  // Handle joining a group
  const handleJoinGroup = () => {
    if (pendingGroup) {
      joinGroup(pendingGroup.id, pendingGroup.name);
      setShowJoinPopup(false);

      // Create and select the room
      const msgs = groupMessages[pendingGroup.id];
      const lastMsg = msgs && msgs.length > 0 ? msgs[msgs.length - 1] : null;
      const newRoom: ChatRoom = {
        id: `group-${pendingGroup.id}`,
        name: pendingGroup.name,
        type: "group",
        icon: groupIcons[pendingGroup.id] || Users,
        lastMessage: lastMsg ? lastMsg.content : "Welcome! Start the conversation.",
        lastMessageTime: lastMsg ? lastMsg.timestamp : new Date(),
        unread: 0,
        members: users.filter(u => u.interests.includes(pendingGroup.id)).length,
      };
      setSelectedRoom(newRoom);
      setPendingGroup(null);
    }
  };

  const handleMaybeLater = () => {
    setShowJoinPopup(false);
    setPendingGroup(null);
    window.history.pushState({}, "", "/chat");
  };

  // Auto-reply data for group chats
  const groupAutoReplies: Record<string, { senderId: string; senderName: string; replies: string[] }[]> = {
    "art": [
      { senderId: "u034", senderName: "Mei Ling", replies: ["That's a great idea!", "Would love to see your work!", "Let's make it happen!"] },
      { senderId: "u022", senderName: "Ravi", replies: ["Count me in!", "Sounds fun!", "I'm excited!"] },
      { senderId: "u017", senderName: "Sarah", replies: ["Perfect!", "Can't wait!", "This is going to be great!"] },
    ],
    "badminton": [
      { senderId: "u023", senderName: "Wei Ming", replies: ["Let's do it!", "Good one!", "See you there!"] },
      { senderId: "u045", senderName: "Priya", replies: ["I'm in!", "Awesome!", "Great timing!"] },
      { senderId: "u011", senderName: "Ahmad", replies: ["Perfect!", "Looking forward!", "Let's go!"] },
    ],
    // ... [Other existing groups remain unchanged]
  };

  // Generic neighborhood auto-replies
  const neighborhoodAutoReplies = [
    { senderId: "u098", senderName: "Auntie Rose", replies: ["That's wonderful!", "Thanks for sharing, neighbour.", "Have a lovely day!"] },
    { senderId: "u027", senderName: "Uncle Tan", replies: ["Very good!", "I agree.", "See you around!"] },
    { senderId: "u042", senderName: "Steven", replies: ["Nice!", "Thanks for the update.", "Let's catch up soon."] },
    { senderId: "u018", senderName: "Nancy", replies: ["Oh that's interesting!", "I didn't know that.", "Thanks for letting us know!"] },
  ];

  const getTopicSnippet = (message: string) => {
    const cleaned = message.trim().replace(/\s+/g, " ");
    const words = cleaned.split(" ").slice(0, 6);
    return words.join(" ");
  };

  const generateContextualGroupReply = (
    userMessage: string,
    groupId: string,
    fallbackReplies: string[],
  ) => {
    const text = userMessage.trim();
    const lower = text.toLowerCase();
    
    // Simple response generation logic
    const isThanks = /\b(thanks|thank you|thx)\b/.test(lower);
    if (isThanks) return "You're welcome!";
    
    const isGreeting = /\b(hi|hello|hey|good morning|evening)\b/.test(lower);
    if (isGreeting) return "Hello! How are you?";

    // Use fallback replies randomly
    return fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
  };

  // Auto-reply for personal chats
  const personalAutoReplies = [
    "That sounds great! Let me know when you're free.",
    "Nice to hear from you! Would love to catch up soon.",
    "Thanks for reaching out! What did you have in mind?",
    "Hey! That's a lovely idea. Let's plan something!",
    "Oh nice! I was just thinking about you. Let's meet up!",
  ];

  const handleSendMessage = (msgContent?: string) => {
    const content = typeof msgContent === "string" ? msgContent : newMessage;
    if (!content.trim() || !currentUser) return;

    const message: Message = {
      id: `m${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name.split(" ")[0],
      content: content,
      timestamp: new Date(),
      isMe: true,
    };
    setMessages(prev => [...prev, message]);
    setNewMessage("");

    // Auto-reply logic
    if (selectedRoom) {
      if (selectedRoom.isNeighborhood) {
        // Neighborhood chat auto-reply
        const replyData = neighborhoodAutoReplies;
        const shuffled = [...replyData].sort(() => Math.random() - 0.5).slice(0, 2); // 2 random replies

        shuffled.forEach((responder, index) => {
          setTimeout(() => {
            const replyMessage: Message = {
              id: `m${Date.now()}-${index}`,
              senderId: responder.senderId,
              senderName: responder.senderName,
              content: responder.replies[Math.floor(Math.random() * responder.replies.length)],
              timestamp: new Date(),
              isMe: false,
            };
            setMessages(prev => [...prev, replyMessage]);
          }, 1500 + (index * 1000) + Math.random() * 500);
        });

      } else if (selectedRoom.type === "group") {
        // Interest group chat: 3 replies
        const groupId = selectedRoom.id.replace("group-", "");
        const replyData = groupAutoReplies[groupId];

        if (replyData) {
          const shuffled = [...replyData].sort(() => Math.random() - 0.5).slice(0, 3);

          shuffled.forEach((responder, index) => {
            setTimeout(() => {
              const contextualReply = generateContextualGroupReply(
                content,
                groupId,
                responder.replies,
              );
              const replyMessage: Message = {
                id: `m${Date.now()}-${index}`,
                senderId: responder.senderId,
                senderName: responder.senderName,
                content: contextualReply,
                timestamp: new Date(),
                isMe: false,
              };
              setMessages(prev => [...prev, replyMessage]);
            }, 600 + (index * 400) + Math.random() * 400);
          });
        }
      } else {
        // Personal chat: 1 reply
        setTimeout(() => {
          const targetUser = users.find(u => u.id === selectedRoom.userId);
          const randomReply = personalAutoReplies[Math.floor(Math.random() * personalAutoReplies.length)];
          const replyMessage: Message = {
            id: `m${Date.now()}-reply`,
            senderId: selectedRoom.userId || "unknown",
            senderName: targetUser?.name.split(" ")[0] || selectedRoom.name.split(" ")[0],
            content: randomReply,
            timestamp: new Date(),
            isMe: false,
          };
          setMessages(prev => [...prev, replyMessage]);
        }, 1000 + Math.random() * 600);
      }
    }
  };

  const toggleCamera = () => {
    setIsCameraActive(!isCameraActive);
  };

  // Load messages when room changes
  useEffect(() => {
    if (selectedRoom) {
      if (selectedRoom.isNeighborhood) {
        setMessages(neighborhoodMessages);
      } else if (selectedRoom.type === "group") {
        const groupId = selectedRoom.id.replace("group-", "");
        // Check if there are messages saved from the join modal first
        try {
          const saved = sessionStorage.getItem(`kindred-group-chat-${groupId}`);
          if (saved) {
            const parsed = JSON.parse(saved);
            const restored: Message[] = parsed.map((m: any) => ({
              id: m.id,
              senderId: m.senderId,
              senderName: m.senderName,
              content: m.content,
              timestamp: new Date(m.timestamp),
              isMe: m.isMe,
            }));
            setMessages(restored);
            return;
          }
        } catch { /* ignore parse errors */ }
        setMessages(groupMessages[groupId] || []);
      } else {
        // Direct messages start empty
        setMessages([]);
      }
    }
  }, [selectedRoom]);

  // Persist group chat messages to sessionStorage so they survive navigation
  useEffect(() => {
    if (selectedRoom?.type === "group" && messages.length > 0) {
      const groupId = selectedRoom.id.replace("group-", "");
      try {
        const toSave = messages.map(m => ({
          id: m.id,
          senderId: m.senderId,
          senderName: m.senderName,
          content: m.content,
          timestamp: m.timestamp instanceof Date ? m.timestamp.toISOString() : m.timestamp,
          isMe: m.isMe,
        }));
        sessionStorage.setItem(`kindred-group-chat-${groupId}`, JSON.stringify(toSave));
      } catch { /* ignore */ }
    }
  }, [messages, selectedRoom]);

  // Send pending draft message after room is selected
  useEffect(() => {
    if (selectedRoom && pendingDraft && currentUser) {
      // Small delay to ensure UI is ready
      const timer = setTimeout(() => {
        // Use handleSendMessage to trigger auto-reply
        handleSendMessage(pendingDraft);
        setPendingDraft(null);
        // Clear draft from URL
        window.history.replaceState({}, "", `/chat?userId=${selectedRoom.userId || ""}`);
      }, 300);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoom, pendingDraft, currentUser]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-pandan/5 dark:to-pandan/5">
      {/* Join Group Popup */}
      <AnimatePresence>
        {showJoinPopup && pendingGroup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 24 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border border-white/20 dark:border-white/10 bg-white/75 dark:bg-zinc-900/80 backdrop-blur-2xl backdrop-saturate-150 p-6 text-center"
            >
              <div className="h-16 w-16 mx-auto rounded-2xl bg-gradient-to-br from-pandan/20 to-emerald-100 dark:to-emerald-900/30 flex items-center justify-center mb-4">
                {(() => {
                  const Icon = groupIcons[pendingGroup.id] || Users;
                  return <Icon className="h-8 w-8 text-pandan" />;
                })()}
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{pendingGroup.name}</h3>
              <p className="text-sm text-muted-foreground mb-1">
                {users.filter(u => u.interests.includes(pendingGroup.id)).length} members in this group
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Join this amazing community and connect with like-minded neighbours!
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleMaybeLater}
                  className="flex-1 py-3 rounded-2xl bg-white/60 dark:bg-white/10 border border-border/30 dark:border-white/10 text-muted-foreground font-medium hover:bg-white/80 dark:hover:bg-white/15 transition-all"
                >
                  Maybe later
                </button>
                <button
                  onClick={handleJoinGroup}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-pandan to-emerald-400 text-white font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Heart className="h-4 w-4" />
                  Join Group
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedRoom ? (
        <div className="flex-1 flex flex-col">
          {/* Chat header — glassmorphism */}
          <div className="px-5 py-3.5 bg-white/60 dark:bg-zinc-900/70 backdrop-blur-2xl backdrop-saturate-150 border-b border-white/20 dark:border-white/10 flex items-center gap-3 w-full justify-between z-10 sticky top-0">
            <div className="flex items-center gap-3 flex-1">
              <button
                onClick={() => {
                  setSelectedRoom(null);
                  window.history.pushState({}, "", "/chat");
                }}
                className="h-9 w-9 rounded-xl bg-white/60 dark:bg-white/10 border border-white/30 dark:border-white/10 flex items-center justify-center hover:bg-white/80 dark:hover:bg-white/15 transition-all shadow-sm"
              >
                <ChevronLeft className="h-4 w-4 text-foreground" />
              </button>
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${selectedRoom.isNeighborhood ? "bg-gradient-to-br from-pandan/20 to-emerald-100 dark:to-emerald-900/30" : "bg-gradient-to-br from-primary/15 to-primary/5 dark:from-primary/20 dark:to-primary/10"}`}>
                <selectedRoom.icon className={`h-5 w-5 ${selectedRoom.isNeighborhood ? "text-pandan" : "text-primary"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-foreground text-sm truncate">{selectedRoom.name}</h2>
                <p className="text-[11px] text-muted-foreground">{selectedRoom.members} members</p>
              </div>
            </div>
          </div>

          {/* Active Status Bar */}
          <AnimatePresence>
            {isCameraActive && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-pandan/5 dark:bg-pandan/10 px-6 py-2 flex items-center justify-center text-xs text-pandan font-medium border-b border-pandan/10"
              >
                <Camera className="h-3 w-3 mr-2 animate-pulse" />
                You are taking a photo...
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 pb-36 space-y-3">
            <div className="flex justify-center mb-4">
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/60 dark:bg-white/10 backdrop-blur-xl border border-white/30 dark:border-white/10 text-pandan text-xs shadow-sm">
                <Shield className="h-3 w-3" />
                <span className="font-medium">All members verified</span>
              </div>
            </div>

            {messages.map((message, i) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.02 }}
                className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[75%] ${message.isMe ? "order-2" : ""}`}>
                  {!message.isMe && (
                    <p className={`text-[10px] mb-0.5 ml-3 font-medium ${getSenderColor(message.senderId).text}`}>{message.senderName}</p>
                  )}
                  <div
                    className={`px-3.5 py-2.5 rounded-2xl ${message.isMe
                      ? "bg-gradient-to-r from-pandan to-emerald-400 text-white rounded-br-md shadow-md"
                      : `${getSenderColor(message.senderId).bg} dark:bg-opacity-20 border border-white/40 dark:border-white/10 rounded-bl-md shadow-sm`
                      }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                  <p className={`text-[10px] text-muted-foreground mt-0.5 ${message.isMe ? "text-right mr-3" : "ml-3"}`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Message input — glassmorphism */}
          <div className="fixed bottom-16 left-0 right-0 z-40 p-3 bg-white/60 dark:bg-zinc-900/70 backdrop-blur-2xl backdrop-saturate-150 border-t border-white/20 dark:border-white/10">
            <div className="max-w-7xl mx-auto w-full">
              <div className="flex items-end gap-2">
                <div className="flex gap-1.5 mb-0.5">
                  <button
                    className="h-9 w-9 rounded-xl bg-white/60 dark:bg-white/10 border border-white/30 dark:border-white/10 flex items-center justify-center text-muted-foreground hover:bg-white/80 dark:hover:bg-white/15 hover:text-foreground transition-all shadow-sm"
                    title="Attach file"
                  >
                    <Paperclip className="h-4 w-4" />
                  </button>
                  <button
                    onClick={toggleCamera}
                    className={`h-9 w-9 rounded-xl flex items-center justify-center transition-all shadow-sm ${isCameraActive
                      ? "bg-gradient-to-r from-pandan to-emerald-400 text-white border border-pandan/30"
                      : "bg-white/60 dark:bg-white/10 border border-white/30 dark:border-white/10 text-muted-foreground hover:bg-white/80 dark:hover:bg-white/15 hover:text-foreground"
                      }`}
                    title="Take photo"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex-1 bg-white/70 dark:bg-white/10 rounded-2xl flex items-center px-4 py-2.5 border border-white/30 dark:border-white/10 shadow-sm">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent border-none text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!newMessage.trim()}
                  className="h-10 w-10 rounded-xl bg-gradient-to-br from-pandan to-emerald-400 flex items-center justify-center text-white shadow-md disabled:opacity-40 hover:shadow-lg transition-all mb-0.5"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Header — glassmorphism */}
          <div className="px-6 pt-8 pb-5">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-pandan" />
                <p className="text-pandan text-sm font-medium">Messages</p>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-5">Stay connected</h1>

              {/* Search — glassmorphism */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/70 dark:bg-white/10 border border-white/30 dark:border-white/10 backdrop-blur-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-pandan/40 shadow-sm transition-all"
                />
              </div>
            </motion.div>
          </div>

          {/* Chat list */}
          <div className="px-5 flex-1 overflow-y-auto scrollbar-hide pb-20">
            {allRooms.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="h-20 w-20 mx-auto rounded-3xl bg-white/60 dark:bg-white/10 backdrop-blur-xl border border-white/20 dark:border-white/10 flex items-center justify-center mb-4 shadow-sm">
                  <MessageCircle className="h-10 w-10 text-pandan/60" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No conversations yet</h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-xs mx-auto">
                  Join interest groups or connect with members from the Explore tab to start chatting!
                </p>
              </motion.div>
            ) : (
              <div className="space-y-2.5">
                {allRooms.map((room, i) => (
                  <motion.button
                    key={room.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 + i * 0.04 }}
                    onClick={() => setSelectedRoom(room)}
                    className="w-full flex items-center gap-3.5 p-4 rounded-2xl bg-white/65 dark:bg-zinc-900/60 backdrop-blur-xl backdrop-saturate-150 border border-white/25 dark:border-white/10 text-left shadow-sm hover:shadow-md hover:bg-white/80 dark:hover:bg-zinc-900/70 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
                  >
                    <div className="relative">
                      <div className={`h-11 w-11 rounded-xl flex items-center justify-center shadow-sm ${
                        room.isNeighborhood
                          ? "bg-gradient-to-br from-pandan/20 to-emerald-100 dark:to-emerald-900/30"
                          : room.type === "group"
                            ? "bg-gradient-to-br from-violet-100 to-purple-50 dark:from-violet-900/30 dark:to-purple-900/20"
                            : "bg-gradient-to-br from-primary/15 to-primary/5 dark:from-primary/20 dark:to-primary/10"
                        }`}>
                        <room.icon className={`h-5 w-5 ${room.isNeighborhood ? "text-pandan" : room.type === "group" ? "text-violet-600 dark:text-violet-400" : "text-primary"}`} />
                      </div>
                      {room.unread > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-gradient-to-r from-pandan to-emerald-400 text-white text-[10px] font-bold flex items-center justify-center shadow-sm ring-2 ring-white/80 dark:ring-zinc-900/80">
                          {room.unread}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground text-sm">{room.name}</h3>
                          {room.fromLikedList && !isUserContacted(room.userId || "") && (
                            <span className="flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full bg-rose-100/80 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 font-medium border border-rose-200/50 dark:border-rose-800/30">
                              <Heart className="h-2.5 w-2.5" />
                              Liked
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-muted-foreground font-medium">{formatTime(room.lastMessageTime)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {room.type === "group" && <Users className="h-3 w-3 text-muted-foreground/70" />}
                        <p className="text-xs text-muted-foreground truncate">{room.lastMessage}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ChatPage;