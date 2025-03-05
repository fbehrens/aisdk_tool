import { z } from "zod";
import { generateText, tool } from "ai";
// import { openai } from "@ai-sdk/openai";
// const model = openai("gpt-4.5-previ÷ew");
import { anthropic } from "@ai-sdk/anthropic";
import { getTranscript } from "./yt.ts";

const model = anthropic("claude-3-7-sonnet-20250219");

const transcript = tool({
  description: "Get the transcript of a video",
  parameters: z.object({
    videoId: z
      .string()
      .describe("The videoId of the video to get the transcript from"),
  }),
  execute: getTranscript,
});

async function summarise(video: string) {
  const { text, steps } = await generateText({
    model,
    tools: {
      transcript,
    },
    maxSteps: 5, // allow up to 5 steps
    prompt: `Please summarize the video ${video} ?`,
  });
  await Deno.writeTextFile("out/steps.json", JSON.stringify(steps, null, 2));
  return text;
}
if (import.meta.main) {
  console.log(await summarise(Deno.args[0]));
}
// deno  --allow-env --allow-net tool.ts https://youtu.be/9vDLIlB1Iro\?feature\=shared
