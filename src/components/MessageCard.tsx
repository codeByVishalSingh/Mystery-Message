'use client '
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Message } from "@/app/models/user.model";
import { toast } from "sonner";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
type MessageCardProps ={
message: Message,
onMessageDelete: (MessageId: any) => void
}
const MessageCard = ({message,onMessageDelete}:MessageCardProps)=>{
    const handleDeleteConfirm = async ()=>{
       
       const res = await axios.delete<ApiResponse>(`/api/delete-message ${message._id}`)
        toast.success('Messgae Deleted Successfully')
    
       onMessageDelete(message._id)
    }
    return (
     <Card className="w-full max-w-md">
  <CardHeader>
    <CardTitle>Welcome</CardTitle>
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button><X className="w-6 h-6"/></Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you absolutely sure?
          </AlertDialogTitle>

          <AlertDialogDescription>
            This action cannot be undone. This will permanently
            delete your account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction onClick={handleDeleteConfirm}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    <CardDescription>
      This is a shadcn/ui card.
    </CardDescription>
  </CardHeader>

  <CardContent>
  </CardContent>

</Card>
    )
}
export default MessageCard