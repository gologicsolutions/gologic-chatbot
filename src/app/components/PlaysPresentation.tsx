"use client";

import { useCopilotContext } from "@copilotkit/react-core";
import { CopilotTask } from "@copilotkit/react-core";
import {
  useMakeCopilotActionable,
  useMakeCopilotReadable,
} from "@copilotkit/react-core";

import { useCallback, useMemo, useState } from "react";
import {
  BackwardIcon,
  ForwardIcon,
  PlusIcon,
  SparklesIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { SlideModel, Slide } from "./Slide";

export const ActionButton = ({
  disabled,
  onClick,
  className,
  children,
}: {
  disabled: boolean;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <button
      disabled={disabled}
      className={`bg-blue-500 text-white font-bold py-2 px-4 rounded
      ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}
      ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export const PlaysPresentation = () => {
  const [slides, setSlides] = useState<SlideModel[]>([
    {
      title: `Welcome to our presentation!`, // Title of the first slide.
      content: "This is the first slide.", // Content of the first slide.
      backgroundImageDescription: "hello", // Description for background image retrieval.
      spokenNarration: "This is the first slide. Welcome to our presentation!", // Spoken narration text for the first slide.
    },
  ]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const currentSlide = useMemo(
    () => slides[currentSlideIndex],
    [slides, currentSlideIndex]
  );

  useMakeCopilotReadable("These are all the slides: " + JSON.stringify(slides));
  useMakeCopilotReadable(
    "This is the current slide: " + JSON.stringify(currentSlide)
  );

  useMakeCopilotActionable(
    {
      name: "appendSlide",
      description: "Add a slide after all the existing slides.",
      argumentAnnotations: [
        {
          name: "title",
          type: "string",
          description: "The title of the slide.",
          required: true,
        },
        {
          name: "content",
          type: "string",
          description: "The content of the slide.",
          required: true,
        },
        {
          name: "backgroundImageDescription",
          type: "string",
          description: "What to display in the background.",
          required: true,
        },
        {
          name: "spokenNarration",
          type: "string",
          description: "The text to read while presenting the slide.",
          required: true,
        },
        {
          name: "url",
          type: "string",
          description: "The URL of the selected play",
          required: true,
        }
      ],
      implementation: async (
        title,
        content,
        backgroundImageDescription,
        spokenNarration,
        url
      ) => {
        const newSlide: SlideModel = {
          title,
          content,
          backgroundImageDescription,
          spokenNarration,
        };
        console.log("Selected Play URL:", url);
        setSlides((slides) => [...slides, newSlide]);
      },
    },
    [setSlides]
  );

  const context = useCopilotContext();
  const generateSlideTask = new CopilotTask({
    instructions:
      "Generate slides based on the overall topic. Do NOT carry any research.",
  });
  const [generateSlideTaskRunning, setGenerateSlideTaskRunning] =
    useState(false);

  const updateCurrentSlide = useCallback(
    (partialSlide: Partial<SlideModel>) => {
      setSlides((slides) => [
        ...slides.slice(0, currentSlideIndex),
        { ...slides[currentSlideIndex], ...partialSlide },
        ...slides.slice(currentSlideIndex + 1),
      ]);
    },
    [currentSlideIndex, setSlides]
  );

  return (
    <div className="relative">
      <Slide slide={currentSlide} partialUpdateSlide={updateCurrentSlide} />
      <div className="absolute top-0 left-0 mt-6 ml-4 z-30">
        <ActionButton
          disabled={generateSlideTaskRunning}
          onClick={() => {
            const newSlide: SlideModel = {
              title: "Title",
              content: "Body",
              backgroundImageDescription: "random",
              spokenNarration: "The speaker's notes for this slide.",
            };
            setSlides((slides) => [
              ...slides.slice(0, currentSlideIndex + 1),
              newSlide,
              ...slides.slice(currentSlideIndex + 1),
            ]);
            setCurrentSlideIndex((i) => i + 1);
          }}
          className="rounded-r-none"
        >
          <PlusIcon className="h-6 w-6" />
        </ActionButton>
        <ActionButton
          disabled={generateSlideTaskRunning}
          onClick={async () => {
            setGenerateSlideTaskRunning(true); // Indicates the task is starting.
            await generateSlideTask.run(context); // Executes the task with the current context.
            setGenerateSlideTaskRunning(false); // Resets the flag when the task is complete.
          }}
          className="rounded-l-none ml-[1px]"
        >
          <SparklesIcon className="h-6 w-6" />
        </ActionButton>
      </div>
      <div className="absolute top-0 right-0 mt-6 mr-24">
        <ActionButton
          disabled={generateSlideTaskRunning || slides.length === 1}
          onClick={() => {
            setSlides((slides) => [
              ...slides.slice(0, currentSlideIndex),
              ...slides.slice(currentSlideIndex + 1),
            ]);
            setCurrentSlideIndex((i) => 0);
          }}
          className="ml-5 rounded-r-none"
        >
          <TrashIcon className="h-6 w-6" />
        </ActionButton>
      </div>
      <div
        className="absolute bottom-0 right-0 mb-20 mx-24 text-xl"
        style={{
          textShadow:
            "1px 1px 0 #ddd, -1px -1px 0 #ddd, 1px -1px 0 #ddd, -1px 1px 0 #ddd",
        }}
      >
        Slide {currentSlideIndex + 1} of {slides.length}
      </div>
      <div className="absolute bottom-0 right-0 mb-6 mx-24">
        <ActionButton
          className="rounded-r-none"
          disabled={generateSlideTaskRunning || currentSlideIndex === 0}
          onClick={() => {
            setCurrentSlideIndex((i) => i - 1);
          }}
        >
          <BackwardIcon className="h-6 w-6" />
        </ActionButton>
        <ActionButton
          className="mr-[1px] rounded-l-none"
          disabled={
            generateSlideTaskRunning || currentSlideIndex + 1 === slides.length
          }
          onClick={() => {
            setCurrentSlideIndex((i) => i + 1);
          }}
        >
          <ForwardIcon className="h-6 w-6" />
        </ActionButton>
      </div>
    </div>
  );
};
