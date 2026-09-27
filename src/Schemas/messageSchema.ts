import z from "zod"

export const messageScehma  = z.object({
    content: z.string().min(10,'messaage must be at least of 10 character').max(300, 'message must be no longer then 300 characters')
})