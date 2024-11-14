"use client";

import React from "react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Calendar,
  User,
  MessageSquare,
  Paperclip,
  Send,
  X,
} from "lucide-react";
import { Header } from "./components/header";
import { Footer } from "./components/footer";

type Comment = {
  id: number;
  user: string;
  avatar: string;
  content: string;
  image?: string;
  timestamp: string;
  replies: Comment[];
};

export function ItemDetailPage() {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      user: "Jane Doe",
      avatar: "https://g-tov6ou6udwi.vusercontent.net/placeholder.svg",
      content:
        "I've noticed this issue as well. It seems to occur more frequently when the system is under heavy load.",
      timestamp: "2023-11-15 14:30",
      replies: [
        {
          id: 2,
          user: "John Smith",
          avatar: "https://g-tov6ou6udwi.vusercontent.net/placeholder.svg",
          content:
            "Thanks for the additional info, Jane. I'll look into the performance aspects.",
          timestamp: "2023-11-15 15:45",
          replies: [],
        },
      ],
    },
    {
      id: 3,
      user: "Alice Johnson",
      avatar: "https://g-tov6ou6udwi.vusercontent.net/placeholder.svg",
      content: "Here's a screenshot of the error message I'm seeing:",
      image:
        "https://g-tov6ou6udwi.vusercontent.net/placeholder.svg?height=300&width=400",
      timestamp: "2023-11-16 09:15",
      replies: [],
    },
  ]);

  const [newComment, setNewComment] = useState("");
  const [newImage, setNewImage] = useState<File | null>(null);
  const [openImageDialog, setOpenImageDialog] = useState<string | null>(null);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() || newImage) {
      const newCommentObj: Comment = {
        id: comments.length + 1,
        user: "Current User",
        avatar: "/placeholder.svg",
        content: newComment,
        image: newImage ? URL.createObjectURL(newImage) : undefined,
        timestamp: new Date().toLocaleString(),
        replies: [],
      };
      setComments([...comments, newCommentObj]);
      setNewComment("");
      setNewImage(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  const CommentComponent = ({
    comment,
    isReply = false,
  }: {
    comment: Comment;
    isReply?: boolean;
  }) => (
    <div className={`flex ${isReply ? "ml-12 mt-4" : "mt-6"}`}>
      <Avatar className="w-10 h-10">
        <AvatarImage src={comment.avatar} alt={`${comment.user}'s avatar`} />
        <AvatarFallback>{comment.user[0]}</AvatarFallback>
      </Avatar>
      <div className="ml-4 flex-grow">
        <div className="flex items-center">
          <span className="font-semibold">{comment.user}</span>
          <span className="ml-2 text-sm text-muted-foreground">
            {comment.timestamp}
          </span>
        </div>
        <p className="mt-1">{comment.content}</p>
        {comment.image && (
          <Dialog
            open={openImageDialog === comment.image}
            onOpenChange={() => setOpenImageDialog("")}
          >
            <DialogTrigger asChild>
              <button className="mt-2 overflow-hidden rounded-lg">
                <img
                  src={comment.image}
                  alt="Comment attachment"
                  className="max-w-[100px] h-auto object-cover"
                />
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] sm:max-h-[600px] p-0">
              <img
                src={comment.image}
                alt="Comment attachment"
                className="w-full h-full object-contain"
              />
              <Button
                className="absolute top-2 right-2"
                variant="ghost"
                size="icon"
                onClick={() => setOpenImageDialog(null)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogContent>
          </Dialog>
        )}
        {!isReply && (
          <Button variant="ghost" size="sm" className="mt-2">
            Reply
          </Button>
        )}
        {comment.replies.map((reply) => (
          <CommentComponent key={reply.id} comment={reply} isReply />
        ))}
      </div>
    </div>
  );

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Bug #1234: Unable to save changes in user profile
          </CardTitle>
          <div className="flex items-center gap-4 mt-2">
            <Badge>High Priority</Badge>
            <Badge variant="outline">In Progress</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Created: 2023-11-14</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>Reporter: @janedoe</span>
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p>
                Users are reporting that they are unable to save changes made to
                their profile information. The save button appears to be
                clickable, but no changes are persisted after refreshing the
                page.
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="text-lg font-semibold mb-2">Steps to Reproduce</h3>
              <ol className="list-decimal list-inside space-y-1">
                <li>Log in to the application</li>
                <li>Navigate to the user profile page</li>
                <li>Make changes to any field (e.g., bio, location)</li>
                <li>Click the &quot;Save Changes&quot; button</li>
                <li>Refresh the page</li>
              </ol>
            </div>
            <Separator />
            <div>
              <h3 className="text-lg font-semibold mb-2">Expected Behavior</h3>
              <p>
                Changes made to the user profile should be saved and persist
                after page refresh.
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="text-lg font-semibold mb-2">Actual Behavior</h3>
              <p>
                Changes are not saved, and the profile reverts to its previous
                state after refresh.
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="flex items-center text-lg font-semibold mb-2">
                <MessageSquare className="w-5 h-5 mr-2" />
                Discussion
              </h3>
              {comments.map((comment) => (
                <CommentComponent key={comment.id} comment={comment} />
              ))}
              <form onSubmit={handleCommentSubmit} className="mt-6">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Paperclip className="w-5 h-5 text-muted-foreground" />
                    </label>
                    {newImage && (
                      <span className="ml-2 text-sm">{newImage.name}</span>
                    )}
                  </div>
                  <Button type="submit">
                    <Send className="w-4 h-4 mr-2" />
                    Send
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

export default ItemDetailPage;
