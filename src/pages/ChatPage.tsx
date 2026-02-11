import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Shield, Users, ChevronLeft, Search, User, Paperclip, Camera,
  MessageCircle, Sparkles, Heart,
  // Group icons
  Palette, CircleDot, Gamepad2, Coffee, Cat, UtensilsCrossed, Bike,
  Dog, Sunset, Soup, Flower2, Dumbbell, Footprints, Film, Music,
  BookOpen, Monitor, HandHeart, type LucideIcon
} from "lucide-react";
import { useCurrentUser, useUsers } from "@/hooks/use-data";
import { useChatConnections } from "@/hooks/use-chat-connections";

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

  // Build rooms from joined groups and contacted users
  const allRooms: ChatRoom[] = [
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
    "board games": [
      { senderId: "u039", senderName: "Kenneth", replies: ["Nice!", "That's awesome!", "Can't wait!"] },
      { senderId: "u016", senderName: "Hui Wen", replies: ["So excited!", "Count me in!", "Great idea!"] },
      { senderId: "u024", senderName: "Bryan", replies: ["Let's do it!", "Perfect!", "I'm ready!"] },
    ],
    "bubble tea": [
      { senderId: "u028", senderName: "Jia Hui", replies: ["Yum!", "Love it!", "Let's go together!"] },
      { senderId: "u033", senderName: "Darren", replies: ["Sounds good!", "I want brown sugar!", "Count me in!"] },
      { senderId: "u041", senderName: "Michelle", replies: ["Perfect timing!", "Let's try the new place!", "So thirsty now!"] },
    ],
    "cats": [
      { senderId: "u041", senderName: "Michelle", replies: ["So cute!", "Aww!", "Love that!"] },
      { senderId: "u019", senderName: "Jason", replies: ["My cat agrees!", "Purrfect!", "Meow!"] },
      { senderId: "u027", senderName: "Auntie Susan", replies: ["How lovely!", "My cats would love that!", "Such a good idea!"] },
    ],
    "cooking": [
      { senderId: "u044", senderName: "Hui Min", replies: ["Delicious!", "Great recipe idea!", "Let's cook together!"] },
      { senderId: "u009", senderName: "John", replies: ["Yummy!", "I want to try!", "Teach me!"] },
      { senderId: "u003", senderName: "Farah", replies: ["Sounds tasty!", "Love it!", "Let's do a potluck!"] },
    ],
    "cycling": [
      { senderId: "u015", senderName: "Daniel", replies: ["Let's ride!", "Great route!", "I'm pumped!"] },
      { senderId: "u038", senderName: "Li Ting", replies: ["Count me in!", "Perfect weather!", "See you there!"] },
      { senderId: "u020", senderName: "Hafiz", replies: ["Let's go!", "Excited!", "I'll bring snacks!"] },
    ],
    "dogs": [
      { senderId: "u021", senderName: "Rachel", replies: ["Woof!", "My dog is excited!", "Let's do it!"] },
      { senderId: "u037", senderName: "Uncle Tan", replies: ["My golden loves that!", "Perfect!", "See you at the park!"] },
      { senderId: "u012", senderName: "Mei", replies: ["My corgi says yes!", "Pawsome!", "Can't wait!"] },
    ],
    "evening walks": [
      { senderId: "u099", senderName: "Uncle Lim", replies: ["Good idea!", "The weather is nice!", "See you there!"] },
      { senderId: "u098", senderName: "Auntie Rose", replies: ["Perfect!", "I'll bring water!", "Let's walk!"] },
      { senderId: "u025", senderName: "Jenny", replies: ["I need this!", "Great for destressing!", "Count me in!"] },
    ],
    "food hunt": [
      { senderId: "u044", senderName: "Hui Min", replies: ["Yum!", "Where is it?", "Let's try!"] },
      { senderId: "u009", senderName: "John", replies: ["I'm hungry now!", "Sounds amazing!", "Take me there!"] },
      { senderId: "u028", senderName: "Jia Hui", replies: ["Food adventure!", "Love it!", "My stomach is ready!"] },
    ],
    "gardening": [
      { senderId: "u046", senderName: "Auntie Mary", replies: ["Green thumbs up!", "Love gardening!", "Let's grow together!"] },
      { senderId: "u029", senderName: "Kelvin", replies: ["Great tip!", "I'll try that!", "Thanks for sharing!"] },
      { senderId: "u025", senderName: "Jenny", replies: ["So relaxing!", "Nature is amazing!", "Beautiful!"] },
    ],
    "gym light": [
      { senderId: "u031", senderName: "Marcus", replies: ["Let's work out!", "Great motivation!", "See you at the gym!"] },
      { senderId: "u014", senderName: "Siti", replies: ["Fitness goals!", "I'm in!", "Let's do this!"] },
      { senderId: "u035", senderName: "Ying Xuan", replies: ["Pump it up!", "Great idea!", "Exercise time!"] },
    ],
    "jogging": [
      { senderId: "u020", senderName: "Hafiz", replies: ["Run!", "Let's go!", "Great pace!"] },
      { senderId: "u035", senderName: "Ying Xuan", replies: ["I'm ready!", "See you at the track!", "Let's hit our goals!"] },
      { senderId: "u014", senderName: "Siti", replies: ["Running is life!", "Count me in!", "Let's do 5K!"] },
    ],
    "kopi": [
      { senderId: "u099", senderName: "Uncle Lim", replies: ["Kopi-o kosong!", "Best drink!", "See you at the kopitiam!"] },
      { senderId: "u042", senderName: "Steven", replies: ["Shiok!", "Kopi time!", "I need my caffeine!"] },
      { senderId: "u018", senderName: "Nancy", replies: ["Let's go!", "With kaya toast!", "Perfect morning!"] },
    ],
    "movies": [
      { senderId: "u024", senderName: "Bryan", replies: ["Great pick!", "I love that movie!", "Let's watch!"] },
      { senderId: "u036", senderName: "Cheryl", replies: ["Popcorn ready!", "Can't wait!", "Book the tickets!"] },
      { senderId: "u019", senderName: "Jason", replies: ["Movie night!", "I'm excited!", "IMAX please!"] },
    ],
    "music": [
      { senderId: "u026", senderName: "Wei Lin", replies: ["Rock on!", "Let's jam!", "Great taste!"] },
      { senderId: "u043", senderName: "Amir", replies: ["Nice tune!", "I'll bring my bass!", "Music is life!"] },
      { senderId: "u036", senderName: "Cheryl", replies: ["Love that song!", "Let's harmonize!", "Beautiful!"] },
    ],
    "photography": [
      { senderId: "u030", senderName: "Karen", replies: ["Great shot!", "Beautiful!", "Let's do a photowalk!"] },
      { senderId: "u013", senderName: "David", replies: ["Nice composition!", "What camera?", "Stunning!"] },
      { senderId: "u022", senderName: "Ravi", replies: ["Love the lighting!", "Amazing!", "Share more!"] },
    ],
    "study": [
      { senderId: "u022", senderName: "Aiman", replies: ["Let's study!", "Great focus!", "Knowledge is power!"] },
      { senderId: "u017", senderName: "Priya", replies: ["Good luck!", "We can do this!", "Study buddy!"] },
      { senderId: "u032", senderName: "Ken", replies: ["Almost there!", "Keep going!", "Take a break!"] },
    ],
    "tech": [
      { senderId: "u034", senderName: "Wei Lin", replies: ["Interesting!", "Let's code!", "Tech is cool!"] },
      { senderId: "u023", senderName: "Raj", replies: ["Nice solution!", "Great idea!", "Let's build it!"] },
      { senderId: "u047", senderName: "Sarah", replies: ["Love it!", "Ship it!", "That's innovative!"] },
    ],
    "volunteering": [
      { senderId: "u040", senderName: "Grace", replies: ["Thank you!", "Together we can!", "Making a difference!"] },
      { senderId: "u008", senderName: "Michael", replies: ["Great cause!", "Happy to help!", "Community spirit!"] },
      { senderId: "u025", senderName: "Jenny", replies: ["Love giving back!", "Count me in!", "This is meaningful!"] },
    ],
  };

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
    const snippet = getTopicSnippet(text);
    const isQuestion = lower.includes("?");
    const isPlanning =
      /\b(when|where|time|meet|tomorrow|tonight|weekend|saturday|sunday|\d{1,2}(am|pm))\b/.test(lower);
    const isAgreeing = /\b(yes|yeah|yep|count me in|i'm in|im in|let's|lets|sure)\b/.test(lower);
    const isThanks = /\b(thanks|thank you|thx)\b/.test(lower);

    const topicReplies: Record<string, string[]> = {
      art: ["That art idea sounds amazing!", "I'd love to get creative with that.", "Count me in for an art session!", "Do we need to bring our own supplies?"],
      badminton: ["I'm down for badminton!", "When is the next game?", "My racquet is ready to go.", "I can book a court if we have enough players."],
      "board games": ["Board game night? Yes please!", "I have Catan if anyone wants to play.", "I'm in! I love board games.", "Strategy games or party games?"],
      "bubble tea": ["Boba run? I'm there.", "I'm craving bubble tea too.", "Sugar level 0% for me please!", "Let's go get some after this."],
      cats: ["Aww, that's adorable.", "Cat lovers unite!", "Can I bring my cat too?", "We should do a cat cafe meet."],
      cooking: ["That sounds delicious!", "I'd love to learn that recipe.", "Potluck dinner?", "I can bring dessert!"],
      cycling: ["I'm up for a ride.", "Is it a long distance route?", "I'll bring my road bike.", "Cycling sounds great for this weekend."],
      dogs: ["Dog park meetup?", "My golden retriever would love that.", "Puppy playdate!", "Let's go for a walk with the dogs."],
      "evening walks": ["Evening walks are the best.", "I need to get my steps in.", "Fresh air sounds good.", "Where should we meet for the walk?"],
      "food hunt": ["I'm always hungry. Where are we going?", "Food hunt! Yes!", "I know a great hawker center nearby.", "Let's try that new place."],
      gardening: ["My plants need some help honestly.", "I love gardening.", "Community garden meetup?", "Anyone have spare potting soil?"],
      "gym light": ["Gym buddy?", "I need motivation to go.", "Let's hit the weights.", "Cardio or lifting?"],
      jogging: ["Running sounds good.", "What pace are we thinking?", "I can do a 5k.", "Morning jog?"],
      kopi: ["Kopi sounds perfect right now.", "Meet at the usual coffeeshop?", "Kopi C Kosong for me.", "Let's catch up over coffee."],
      movies: ["Movie night?", "I've been wanting to see that.", "Popcorn is on me.", "Cinema or Netflix party?"],
      music: ["Jam session?", "I can bring my guitar.", "What genre are we thinking?", "Karaoke night anyone?"],
      photography: ["Photo walk?", "I'll bring my camera.", "Golden hour shoot?", "Any specific location in mind?"],
      study: ["Study session?", "I need to focus too.", "Library meetup?", "Let's be productive."],
      tech: ["Tech talk! specific topic?", "I'm working on a project too.", "Hackathon ideas?", "Anyone into coding?"],
      volunteering: ["Giving back sounds rewarding.", "Count me in to help.", "When is this happening?", "Great initiative."],
    };

    const fillerReplies = [
      "That sounds interesting!",
      "Tell me more about the plan.",
      "I was thinking the same thing.",
      "Good point!",
      "Haha totally agree.",
      "Hmm, let me check my schedule.",
      "Anyone else interested in this?",
      "Lets make it happen!",
      "Sounds like a plan to me.",
      "Ooh nice idea."
    ];

    if (isThanks) {
      return ["No problem!", "Anytime!", "You're welcome!", "Happy to help!"].sort(() => 0.5 - Math.random())[0];
    }

    // If it's a specific question or logistical planning message, agree or ask for details
    if (isPlanning) {
      const planningReplies = [
        "Sounds good. When exactly?",
        "I'm free then.",
        "That time works for me.",
        "Let's lock in the details.",
        "Where are we meeting?"
      ];
      return planningReplies[Math.floor(Math.random() * planningReplies.length)];
    }

    if (isQuestion) {
      const questionReplies = [
        "Good question. I'm not sure yet.",
        "I think we can decide that together.",
        "Does anyone else know?",
        "Let's figure it out."
      ];
      return questionReplies[Math.floor(Math.random() * questionReplies.length)];
    }

    if (isAgreeing) {
      return ["Same here!", "Me too.", "Count me in as well.", "Awesome."][Math.floor(Math.random() * 4)];
    }

    const groupSpecific = topicReplies[groupId];
    // Higher chance to use specific replies if available
    if (groupSpecific && groupSpecific.length > 0 && Math.random() > 0.3) {
      return groupSpecific[Math.floor(Math.random() * groupSpecific.length)];
    }

    // Check for keywords in specific topics even if group ID doesn't match perfectly
    // (Simple keyword matching as fallback)
    for (const [topic, replies] of Object.entries(topicReplies)) {
      if (lower.includes(topic)) {
        return replies[Math.floor(Math.random() * replies.length)];
      }
    }

    return fillerReplies[Math.floor(Math.random() * fillerReplies.length)];
  };

  // Auto-reply for personal chats
  const personalAutoReplies = [
    "That sounds great! Let me know when you're free.",
    "Nice to hear from you! Would love to catch up soon.",
    "Thanks for reaching out! What did you have in mind?",
    "Hey! That's a lovely idea. Let's plan something!",
    "Oh nice! I was just thinking about you. Let's meet up!",
    "Sounds fun! I'm usually free on weekends.",
    "Great to connect! Looking forward to it.",
    "Awesome! Let me check my schedule and get back to you.",
    "That would be wonderful! Let's do it!",
    "Haha yes! I'd love that. When works for you?",
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
      if (selectedRoom.type === "group") {
        // Group chat: 3 replies from different members
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
      if (selectedRoom.type === "group") {
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
    <div className="min-h-screen flex flex-col bg-background">
      {/* Join Group Popup */}
      <AnimatePresence>
        {showJoinPopup && pendingGroup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-elevated text-center"
            >
              <div className="h-16 w-16 mx-auto rounded-2xl bg-gradient-to-br from-pandan/20 to-emerald-100 flex items-center justify-center mb-4">
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
                  className="flex-1 py-3 rounded-xl bg-muted text-muted-foreground font-medium hover:bg-muted/80 transition-colors"
                >
                  Maybe later
                </button>
                <button
                  onClick={handleJoinGroup}
                  className="flex-1 py-3 rounded-xl bg-pandan text-white font-medium hover:bg-pandan/90 transition-colors flex items-center justify-center gap-2"
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
          {/* Chat header */}
          <div className="px-6 py-4 bg-white/80 backdrop-blur-md border-b border-border/50 flex items-center gap-3 w-full justify-between z-10 sticky top-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setSelectedRoom(null);
                  window.history.pushState({}, "", "/chat");
                }}
                className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/70 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <selectedRoom.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="font-medium text-foreground text-sm">{selectedRoom.name}</h2>
                <p className="text-xs text-muted-foreground">{selectedRoom.members} members</p>
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
                className="bg-primary/5 px-6 py-2 flex items-center justify-center text-xs text-primary font-medium border-b border-primary/10"
              >
                <Camera className="h-3 w-3 mr-2 animate-pulse" />
                You are taking a photo...
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 pb-32 space-y-3">
            <div className="flex justify-center mb-4">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-pandan/10 text-pandan text-xs">
                <Shield className="h-3 w-3" />
                <span>All members verified</span>
              </div>
            </div>

            {/* Welcome message for new chats */}
            {selectedRoom.isNew && messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <div className="h-16 w-16 mx-auto rounded-2xl bg-gradient-to-br from-primary/10 to-sakura/10 flex items-center justify-center mb-4">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-medium text-foreground mb-2">Start the conversation!</h3>
                <p className="text-sm text-muted-foreground mb-4">Say hello to your new community</p>

                {selectedRoom.suggestedStarters && (
                  <div className="space-y-2">
                    {selectedRoom.suggestedStarters.slice(0, 2).map((starter, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(starter)}
                        className="block mx-auto px-4 py-2 rounded-full bg-primary/10 text-primary text-sm hover:bg-primary/20 transition-colors"
                      >
                        {starter}
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

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
                      ? "bg-primary text-white rounded-br-md"
                      : `${getSenderColor(message.senderId).bg} shadow-soft rounded-bl-md`
                      }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <p className={`text-[10px] text-muted-foreground mt-0.5 ${message.isMe ? "text-right mr-3" : "ml-3"}`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Message input */}
          <div className="fixed bottom-16 left-0 right-0 z-40 p-4 bg-white/80 backdrop-blur-md border-t border-border/50">
            <div className="max-w-7xl mx-auto w-full">
              <div className="flex items-end gap-2">
                <div className="flex gap-1 mb-1">
                  <button
                    className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors"
                    title="Attach file"
                  >
                    <Paperclip className="h-4 w-4" />
                  </button>
                  <button
                    onClick={toggleCamera}
                    className={`h-9 w-9 rounded-full flex items-center justify-center transition-colors ${isCameraActive
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                      }`}
                    title="Take photo"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex-1 bg-muted rounded-xl flex items-center px-4 py-2.5">
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
                  className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-soft disabled:opacity-50 hover:opacity-90 transition-opacity mb-0.5"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="px-8 py-10 pb-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-muted-foreground text-sm mb-1">Messages</p>
              <h1 className="text-3xl text-foreground mb-6">Stay connected</h1>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white shadow-soft border-none text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </motion.div>
          </div>

          {/* Chat list */}
          <div className="px-8 flex-1 overflow-y-auto scrollbar-hide">
            {allRooms.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="h-20 w-20 mx-auto rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <MessageCircle className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">No conversations yet</h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-xs mx-auto">
                  Join interest groups or connect with members from the Explore tab to start chatting!
                </p>
              </motion.div>
            ) : (
              <div className="space-y-2">
                {allRooms.map((room, i) => (
                  <motion.button
                    key={room.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                    onClick={() => setSelectedRoom(room)}
                    className="w-full flex items-center gap-3 p-4 bg-white rounded-2xl shadow-soft text-left card-hover"
                  >
                    <div className="relative">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${room.type === "group" ? "bg-pandan/10" : "bg-primary/10"
                        }`}>
                        <room.icon className={`h-5 w-5 ${room.type === "group" ? "text-pandan" : "text-primary"}`} />
                      </div>
                      {room.unread > 0 && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                          {room.unread}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-foreground text-sm">{room.name}</h3>
                          {room.fromLikedList && !isUserContacted(room.userId || "") && (
                            <span className="flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-600 font-medium">
                              <Heart className="h-2.5 w-2.5" />
                              Liked
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-muted-foreground">{formatTime(room.lastMessageTime)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {room.type === "group" && <Users className="h-3 w-3 text-muted-foreground" />}
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
