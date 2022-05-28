export const VideoDubSteps = [
  {
    element: '[data-tut="play"]',
    intro: `<span>🤗</span>Play/Pause Button for the youtube video.`,
    position: "bottom",
  },
  {
    element: '[data-tut="duration"]',
    intro: "<span>😀</span>Change the duration of the video (Starting & Ending time) according to your preferences.",
  },
  {
    element: '[data-tut="record"]',
    intro: `<span>🤗</span>Start Recording your voice by clicking on the mic button.`,
  },
  {
    element: '[data-tut="voiceover"]',
    intro: "<span>😀</span>Play & Understand your voice quality before saving this video.",
  },
  {
    element: '[data-tut="save"]',
    intro: "<span>✌</span>Save that video by clicking this button & get your tab under voiceover pannel.",
    tooltipClass: "myTooltipClass customTooltipClass",
  },
];
