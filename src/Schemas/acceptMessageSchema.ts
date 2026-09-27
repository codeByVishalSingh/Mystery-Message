import z from "zod"

export const acceptScehma  = z.object({
    acceptMessages: z.boolean()
})