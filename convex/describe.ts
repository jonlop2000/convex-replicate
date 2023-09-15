import Replicate from "replicate";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

export const describe = internalAction(
  async (
    { runMutation },
    {
      describe,
      image,
      sketchId,
    }: { sketchId: Id<"sketches">; describe: string; image: string }
  ) => {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN!,
    });

    const output = (await replicate.run(
      "pharmapsychotic/clip-interrogator:8151e1c9f47e696fa316146a2e35812ccf79cfc9eba05b11c7f450155102af70",
      {
        input: {
          image: "...",
        },
      }
    )) as [string, string];
  }
);
