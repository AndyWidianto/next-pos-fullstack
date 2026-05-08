import { z } from "zod";

export const categorySchema = z.object({
    name: z.string().min(1, "name tidak boleh ksoong"),
    description: z.string().optional(),
    icon: z.string().min(1, "Icon wajib diisi")
});

export type CategoryInput = z.infer<typeof categorySchema>;