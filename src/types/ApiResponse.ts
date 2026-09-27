import { Message } from "@/app/models/user.model";


export interface ApiResponse{
  success:boolean;
  message:string;
  isAcceptMessage?:boolean
  messages?:Array<Message>
}