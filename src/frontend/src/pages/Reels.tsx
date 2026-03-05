import { Link } from "@tanstack/react-router";
import {
  Bookmark,
  Heart,
  MessageCircle,
  Pause,
  Play,
  Share2,
} from "lucide-react";
import React, { useState } from "react";

const mockReels = [
  {
    id: 1,
    salon: "Style Studio",
    salonId: "salon-1",
    caption:
      "Amazing hair transformation! Book now for the same look ✂️ #haircut #transformation #salon",
    likes: 1240,
    comments: 89,
    thumbnail:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=700&fit=crop",
    avatar:
      "https://images.unsplash.com/photo-1560066984-138daaa0c914?w=60&h=60&fit=crop",
  },
  {
    id: 2,
    salon: "Royal Barbers",
    salonId: "salon-2",
    caption:
      "Classic fade + beard trim combo 🔥 Walk-in welcome! #barbershop #fade #beard",
    likes: 3580,
    comments: 214,
    thumbnail:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=700&fit=crop",
    avatar:
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=60&h=60&fit=crop",
  },
  {
    id: 3,
    salon: "Glam Parlour",
    salonId: "salon-3",
    caption:
      "Bridal hair & makeup package 💍 Book your special day! #bridal #wedding #hairstyle",
    likes: 5200,
    comments: 342,
    thumbnail:
      "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400&h=700&fit=crop",
    avatar:
      "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=60&h=60&fit=crop",
  },
  {
    id: 4,
    salon: "Trendy Cuts",
    salonId: "salon-4",
    caption:
      "Kids special haircut session! Super fun & quick ✂️👦 #kidshaircut #childrensalon",
    likes: 892,
    comments: 67,
    thumbnail:
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=700&fit=crop",
    avatar:
      "https://images.unsplash.com/photo-1567894340315-735d7c361db0?w=60&h=60&fit=crop",
  },
];

function ReelCard({ reel }: { reel: (typeof mockReels)[0] }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(reel.likes);
  const [playing, setPlaying] = useState(false);

  const handleLike = () => {
    setLiked((v) => !v);
    setLikeCount((c) => (liked ? c - 1 : c + 1));
  };

  return (
    <div
      className="relative w-full h-screen snap-start flex-shrink-0 overflow-hidden"
      style={{ background: "#0a0a0a" }}
    >
      {/* Background thumbnail */}
      <img
        src={reel.thumbnail}
        alt={reel.caption}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.85 }}
      />

      {/* Gradient overlays */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, transparent 30%, transparent 50%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      {/* Play/Pause button overlay */}
      <button
        type="button"
        onClick={() => setPlaying((v) => !v)}
        className="absolute inset-0 flex items-center justify-center"
        data-ocid="reel.play_button"
      >
        {!playing && (
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(4px)",
            }}
          >
            <Play className="w-7 h-7 text-white ml-1" fill="white" />
          </div>
        )}
      </button>

      {/* Right action bar */}
      <div className="absolute right-3 bottom-32 flex flex-col items-center gap-6">
        {/* Salon avatar */}
        <div className="relative">
          <img
            src={reel.avatar}
            alt={reel.salon}
            className="w-11 h-11 rounded-full border-2 object-cover"
            style={{ borderColor: "oklch(0.72 0.12 75)" }}
          />
          <div
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center"
            style={{ background: "oklch(0.72 0.12 75)" }}
          >
            <span className="text-black text-xs font-bold leading-none">+</span>
          </div>
        </div>

        {/* Like */}
        <button
          type="button"
          onClick={handleLike}
          className="flex flex-col items-center gap-1"
          data-ocid="reel.like_button"
        >
          <Heart
            className="w-7 h-7 transition-all duration-200"
            style={{ color: liked ? "#ff4d6d" : "white" }}
            fill={liked ? "#ff4d6d" : "none"}
          />
          <span className="text-white text-xs font-medium">
            {likeCount >= 1000
              ? `${(likeCount / 1000).toFixed(1)}k`
              : likeCount}
          </span>
        </button>

        {/* Comment */}
        <button
          type="button"
          className="flex flex-col items-center gap-1"
          data-ocid="reel.comment_button"
        >
          <MessageCircle className="w-7 h-7 text-white" />
          <span className="text-white text-xs font-medium">
            {reel.comments >= 1000
              ? `${(reel.comments / 1000).toFixed(1)}k`
              : reel.comments}
          </span>
        </button>

        {/* Share */}
        <button
          type="button"
          className="flex flex-col items-center gap-1"
          data-ocid="reel.share_button"
        >
          <Share2 className="w-7 h-7 text-white" />
          <span className="text-white text-xs font-medium">Share</span>
        </button>

        {/* Save */}
        <button
          type="button"
          onClick={() => setSaved((v) => !v)}
          className="flex flex-col items-center gap-1"
          data-ocid="reel.save_button"
        >
          <Bookmark
            className="w-7 h-7 transition-all duration-200"
            style={{ color: saved ? "oklch(0.72 0.12 75)" : "white" }}
            fill={saved ? "oklch(0.72 0.12 75)" : "none"}
          />
          <span className="text-white text-xs font-medium">Save</span>
        </button>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-20 left-4 right-16 space-y-2">
        <div className="flex items-center gap-2">
          <span
            className="text-sm font-bold"
            style={{ color: "oklch(0.72 0.12 75)" }}
          >
            @{reel.salon}
          </span>
        </div>
        <p className="text-white text-sm leading-snug line-clamp-3">
          {reel.caption}
        </p>

        {/* Book Now CTA */}
        <Link
          to="/salon/$salonId"
          params={{ salonId: reel.salonId }}
          data-ocid="reel.book_now_button"
          className="inline-flex items-center gap-1.5 mt-1 px-4 py-1.5 rounded-full text-sm font-bold text-black"
          style={{ background: "oklch(0.72 0.12 75)" }}
        >
          ✂️ Book Now
        </Link>
      </div>
    </div>
  );
}

export default function Reels() {
  return (
    <div
      className="fixed inset-0 z-40 overflow-y-scroll snap-y snap-mandatory"
      style={{ scrollbarWidth: "none" }}
      data-ocid="reels.page"
    >
      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Header */}
      <div
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 pt-4 pb-2"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)",
        }}
      >
        <h1
          className="text-xl font-bold tracking-tight"
          style={{ color: "oklch(0.72 0.12 75)" }}
        >
          Reels
        </h1>
        <div className="flex gap-3">
          <button
            type="button"
            className="text-white text-sm font-medium px-3 py-1 rounded-full border border-white/30"
            data-ocid="reels.filter.tab"
            style={{ background: "rgba(255,255,255,0.1)" }}
          >
            Following
          </button>
          <button
            type="button"
            className="text-black text-sm font-bold px-3 py-1 rounded-full"
            data-ocid="reels.trending.tab"
            style={{ background: "oklch(0.72 0.12 75)" }}
          >
            Trending
          </button>
        </div>
      </div>

      {/* Reel cards */}
      {mockReels.map((reel) => (
        <ReelCard key={reel.id} reel={reel} />
      ))}
    </div>
  );
}
