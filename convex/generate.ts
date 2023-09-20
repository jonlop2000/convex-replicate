"use node";

import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import Replicate from "replicate";
import { Id } from "./_generated/dataModel";

export const generate = internalAction(
  async (
    { runMutation },
    {
      prompt,
      image,
      sketchId,
    }: { sketchId: Id<"sketches">; prompt: string; image: string }
  ) => {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN!,
    });

    const output = (await replicate.run(
      "jagilley/controlnet-scribble:435061a1b5a4c1e26740464bf786efdfa9cb3a3ac488595a2de23e143fdb0117",
      {
        input: {
          image,
          scale: 7,
          prompt,
          image_resolution: "512",
          n_prompt:
            "longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality ",
        },
      }
    )) as [string, string];
    await runMutation(internal.sketches.updateSketchResult, {
      sketchId,
      result: output[1],
    });

    //CLIP INTERREGATOR API AI MODEL
    const generatedImage = output[1]; // Assuming this is the image path
    const descriptionOutput = await replicate.run(
      "pharmapsychotic/clip-interrogator:a4a8bafd6089e1716b06057c42b19378250d008b80fe87caa5cd36d40c1eda90",
      {
        input: {
          image: generatedImage,
          clip_model_name: "ViT-H-14/laion2b_s32b_b79k", // or "ViT-H-14/laion2b_s32b_b79k"
          mode: "fast",
        },
      }
    );

    const imageDescription = descriptionOutput; // Extracting the description

    // Now you can store, display, or utilize imageDescription as required

    console.log(imageDescription);
    return imageDescription;
  }
);
